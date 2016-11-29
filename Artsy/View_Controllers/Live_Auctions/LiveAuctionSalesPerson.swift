import Foundation
import Interstellar
import ReSwift

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType: class {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { get }

    /// Current lot "in focus" based on the page view controller.
    var currentFocusedLotIndex: Observable<Int> { get }

    var auctionViewModel: LiveAuctionViewModelType { get }
    var lotCount: Int { get }
    var liveSaleID: String { get }
    var liveSaleName: String { get }
    var bidIncrements: [BidIncrementStrategy] { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType
    func indexForViewModel(viewModel: LiveAuctionLotViewModelType) -> Int?
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType
    func currentLotValue(lot: LiveAuctionLotViewModelType) -> UInt64
    func currentLotValueString(lot: LiveAuctionLotViewModelType) -> String

    func bidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)
    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)

    var store: Store<LiveAuctionState> { get }

    /// Lets a client hook in to listen to all events
    /// shoud not be used outside of developer tools.
    var debugAllEventsSignal: Observable<LotEventJSON> { get }
}

class LiveAuctionsSalesPerson: NSObject, LiveAuctionsSalesPersonType {

    typealias StateManagerCreator = (host: String, sale: LiveSale, saleArtworks: [LiveAuctionLotViewModel], jwt: JWT, bidderCredentials: BiddingCredentials, store: Store<LiveAuctionState>) -> LiveAuctionStateManager
    typealias AuctionViewModelCreator = (sale: LiveSale, currentLotSignal: Observable<LiveAuctionLotViewModelType?>, biddingCredentials: BiddingCredentials) -> LiveAuctionViewModelType

    let sale: LiveSale
    let lots: [LiveAuctionLotViewModel]

    let store = Store<LiveAuctionState>(reducer: LiveAuctionRootReducer(), state: nil)

    let dataReadyForInitialDisplay = Observable<Void>()
    let auctionViewModel: LiveAuctionViewModelType

    private let stateManager: LiveAuctionStateManager
    private let bidderCredentials: BiddingCredentials

    // Lot currently being looked at by the user. Defaults to zero, the first lot in a sale.
    var currentFocusedLotIndex = Observable(0)

    init(sale: LiveSale,
         jwt: JWT,
         biddingCredentials: BiddingCredentials,
         defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults(),
         stateManagerCreator: StateManagerCreator = LiveAuctionsSalesPerson.defaultStateManagerCreator(),
         auctionViewModelCreator: AuctionViewModelCreator = LiveAuctionsSalesPerson.defaultAuctionViewModelCreator()) {

        self.sale = sale
        self.lots = sale.saleArtworks.map { LiveAuctionLotViewModel(lot: $0, bidderCredentials: biddingCredentials) }
        self.bidderCredentials = biddingCredentials

        let useBidderServer = (jwt.role == .Bidder)
        let host = useBidderServer ? ARRouter.baseBidderCausalitySocketURLString() : ARRouter.baseObserverCausalitySocketURLString()

        self.stateManager = stateManagerCreator(host: host, sale: sale, saleArtworks: self.lots, jwt: jwt, bidderCredentials: biddingCredentials, store: store)
        self.auctionViewModel = auctionViewModelCreator(sale: sale, currentLotSignal: stateManager.currentLotSignal, biddingCredentials: biddingCredentials)
    }

    lazy var bidIncrements: [BidIncrementStrategy] = { [weak self] in
        // It's very unikely the API would fail to send us bid increments, but just in case, let's avoid a crash.
        guard let bidIncrements = self?.sale.bidIncrementStrategy else { return [] }
        return bidIncrements.sort()
    }()

    func currentLotValue(lot: LiveAuctionLotViewModelType) -> UInt64 {
        return sale.bidIncrementStrategy.minimumNextBidCentsIncrement(lot.askingPrice)
    }

    func currentLotValueString(lot: LiveAuctionLotViewModelType) -> String {
        return currentLotValue(lot).convertToDollarString(lot.currencySymbol)
    }
}

private typealias ComputedProperties = LiveAuctionsSalesPerson
extension ComputedProperties {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> {
        return stateManager.currentLotSignal
    }

    var lotCount: Int {
        return lots.count
    }

    var liveSaleID: String {
        return sale.liveSaleID
    }

    var liveSaleName: String {
        let saleName = sale.name
        // Bit of a hack until we have our server-side stuff figured out. If the sale name has a :, it's likely
        // "Partner Name: The Awesome Sale", and we want just "Partner Name"
        let colonRange = saleName.rangeOfString(":", options: [], range: nil, locale: nil)

        if let colonRange = colonRange {
            return saleName.substringToIndex(colonRange.startIndex)
        } else {
            return saleName
        }
    }

    var debugAllEventsSignal: Observable<LotEventJSON> {
        return stateManager.debugAllEventsSignal
    }
}

private typealias PublicFunctions = LiveAuctionsSalesPerson
extension LiveAuctionsSalesPerson {

    // Returns nil if there is no current lot.
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType {
        precondition(abs(offset) < lotCount)

        let currentlyShowingIndex = currentFocusedLotIndex.peek() ?? 0 // The coalesce is only to satisfy the compiler, should never happen since the currentFocusedLotIndex is created with an initial value.

        // Apply the offset
        let newIndex = currentlyShowingIndex + offset

        // Guarantee the offset is within the bounds of our array.
        let loopingIndex: Int
        if newIndex >= lotCount {
            loopingIndex = newIndex - lotCount
        } else if newIndex < 0 {
            loopingIndex = newIndex + lotCount
        } else {
            loopingIndex = newIndex
        }

        return lotViewModelForIndex(loopingIndex)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType {
        return lots[index]
    }

    // Performs a linear scan through all the lots, use parsimoniously.
    func indexForViewModel(viewModel: LiveAuctionLotViewModelType) -> Int? {
        return lots.indexOf { $0.lotID == viewModel.lotID }
    }

    func bidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        guard let askingPrice = lot.askingPriceSignal.peek() else { return }
        stateManager.bidOnLot(lot.lotID, amountCents: askingPrice, biddingViewModel: biddingViewModel)
    }

    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        stateManager.leaveMaxBidOnLot(lot.lotID, amountCents: amountCents, biddingViewModel: biddingViewModel)
    }
}

private typealias ClassMethods = LiveAuctionsSalesPerson
extension ClassMethods {

    class func defaultStateManagerCreator() -> StateManagerCreator {
        return { host, sale, saleArtworks, jwt, bidderCredentials, store in
            LiveAuctionStateManager(host: host, sale: sale, saleArtworks: saleArtworks, jwt: jwt, bidderCredentials: bidderCredentials, store: store)
        }
    }

    class func stubbedStateManagerCreator() -> StateManagerCreator {
        return { host, sale, saleArtworks, jwt, bidderCredentials, store in
            LiveAuctionStateManager(host: host, sale: sale, saleArtworks: saleArtworks, jwt: jwt, bidderCredentials: bidderCredentials, store: store, socketCommunicatorCreator: LiveAuctionStateManager.stubbedSocketCommunicatorCreator())
        }
    }

    class func defaultAuctionViewModelCreator() -> AuctionViewModelCreator {
        return { sale, currentLotSignal, biddingCredentials in
            return LiveAuctionViewModel(sale: sale, currentLotSignal: currentLotSignal, biddingCredentials: biddingCredentials)
        }
    }

}
