#import "ARDefaults+SiteFeatures.h"
#import "ARDefaults.h"

const static NSInteger AROnboardingPromptDefault = 25;

NSString *const ARUserIdentifierDefault = @"ARUserIdentifier";
NSString *const ARUseStagingDefault = @"ARUseStagingDefault";

NSString *const ARStagingAPIURLDefault = @"ARStagingAPIURLDefault";
NSString *const ARStagingPhoneWebURLDefault = @"ARStagingPhoneWebURLDefault";
NSString *const ARStagingPadWebURLDefault = @"ARStagingPadWebURLDefault";
NSString *const ARStagingMetaphysicsURLDefault = @"ARStagingMetaphysicsURLDefault";
NSString *const ARStagingLiveAuctionSocketURLDefault = @"ARStagingLiveAuctionSocketURLDefault";

NSString *const AROAuthTokenDefault = @"AROAuthToken";
NSString *const AROAuthTokenExpiryDateDefault = @"AROAuthTokenExpiryDate";

// Yes, there's inconsitency here. We migrated this to keychain, but wanted
// to keep backwards compatability.
NSString *const ARXAppTokenKeychainKey = @"ARXAppTokenDefault";
NSString *const ARXAppTokenExpiryDateDefault = @"ARXAppTokenExpiryDateDefault";

NSString *const AROnboardingSkipPersonalizeDefault = @"eigen-onboard-skip-personalize";
NSString *const AROnboardingSkipCollectorLevelDefault = @"eigen-onboard-skip-collector-level";
NSString *const AROnboardingSkipPriceRangeDefault = @"eigen-onboard-skip-price-range";
NSString *const AROnboardingPromptThresholdDefault = @"eigen-onboard-prompt-threshold";
NSString *const ARShowAuctionResultsButtonDefault = @"auction-results";


@implementation ARDefaults

+ (void)setup
{
    BOOL useStagingDefault;
#if DEBUG
    useStagingDefault = YES;
#else
    useStagingDefault = NO;
#endif

    [[NSUserDefaults standardUserDefaults] registerDefaults:@{
        AROnboardingPromptThresholdDefault : @(AROnboardingPromptDefault),
        AROnboardingSkipPersonalizeDefault : @(NO),
        AROnboardingSkipCollectorLevelDefault : @(NO),
        AROnboardingSkipPriceRangeDefault : @(NO),
        AROnboardingPromptThresholdDefault : @(NO),

        ARUseStagingDefault : @(useStagingDefault),
        ARStagingAPIURLDefault : @"https://stagingapi.artsy.net",
        ARStagingPhoneWebURLDefault : @"http://m-staging.artsy.net",
        ARStagingPadWebURLDefault : @"https://staging.artsy.net",
        ARStagingMetaphysicsURLDefault : @"http://metaphysics-staging.artsy.net",
        ARStagingLiveAuctionSocketURLDefault : @"https://prediction-staging.artsy.net"
    }];
}

+ (void)resetDefaults
{
    [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
