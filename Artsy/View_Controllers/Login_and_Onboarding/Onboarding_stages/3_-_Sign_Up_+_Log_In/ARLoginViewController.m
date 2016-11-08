#import "ARLoginViewController.h"

#import "ARLoginFieldsView.h"
#import "ARLoginButtonsView.h"
#import "Artsy+UILabels.h"

#import "ARFonts.h"
#import "ARUserManager.h"
#import "AROnboardingNavBarView.h"
#import "ARAuthProviders.h"
#import "UIViewController+FullScreenLoading.h"
#import <UIAlertView_Blocks/UIAlertView+Blocks.h>
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "UIView+HitTestExpansion.h"
#import "ARTheme.h"
#import "ARNetworkErrorManager.h"
#import "ARDispatchManager.h"
#import "ARDeveloperOptions.h"
#import "ARLogger.h"

#import "UIDevice-Hardware.h"

#import "Artsy-Swift.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <ORStackView/ORStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

#define SPINNER_TAG 0x555


@interface ARLoginViewController () <UITextFieldDelegate>

@property (nonatomic, strong) ARLoginFieldsView *textFieldsView;
@property (nonatomic, strong) ARLoginButtonsView *buttonsView;
@property (nonatomic, strong) ARSerifLineHeightLabel *titleLabel;
@property (nonatomic, strong) NSLayoutConstraint *titleToTextFieldsSpacer;


@property (nonatomic, strong) UIButton *back;
@property (nonatomic, strong) UIButton *testBotButton;
@property (nonatomic, strong) ARUppercaseButton *loginButton;
@property (nonatomic, strong) NSString *email;

@property (nonatomic, strong) NSLayoutConstraint *keyboardConstraint;
@end


@implementation ARLoginViewController

- (instancetype)initWithEmail:(NSString *)email
{
    self = [super init];
    if (self) {
        _email = email;
    }
    return self;
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [self showViews];
}

- (void)showViews
{
    self.view.backgroundColor = [UIColor whiteColor];

    self.back = [[UIButton alloc] init];
    [self.back setImage:[UIImage imageNamed:@"BackArrowBlack"] forState:UIControlStateNormal];
    [self.back setImage:[UIImage imageNamed:@"BackArrow_Highlighted"] forState:UIControlStateHighlighted];
    [self.back addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:self.back];

    [self.back constrainWidth:@"20" height:@"20"];
    [self.back alignTop:@"10" leading:@"10" toView:self.view];

    self.titleLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:1.4];
    self.titleLabel.text = @"Login to your Artsy account";
    self.titleLabel.font = [UIFont serifFontWithSize:self.useLargeLayout ? 40.0 : 30.0];
    self.titleLabel.textAlignment = self.useLargeLayout ? NSTextAlignmentCenter : NSTextAlignmentLeft;

    [self.view addSubview:self.titleLabel];

    [self.titleLabel constrainWidthToView:self.view predicate:@"*.9"];
    [self.titleLabel alignCenterXWithView:self.view predicate:@"0"];
    [self.titleLabel constrainTopSpaceToView:self.back predicate:@"20"];
    [self.titleLabel constrainHeight:@"60"];

    self.textFieldsView = [[ARLoginFieldsView alloc] init];
    [self.view addSubview:self.textFieldsView];

    [self.textFieldsView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"*.9"];
    [self.textFieldsView alignCenterXWithView:self.view predicate:@"0"];
    self.titleToTextFieldsSpacer = [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:self.useLargeLayout ? @"120" : @"60"];

    [self.textFieldsView constrainHeight:@">=108"];
    [self.textFieldsView setupForLogin];

    self.buttonsView = [[ARLoginButtonsView alloc] init];
    [self.view addSubview:self.buttonsView];
    [self.buttonsView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"*.9"];
    [self.buttonsView alignCenterXWithView:self.view predicate:@"0"];
    [self.buttonsView constrainTopSpaceToView:self.textFieldsView predicate:@"0"];
    [self.buttonsView constrainHeight:@"300"];
    [self.buttonsView setupForLogin];

    self.textFieldsView.emailField.delegate = self;
    self.textFieldsView.passwordField.delegate = self;

    [self.buttonsView.emailActionButton setEnabled:NO animated:NO];

    [self.buttonsView.emailActionButton addTarget:self action:@selector(login:) forControlEvents:UIControlEventTouchUpInside];
    [self.buttonsView.forgotPasswordButton addTarget:self action:@selector(forgotPassword:) forControlEvents:UIControlEventTouchUpInside];
    [self.buttonsView.facebookActionButton addTarget:self action:@selector(fb:) forControlEvents:UIControlEventTouchUpInside];
    [self.buttonsView.twitterActionButton addTarget:self action:@selector(twitter:) forControlEvents:UIControlEventTouchUpInside];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    UITapGestureRecognizer *keyboardCancelTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideKeyboard)];
    [self.view addGestureRecognizer:keyboardCancelTap];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UITextFieldTextDidChangeNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillShowNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillHideNotification
                                                  object:nil];
}

