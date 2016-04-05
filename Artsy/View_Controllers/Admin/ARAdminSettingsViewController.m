#import <HockeySDK_Source/HockeySDK.h>
#import <HockeySDK_Source/BITFeedbackManager.h>
#import <MobileCoreServices/MobileCoreServices.h>

#import "ARAdminSettingsViewController.h"
#import "ARQuicksilverViewController.h"

#import "ARDefaults.h"
#import "ARGroupedTableViewCell.h"
#import "ARAnimatedTickView.h"
#import "ARAppDelegate.h"
#import "ARUserManager.h"
#import "ARFileUtils.h"
#import "ARRouter.h"
#import "AROptions.h"

#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

#if DEBUG
#import <VCRURLConnection/VCR.h>
#endif

NSString *const AROptionCell = @"OptionCell";
NSString *const ARLabOptionCell = @"LabOptionCell";


@implementation ARAdminSettingsViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARTableViewData *tableViewData = [[ARTableViewData alloc] init];
    [self registerClass:[ARTickedTableViewCell class] forCellReuseIdentifier:ARLabOptionCell];
    [self registerClass:[ARAdminTableViewCell class] forCellReuseIdentifier:AROptionCell];

    ARSectionData *miscSectionData = [[ARSectionData alloc] init];
    NSString *name = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *gitCommitRevision = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitRev"];

    miscSectionData.headerTitle = [NSString stringWithFormat:@"%@ v%@, build %@ (%@)", name, version, build, gitCommitRevision];

    [miscSectionData addCellData:[self generateLogOut]];
    [miscSectionData addCellData:[self generateOnboarding]];
    [miscSectionData addCellData:[self generateFeedback]];
    [miscSectionData addCellData:[self generateRestart]];
    [miscSectionData addCellData:[self generateStagingSwitch]];
    [miscSectionData addCellData:[self generateQuicksilver]];
    [miscSectionData addCellData:[self generateOnScreenAnalytics]];

#if !TARGET_IPHONE_SIMULATOR
    [miscSectionData addCellData:[self generateNotificationTokenPasteboardCopy]];
#endif

    [tableViewData addSectionData:miscSectionData];

    ARSectionData *labsSection = [self createLabsSection];
    [tableViewData addSectionData:labsSection];

    ARSectionData *vcrSection = [self createVCRSection];
    [tableViewData addSectionData:vcrSection];

    ARSectionData *developerSection = [self createDeveloperSection];
    [tableViewData addSectionData:developerSection];

    self.tableViewData = tableViewData;
    self.tableView.contentInset = UIEdgeInsetsMake(88, 0, 0, 0);
}

- (ARCellData *)generateLogOut
{
    ARCellData *onboardingData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [onboardingData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Log Out";
    }];

    [onboardingData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self showAlertViewWithTitle:@"Confirm Logout" message:@"App will exit. Please re-open to log back in." actionTitle:@"Logout" actionHandler:^{
            [ARUserManager logout];
        }];
    }];
    return onboardingData;
}

- (ARCellData *)generateOnboarding
{
    ARCellData *onboardingData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [onboardingData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Show Onboarding";
    }];

    [onboardingData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self showSlideshow];
    }];
    return onboardingData;
}


- (ARCellData *)generateFeedback
{
    ARCellData *emailData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [emailData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Provide Feedback";
    }];

    [emailData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        ARHockeyFeedbackDelegate *feedback = [[ARHockeyFeedbackDelegate alloc] init];
        [feedback showFeedback:nil];

    }];
    return emailData;
}


- (ARCellData *)generateRestart
{
    ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Restart";
    }];

    [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        exit(YES);
    }];
    return crashCellData;
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
    ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Quicksilver";
    }];

    [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        ARQuicksilverViewController *quicksilver = [[ARQuicksilverViewController alloc] init];
        [self.navigationController pushViewController:quicksilver animated:YES];
    }];
    return crashCellData;
}

- (ARCellData *)generateOnScreenAnalytics
{
    ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        if ([AROptions boolForOption:AROptionsShowAnalyticsOnScreen]) {
            cell.textLabel.text = @"Stop Analytics as Popovers";
        } else {
            cell.textLabel.text = @"Start Analytics as Popovers";
        }
    }];

    [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        BOOL current = [AROptions boolForOption:AROptionsShowAnalyticsOnScreen];
        [AROptions setBool:!current forOption:AROptionsShowAnalyticsOnScreen];
        exit(YES);
    }];
    return crashCellData;
}


