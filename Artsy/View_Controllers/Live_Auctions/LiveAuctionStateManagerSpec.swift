import Quick
import Nimble
import Interstellar
@testable
import Artsy

class LiveAuctionStateManagerSpec: QuickSpec {
    override func spec() {
        var subject: LiveAuctionStateManager!

        beforeEach {
            subject = LiveAuctionStateManager(host: "http://localhost", saleID: "sale-id", accessToken: "abcdefg", socketCommunicatorCreator: test_socketCommunicatorCreator(), stateFetcherCreator: test_stateFetcherCreator())
        }

        it("sets its saleID upon initialization") {
            expect(subject.saleID) == "sale-id"
        }

        it("creates an appropriate socket communicator") {
            expect(mostRecentSocketCommunicator?.host) == "http://localhost"
            expect(mostRecentSocketCommunicator?.accessToken) == "abcdefg"
            expect(mostRecentSocketCommunicator?.saleID) == "sale-id"
        }

        it("sets itself as the socket communicator delegate") {
            expect(mostRecentSocketCommunicator?.delegate) === subject
        }

        it("updates its own state according to the socket communicator delegate callback") {
            let state = ["hi there!"]
            (subject as LiveAuctionSocketCommunicatorDelegate).didUpdateAuctionState(state)

            expect(subject.updatedState.peek() as? [String]) == state
        }
    }
}

func test_socketCommunicatorCreator() -> LiveAuctionStateManager.SocketCommunicatorCreator {
    return { host, saleID, accessToken in
        return Test_SocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
    }
}

func test_stateFetcherCreator() -> LiveAuctionStateManager.StateFetcherCreator {
    return { host, saleID in
        return Test_StateFetcher(host: host, saleID: saleID)
    }
}

class Test_StateFetcher: LiveAuctionStateFetcherType {

    let host: String
    let saleID: String

    init(host: String, saleID: String) {
        self.host = host
        self.saleID = saleID
    }

    func fetchSale() -> Signal<AnyObject> {
        return Signal<AnyObject>()
    }
}

var mostRecentSocketCommunicator: Test_SocketCommunicator?

class Test_SocketCommunicator: LiveAuctionSocketCommunicatorType {
    weak var delegate: LiveAuctionSocketCommunicatorDelegate?

    let host: String
    let saleID: String
    let accessToken: String

    init(host: String, saleID: String, accessToken: String) {
        self.host = host
        self.saleID = saleID
        self.accessToken = accessToken

        mostRecentSocketCommunicator = self
    }
}
