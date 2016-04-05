import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView
import Interstellar
import UICKeyChainStore

class LiveAuctionViewController: UIViewController {
    let saleID: String

    let auctionDataSource = LiveAuctionSaleLotsDataSource()

    lazy var salesPerson: LiveAuctionsSalesPersonType = {
        // TODO: Very brittle! Assumes user is logged in. Prediction doesn't have guest support yet.
        let accessToken = UICKeyChainStore.stringForKey(AROAuthTokenDefault) ?? ""
        return LiveAuctionsSalesPerson(saleID: self.saleID, accessToken: accessToken, stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
    }()

    var pageController: UIPageViewController!
    var hasBeenSetup = false

    init(saleID: String) {
        self.saleID = saleID
        super.init(nibName: nil, bundle: nil)
        self.title = saleID;
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupToolbar()
        setupKeyboardShortcuts()

        view.backgroundColor = .whiteColor()

        pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
        ar_addModernChildViewController(pageController)
        pageController.delegate = salesPerson.pageControllerDelegate

        let pageControllerView = pageController.view
        pageControllerView.alignTopEdgeWithView(view, predicate: "0")
        pageControllerView.alignLeadingEdgeWithView(view, predicate: "0")
        pageControllerView.alignTrailingEdgeWithView(view, predicate: "0")
        pageControllerView.alignBottomEdgeWithView(view, predicate: "0")



        let progress = SimpleProgressView()
        progress.progress = 0.6
        progress.backgroundColor = .artsyGrayRegular()

        view.addSubview(progress)
        progress.constrainHeight("4")
        progress.alignLeading("0", trailing: "0", toView: view)
        progress.alignBottomEdgeWithView(view, predicate: "-165")

        salesPerson.updatedStateSignal.next { [weak self] _ in
            self?.setupWithInitialData()
        }
    }

    func setupToolbar() {
        func image(name: String) -> UIImage {
            let bundle = NSBundle(forClass: self.dynamicType)
            return UIImage(named: name, inBundle: bundle, compatibleWithTraitCollection: nil)!
        }

        let close = ARSerifToolbarButtonItem(image: image("Close_Icon"))
        close.accessibilityLabel = "Exit Live Bidding"
        close.button.addTarget(self, action: #selector(LiveAuctionViewController.dismissModal), forControlEvents: .TouchUpInside)

        let info = ARSerifToolbarButtonItem(image: image("info_icon"))
        info.accessibilityLabel = "More Information"
        info.button.addTarget(self, action: #selector(LiveAuctionViewController.moreInfo), forControlEvents: .TouchUpInside)

        let lots = ARSerifToolbarButtonItem(image: image("lots_icon"))
        lots.accessibilityLabel = "Show all Lots"
        lots.button.addTarget(self, action: #selector(LiveAuctionViewController.showLots), forControlEvents: .TouchUpInside)

        navigationItem.rightBarButtonItems = [close, lots, info]
    }

    func setupKeyboardShortcuts() {
        if ARAppStatus.isOSNineOrGreater() {
            if #available(iOS 9.0, *) {

                let previous = UIKeyCommand(input: UIKeyInputLeftArrow, modifierFlags: [], action: #selector(LiveAuctionViewController.previousLot), discoverabilityTitle: "Previous Lot")
                addKeyCommand(previous)

                let next = UIKeyCommand(input: UIKeyInputRightArrow, modifierFlags: [], action: #selector(LiveAuctionViewController.nextLot), discoverabilityTitle: "Next Lot")
                addKeyCommand(next)
            }
        }
    }

    func dismissModal() {
        guard let presentor = navigationController?.presentingViewController else { return }
        presentor.dismissViewControllerAnimated(true, completion: nil)
    }

    func moreInfo() {
        AuctionSaleNetworkModel().fetchSale(saleID) { result in
            guard let saleInfo = result.value else { return }

            let saleVM = SaleViewModel(sale: saleInfo, saleArtworks: [])
            let saleInfoVC = AuctionInformationViewController(saleViewModel: saleVM)
            self.navigationController?.pushViewController(saleInfoVC, animated: true)
        }
    }

    func showLots() {
        
    }

    func setupWithInitialData() {
        // Make sure we only initialize with initial data once.
        guard hasBeenSetup == false else { return }
        defer { hasBeenSetup = true }

        auctionDataSource.salesPerson = salesPerson

        pageController.dataSource = auctionDataSource

        guard let startVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(0) else { return }
        pageController.setViewControllers([startVC], direction: .Forward, animated: false, completion: nil)
    }

    func jumpToLiveLot() {
        let focusedIndex = salesPerson.currentFocusedLot.peek()!
        let currentLotVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(focusedIndex)

        // This logic won't do, lot at index 10 is not classed as being -1 from current index
        // perhaps it needs to see within a wrapping range of 0 to 10, which direction is it less steps
        // to get to my index

//        guard let viewController = pageController.viewControllers?.first as? LiveAuctionLotViewController else { return }
//        let direction: UIPageViewControllerNavigationDirection = viewController.index > index ? .Forward : .Reverse

        let direction = UIPageViewControllerNavigationDirection.Forward
        pageController.setViewControllers([currentLotVC!], direction: direction, animated: true, completion: nil)
    }

    func nextLot() {
        guard let current = pageController.childViewControllers.first else { return }
        guard let nextLotVC = auctionDataSource.pageViewController(pageController, viewControllerAfterViewController: current) else { return }
        pageController.setViewControllers([nextLotVC], direction: .Forward, animated: true, completion: nil)    }

    func previousLot() {
        guard let current = pageController.childViewControllers.first else { return }
        guard let previousLotVC = auctionDataSource.pageViewController(pageController, viewControllerBeforeViewController: current) else { return }
        pageController.setViewControllers([previousLotVC], direction: .Reverse, animated: true, completion: nil)
    }


    // Support for ARMenuAwareViewController

    let hidesBackButton = true
    let hidesSearchButton = true
    let hidesStatusBarBackground = true
}

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPersonType!

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionLotViewController? {
        guard let auctionViewModel = salesPerson.auctionViewModel else { return nil }
        guard let lotViewModel = salesPerson.lotViewModelForIndex(index) else { return nil }


        let auctionVC =  LiveAuctionLotViewController(index: index, auctionViewModel: auctionViewModel, lotViewModel: lotViewModel, currentLotSignal: salesPerson.currentLotSignal)
        
        return auctionVC
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionLotViewController else { return nil }
        var newIndex = viewController.index - 1
        if (newIndex < 0) { newIndex = salesPerson.lotCount - 1 }
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionLotViewController else { return nil }
        let newIndex = (viewController.index + 1) % salesPerson.lotCount;
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }
}