#if !TARGET_IPHONE_SIMULATOR
- (ARCellData *)generateNotificationTokenPasteboardCopy;
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
        cell.textLabel.text = @"Copy Push Notification Token";
    };
    cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
        NSString *deviceToken = [[NSUserDefaults standardUserDefaults] valueForKey:ARAPNSDeviceTokenKey];
        [[UIPasteboard generalPasteboard] setValue:deviceToken forPasteboardType:(NSString *)kUTTypePlainText];
    };
    return cellData;
}
#endif

- (ARSectionData *)createLabsSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Labs";

    NSArray *options = [AROptions labsOptions];
    for (NSInteger index = 0; index < options.count; index++) {
        NSString *title = options[index];

        ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
        [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
            cell.textLabel.text = title;
            cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:[AROptions boolForOption:title]];
        }];

        [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
            BOOL currentSelection = [AROptions boolForOption:title];
            [AROptions setBool:!currentSelection forOption:title];

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

    ARCellData *stagingAPI = [self cellDataWithName:@"API" defaultKey:ARStagingAPIURLDefault];
    ARCellData *stagingPhoneWeb = [self cellDataWithName:@"Phone Web" defaultKey:ARStagingPhoneWebURLDefault];
    ARCellData *stagingPadWeb = [self cellDataWithName:@"Pad Web" defaultKey:ARStagingPadWebURLDefault];
    ARCellData *stagingMetaphysics = [self cellDataWithName:@"Metaphysics" defaultKey:ARStagingMetaphysicsURLDefault];
    ARCellData *stagingSocket = [self cellDataWithName:@"Live Auctions Socket" defaultKey:ARStagingLiveAuctionSocketURLDefault];

    [labsSectionData addCellDataFromArray:@[ stagingAPI, stagingPhoneWeb, stagingPadWeb, stagingMetaphysics, stagingSocket ]];
    return labsSectionData;
}


- (ARSectionData *)createVCRSection
{
    ARSectionData *vcrSectionData = [[ARSectionData alloc] init];
#if DEBUG
    vcrSectionData.headerTitle = @"Offline Recording Mode (Dev)";

    ARCellData *startCellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
    [startCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Start Recording, restarts";
    }];

    [startCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        NSString *oldFilePath = [ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"];
        [[NSFileManager defaultManager] removeItemAtPath:oldFilePath error:nil];

        [AROptions setBool:YES forOption:AROptionsUseVCR];
        exit(0);
    }];

    ARCellData *saveCellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
    [saveCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Saves Recording, restarts";
    }];

    [saveCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [VCR save:[ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"]];
        exit(0);
    }];


    [vcrSectionData addCellData:startCellData];
    [vcrSectionData addCellData:saveCellData];
#endif

    return vcrSectionData;
}

- (void)showAlertViewWithTitle:(NSString *)title message:(NSString *)message actionTitle:(NSString *)actionTitle actionHandler:(void (^)())handler
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];

    // if iOS 7

    if (!alert) {
        handler();
    }

    UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:actionTitle
                                                            style:UIAlertActionStyleDestructive
                                                          handler:^(UIAlertAction *action) {
                                        handler();
                                                          }];


    UIAlertAction *cancelAction = [UIAlertAction
        actionWithTitle:@"Cancel"
                  style:UIAlertActionStyleCancel
                handler:nil];

    [alert addAction:defaultAction];
    [alert addAction:cancelAction];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)showSlideshow
{
    ARAppDelegate *delegate = [ARAppDelegate sharedInstance];
    [delegate showTrialOnboardingWithState:ARInitialOnboardingStateSlideShow andContext:ARTrialContextNotTrial];

    [self.navigationController popViewControllerAnimated:NO];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (ARCellData *)cellDataWithName:(NSString *)name defaultKey:(NSString *)key
{
    ARCellData *cell = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];

    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *value = [defaults stringForKey:key];

    [cell setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = [NSString stringWithFormat:@"%@: %@", name, value];
    }];

    [cell setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        UIAlertController *controller = [UIAlertController alertControllerWithTitle:name message:@"" preferredStyle:UIAlertControllerStyleAlert];

        [controller addAction:[UIAlertAction actionWithTitle:@"Save + Restart" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
            UITextField *theTextField = [controller textFields].firstObject;
            [defaults setObject:theTextField.text forKey:key];
            [defaults synchronize];
            exit(0);
        }]];

        [controller addAction:[UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
        }]];

        [controller addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            textField.text = value;
        }];

        [self presentViewController:controller animated:YES completion:nil];
    }];
    return cell;
}

@end
