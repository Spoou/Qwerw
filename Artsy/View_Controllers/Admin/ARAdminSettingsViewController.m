#import <HockeySDK-Source/HockeySDK.h>
#import <HockeySDK-Source/BITFeedbackManager.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <ReplayKit/ReplayKit.h>

#import "ARAdminSettingsViewController.h"
#import "ARQuicksilverViewController.h"
#import "AREchoContentsViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARAdminSentryBreadcrumbViewController.h"

#import "ARDefaults.h"
#import "ARAnimatedTickView.h"
#import "ARAppDelegate.h"
#import "ARUserManager.h"
#import "ARFileUtils.h"
#import "ARRouter.h"
#import "AROptions.h"

#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"
#import "ARAdminNetworkModel.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <Emission/AREmission.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARShowConsignmentsFlowViewController.h>

#if DEBUG
#import <VCRURLConnection/VCR.h>
#endif

NSString *const ARRecordingScreen = @"ARRecordingScreen";

@implementation ARAdminSettingsViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARTableViewData *tableViewData = [[ARTableViewData alloc] init];

    NSString *name = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *gitCommitRevision = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitRev"];


    ARSectionData *userSectionData = [[ARSectionData alloc] init];
    userSectionData.headerTitle = [NSString stringWithFormat:@"%@ v%@, build %@ (%@)", name, version, build, gitCommitRevision];

    [userSectionData addCellDataFromArray:@[
        [self generateStagingSwitch],
        [self generateRestart],
        [self generateLogOut],
    ]];
    [tableViewData addSectionData:userSectionData];

    ARSectionData *feedbackSectionData = [[ARSectionData alloc] init];
    feedbackSectionData.headerTitle = @"Feedback";
    [feedbackSectionData addCellDataFromArray:@[
        [self generateFeedback],
        [self generateRecording],
    ]];
    [tableViewData addSectionData:feedbackSectionData];


    ARSectionData *launcherSections = [[ARSectionData alloc] initWithCellDataArray:@[
        [self generateOnboarding],
        [self generateShowAllLiveAuctions],
        [self showConsignmentsFlow],
        [self showSentryBreadcrumbs],
        [self generateQuicksilver],
        [self generateEchoContents],
   ]];
    launcherSections.headerTitle = @"Launcher";
    [tableViewData addSectionData:launcherSections];

    ARSectionData *rnSection = [self createReactNativeSection];
    [tableViewData addSectionData:rnSection];

    ARSectionData *labsSection = [self createLabsSection];
    [tableViewData addSectionData:labsSection];

    ARSectionData *toggleSections = [[ARSectionData alloc] initWithCellDataArray:@[
       [self generateOnScreenAnalytics],
       [self generateOnScreenMartsy]
    ]];
    toggleSections.headerTitle = @"Options";
    [tableViewData addSectionData:toggleSections];

    ARSectionData *vcrSection = [self createVCRSection];
    [tableViewData addSectionData:vcrSection];

    ARSectionData *developerSection = [self createDeveloperSection];
    [tableViewData addSectionData:developerSection];

    self.tableViewData = tableViewData;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (ARCellData *)generateLogOut
{
    return [self tappableCellDataWithTitle:@"Log Out" selection:^{
        [self showAlertViewWithTitle:@"Confirm Log Out" message:@"" actionTitle:@"Continue" actionHandler:^{
            [ARUserManager logout];
        }];
    }];
}

- (ARCellData *)generateOnboarding
{
    return [self tappableCellDataWithTitle:@"Show Onboarding" selection:^{
        [self showSlideshow];
    }];
}

- (ARCellData *)generateFeedback
{
    return [self tappableCellDataWithTitle:@"Provide Beta Feedback" selection:^{
        ARHockeyFeedbackDelegate *feedback = [[ARHockeyFeedbackDelegate alloc] init];
        [feedback showFeedback:nil data:nil];
    }];
}

- (ARCellData *)generateRecording
{
    BOOL isRecording = [AROptions boolForOption:ARRecordingScreen];
    ARCellData *emailData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [emailData setCellConfigurationBlock:^(UITableViewCell *cell) {
        NSString *message = isRecording ? @"Stop Recording" : @"Record Video of Screen";
        cell.textLabel.text = message;
    }];

    [emailData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        if(!isRecording) {
            [self.navigationController popViewControllerAnimated:FALSE];
            [[RPScreenRecorder sharedRecorder] startRecordingWithHandler:^(NSError * _Nullable error) {
                if (error) {
                    [self showAlertViewWithTitle:@"Error setting up recorder" message:error.localizedDescription actionTitle:@"Sorry..." actionHandler:nil];
                }
                [AROptions setBool:YES forOption:ARRecordingScreen];
            }];
        } else {
            [AROptions setBool:NO forOption:ARRecordingScreen];
            [[RPScreenRecorder sharedRecorder] stopRecordingWithHandler:^(RPPreviewViewController * _Nullable previewViewController, NSError * _Nullable error) {
                previewViewController.previewControllerDelegate = [ARHockeyFeedbackDelegate shared];
                [[ARTopMenuViewController sharedController] pushViewController:previewViewController];

            }];
        }
    }];
    return emailData;
}

