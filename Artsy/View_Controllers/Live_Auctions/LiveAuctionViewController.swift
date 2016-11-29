import UIKit
import Artsy_UIButtons
import Interstellar
import UICKeyChainStore
import SwiftyJSON
import FXBlurView
import ORStackView
import ReSwift

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = { [weak self] in
        return self?.traitCollection.horizontalSizeClass == .Compact
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = { [weak self] in
        return LiveAuctionStaticDataFetcher(saleSlugOrID: self?.saleSlugOrID ?? "")
    }()

    lazy var salesPersonCreator: (LiveSale, JWT, BiddingCredentials) -> LiveAuctionsSalesPersonType = LiveAuctionViewController.salesPerson

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!
    var lotListController: LiveAuctionLotListViewController!
    var loadingView: LiveAuctionLoadingView?

    var subscribedStore: Store<LiveAuctionState>?

    var sale: LiveSale?

    private var statusMaintainer = ARSerifStatusMaintainer()
    lazy var app = UIApplication.sharedApplication()
    var suppressJumpingToOpenLots = false

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID

        super.init(nibName: nil, bundle: nil)

        self.title = saleSlugOrID

        // UIKit complains if we don't have at least one view controller; we replace this later in setupWithSale()
        viewControllers = [UIViewController()]

        // Find out when we've updated registration status
        NSNotificationCenter.defaultCenter()
            .addObserver(self, selector: #selector(userHasChangedRegistrationStatus), name: ARAuctionArtworkRegistrationUpdatedNotification, object: nil)
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        if delegate != nil { return }

        preferredDisplayMode = .AllVisible
        preferredPrimaryColumnWidthFraction = 0.4
        delegate = self

        statusMaintainer.viewWillAppear(animated, app: app)
        connectToNetwork()

        app.idleTimerDisabled = true

        if waitingForInitialLoad {
            loadingView = LiveAuctionLoadingView().then {
                $0.operation = applyWeakly(self, LiveAuctionViewController.dismissLiveAuctionsModal)
                view.addSubview($0)
                $0.alignToView(view)
            }
        }
    }

    func connectToNetwork() {
        staticDataFetcher.fetchStaticData().subscribe { [weak self] result in
            self?.ar_removeIndeterminateLoadingIndicatorAnimated(Bool(ARPerformWorkAsynchronously))

            switch result {
            case .Success(let (sale, jwt, bidderCredentials)):
                self?.sale = sale
                self?.setupWithSale(sale, jwt: jwt, bidderCredentials: bidderCredentials)

            case .Error(let error):
                print("Error pulling down sale data for \(self?.saleSlugOrID)")
                print("Error: \(error)")
                self?.showOfflineView()
            }
        }
    }

    /// We want to offer ~1 second of delay to allow
    /// the socket to reconnect before we show the disconnect warning
    /// This is mainly to ensure it doesn't consistently flicker on/off
    /// with unpredictable connections

    var showSocketDisconnectWarning = false
    var waitingToShowDisconnect = false
    var waitingForInitialLoad = true

    /// param is hide because it recieves a "connected" signal
    func showSocketDisconnectedOverlay(hide: Bool) {
        if hide { actuallyShowDisconnectedOverlay(false) }
        let show = !hide
        showSocketDisconnectWarning = show

        if waitingToShowDisconnect { return }
        if show {
            waitingToShowDisconnect = true

            ar_dispatch_after(1.1) {
                self.waitingToShowDisconnect = false
                if self.showSocketDisconnectWarning == true {
                    self.actuallyShowDisconnectedOverlay(true)
                }
            }
        }
    }

    func actuallyShowDisconnectedOverlay(show: Bool) {
        if !show {
            ar_removeBlurredOverlayWithTitle()
        } else {
            let title = NSLocalizedString("Artsy has lost contact with the auction house.", comment: "Live websocket disconnect title")
            let subtitle = NSLocalizedString("Attempting to reconnect now", comment: "Live websocket disconnect subtitle")
            let menuButton = BlurredStatusOverlayViewCloseButtonState.Show(target: self, selector: #selector(dismissLiveAuctionsModal))
            ar_presentBlurredOverlayWithTitle(title, subtitle: subtitle, buttonState:menuButton)
        }
    }

    /// This is the offline view when we cannot fetch metaphysics static data
    /// which means we can't connect to the server for JSON data
    var offlineView: AROfflineView?

    func showOfflineView() {
        // Stop the spinner to indicate that it's
        // tried and failed to do it

        guard offlineView == nil else {
            offlineView?.refreshFailed()
            return
        }

        offlineView = AROfflineView()
        guard let offlineView = offlineView else { return }

        offlineView.delegate = self
        view.addSubview(offlineView)
        offlineView.alignToView(view)

        // As we're not showing a ARSerifNav
        // we don't have a back button yet, so add one

        let dimension = 40
        let closeButton = ARMenuButton()
        closeButton.setBorderColor(.artsyGrayRegular(), forState: .Normal, animated: false)
        closeButton.setBackgroundColor(.whiteColor(), forState: .Normal, animated: false)
        closeButton.setImage(UIImage(named:"serif_modal_close"), forState: .Normal)
        closeButton.addTarget(self, action: #selector(dismissLiveAuctionsModal), forControlEvents: .TouchUpInside)

        offlineView.addSubview(closeButton)
        closeButton.alignTrailingEdgeWithView(offlineView, predicate: "-20")
        closeButton.alignTopEdgeWithView(offlineView, predicate: "20")
        closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
    }

    func userHasChangedRegistrationStatus() {
        // we have to ask for a new metaphysics JWT ( as they contain metadata about bidder status )
        // so we need to pull down the current view heirarchy, and recreate it
        // Which luckily, connectToNetwork() does for us via setupWithSale()
        connectToNetwork()
    }

    func dismissLiveAuctionsModal() {
        subscribedStore?.unsubscribe(self)
        self.presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)

        statusMaintainer.viewWillDisappear(animated, app: app)
        app.idleTimerDisabled = false

        // Hrm, yes, so this seems to be a weird side effect of UISplitVC
        // in that it won't pass the view transition funcs down to it's children
        viewControllers.forEach { vc in
            vc.beginAppearanceTransition(false, animated: animated)
        }

        // This crashes on iOS 10
        if #available(iOS 10, *) {} else {
            guard let internalPopover = valueForKey("_hidden" + "PopoverController") as? UIPopoverController else { return }
            internalPopover.dismissPopoverAnimated(false)
        }
    }

    override func viewDidDisappear(animated: Bool) {
        super.viewDidDisappear(animated)

        viewControllers.forEach { vc in
            vc.endAppearanceTransition()
        }
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func shouldAutorotate() -> Bool {
        return traitDependentAutorotateSupport
    }

    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }
}

