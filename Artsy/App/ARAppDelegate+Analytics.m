// MARK: Formatter Exempt

#import "ARAppDelegate+Analytics.h"
#import <ARAnalytics/ARAnalytics.h>
#import <ARAnalytics/ARDSL.h>
#import "ARAnalyticsConstants.h"
#import <HockeySDK_Source/BITHockeyManager.h>
#import <Mantle/NSDictionary+MTLManipulationAdditions.h>
#import <Adjust/Adjust.h>
#import <AFNetworking/AFNetworking.h>

#import "AROptions.h"
#import "Artsy-Swift.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARDefaults.h"
#import "ARUserManager.h"
#import "ARTopMenuNavigationDataSource.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "FeaturedLink.h"
#import "Gene.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "Profile.h"
#import "ARFairMapAnnotation.h"
#import "ARAnalyticsVisualizer.h"
#import "ARAppNotificationsDelegate.h"

// View Controllers
#import "ARFairGuideViewController.h"
#import "ARFairArtistViewController.h"
#import "ARShowViewController.h"
#import "ARProfileViewController.h"
#import "ARAppSearchViewController.h"
#import "ARInquireForArtworkViewController.h"
#import "ARArtworkViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARSignUpSplashViewController.h"
#import "ARLoginViewController.h"
#import "ARCreateAccountViewController.h"
#import "ARGeneViewController.h"
#import "ARPersonalizeViewController.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "ARPriceRangeViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARArtistViewController.h"
#import "ARFairViewController.h"
#import "ARFairSearchViewController.h"
#import "ARSharingController.h"
#import "ARFavoritesViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARArtistBiographyViewController.h"
#import "ARFairMapViewController.h"
#import "ARBrowseViewController.h"
#import "ARSearchViewController.h"
#import "ARNavigationController.h"
#import "ARHeroUnitViewController.h"
#import <Emission/ARArtistComponentViewController.h>

// Views
#import "ARHeartButton.h"
#import "ARFairMapAnnotationCallOutView.h"
#import "ARSiteHeroUnitView.h"
#import "ARButtonWithImage.h"
#import "ARTabContentView.h"
#import "ARArtworkView.h"
#import "ARSwitchView.h"
#import "ARSwitchView+Favorites.h"
#import "ARSwitchView+Artist.h"
#import "ARAppStatus.h"

// Models
#import "ARFairFavoritesNetworkModel+Private.h"
#import <Keys/ArtsyKeys.h>

// Note the Eigen Schema:
// https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862

@implementation ARAppDelegate (Analytics)

- (void)lookAtURLForAnalytics:(NSURL *)url
{
    [Adjust appWillOpenUrl:url];
}