- (ARCellData *)generateRestart
{
    return [self tappableCellDataWithTitle:@"Restart" selection:^{
        exit(0);
    }];
}

- (ARCellData *)generateStagingSwitch
{
    BOOL useStaging = [AROptions boolForOption:ARUseStagingDefault];
    NSString *title = NSStringWithFormat(@"Switch to %@ (Logs out)", useStaging ? @"Production" : @"Staging");

    ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = title;
    }];

    [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self showAlertViewWithTitle:@"Confirm Logout" message:@"Switching servers requires logout. App will exit. Please re-open to log back in." actionTitle:@"Continue" actionHandler:^{
            [ARUserManager logoutAndSetUseStaging:!useStaging];
        }];
    }];
    return crashCellData;
}

- (ARCellData *)generateQuicksilver
{
    return [self tappableCellDataWithTitle:@"Quicksilver" selection:^{
        ARQuicksilverViewController *quicksilver = [[ARQuicksilverViewController alloc] init];
        [self.navigationController pushViewController:quicksilver animated:YES];
    }];
}

- (ARCellData *)showSentryBreadcrumbs
{
    return [self tappableCellDataWithTitle:@"Show Sentry Breadcrumbs" selection:^{
        ARAdminSentryBreadcrumbViewController *quicksilver = [[ARAdminSentryBreadcrumbViewController alloc] init];
        [self.navigationController pushViewController:quicksilver animated:YES];
    }];
}


- (ARCellData *)generateShowAllLiveAuctions
{
    return [self tappableCellDataWithTitle:@"Show All Live Auctions" selection:^{

        NSURL *url = [NSURL URLWithString:@"https://live-staging.artsy.net"];
        ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:url];
        [self.navigationController pushViewController:webVC animated:YES];
    }];
}

- (ARCellData *)showConsignmentsFlow
{
    return [self tappableCellDataWithTitle:@"Start Consignments Flow" selection:^{
        id vc = [[ARShowConsignmentsFlowViewController alloc] init];
        [self.navigationController presentViewController:vc animated:YES completion:NULL];
    }];
}

- (ARCellData *)generateOnScreenAnalytics
{
    NSString *message = [AROptions boolForOption:AROptionsShowAnalyticsOnScreen] ? @"Stop" : @"Start";
    NSString * title = NSStringWithFormat(@"%@ on Screen Analytics", message);

    return [self tappableCellDataWithTitle:title selection:^{
        BOOL current = [AROptions boolForOption:AROptionsShowAnalyticsOnScreen];
        [AROptions setBool:!current forOption:AROptionsShowAnalyticsOnScreen];
        exit(YES);
    }];
}

- (ARCellData *)generateOnScreenMartsy
{
    NSString *message = [AROptions boolForOption:AROptionsShowMartsyOnScreen] ? @"Hide" : @"Show";
    NSString * title = NSStringWithFormat(@"%@ Red Dot for Martsy Views", message);

    return [self tappableCellDataWithTitle:title selection:^{
        BOOL current = [AROptions boolForOption:AROptionsShowMartsyOnScreen];
        [AROptions setBool:!current forOption:AROptionsShowMartsyOnScreen];
        exit(YES);
    }];
}

- (ARCellData *)generateEchoContents
{
    return [self tappableCellDataWithTitle:@"View Echo Configuration" selection:^{
        [self.navigationController pushViewController:[[AREchoContentsViewController alloc] init] animated:YES];
    }];
}

#if !TARGET_IPHONE_SIMULATOR
- (ARCellData *)generateNotificationTokenPasteboardCopy;
{
    return [self tappableCellDataWithTitle:@"Copy Push Notification Token" selection:^{
        NSString *deviceToken = [[NSUserDefaults standardUserDefaults] valueForKey:ARAPNSDeviceTokenKey];
        [[UIPasteboard generalPasteboard] setValue:deviceToken forPasteboardType:(NSString *)kUTTypePlainText];
    }];
}
#endif