extension LiveAuctionViewController: AROfflineViewDelegate {
    // Give networking a second shot when offline
    func offlineViewDidRequestRefresh(offlineView: AROfflineView!) {
        connectToNetwork()
    }
}

private typealias PrivateFunctions = LiveAuctionViewController
extension PrivateFunctions: StoreSubscriber {

    func setupWithSale(sale: LiveSale, jwt: JWT, bidderCredentials: BiddingCredentials) {
        let salesPerson = self.salesPersonCreator(sale, jwt, bidderCredentials)
        subscribedStore = salesPerson.store
        salesPerson.store.subscribe(self)

        lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson, traitCollection: view.traitCollection)
        lotSetController.suppressJumpingToOpenLots = suppressJumpingToOpenLots
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        if useSingleLayout {
            viewControllers = [lotsSetNavigationController]
        } else {
            lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
            lotListController.delegate = self

            let lotListNav = ARSerifNavigationViewController(rootViewController: lotListController)

            viewControllers = [lotListNav, lotsSetNavigationController]
        }
    }

    class func salesPerson(sale: LiveSale, jwt: JWT, biddingCredentials: BiddingCredentials) -> LiveAuctionsSalesPersonType {
        return LiveAuctionsSalesPerson(sale: sale, jwt: jwt, biddingCredentials: biddingCredentials)
    }

    func newState(state: LiveAuctionState) {
        self.showSocketDisconnectedOverlay(state.operatorIsConnected && state.socketIsConnected)
        if state.isInitialStateLoaded {
            waitingForInitialLoad = false
            loadingView?.removeFromSuperview()
            loadingView = nil
        }
    }
}

extension LiveAuctionViewController: UISplitViewControllerDelegate {
    func splitViewController(splitViewController: UISplitViewController, collapseSecondaryViewController secondaryViewController: UIViewController, ontoPrimaryViewController primaryViewController: UIViewController) -> Bool {
        return true
    }
}

extension LiveAuctionViewController: LiveAuctionLotListViewControllerDelegate {
    func didSelectLotAtIndex(index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController) {
        lotSetController.jumpToLotAtIndex(index)
    }
}

// swiftlint:disable force_unwrapping

class Stubbed_StaticDataFetcher: LiveAuctionStaticDataFetcherType {

    var bidders: [Bidder] = []
    var paddleNumber: String = "123456"

    init() {
        if let bidder = try? Bidder(dictionary: ["qualifiedForBidding": true, "saleRequiresBidderApproval": true, "bidderID": "123456"], error: Void()) {
            bidders = [bidder]
        }
    }

    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()

        let json = loadJSON("live_auctions_static")
        let sale = self.parseSale(JSON(json))!
        let bidderCredentials = BiddingCredentials(bidders: bidders, paddleNumber: paddleNumber)

        let stubbedJWT = JWT(jwtString: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6bnVsbCwic2FsZUlkIjoiNTRjN2U4ZmE3MjYxNjkyYjVhY2QwNjAwIiwiYmlkZGVySWQiOm51bGwsImlhdCI6MTQ2NTIzNDI2NDI2N30.2q3bh1E897walHdSXIocGKElbxOhCGmCCsL8Bf-UWNA")!
        let s = (sale: sale, jwt: stubbedJWT, bidderCredentials: bidderCredentials)
        signal.update(Result.Success(s))

        return signal
    }
}

func loadJSON(filename: String) -> AnyObject! {
    let jsonPath = NSBundle.mainBundle().pathForResource(filename, ofType: "json")
    let jsonData = NSData(contentsOfFile: jsonPath!)!
    let json = try? NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

    return json
    }
