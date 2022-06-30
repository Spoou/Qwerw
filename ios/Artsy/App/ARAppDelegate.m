#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <AFOAuth1Client/AFOAuth1Client.h>
#import <UICKeyChainStore/UICKeyChainStore.h>
#import <Firebase.h>
#import <Appboy.h>
#import "AppboyReactUtils.h"
#import <Analytics/SEGAnalytics.h>
#import <Segment-Appboy/SEGAppboyIntegrationFactory.h>
#import <Segment-Adjust/SEGAdjustIntegrationFactory.h>
#import <Adjust/Adjust.h>

#import "ARAnalyticsConstants.h"
#import "ARAppDelegate.h"
#import "ARAppDelegate+Analytics.h"
#import "ARAppDelegate+Emission.h"
#import "ARAppDelegate+Echo.h"
#import "ARAppNotificationsDelegate.h"
#import "ARAppConstants.h"
#import "ARFonts.h"
#import "ARUserManager.h"
#import "AROptions.h"

#import "UIViewController+InnermostTopViewController.h"
#import "ARAdminSettingsViewController.h"
#import "ARRouter.h"
#import "ARNetworkConstants.h"
#import "ArtsyAPI+Private.h"
#import "ARFileUtils.h"
#import "ARWebViewCacheHost.h"
#import "ARAppStatus.h"
#import "Artsy-Swift.h"
#import "ARSystemTime.h"
#import "ARDispatchManager.h"
#import "ARLogger.h"

#import "AREmission.h"
#import "AREventsModule.h"
#import "ARTemporaryAPIModule.h"
#import "ARTakeCameraPhotoModule.h"
#import "ARPHPhotoPickerModule.h"
#import "ARNotificationsManager.h"
#import "ARCocoaConstantsModule.h"

#import "UIDevice-Hardware.h"
#import "ArtsyEcho.h"

#import <react-native-config/ReactNativeConfig.h>

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <React/RCTDevSettings.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "AREmission.h"
#import "ARNotificationsManager.h"

#if defined(FB_SONARKIT_ENABLED) && __has_include(<FlipperKit/FlipperClient.h>)
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>


static void InitializeFlipper(UIApplication *application) {
    FlipperClient *client = [FlipperClient sharedClient];
    SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
    [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
    [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
    [client addPlugin:[FlipperKitReactPlugin new]];
    [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
    [client start];
}
#endif


@interface ARAppDelegate ()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@property (strong, nonatomic, readwrite) NSDictionary *initialLaunchOptions;

@end


@implementation ARAppDelegate

static ARAppDelegate *_sharedInstance = nil;

+ (void)load
{
    _sharedInstance = [[self alloc] init];
    [JSDecoupledAppDelegate sharedAppDelegate].appStateDelegate = _sharedInstance;
    [JSDecoupledAppDelegate sharedAppDelegate].appDefaultOrientationDelegate = (id)_sharedInstance;
    [JSDecoupledAppDelegate sharedAppDelegate].URLResourceOpeningDelegate = (id)_sharedInstance;
}

+ (ARAppDelegate *)sharedInstance
{
    return _sharedInstance;
}

// Because we‘ve locked the launch screen on iPhone to portrait mode, we now have to unlock all of them again such that
// VCs get to decide the allowed orientations, specifically for the view in room VC.
- (NSUInteger)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
    return UIInterfaceOrientationMaskAll;
}

/// These are the pre-requisites for doing any background networking with Eigen.

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.echo = [[ArtsyEcho alloc] init];
    [self setupEcho];

    self.initialLaunchOptions = launchOptions;
    return YES;
}

/// This is called when we are going to present a user interface, which
/// is both on traditional app launch, and every time we are backgrounded and back.

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [self setupForAppLaunch:nil];
}