- (ARSectionData *)createReactNativeSection
{
    ARSectionData *sectionData = [[ARSectionData alloc] init];
    sectionData.headerTitle = @"React Native";

    BOOL isStagingReact = [AROptions boolForOption:AROptionsStagingReactEnv];
    BOOL isDevReact = [AROptions boolForOption:AROptionsDevReactEnv];

    if (isStagingReact) {
        [sectionData addCellDataFromArray:self.emissionInformationCells];
        [sectionData addCellData:self.emissionVersionUpdater];
    }
    if (!isDevReact) {
        [sectionData addCellData:self.toggleStagingReactNative];
    }
    if (!isStagingReact) {
        [sectionData addCellData:self.useDevReactNative];
    }
    return sectionData;
}

- (NSArray<ARCellData *> *)emissionInformationCells
{
    NSError *jsonError = nil;
    NSURL *metadataURL = [ARAdminNetworkModel fileURLForLatestCommitMetadata];

    NSData *data = [NSData dataWithContentsOfURL:metadataURL];
    if(!data) { return @[]; }

    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&jsonError];
    Metadata *metadata = [[Metadata alloc] initFromJSONDict:json];

    if (jsonError) { return @[]; }

    ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
    NSDate *lastUpdate = [dateFormatter dateFromString:[metadata date]];

    NSUInteger unitFlags = NSCalendarUnitDay;
    NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierISO8601];
    NSDateComponents *components = [calendar components:unitFlags fromDate:lastUpdate toDate:[NSDate dateWithTimeIntervalSinceNow:0] options:0];

    NSString *pr = [NSString stringWithFormat:@"Last PR #%@ - %@", [metadata number], [metadata title]];
    NSString *emissionVersion = [[NSUserDefaults standardUserDefaults] valueForKey:AREmissionHeadVersionDefault];
    NSString *days = [NSString stringWithFormat:@"%@ %@", @([components day]), [components day] == 1 ? @"day" : @"days"];

    return @[
     [self informationCellDataWithTitle:[NSString stringWithFormat:@"Emission v%@", emissionVersion]],
     [self informationCellDataWithTitle:[NSString stringWithFormat:@"Current Code is %@ old", days]],

     [self tappableCellDataWithTitle:pr selection:^{
         NSString *addr = [NSString stringWithFormat:@"https://github.com/artsy/emission/pull/%@", metadata.number];
         NSURL *url = [NSURL URLWithString:addr];
         id viewController = [[ARInternalMobileWebViewController alloc] initWithURL:url];
         [self.navigationController pushViewController:viewController animated:YES];
     }]
 ];
}

- (ARCellData *)emissionVersionUpdater
{
    // This should stay the long-form version so that it can edit the cell's text

    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    cellData.keepSelection = YES;

    cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
        cell.textLabel.text = @"Update Emission to latest";
    };

    cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
        NSIndexPath *selection = tableView.indexPathForSelectedRow;
        UITableViewCell *cell = [tableView cellForRowAtIndexPath:selection];
        cell.textLabel.text = @"Updating...";

        [self updateEmissionVersion:^() {
            exit(0);
        }];
    };
    return cellData;
}

- (void)updateEmissionVersion:(void (^)(void))completion;
{
    __block NSString *subtitleMessage = @"Emission from master";
    ARAdminNetworkModel *model = [[ARAdminNetworkModel alloc] init];
    [model downloadJavaScriptForMasterCommit:^(NSString * _Nullable title, NSString * _Nullable subtitle) {
        subtitleMessage = subtitle;

    } completion:^(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error) {
        if (error) {
            NSLog(@"Err: %@", error);
        } else {
            [self showAlertViewWithTitle:@"Restarting" message:subtitleMessage actionTitle:@"Restart" actionHandler:^{
                completion();
            }];
        }
    }];
}

- (ARCellData *)toggleStagingReactNative
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    cellData.keepSelection = YES;

    BOOL isStagingReact = [AROptions boolForOption:AROptionsStagingReactEnv];
    NSString *message = isStagingReact? @"Return to original" : @"Switch to Staging";
    NSString *title = NSStringWithFormat(@"%@ React Native ENV (restarts)", message);


    cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
        cell.textLabel.text = title;
    };

    cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
        // Update defaults
        [AROptions setBool: ![AROptions boolForOption:AROptionsStagingReactEnv] forOption:AROptionsStagingReactEnv];

        // Pass some metadata
        NSBundle *bundle = [NSBundle bundleForClass:AREmission.class];
        NSString *version = bundle.infoDictionary[@"CFBundleShortVersionString"];
        [[NSUserDefaults standardUserDefaults] setValue:version forKey:AREmissionHeadVersionDefault];
        [[NSUserDefaults standardUserDefaults] synchronize];

        if (!isStagingReact) {
            // Let the user know we're updating the JS
            NSIndexPath *selection = tableView.indexPathForSelectedRow;
            UITableViewCell *cell = [tableView cellForRowAtIndexPath:selection];
            cell.textLabel.text = @"Downloading Emission...";

            return [self updateEmissionVersion:^{ exit(0); }];
        }

        exit(0);
    };

    return cellData;
}

