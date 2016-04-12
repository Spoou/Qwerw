import UIKit
import Interstellar

class LiveBidProgressOverlayView: UIView {

    var biddingProgressSignal = Signal<LiveAuctionBiddingProgressState>()

    @IBOutlet weak var bidProgressImageView: UIImageView!
    @IBOutlet weak var bidProgressTitleLabel: UILabel!
    @IBOutlet weak var bidProgressSubtitleLabel: UILabel!

    override func awakeFromNib() {
        super.awakeFromNib()
        biddingProgressSignal.next(biddingProgressUpdated)
    }

    private func biddingProgressUpdated(state: LiveAuctionBiddingProgressState) {

        let purple = UIColor.artsyPurpleRegular()
        let green = UIColor.artsyGreenRegular()
        let red = UIColor.artsyRedRegular()

        switch state {
        case .Biddable, .TrialUser: break
        case .LotSold:
            setupProgressUI("Sold", subtitle:"The Lot has finished", textColor: red, image: .LiveAuctionOutbidWarningIcon)

        case .LotWaitingToOpen:
            // Hrm, is this a possible state for it to get to?
            setupProgressUI("Lot waiting to Open", textColor: purple, image: .LiveAuctionSpinner)

        case .BiddingInProgress:
            setupProgressUI("Placing Bid", textColor: purple, image: .LiveAuctionSpinner, spinImage: true)

        case .BidSuccess(let outbid):
            if outbid {
                setupProgressUI("Outbid", subtitle: "Set a higher max bid", textColor: red, image: .LiveAuctionOutbidWarningIcon)

            } else {
                setupProgressUI("Bid Placed", textColor: green, image: .LiveAuctionMaxBidIcon)
            }

        case .BidNetworkFail:
            setupProgressUI("Connection Issues", subtitle: "Please check your signal strength", textColor: red, image: .LiveAuctionOutbidWarningIcon)
        }
    }

    private func setupProgressUI(title: String, subtitle: String = "", textColor: UIColor, image: UIImage.Asset, spinImage: Bool = false) {
        bidProgressTitleLabel.text = title.uppercaseString
        bidProgressSubtitleLabel.text = subtitle
        bidProgressTitleLabel.textColor = textColor
        bidProgressSubtitleLabel.textColor = textColor
        bidProgressImageView.image = UIImage(asset: image)

        // Only spin in prod
        let animate = spinImage && ARPerformWorkAsynchronously
        if animate {
            bidProgressImageView.ar_startSpinningIndefinitely()
        } else {
            bidProgressImageView.ar_stopSpinningInstantly(true)
        }
    }

}
