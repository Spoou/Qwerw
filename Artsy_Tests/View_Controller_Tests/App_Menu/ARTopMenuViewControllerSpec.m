#import "ARTopMenuViewController.h"
#import "ARTopMenuViewController+Testing.h"
#import "ARTestTopMenuNavigationDataSource.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARFairViewController.h"
#import "ARUserManager+Stubs.h"
#import "ARTrialController.h"
#import "AROnboardingViewController.h"
#import "ARStubbedBrowseNetworkModel.h"
#import "ARBrowseViewController.h"
#import <JSBadgeView/JSBadgeView.h>
#import "ARSwitchBoard.h"
#import "ARFavoritesViewController.h"


@interface ARTopMenuNavigationDataSource (Test)
@property (nonatomic, strong, readonly) ARBrowseViewController *browseViewController;
@property (nonatomic, assign, readonly) NSUInteger *badgeCounts;

@end


@interface ARTrialController (Testing)
- (void)presentTrialWithContext:(enum ARTrialContext)context success:(void (^)(BOOL newUser))success;
@end


@interface ARTopMenuViewController (ExposedForTesting) <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
- (JSBadgeView *)badgeForButtonAtIndex:(NSInteger)index createIfNecessary:(BOOL)createIfNecessary;
@property (readwrite, nonatomic, assign) enum ARTopTabControllerIndex selectedTabIndex;
@end

SpecBegin(ARTopMenuViewController);

__block ARTopMenuViewController *sut;
__block ARTopMenuNavigationDataSource *dataSource;

dispatch_block_t sharedBefore = ^{
    sut = [[ARTopMenuViewController alloc] initWithStubbedNetworking];
    sut.navigationDataSource = dataSource;
    dataSource.browseViewController.networkModel = [[ARStubbedBrowseNetworkModel alloc] init];
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];

    [sut beginAppearanceTransition:YES animated:NO];
    [sut endAppearanceTransition];
    [sut.view layoutIfNeeded];
};

itHasSnapshotsForDevicesWithName(@"selects 'home' by default", ^{
   dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
   sharedBefore();
   return sut;
});

itHasSnapshotsForDevicesWithName(@"should be able to hide", ^{
   dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
   sharedBefore();
   [sut hideToolbar:YES animated:NO];
   return sut;
});

sharedExamplesFor(@"tab behavior", ^(NSDictionary *data) {
    __block NSInteger tab;
    before(^{
        tab = [data[@"tab"] integerValue];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/site_hero_units" withResponse:@[@{ @"heading": @"something" }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
    });

    it(@"is selectable when not selected", ^{
        expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tab]).to.beTruthy();
    });

    describe(@"already selected", ^{
        before(^{
            [sut.tabContentView setCurrentViewIndex:tab animated:NO];
        });

        it(@"is not selectable", ^{
            expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tab]).to.beFalsy();
        });

        it(@"pops to root", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];

            [sut pushViewController:[[ARFairViewController alloc] init] animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(2);

            [sut.tabContentView setCurrentViewIndex:tab animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(1);
        });
    });

    describe(@"when presenting a root view controller", ^{
        __block id topMenuVCMock = nil;
        __block id navigationControllerMock = nil;
        __block id tabContentViewMock = nil;

        before(^{
            [sut pushViewController:[[ARFairViewController alloc] init] animated:NO];

            topMenuVCMock = [OCMockObject partialMockForObject:sut];

            navigationControllerMock = [OCMockObject partialMockForObject:sut.rootNavigationController];
            [[[topMenuVCMock expect] andReturn:navigationControllerMock] rootNavigationControllerAtIndex:tab];

            tabContentViewMock = [OCMockObject partialMockForObject:sut.tabContentView];
            [[[topMenuVCMock expect] andReturn:tabContentViewMock] tabContentView];
        });

        describe(@"when already on the selected tab", ^{
            before(^{
                [sut.tabContentView setCurrentViewIndex:tab animated:NO];
            });

            it(@"animates popping", ^{
                [[navigationControllerMock expect] popToRootViewControllerAnimated:YES];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
                [navigationControllerMock verify];
            });

            it(@"does not change tab", ^{
                [[[tabContentViewMock reject] ignoringNonObjectArgs] setCurrentViewIndex:0 animated:0];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
                [tabContentViewMock verify];
            });
        });

        describe(@"when not on the selected tab", ^{
            before(^{
                NSInteger numberOfTabs = [sut.navigationDataSource numberOfViewControllersForTabContentView:sut.tabContentView];
                NSInteger otherTab = (tab + 1) % numberOfTabs;
                [sut.tabContentView setCurrentViewIndex:otherTab animated:NO];
            });

            it(@"does not animate popping", ^{
                [[navigationControllerMock expect] popToRootViewControllerAnimated:NO];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
                [navigationControllerMock verify];
            });

            it(@"changes tabs in an animated fashion", ^{
                [[tabContentViewMock expect] setCurrentViewIndex:tab animated:YES];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
                [tabContentViewMock verify];
            });
        });
    });

    describe(@"concerning badges", ^{
        __block JSBadgeView *badgeView = nil;

        before(^{
            sut.navigationDataSource.badgeCounts[tab] = tab+1;
            [sut updateBadges];
            badgeView = [sut badgeForButtonAtIndex:tab createIfNecessary:NO];
        });

        it(@"shows a notification badge", ^{
            expect(badgeView.badgeText).to.equal(@(tab+1).stringValue);
        });

        it(@"updates the badge count in the data source", ^{
            [sut setNotificationCount:0 forControllerAtIndex:tab];
            expect(badgeView.badgeText).to.equal(@"0");
        });

        it(@"does not show a notification badge when it's value is 0", ^{
            [sut setNotificationCount:0 forControllerAtIndex:tab];
            expect(badgeView.isHidden).to.beTruthy;
        });
    });
});