- (ARCellData *)useDevReactNative
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    BOOL isDevReact = [AROptions boolForOption:AROptionsDevReactEnv];

    cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
        if (isDevReact) {
            cell.textLabel.text = @"Use bundled Emission (restarts)";
        } else {
            cell.textLabel.text = @"Use local Emission packaging server (restarts)";
        }
    };
    cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
        [AROptions setBool: !isDevReact forOption:AROptionsDevReactEnv];

        // Bail quick if we're turning it off
        if (isDevReact) { exit(0); }

        // Warn to see the docs
        NSString *message = @"See the Emission docs on this, github.com/artsy/Emission/docs/running-emission-in-eigen.md";
        UIAlertController *controller = [UIAlertController alertControllerWithTitle:@"Note" message:message preferredStyle:UIAlertControllerStyleAlert];

        [controller addAction:[UIAlertAction actionWithTitle:@"Got it" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
            [AROptions setBool: !isDevReact forOption:AROptionsDevReactEnv];
            exit(0);
        }]];
        [self presentViewController:controller animated:YES completion:nil];
    };
    return cellData;
}


- (ARSectionData *)createLabsSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Labs";

    NSArray *options = [AROptions labsOptions];
    for (NSInteger index = 0; index < options.count; index++) {
        NSString *title = options[index];
        BOOL requiresRestart = [[AROptions labsOptionsThatRequireRestart] indexOfObject:title] != NSNotFound;

        ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
        [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
            cell.textLabel.text = requiresRestart ? [title stringByAppendingString:@" (restarts)"] : title;
            cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:[AROptions boolForOption:title]];
        }];

        [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
            BOOL currentSelection = [AROptions boolForOption:title];
            [AROptions setBool:!currentSelection forOption:title];

            if (requiresRestart) {
                // Show checkmark.
                ar_dispatch_after(1, ^{
                    exit(0);
                });
            }

            UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
            [(ARAnimatedTickView *)cell.accessoryView setSelected:!currentSelection animated:YES];
        }];

        [labsSectionData addCellData:cellData];
    }
    return labsSectionData;
}

- (ARSectionData *)createDeveloperSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Developer";

    [labsSectionData addCellDataFromArray:@[

#if !TARGET_IPHONE_SIMULATOR
        [self generateNotificationTokenPasteboardCopy],
#endif
        [self editableTextCellDataWithName:@"Gravity API" defaultKey:ARStagingAPIURLDefault],
        [self editableTextCellDataWithName:@"Web" defaultKey:ARStagingWebURLDefault],
        [self editableTextCellDataWithName:@"Metaphysics" defaultKey:ARStagingMetaphysicsURLDefault],
        [self editableTextCellDataWithName:@"Live Auctions Socket" defaultKey:ARStagingLiveAuctionSocketURLDefault],
    ]];
    return labsSectionData;
}


- (ARSectionData *)createVCRSection
{
    ARSectionData *vcrSectionData = [[ARSectionData alloc] init];
#if DEBUG
    vcrSectionData.headerTitle = @"Offline Recording Mode (Dev)";

    ARCellData *startCellData = [self tappableCellDataWithTitle:@"Start API Recording, restarts" selection:^{
        NSString *oldFilePath = [ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"];
        [[NSFileManager defaultManager] removeItemAtPath:oldFilePath error:nil];

        [AROptions setBool:YES forOption:AROptionsUseVCR];
        exit(0);
    }];

    ARCellData *saveCellData = [self tappableCellDataWithTitle:@"Saves API Recording, restarts" selection:^{
        [VCR save:[ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"]];
        exit(0);
    }];

    [vcrSectionData addCellData:startCellData];
    [vcrSectionData addCellData:saveCellData];
#endif

    return vcrSectionData;
}

- (void)showSlideshow
{
    ARAppDelegate *delegate = [ARAppDelegate sharedInstance];
    [delegate showOnboardingWithState:ARInitialOnboardingStateSlideShow];

    [self.navigationController popViewControllerAnimated:NO];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

@end
