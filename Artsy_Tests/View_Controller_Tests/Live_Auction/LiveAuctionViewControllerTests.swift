import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Interstellar
import Forgeries

@testable
import Artsy

class LiveAuctionViewControllerTests: QuickSpec {


    override func spec() {
        var subject: LiveAuctionViewController!

        var auctionViewModel: Test_LiveAuctionViewModel!
        var fakeSalesPerson: Stub_LiveAuctionsSalesPerson!

        beforeEach {
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/sale/los-angeles-modern-auctions-march-2015", withResponse:[:])

            auctionViewModel = Test_LiveAuctionViewModel()
            fakeSalesPerson = stub_auctionSalesPerson(auctionViewModel)
            fakeSalesPerson.store.dispatch(InitialStateLoadedAction())
        }

        func setupViewControllerForPhone(singleLayout: Bool) {

            subject = LiveAuctionViewController(saleSlugOrID: "sale-id")

            subject.staticDataFetcher = Stubbed_StaticDataFetcher()
            subject.useSingleLayout = singleLayout
            subject.suppressJumpingToOpenLots = true

            subject.salesPersonCreator = { _ in
                return fakeSalesPerson
            }
        }

        it("looks good by default") {
            setupViewControllerForPhone(true)
            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("handles splitting in an iPad") {
            setupViewControllerForPhone(false)
            subject.stubHorizontalSizeClass(.Regular)
            subject.view.frame = CGRect(x: 0, y: 0, width: 1024, height: 768)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows an error screen when static data fails") {
            setupViewControllerForPhone(true)

            let fakeStatic = FakeStaticFetcher()
            subject.staticDataFetcher = fakeStatic

            subject.beginAppearanceTransition(true, animated: false)
            subject.view.frame = CGRect(x: 0, y: 0, width: 320, height: 480)
            subject.endAppearanceTransition()

            let result: StaticSaleResult = Result.Error(LiveAuctionStaticDataFetcher.Error.JSONParsing)
            fakeStatic.fakeObserver.update(result)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows a socket disconnect screen when socket fails") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.store.dispatch(ChangeSocketIsConnectedAction(isConnected: false))

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows a removes disconnected screen when socket reconnects") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.store.dispatch(ChangeSocketIsConnectedAction(isConnected: false))
            // Adds everything synchronously, which is the test above
            fakeSalesPerson.store.dispatch(ChangeSocketIsConnectedAction(isConnected: true))

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }



        it("shows an operator disconnect screen when operator disconnects") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.store.dispatch(ChangeOperatorIsConnectedAction(operatorIsConnected: false))

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows an operator disconnected screen when operator reconnects") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.store.dispatch(ChangeOperatorIsConnectedAction(operatorIsConnected: false))
            // Adds everything synchronously, which is the test above
            fakeSalesPerson.store.dispatch(ChangeOperatorIsConnectedAction(operatorIsConnected: true))

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }
    }
}

class FakeStaticFetcher: LiveAuctionStaticDataFetcherType {
    let fakeObserver = Observable<StaticSaleResult>()
    func fetchStaticData() -> Observable<StaticSaleResult> {
        return fakeObserver
    }
}
