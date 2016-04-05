import Quick
import Nimble
import OHHTTPStubs
@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "sale_id"
        let stateJSON: NSDictionary = ["id": saleID]

        var subject: LiveAuctionStaticDataFetcher!

        beforeEach {
            OHHTTPStubs.stubJSONResponseAtPath("https://metaphysics-production.artsy.net/", withResponse: stateJSON)

            subject = LiveAuctionStaticDataFetcher(saleID: saleID)
        }
        
        it("configures its sale ID correctly") {
            expect(subject.saleID) == saleID
        }

        it("fetches the static data") {
            var receivedState: AnyObject?

            subject
                .fetchStaticData()
                .next { state in
                    receivedState = state
            }

            let dictionary = receivedState as? NSDictionary
            expect(dictionary) == stateJSON
        }
    }
}