describe(@"presenting modally", ^{
    it(@"returns true for a UINavigationController", ^{
        UIViewController *controller = [[UIViewController alloc] init];
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:controller];
        expect([ARTopMenuViewController shouldPresentViewControllerAsModal:nav]).to.beTruthy();
    });
    it(@"returns false for a UIViewController", ^{
        UIViewController *controller = [[UIViewController alloc] init];
        expect([ARTopMenuViewController shouldPresentViewControllerAsModal:controller]).to.beFalsy();
    });
});

describe(@"navigation", ^{
   __block NSInteger tabIndex;
   before(^{
       dataSource = [[ARTopMenuNavigationDataSource alloc] init];
       sharedBefore();
   });

   describe(@"feed", ^{
       before(^{
           [sut.tabContentView setCurrentViewIndex:ARTopTabControllerIndexBrowse animated:NO];
       });
       itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexFeed]});
   });

   describe(@"browse", ^{
       itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexBrowse]});
   });

   describe(@"favorites", ^{
       before(^{
           tabIndex = ARTopTabControllerIndexFavorites;
       });

       describe(@"logged out", ^{
           __block id userMock;
           before(^{
               userMock = [OCMockObject niceMockForClass:[User class]];
               [[[userMock stub] andReturnValue:@(YES)] isTrialUser];
           });

           after(^{
               [userMock stopMocking];
           });

           it(@"is not selectable", ^{
               expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tabIndex]).to.beFalsy();
           });

           it(@"invokes signup popover", ^{
               id mock = [OCMockObject niceMockForClass:[ARTrialController class]];
               [[mock expect] presentTrialWithContext:0 success:[OCMArg any]];
           });
       });

       describe(@"logged in", ^{
           before(^{
               [ARUserManager stubAndLoginWithUsername];
           });
           after(^{
               [ARUserManager clearUserData];
           });
           itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexFavorites]});
       });
   });

    describe(@"routing", ^{
        before(^{
            [ARUserManager stubAndLoginWithUsername];
        });
        after(^{
            [ARUserManager clearUserData];
        });

        it(@"supports routing to paths", ^{
            NSDictionary *menuToPaths = @{
                @(ARTopTabControllerIndexFeed): @"/",
                @(ARTopTabControllerIndexBrowse): @"/browse",
                @(ARTopTabControllerIndexFavorites): @"/favorites",
                @(ARTopTabControllerIndexNotifications): @"/works-for-you",
            };

            ARSwitchBoard *switchboard = [ARSwitchBoard sharedInstance];
            for (NSNumber *tabIndex in menuToPaths.keyEnumerator) {
                id viewcontroller = [switchboard loadPath:menuToPaths[tabIndex]];
                if (tabIndex.integerValue == ARTopTabControllerIndexFavorites) {
                    expect(viewcontroller).to.beAKindOf(ARFavoritesViewController.class);
                } else {
                    expect(viewcontroller).to.equal([[ARTopMenuViewController sharedController] rootNavigationControllerAtIndex:tabIndex.integerValue].rootViewController);
                }
            }
        });
    });
});

SpecEnd;