- (void)setupAnalytics
{
    ArtsyKeys *keys = [[ArtsyKeys alloc] init];

    NSString *segmentWriteKey = keys.segmentProductionWriteKey;
    NSString *environment = ADJEnvironmentProduction;

    if (ARAppStatus.isBetaOrDev) {
        segmentWriteKey = keys.segmentDevWriteKey;
        environment = ADJEnvironmentSandbox;
    }

    if (ARAppStatus.isRunningTests == NO) {
        // Skipping ARAnalytics because Adjust has its own expectations
        // around event names being < 6 chars
        ADJConfig *adjustConfig = [ADJConfig configWithAppToken:keys.adjustProductionAppToken environment:environment];
        [Adjust appDidLaunch:adjustConfig];
    }

    if ([AROptions boolForOption:AROptionsShowAnalyticsOnScreen]) {
        ARAnalyticsVisualizer *visualizer = [ARAnalyticsVisualizer new];
        [ARAnalytics setupProvider:visualizer];
    }

#if DEBUG
    BITHockeyManager *hockey = [BITHockeyManager sharedHockeyManager];
    hockey.disableUpdateManager = YES;
    hockey.disableCrashManager = YES;
#endif

    ARAnalyticsEventShouldFireBlock heartedShouldFireBlock = ^BOOL(id controller, NSArray *parameters) {
        ARHeartButton *sender = parameters.firstObject;
        return sender.isHearted;
    };

    ARAnalyticsEventShouldFireBlock unheartedShouldFireBlock = ^BOOL(id controller, NSArray *parameters) {
        return !heartedShouldFireBlock(controller, parameters);
    };

    [ARAnalytics setupWithAnalytics:
    @{
        ARHockeyAppBetaID: @"306e66bde3cb91a2043f2606cf335700",
        ARHockeyAppLiveID: @"d7bceb80c6fa1e83e787b3919c749311",
        ARSegmentioWriteKey: segmentWriteKey,
    } configuration:
    @{
        ARAnalyticsTrackedEvents:
            @[
                @{
                    ARAnalyticsClass: ARFairGuideViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuideView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairGuideViewController *controller, NSArray *_) {
                                return @{
                                     @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                     @"fair_id" : controller.fair.fairID ?: @"",
                                 };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairLeaveFromArtist,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(addArtistOnArtsyButton)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairArtistViewController *controller, NSArray *_) {
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairLeaveFromArtist,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(addArtistOnArtsyButton)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairArtistViewController *controller, NSArray *_) {
                                return @{
                                    @"followed": controller.isFollowingArtist ? @"yes" : @"no",
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(mapButtonTapped)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairArtistViewController *controller, NSArray *_) {
                                FairOrganizer *organizer = controller.fair.organizer;
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"profile_id" : organizer.fairOrganizerID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARShowViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsPartnerShowView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return controller.dictionaryForAnalytics;
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleMapButtonPress:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return controller.dictionaryForAnalytics;
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPartnerFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowShow:)),
                            ARAnalyticsShouldFire: ^BOOL(ARShowViewController *controller, NSArray *_) {
                                return controller.isFollowing == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return @{
                                    @"gallery_slug" : controller.show.partner.partnerID ?: @"",
                                };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARHeartButton.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setHearted:animated:)),
                            ARAnalyticsShouldFire: ^BOOL(ARHeartButton *button, NSArray *_) {
                                return button.hearted;
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setHearted:animated:)),
                            ARAnalyticsShouldFire: ^BOOL(ARHeartButton *button, NSArray *_) {
                                return !button.hearted;
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARProfileViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsProfileView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loadMartsyView)),
                            ARAnalyticsProperties: ^NSDictionary*(ARProfileViewController *controller, NSArray *_) {
                                return @{
                                    @"profile_id" : controller.profileID ?: @"",
                                    @"user_id" : [[ARUserManager sharedManager] currentUser].userID ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairFavoritesNetworkModel.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuidePartnerShowSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleShowButtonPress:fair:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairFavoritesNetworkModel *model, NSArray *parameters) {
                                PartnerShow *show = parameters[0];
                                Fair *fair = parameters[1];
                                return @{
                                    @"profile_id" : fair.organizer.profileID ?: @"",
                                    @"fair_id" : fair.fairID ?: @"",
                                    @"partner_show_id" : show.showID ?: @"",
                                    @"partner_id" : show.partner.partnerID ?: @""
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuideArtworkSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleArtworkButtonPress:fair:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairFavoritesNetworkModel *model, NSArray *parameters) {
                                Artwork *artwork = parameters[0];
                                Fair *fair = parameters[1];
                                return @{
                                    @"profile_id" : fair.organizer.profileID ?: @"",
                                    @"fair_id" : fair.fairID ?: @"",
                                    @"artwork_id" : artwork.artworkID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuideArtistSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleArtistButtonPress:fair:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairFavoritesNetworkModel *model, NSArray *parameters) {
                                Artist *artist = parameters[0];
                                Fair *fair = parameters[1];
                                return @{
                                    @"profile_id" : fair.organizer.profileID ?: @"",
                                    @"fair_id" : fair.fairID ?: @"",
                                    @"artist_id" : artist.artistID ?: @"",
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARAppSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(selectedResult:ofType:fromQuery:)),
                            ARAnalyticsShouldFire: ^BOOL(ARAppSearchViewController *controller, NSArray *parameters) {
                                NSString *type = parameters[1];
                                return type != nil;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARAppSearchViewController *controller, NSArray *parameters) {
                                SearchResult *result = parameters[0];
                                NSString *type = parameters[1];
                                NSString *query = parameters[2];

                                return @{
                                    type : result.modelID ?: @"",
                                    @"query" : query ?: @"",
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedGalleryInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedContactGallery)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters) {
                                return @{
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"partner_slug": controller.artwork.partner.partnerID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkSave,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtworkViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"artwork_slug" : controller.artwork.artworkID ?: @"",
                                    @"source_screen" : @"Artwork"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkUnsave,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtworkViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == NO;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"artwork_slug" : controller.artwork.artworkID ?: @"",
                                    @"source_screen" : @"Artwork"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTapPartnerName,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedOpenArtworkPartner)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"gallery_slug": controller.artwork.partner.partnerID ?: @"",
                                };
                            },

                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkViewInMap)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *_){
                                return @{@"artwork_id" : controller.artwork.artworkID ?: @""};
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionBidTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(bidCompleted:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                SaleArtwork *saleArtwork = parameters.firstObject;
                                return @{
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"auction_id": saleArtwork.auction.saleID ?: @"",
                                    @"context_type" : @"artwork_page"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionHowBiddingWorks,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedAuctionInfo)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artwork_id" : controller.artwork.artworkID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkZoom,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(tappedTileableImagePreview),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artwork_slug" : controller.artwork.artworkID ?: @"",
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARInquireForArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsInquiryError,
                            ARAnalyticsSelectorName: @"inquiryFailed:",
                            ARAnalyticsProperties: ^NSDictionary*(ARInquireForArtworkViewController *controller, NSArray *parameters) {

                                NSError *error = [parameters firstObject];
                                NSData *data = error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey];
                                NSDictionary *recoverySuggestion;
                                NSString *responseString = @"";
                                if (data) {
                                    recoverySuggestion = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                                    responseString = [recoverySuggestion objectForKey:@"message"];
                                }
        
                                return @{
                                    @"errors" : ([error localizedDescription] ?: [error description]) ?: @"",
                                    @"response" : responseString ?: @"",
                                    @"artwork_id" : controller.artwork.artworkID ?: @"",
                                    @"inquirable" : controller.artwork.inquireable ?: @1
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSubmittedInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(inquiryCompleted:)),
                        },
                    ]
                },
                    @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInEmail,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.firstObject;
                                ARLoginViewControllerLoginType type = typeNumber.integerValue;
                                return type == ARLoginViewControllerLoginTypeEmail;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInTwitter,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.firstObject;
                                ARLoginViewControllerLoginType type = typeNumber.integerValue;
                                return type == ARLoginViewControllerLoginTypeTwitter;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInFacebook,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.firstObject;
                                ARLoginViewControllerLoginType type = typeNumber.integerValue;
                                return type == ARLoginViewControllerLoginTypeFacebook;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(failedToLoginToTwitter)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(authenticationFailure)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(networkFailure:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(failedToLoginToFacebook)),
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairMapAnnotationCallOutView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapPartnerShowTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tapped:)),
                            ARAnalyticsShouldFire: ^BOOL(ARFairMapAnnotationCallOutView *view, NSArray *parameters) {
                                return [view.annotation.representedObject isKindOfClass:[PartnerShow class]];
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARFairMapAnnotationCallOutView *view, NSArray *_){
                                PartnerShow *partnerShow = view.annotation.representedObject;
                                return @{
                                    @"fair_id" : partnerShow.fair.fairID ?: @"",
                                    @"profile_id" : partnerShow.fair.organizer.profileID ?: @"",
                                    @"partner_show_id" : partnerShow.showID ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapPartnerShowTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tapped:)),
                            ARAnalyticsShouldFire: ^BOOL(ARFairMapAnnotationCallOutView *view, NSArray *parameters) {
                                return ![view.annotation.representedObject isKindOfClass:[PartnerShow class]] && view.annotation.href;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARFairMapAnnotationCallOutView *view, NSArray *_){
                                return @{
                                    @"fair_id" : view.fair.fairID ?: @"",
                                    @"profile_id" : view.fair.organizer.profileID ?: @"",
                                    @"href" : view.annotation.href ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARGeneViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsGeneView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARGeneViewController *controller, NSArray *_){
                                return @{
                                    @"gene_id" : controller.gene.geneID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsGeneFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARGeneViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.firstObject;
                                return @{
                                    @"followed": sender.isHearted? @"yes" : @"no",
                                    @"gene_id" : controller.gene.geneID ?: @"",
                                    @"source_screen": @"gene page"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsShouldFire: ^BOOL (ARGeneViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.hearted;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsShouldFire: ^BOOL (ARGeneViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.hearted;
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARSignUpSplashViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingGetStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(startOnboarding:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLogin,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(logIn:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginSuccess,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(loggedInWithSharedCredentials),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_) {
                                return @{ @"context type": @"safari keychain" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AROnboardingViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingBudgetSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setPriceRangeDone:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                NSInteger range = [parameters.firstObject integerValue];
                                NSString *stringRange = [NSString stringWithFormat:@"%@", @(range)];
                                return @{ @"budget" : stringRange };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupSuccess,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fbSuccessWithToken:email:name:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"facebook" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fbError:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"facebook",
                                          @"error"        : @"Could not get facebook credentials"
                                          };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(login:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"email" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(twitter:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"twitter" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fb:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"facebook" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginSuccess,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARLoginViewControllerLoginType type = [_.firstObject integerValue];
                                if  (type == ARLoginViewControllerLoginTypeEmail) {
                                    return @{ @"context_type" : @"email" };
                                } else if (type == ARLoginViewControllerLoginTypeTwitter) {
                                    return @{ @"context_type" : @"twitter" };
                                } else if (type == ARLoginViewControllerLoginTypeFacebook) {
                                    return @{ @"context_type" : @"facebook" };
                                }
                                return @{};
                            },
                            ARAnalyticsShouldFire: ^BOOL(id *controller, NSArray *_) {
                                ARLoginViewControllerLoginType type = [_.firstObject integerValue];
                                return (type == ARLoginViewControllerLoginTypeEmail ||
                                        type == ARLoginViewControllerLoginTypeTwitter ||
                                        type == ARLoginViewControllerLoginTypeFacebook
                                        );
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(twitterError:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"twitter",
                                          @"error"        : @"could not get twitter credentials"
                                          };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fbError:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"facebook",
                                          @"error"        : @"could not get facebook credentials"
                                          };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fbNoUser:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"facebook",
                                          @"error"        : @"no artsy account associated with facebook profile"
                                          };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingLoginFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(authenticationFailure:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"email",
                                          @"error"        : @"invalid email and or password"
                                          };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARCreateAccountViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(submit:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"email" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fb:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"facebook" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupSuccess,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loginWithUserCredentialsWithSuccess:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"email" };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(accountExists:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"email",
                                          @"error"        : @"account already exists"
                                          };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSignupFailed,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(showWarningCouldNotCreateAccount:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context_type" : @"email",
                                          @"error"        : @"possible email or password issue"
                                          };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARAppNotificationsDelegate.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationLocal,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(registerUserInterest)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"artist follow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"launch";
                                }
                                
                                return @{
                                         @"outcome"      : @"yes",
                                         @"context_type" : analyticsContext
                                         };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationLocal,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(registerUserDisinterest)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"artist follow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"launch";
                                }
                                return @{
                                         @"outcome"      : @"cancel",
                                         @"context_type" : analyticsContext
                                         };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationApple,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(application:didRegisterForRemoteNotificationsWithDeviceToken:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"artist follow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"launch";
                                }
                                return @{
                                         @"outcome"      : @"yes",
                                         @"context_type" : analyticsContext
                                         };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationApple,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(application:didFailToRegisterForRemoteNotificationsWithError:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"artist follow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"launch";
                                }
                                return @{
                                         @"outcome"      : @"cancel",
                                         @"context_type" : analyticsContext
                                         };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingTappedSearch,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(searchStarted:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *_){
                                if (controller.state == AROnboardingStagePersonalizeArtists) {
                                    return @{
                                             @"context_type": @"artists"
                                             };
                                } else if (controller.state == AROnboardingStagePersonalizeCategories) {
                                    return @{
                                             @"context_type": @"categories"
                                             };
                                } else {
                                    return @{};
                                }
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeArtists ||
                                        controller.state == AROnboardingStagePersonalizeCategories);
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(artistFollowed:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *params){
                                Artist *artist = params.firstObject;
                                NSString *sourceScreen = @"";
                                if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModePlaceholder) {
                                    sourceScreen = @"onboarding top artists";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeSearchResults) {
                                    sourceScreen = @"onboarding search";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults) {
                                    sourceScreen = @"onboarding recommended";
                                }
                                return @{
                                         @"artist_slug" : artist.artistID,
                                         @"artist_id" : artist.artistID,
                                         @"source_screen" : sourceScreen
                                        };
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeArtists);
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsGeneFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(categoryFollowed:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *params){
                                Gene *gene = params.firstObject;
                                NSString *sourceScreen = @"";
                                if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModePlaceholder) {
                                    sourceScreen = @"onboarding top categories";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeSearchResults) {
                                    sourceScreen = @"onboarding search";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults) {
                                    sourceScreen = @"onboarding recommended";
                                }
                                return @{
                                         @"gene_id" : gene.geneID,
                                         @"source_screen" : sourceScreen
                                        };
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeCategories);
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARViewInRoomViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkViewInRoom,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARViewInRoomViewController *controller, NSArray *_){
                                return @{
                                    @"interaction_type": controller.popOnRotation ? @"rotation" : @"button",
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARViewInRoomViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkViewInRoom,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARViewInRoomViewController *controller, NSArray *_){
                                return @{
                                    @"via_rotation" : @(controller.popOnRotation),
                                    @"artwork" : controller.artwork.artworkID ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARSiteHeroUnitViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedHeroUnit,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedUnit:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARSiteHeroUnitViewController *vc, NSArray *_){
                                return @{
                                    @"destination" : vc.heroUnit.link ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARTabContentView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedMainNavigationItem,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(navigationControllerForIndex:),
                            ARAnalyticsProperties:^NSDictionary*(ARTabContentView *view, NSArray *parameters) {
                                NSInteger index = [parameters.firstObject integerValue];
                                UIButton *button = view.buttons[index];
                                NSString *title = button.accessibilityLabel ?: button.titleLabel.text;
                                NSParameterAssert(title);
                                return @{
                                    @"tab name" : (title ?: @"").lowercaseString
                                };
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                // Ignore first invocation so that we don't track when users are loading the app initially.
                                static BOOL firstInvocation = YES;
                                if (firstInvocation) {
                                    firstInvocation = NO;
                                    return NO;
                                }
 
                                return YES;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistComponentViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistComponentViewController *controller, NSArray *_){
                                return @{
                                    @"artist_id" : controller.artistID ?: @"",
                                };
                            },
                        },
                    ],
                },
                @{
                    ARAnalyticsClass: ARArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *_){
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtistViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *parameters){
                                NSString *sourcePage = @"";
                                if (controller.fair) {
                                    sourcePage = @"artist fair page";
                                } else {
                                    sourcePage = @"artist page";
                                }
                                return @{
                                         @"artist_slug" : controller.artist.artistID ?: @"",
                                         @"artist_id" : controller.artist.artistID ?: @"",
                                         @"source_screen" : sourcePage
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistUnfollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtistViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == NO;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *parameters){
                                return @{
                                    @"artist_slug" : controller.artist.artistID ?: @"",
                                    @"source_screen" : @"Artist"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: heartedShouldFireBlock,
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: unheartedShouldFireBlock,
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistTappedForSale,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(forSaleOnlyArtworksTapped)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *_){
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsProfileView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *_){
                                return @{
                                    @"profile_id" : controller.fairProfile.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairFeaturedLinkSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(didSelectFeaturedLink:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                FeaturedLink *featuredLink = parameters.firstObject;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : featuredLink.href ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairPostSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(didSelectPost:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                NSString *postURL = parameters.firstObject;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : postURL ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairFeaturedLinkSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(buttonPressed:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                ARButtonWithImage *button = parameters.firstObject;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : button.targetURL ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairOverviewSelection,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(buttonPressed:),
                            ARAnalyticsProperties:  ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                ARButtonWithImage *button = parameters.firstObject;
                                return @{
                                    @"button_text" : button.title ?: @"",
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARSharingController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsShare,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleActivityCompletion:completed:)),
                            ARAnalyticsShouldFire: ^BOOL(ARSharingController *controller, NSArray *parameters) {
                                BOOL completed = [parameters[1] boolValue];
                                return completed;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARSharingController * controller, NSArray *parameters){
                                NSString *itemType = NSStringFromClass([controller.object class]).lowercaseString;
                                NSString *activityType = parameters.firstObject;
                                return @{
                                    @"object_type" : itemType ?: @"",
                                    @"service" : activityType ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARBrowseViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsExploreTap,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(collectionView:didSelectItemAtIndexPath:),
                            ARAnalyticsProperties:^NSDictionary *(ARBrowseViewController *controller, NSArray *parameters) {
                                NSIndexPath *indexPath = parameters[1];
                                FeaturedLink *link = [controller.networkModel.links objectAtIndex:indexPath.row];

                                return @{
                                    @"type": link.title ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARAppSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchClosed,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(viewDidDisappear:)
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchStartedQuery,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(fetchSearchResults:replace:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters.firstObject ?: @""
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchCleared,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(clearSearchAnimated:)
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(selectedResult:ofType:fromQuery:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters[2] ?: @"",
                                    @"selected_object_type": parameters[1] ?: @"",
                                    @"selected_object_slug": [parameters[0] modelID] ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairSearch,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(fetchSearchResults:replace:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters.firstObject ?: @""
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(selectedResult:ofType:fromQuery:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters[2] ?: @"",
                                    @"selected_object_type": parameters[1] ?: @"",
                                    @"slug": [parameters[0] modelID] ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARNavigationController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsSelectorName: ARAnalyticsSelector(back:),
                            ARAnalyticsEventName: ARAnalyticsBackTapped
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AuctionViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionBidButtonTapped,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(userDidPressRegister:),
                            ARAnalyticsProperties: ^NSDictionary *(AuctionViewController *controller, NSArray *parameters) {
                                return @{
                                    @"auction_slug" : controller.saleID ?: @"",
                                    @"auction_state" : controller.saleViewModel.saleAvailabilityString,
                                    @"context_type": controller.navigationController.topViewController == controller ? @"sale" : @"sale information"
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworksRefineTapped,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(showRefineTapped),
                            ARAnalyticsProperties: ^NSDictionary *(AuctionViewController *controller, NSArray *parameters) {
                                return @{
                                    @"auction_slug" : controller.saleID ?: @"",
                                    @"auction_state" : controller.saleViewModel.saleAvailabilityString,
                                };
                            }
                        }
                    ]
                },
            ],
            ARAnalyticsTrackedScreens: @[
                @{
                    ARAnalyticsClass: ARSignUpSplashViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Onboarding start" } ]
                },
                @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Onboarding login" } ]
                },
                @{
                    ARAnalyticsClass: ARCreateAccountViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Onboarding signup" } ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding follow artists",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeArtists);
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding follow categories",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeCategories);
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding select budget",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeBudget);
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARNavigationController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Search",
                            ARAnalyticsSelectorName: @"search:",
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARTabContentView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Home",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexFeed;
                            }
                        },@{
                            ARAnalyticsPageName: @"Explore",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexBrowse;
                            }
                        },@{
                            ARAnalyticsPageName: @"You",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexFavorites;
                            },
                            ARAnalyticsProperties: ^NSDictionary *(ARTabContentView *view, NSArray *parameters) {
                                // Always starts on artworks tab
                                return @{ @"tab": @"Artworks" };
                            }
                        },@{
                            ARAnalyticsPageName: @"Notifications",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexNotifications;
                            },
                        },@{
                            ARAnalyticsPageName: @"Notifications Tab Tapped",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(buttonTapped:),
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject tag] == ARNavButtonNotificationsTag;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFavoritesViewController.class,
                    ARAnalyticsDetails: @[@{
                          ARAnalyticsPageName: @"You",
                        ARAnalyticsSelectorName: ARAnalyticsSelector(switchView:didPressButtonAtIndex:animated:),
                        ARAnalyticsProperties: ^NSDictionary *(ARFavoritesViewController *controller, NSArray *parameters) {
                            NSInteger buttonIndex = [parameters[1] integerValue];

                            NSString *tab = @"";
                            if (buttonIndex == ARSwitchViewFavoriteArtworksIndex) {
                                tab = @"Artworks";
                            } else if (buttonIndex == ARSwitchViewFavoriteArtistsIndex) {
                                tab = @"Artists";
                            } else if (buttonIndex == ARSwitchViewFavoriteCategoriesIndex) {
                                tab = @"Categories";
                            }
                            return @{ @"tab": tab};
                        }
                    }]
                },
                @{
                    ARAnalyticsClass: ARArtworkView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artwork",
                            ARAnalyticsSelectorName: @"artworkUpdated",
                            ARAnalyticsProperties: ^NSDictionary *(ARArtworkView *view, NSArray *_) {
                                NSDictionary *basics =  @{
                                    @"slug": view.artwork.artworkID ?: @"",
                                    @"artist_slug": view.artwork.artist.artistID ?: @"",
                                    @"partner": view.artwork.partner.partnerID ?: @"",
                                    @"price": view.artwork.price ?: @""
                                };

                                if (view.artwork.fair.fairID) {
                                    basics = [basics mtl_dictionaryByAddingEntriesFromDictionary:@{ @"fair_slug": view.artwork.fair.fairID }];
                                }

                                return basics;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair artist",
                            ARAnalyticsSelectorName: @"artistDidLoad",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairArtistViewController *controller, NSArray *_) {
                                // Fair artists only show all
                                NSString *fairID = controller.fair.fairID ?: @"";
                                NSString *artistID = controller.artist.artistID ?: @"";
                                return @{ @"fair_slug": fairID, @"artist_slug": artistID};
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artist",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairArtistViewController *controller, NSArray *_) {
                                // Displays all by default
                                NSString *artistID = controller.artist.artistID ?: @"";
                                return @{ @"tab": @"All", @"artist_slug": artistID };
                            }
                        },
                        @{
                            ARAnalyticsPageName: @"Artist",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(switchView:didPressButtonAtIndex:animated:),
                            ARAnalyticsProperties: ^NSDictionary *(ARFairArtistViewController *controller, NSArray *parameters) {
                                NSInteger index = [parameters[1] integerValue];
                                NSString *artistID = controller.artist.artistID ?: @"";

                                NSString *tab = @"";
                                if (index == ARSwitchViewArtistButtonIndex) {
                                    tab = @"All";
                                } else if (index == ARSwitchViewForSaleButtonIndex) {
                                    tab = @"For Sale";
                                }
                                return @{ @"tab": tab, @"artist_slug":artistID };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARShowViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Show",
                            ARAnalyticsSelectorName: @"showDidLoad",
                            ARAnalyticsProperties:^NSDictionary *(ARShowViewController *controller, NSArray *_) {
                                NSDictionary *basics =  @{ @"slug": controller.show.showID,
                                    @"partner_slug": controller.show.partner.partnerID ?: @""
                                };

                                if (controller.show.fair.fairID) {
                                    basics = [basics mtl_dictionaryByAddingEntriesFromDictionary:@{ @"fair_slug": controller.show.fair.fairID }];
                                }

                               return basics;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsSelectorName: @"fairDidLoad",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Overview" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairSearchViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Search" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairMapViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairMapViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Map" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairGuideViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsSelectorName: @"setFairLoaded",
                            ARAnalyticsShouldFire: ^BOOL(ARFairGuideViewController *controller, BOOL newValue) {
                                return newValue == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary *(ARFairGuideViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Personalized Guide" };
                            }
                        },
                        @{
                            ARAnalyticsPageName: @"Fair personalized guide",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(setSelectedTabIndex:),
                            ARAnalyticsProperties: ^NSDictionary *(ARFairGuideViewController *controller, NSArray *parameters) {
                                NSInteger index = [parameters.firstObject integerValue];
                                NSString *tab = @"";

                                if (index == ARFairGuideSelectedTabWork) {
                                    tab = @"Work";
                                } else if (index == ARFairGuideSelectedTabArtists) {
                                    tab = @"Artists";
                                } else if (index == ARFairGuideSelectedTabExhibitors) {
                                    tab = @"Exhibitors";
                                }

                                return @{ @"tab": tab, @"slug": controller.fair.fairID ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistBiographyViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artist Biography",
                            ARAnalyticsProperties: ^NSDictionary *(ARArtistBiographyViewController *controller, NSArray *_) {
                                return @{ @"artist_slug": controller.artist.artistID ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARGeneViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Category",
                            ARAnalyticsProperties: ^NSDictionary *(ARGeneViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.gene.geneID ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARInternalMobileWebViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"internal_mobile_web", // convert to Mobile Web? This is backwards compat as-is
                            ARAnalyticsProperties: ^NSDictionary *(ARInternalMobileWebViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.initialURL.path ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AuctionViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Sale",
                            ARAnalyticsProperties: ^NSDictionary *(AuctionViewController *controller, NSArray *_) {
                                return @{ @"auction_slug": controller.saleID ?: @"",
                                          @"slug": [NSString stringWithFormat:@"/auction/%@", controller.saleID] };
                            }
                        }
                    ]
                },
            ]
        }
    ];

    [ARUserManager identifyAnalyticsUser];
    [ARAnalytics incrementUserProperty:ARAnalyticsAppUsageCountProperty byInt:1];
}

@end