- (void)setupForAppLaunch:(NSDictionary *)launchOptions
{
    // In case everything's already set up
    if (self.window) {
        return;
    }

    // Temp Fix for: https://github.com/artsy/eigen/issues/602
    [self forceCacheCustomFonts];

    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[ARAppNotificationsDelegate alloc] init];

    [self countNumberOfRuns];

    _landingURLRepresentation = self.landingURLRepresentation ?: @"https://artsy.net";

    [[ARLogger sharedLogger] startLogging];

    AREmission *emission = [self setupSharedEmission];

    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
    [emission setBridge:bridge];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:@"eigen"
                                              initialProperties:nil];

    if (@available(iOS 13.0, *)) {
        rootView.backgroundColor = [UIColor systemBackgroundColor];
    } else {
        rootView.backgroundColor = [UIColor whiteColor];
    }

    self.window = [[ARWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];

    if (@available(iOS 13.0, *)) {
        // prevent dark mode
        self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
    }

    [ARWebViewCacheHost startup];
    [self registerNewSessionOpened];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#if defined(FB_SONARKIT_ENABLED) && __has_include(<FlipperKit/FlipperClient.h>)
    InitializeFlipper(application);
#endif

    [self setupForAppLaunch:launchOptions];

    [self setupAnalytics:application withLaunchOptions:launchOptions];

    FBSDKApplicationDelegate *fbAppDelegate = [FBSDKApplicationDelegate sharedInstance];
    [fbAppDelegate application:application didFinishLaunchingWithOptions:launchOptions];

    BOOL ossUser = [[ReactNativeConfig envFor:@"OSS"] isEqualToString:@"True"];
    if ([FIRApp defaultApp] == nil && !ossUser) {
        [FIRApp configure];
    }

    return YES;
}

- (void)setupAnalytics:(UIApplication *)application withLaunchOptions:(NSDictionary *)launchOptions
{
    NSString *brazeAppKey = [ReactNativeConfig envFor:@"BRAZE_STAGING_APP_KEY_IOS"];
    if (![ARAppStatus isDev]) {
        brazeAppKey = [ReactNativeConfig envFor:@"BRAZE_PRODUCTION_APP_KEY_IOS"];
    }

    NSString *brazeSDKEndPoint = @"sdk.iad-06.braze.com";
    NSMutableDictionary *appboyOptions = [NSMutableDictionary dictionary];
    appboyOptions[ABKEndpointKey] = brazeSDKEndPoint;
    [Appboy startWithApiKey:brazeAppKey
              inApplication:application
          withLaunchOptions:launchOptions
          withAppboyOptions:appboyOptions];

    NSString *segmentWriteKey = [ReactNativeConfig envFor:@"SEGMENT_STAGING_WRITE_KEY_IOS"];
    if (![ARAppStatus isDev]) {
        segmentWriteKey = [ReactNativeConfig envFor:@"SEGMENT_PRODUCTION_WRITE_KEY_IOS"];
    }

    SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:segmentWriteKey];
    configuration.trackApplicationLifecycleEvents = YES;
    configuration.trackPushNotifications = YES;
    configuration.trackDeepLinks = YES;
    [configuration use:[SEGAdjustIntegrationFactory instance]];
    [SEGAnalytics setupWithConfiguration:configuration];
    [[SEGAppboyIntegrationFactory instance] saveLaunchOptions:launchOptions];
    [[AppboyReactUtils sharedInstance] populateInitialUrlFromLaunchOptions:launchOptions];
}

- (void)registerNewSessionOpened
{
    // TODO: Customise APPBOY Sessions
    // A session is started when you call [[Appboy sharedInstance] startWithApiKey:inApplication:withLaunchOptions:withAppboyOptions]
}

// This happens every time we come _back_ to the app from the background
- (void)applicationWillEnterForeground:(UIApplication *)application
{
    [self registerNewSessionOpened];

    NSString *currentUserId = [[[ARUserManager sharedManager] currentUser] userID];
    if (currentUserId) {
        [[Appboy sharedInstance] changeUser: currentUserId];
    }
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // MANUALLY track lifecycle event. Segment already does this if
    // trackLifecycleSessions: true
}

