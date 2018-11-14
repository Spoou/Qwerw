#import "ARTopMenuNavigationDataSource.h"

#import "ARFeedTimeline.h"
#import "Artsy-swift.h"
#import <Emission/AREmission.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileViewController.h>

#import "ARTopMenuInternalMobileWebViewController.h"
#import "ARFeedSubclasses.h"
#import "FeaturedLink.h"
#import "ARNavigationController.h"
#import "AROptions.h"
#import "ARDefaults.h"
#import "ARSwitchBoard.h"

#import <SDWebImage/SDWebImagePrefetcher.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARTopMenuNavigationDataSource ()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;

@property (nonatomic, assign, readonly) NSUInteger *badgeCounts;

@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (nonatomic, strong) ARNavigationController *favoritesNavigationController;
@property (nonatomic, strong) ARNavigationController *messagingNavigationController;
@property (nonatomic, strong) ARNavigationController *profileNavigationController;

@end


@implementation ARTopMenuNavigationDataSource

- (void)dealloc;
{
    free(_badgeCounts);
}

- (instancetype)init
{
    self = [super init];

    _badgeCounts = malloc(sizeof(NSUInteger) * ARTopTabControllerIndexDelimiter);
    for (int i = 0; i < ARTopTabControllerIndexDelimiter; i++) {
        _badgeCounts[i] = 0;
    }
    
    BOOL shouldOpenOnForYouTab = [[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding;
    ARHomeComponentViewController *homeVC = [[ARHomeComponentViewController alloc] initWithSelectedArtist:nil tab:shouldOpenOnForYouTab ? ARHomeTabForYou : ARHomeTabArtists emission:nil];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController:homeVC];

    return self;
}

- (ARNavigationController *)messagingNavigationController
{
    if (_messagingNavigationController) {
        return _messagingNavigationController;
    }

    ARComponentViewController *messagingVC = [[ARInboxComponentViewController alloc] initWithInbox];
    _messagingNavigationController = [[ARNavigationController alloc] initWithRootViewController:messagingVC];
    return _messagingNavigationController;
}

- (ARNavigationController *)getHomeViewControllerWithArtist:(NSString *)artistID
{
    ARHomeComponentViewController *homeVC = [[ARHomeComponentViewController alloc] initWithSelectedArtist:artistID tab:ARHomeTabArtists emission:nil];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController:homeVC];
    return _feedNavigationController;
}

- (ARNavigationController *)profileNavigationController
{
    if (_profileNavigationController) {
        return _profileNavigationController;
    }

    ARComponentViewController *profileVC = [[ARMyProfileViewController alloc] init];
    _profileNavigationController = [[ARNavigationController alloc] initWithRootViewController:profileVC];
    return _profileNavigationController;
}

- (ARNavigationController *)favoritesNavigationController
{
    ARFavoritesComponentViewController *favoritesVC = [[ARFavoritesComponentViewController alloc] init];
    _favoritesNavigationController = [[ARNavigationController alloc] initWithRootViewController:favoritesVC];
    return _favoritesNavigationController;
}

- (ARNavigationController *)worksForYouNavigationControllerWithSelectedArtist:(NSString *)artistID
{
    ARWorksForYouComponentViewController *worksForYouComponentVC = [[ARWorksForYouComponentViewController alloc] initWithSelectedArtist:artistID];
    return [[ARNavigationController alloc] initWithRootViewController:worksForYouComponentVC];
}

- (ARNavigationController *)cameraNavigationController
{
    if (@available(iOS 11.3, *)) {
        MetadataInARViewController *cameraVC = [[MetadataInARViewController alloc] init];
        return [[ARNavigationController alloc] initWithRootViewController:cameraVC];
    } else {
        // Fallback on earlier versions
        return [[ARNavigationController alloc] initWithRootViewController:[UIViewController new]];
    }
}

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
{
    return (ARNavigationController *)[self navigationControllerAtIndex:index parameters:nil];
}

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index parameters:(NSDictionary *)params;
{
    switch (index) {
        case ARTopTabControllerIndexHome:
            if (params && params[@"artist_id"]) {
                return [self getHomeViewControllerWithArtist:params[@"artist_id"]];
            } else {
                return [self feedNavigationController];
            }

        case ARTopTabControllerIndexMessaging:
            return [self messagingNavigationController];
            
        case ARTopTabControllerIndexCamera:
            return [self cameraNavigationController];

        case ARTopTabControllerIndexFavorites:
            return [self favoritesNavigationController];

        case ARTopTabControllerIndexProfile:
            return [self profileNavigationController];

    }

    return nil;
}

#pragma mark Search

- (BOOL)searchButtonAtIndex:(NSInteger)index
{
    return index == ARTopTabControllerIndexSearch;
}

#pragma mark ARTabViewDataSource

- (UINavigationController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index
{
    _currentIndex = index;
    return [self navigationControllerAtIndex:index];
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView canPresentViewControllerAtIndex:(NSInteger)index
{
    return YES;
}

- (NSInteger)numberOfViewControllersForTabContentView:(ARTabContentView *)tabContentView
{
    return ARTopTabControllerIndexDelimiter;
}

- (NSUInteger)badgeNumberForTabAtIndex:(NSInteger)index;
{
    return self.badgeCounts[index];
}

- (void)setBadgeNumber:(NSUInteger)number forTabAtIndex:(NSInteger)index;
{
    // Don’t send superfluous remoteNotificationsReceived: events to the controllers.
    if (self.badgeCounts[index] != number) {
        self.badgeCounts[index] = number;

        // When setting 0, that just means to remove the badge, no remote notifications were received.
        if (number > 0) {
            ARNavigationController *navigationController = [self navigationControllerAtIndex:index];
            id<ARTopMenuRootViewController> rootViewController = (id<ARTopMenuRootViewController>)navigationController.rootViewController;
            if ([rootViewController respondsToSelector:@selector(remoteNotificationsReceived:)]) {
                [rootViewController remoteNotificationsReceived:number];
            }
        }
    }

    // Always ensure the app icon badge is updated to the right count.
    NSInteger total = 0;
    for (NSInteger i = 0; i < ARTopTabControllerIndexDelimiter; i++) {
        total += self.badgeCounts[i];
    }
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:total];
}

// Just an alias for the above, which keeps the ARTabViewDataSource and ARTopMenuViewController concerns seperated.
- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;
{
    [self setBadgeNumber:number forTabAtIndex:index];
}

@end