- (void)didBecomeActive
{
    // If you've cancelled a twitter request we're currently showing the loader
    // add a delay so the user gets that they were doing something as they were leaving.
    ar_dispatch_after(0.3, ^{
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    });
}


- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textChanged:) name:UITextFieldTextDidChangeNotification object:nil];

    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(didBecomeActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
}

- (void)setupDefaultUsernameAndPassword
{
    if (([ARDeveloperOptions options][@"username"] && [ARDeveloperOptions options][@"password"]) && self.hideDefaultValues == NO) {
        self.textFieldsView.emailField.text = [ARDeveloperOptions options][@"username"];
        self.textFieldsView.passwordField.secureTextEntry = YES;
        self.textFieldsView.passwordField.text = [ARDeveloperOptions options][@"password"];
        self.textFieldsView.passwordField.secureTextEntry = NO;
    }
}

- (void)back:(id)sender
{
    // If self.email is set, we got dropped off here from SSO
    // so we wanna go back to the splash instead.

    if (self.email) {
        [self.delegate slideshowDone];
    }

    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark -
#pragma mark Spinner Methods

- (void)showSpinner
{
    UIView *view = [[UIView alloc] initWithFrame:self.view.bounds];
    view.backgroundColor = [UIColor colorWithWhite:0 alpha:.5];
    UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [view addSubview:spinner];
    spinner.center = CGPointMake(CGRectGetMidX(self.view.bounds), CGRectGetMidY(self.view.bounds));
    [spinner startAnimating];

    UILabel *label = [[UILabel alloc] init];
    label.font = [UIFont serifFontWithSize:16];
    label.textColor = [UIColor whiteColor];
    [label sizeToFit];
    label.center = CGPointMake(spinner.center.x, spinner.center.y + 50);
    [view addSubview:label];
    [self.view addSubview:view];
    view.tag = SPINNER_TAG;

    //we dont want the keyboard to shoot up while we're spinning
    [self hideKeyboard];
}

- (void)hideSpinner
{
    UIView *view = [self.view viewWithTag:SPINNER_TAG];
    [view removeFromSuperview];
}

#pragma mark -
#pragma mark Textfield Delegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    if ([textField isEqual:self.textFieldsView.emailField]) {
        [self.textFieldsView.passwordField becomeFirstResponder];
    } else {
        [self login:nil];
    }
    return YES;
}

- (void)textChanged:(NSNotification *)n
{
    [self.buttonsView.emailActionButton setEnabled:[self validates] animated:YES];
}

#pragma mark -
#pragma mark Keyboard Notifications

- (void)hideKeyboard
{
    [self.view endEditing:YES];
}