- (ARAppNotificationsDelegate *)remoteNotificationsDelegate;
{
    return (ARAppNotificationsDelegate *)[[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
}

- (void)forceCacheCustomFonts
{
    __unused UIFont *font = [UIFont serifSemiBoldFontWithSize:12];
    font = [UIFont serifFontWithSize:12];
    font = [UIFont serifItalicFontWithSize:12];
    font = [UIFont sansSerifFontWithSize:12];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    NSString *sourceApplication = options[UIApplicationOpenURLOptionsSourceApplicationKey];
    id annotation = options[UIApplicationOpenURLOptionsAnnotationKey];

    _referralURLRepresentation = options[UIApplicationOpenURLOptionsSourceApplicationKey];
    _landingURLRepresentation = [url absoluteString];

    [self trackDeeplinkWithTarget:url referrer:_referralURLRepresentation];

    // Twitter SSO
    if ([[url absoluteString] hasPrefix:ARTwitterCallbackPath]) {
        NSNotification *notification = nil;
        notification = [NSNotification notificationWithName:kAFApplicationLaunchedWithURLNotification
                                                     object:nil
                                                   userInfo:@{kAFApplicationLaunchOptionsURLKey : url}];

        [[NSNotificationCenter defaultCenter] postNotification:notification];
        return YES;
    }

    // Facebook
    NSString *fbScheme = [@"fb" stringByAppendingString:[[NSBundle mainBundle] objectForInfoDictionaryKey:@"FacebookAppID"]];

    if ([[url scheme] isEqualToString:fbScheme]) {
        // Call FBAppCall's handleOpenURL:sourceApplication to handle Facebook app responses
        FBSDKApplicationDelegate *fbAppDelegate = [FBSDKApplicationDelegate sharedInstance];

        // If they this returns true it means Facebook handled the URL
        if ([fbAppDelegate application:app openURL:url sourceApplication:sourceApplication annotation:annotation]) {
            return YES;
        }

        // OK, so it could be a link from the app, which looks like:
        // fb308278682573501://authorize?target_url=https%3A%2F%2Fwww.artsy.net%2Farticle%2Fartsy-editorial-peruvian-artists-mansion-idyllic-art-filled-hotel
        NSURLComponents *components = [NSURLComponents componentsWithString:url.absoluteString];
        NSURLQueryItem *target = [components.queryItems find:^BOOL(NSURLQueryItem *object) {
            return [object.name isEqualToString:@"target_url"];
        }];

        if (target) {
            url = [NSURL URLWithString: target.value];
        }
    }

    if ([url isFileURL]) {
        // AirDrop receipt
        NSData *fileData = [NSData dataWithContentsOfURL:url];
        NSDictionary *data = [NSJSONSerialization JSONObjectWithData:fileData options:0 error:nil];
        NSString *urlString = [data valueForKey:@"url"];

        if (urlString) {
            [[AREmission sharedInstance] navigate:urlString];
            return YES;

        } else {
            return NO;
        }
    }

    [[AREmission sharedInstance] navigate:[url absoluteString]];

    return YES;
}

- (void)countNumberOfRuns
{
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty] + 1;

    [[NSUserDefaults standardUserDefaults] setInteger:numberOfRuns forKey:ARAnalyticsAppUsageCountProperty];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
    return @[
        [[AREmission sharedInstance] eventsModule],
        [[AREmission sharedInstance] APIModule],
        [ARTakeCameraPhotoModule new],
        [ARPHPhotoPickerModule new],
        [[AREmission sharedInstance] notificationsManagerModule],
        [ARCocoaConstantsModule new],
    ];
}

@end


@implementation ARWindow

- (void)sendEvent:(UIEvent *)event
{
    [super sendEvent:event];

    if (event.type == UIEventTypeTouches) {
        self.lastTouchPoint = [[[event allTouches] anyObject] locationInView:self];
    }
}

@end
