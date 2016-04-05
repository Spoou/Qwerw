import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionBidViewControllerSpecs: QuickSpec {
    override func spec() {
        var subject: LiveAuctionBidViewController!

        it("looks right on phones") {
            let devices:[ARDeviceType] = [.Phone4, .Phone6]
            for device in devices {
                ARTestContext.useDevice(device) {
                    subject = StoryboardScene.LiveAuctions.instantiateBid()

                    expect(subject) == snapshot("bidding_on_\(device.rawValue)")
                }
            }
        }
    }
}