- (void)keyboardWillShow:(NSNotification *)notification
{
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    if (UIInterfaceOrientationIsLandscape([[UIApplication sharedApplication] statusBarOrientation])) {
        self.titleToTextFieldsSpacer = [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:self.useLargeLayout ? @"20" : @"60"];
    }
    [UIView animateIf:YES duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    self.titleToTextFieldsSpacer = [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:self.useLargeLayout ? @"120" : @"60"];
    [UIView animateIf:YES duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}


#pragma mark -
#pragma mark Networking

- (void)loggedInWithType:(ARLoginViewControllerLoginType)type user:(User *)currentUser
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    [self loggedInWithUser:currentUser];
}

#pragma mark -
#pragma mark Twitter

- (void)twitter:(id)sender
{
    [self hideKeyboard];
    __weak typeof(self) wself = self;

    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    [ARAuthProviders getReverseAuthTokenForTwitter:^(NSString *token, NSString *secret) {
        [[ARUserManager sharedManager] loginWithTwitterToken:token
            secret:secret
            successWithCredentials:nil
            gotUser:^(User *currentUser) {
                __strong typeof (wself) sself = wself;
                [sself loggedInWithType:ARLoginViewControllerLoginTypeTwitter user:currentUser];
            } authenticationFailure:^(NSError *error) {
                __strong typeof (wself) sself = wself;
                [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
                [sself twitterError];

            } networkFailure:^(NSError *error) {
                __strong typeof (wself) sself = wself;
                [sself failedToLoginToTwitter:error];
            }];

    } failure:^(NSError *error) {
             __strong typeof (wself) sself = wself;
             [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
             [sself twitterError];
    }];
}


- (void)failedToLoginToTwitter:(NSError *)error
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    [self networkFailure:error];
}

- (void)twitterError
{
    [UIAlertView showWithTitle:@"Couldn’t get Twitter credentials"
                       message:@"Couldn’t get Twitter credentials. Please link a Twitter account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}

#pragma mark -
#pragma mark Facebook

- (void)fb:(id)sender
{
    [self hideKeyboard];
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    __weak typeof(self) wself = self;
    [ARAuthProviders getTokenForFacebook:^(NSString *token, NSString *email, NSString *name) {
        [[ARUserManager sharedManager] loginWithFacebookToken:token
           successWithCredentials:nil gotUser:^(User *currentUser) {
               __strong typeof (wself) sself = wself;
                [sself loggedInWithType:ARLoginViewControllerLoginTypeFacebook user:currentUser];
           } authenticationFailure:^(NSError *error) {
               __strong typeof (wself) sself = wself;

               [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];

               NSString * reason = error.userInfo[@"com.facebook.sdk:ErrorLoginFailedReason"];
               if (![reason isEqualToString:@"com.facebook.sdk:UserLoginCancelled"]) {
                   [sself fbError];
               } else if ([error.userInfo[@"AFNetworkingOperationFailingURLResponseErrorKey"] statusCode] == 401) {
                   // This case handles a 401 from Artsy's server, which means the Facebook account is not associated with a user.
                   [sself fbNoUser];
               }

           } networkFailure:^(NSError *error) {
               __strong typeof (wself) sself = wself;
               [sself failedToLoginToFacebook:error];
           }];
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;

        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [sself fbError];
    }];
}

- (void)failedToLoginToFacebook:(NSError *)error;
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    [self networkFailure:error];
}

- (void)fbError
{
    [UIAlertView showWithTitle:@"Couldn’t get Facebook credentials"
                       message:@"Couldn’t get Facebook credentials. If you continue having trouble, please email Artsy support at support@artsy.net"
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}

- (void)fbNoUser
{
    [UIAlertView showWithTitle:@"Account not found"
                       message:@"We couldn't find an Artsy account associated with your Facebook profile. You can link your Facebook account in your settings on artsy.net. If you continue having trouble, please email Artsy support at support@artsy.net"
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}

#pragma mark -
#pragma mark Email

- (BOOL)validates
{
    return self.textFieldsView.emailField.text.length && self.textFieldsView.passwordField.text.length;
}

- (void)login:(id)sender
{
    if ([self validates]) {
        [self loginWithUsername:_textFieldsView.emailField.text andPassword:_textFieldsView.passwordField.text];
    }
}

- (void)loginWithUsername:(NSString *)username andPassword:(NSString *)password
{
    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] loginWithUsername:username
        password:password
        successWithCredentials:nil
        gotUser:^(User *currentUser) {
                                                 __strong typeof (wself) sself = wself;
                                                 [sself loggedInWithType:ARLoginViewControllerLoginTypeEmail user:currentUser];
        }

        authenticationFailure:^(NSError *error) {
                                   __strong typeof (wself) sself = wself;
                                   [sself authenticationFailure];
        }

        networkFailure:^(NSError *error) {
                                          __strong typeof (wself) sself = wself;
                                          [sself networkFailure:error];
        }];
}

- (void)authenticationFailure
{
    [self resetForm];
    [self presentErrorMessage:@"Please check your email and password"];
}

#pragma mark -
#pragma mark Forgot Password

- (void)forgotPassword:(id)sender
{
    UIAlertView *alert = [[UIAlertView alloc]
            initWithTitle:@"Forgot Password"
                  message:@"Please enter your email address and we’ll send you a reset link."
                 delegate:nil
        cancelButtonTitle:@"Cancel"
        otherButtonTitles:@"Send Link", nil];
    alert.alertViewStyle = UIAlertViewStylePlainTextInput;
    [[alert textFieldAtIndex:0] setKeyboardAppearance:UIKeyboardAppearanceDark];
    alert.tapBlock = ^(UIAlertView *alertView, NSInteger buttonIndex) {
        if (buttonIndex == alertView.firstOtherButtonIndex) {
            NSString *email = [[alertView textFieldAtIndex:0] text];
            if (!email.length || ![email containsString:@"@"]) {
                [self passwordResetError:@"Please check your email address"];
            } else {
                [self showSpinner];
                [self sendPasswordResetEmail:email];
            }
        }
    };
    [self hideKeyboard];
    [alert show];
}

- (void)sendPasswordResetEmail:(NSString *)email
{
    [[ARUserManager sharedManager] sendPasswordResetForEmail:email success:^{
        [self passwordResetSent];
        ARActionLog(@"Sent password reset request for %@", email);
    } failure:^(NSError *error) {
        ARErrorLog(@"Password reset failed for %@. Error: %@", email, error.localizedDescription);
        [self passwordResetError:@"Couldn’t send reset password link. Please try again, or contact support@artsy.net"];
    }];
}

- (void)passwordResetSent
{
    [self hideSpinner];
    [UIAlertView showWithTitle:@"Please Check Your Email"
                       message:@"We have sent you an email with a link to reset your password"
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}

- (void)passwordResetError:(NSString *)message
{
    [self hideSpinner];
    [UIAlertView showWithTitle:@"Couldn’t Reset Password"
                       message:message
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}

#pragma mark -
#pragma mark Misc

- (void)resetForm
{
    self.textFieldsView.passwordField.text = @"";
    self.buttonsView.emailActionButton.alpha = 1;
}

- (void)networkFailure:(NSError *)error
{
    [ARNetworkErrorManager presentActiveError:error withMessage:@"Sign in failed."];
    self.buttonsView.emailActionButton.alpha = 1;
}

- (void)presentErrorMessage:(NSString *)message
{
    [UIAlertView showWithTitle:@"Couldn’t Log In"
                       message:message
             cancelButtonTitle:@"Dismiss"
             otherButtonTitles:nil
                      tapBlock:nil];
}

- (void)loggedInWithUser:(User *)user
{
    [self.delegate dismissOnboardingWithVoidAnimation:YES];
}


@end
