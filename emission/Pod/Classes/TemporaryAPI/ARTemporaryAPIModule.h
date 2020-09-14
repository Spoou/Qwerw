#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

typedef void(^ARNotificationReadStatusAssigner)(RCTResponseSenderBlock block);

typedef void(^ARNotificationPermissionsPrompter)();

typedef void(^ARAuthValidationChecker)();

typedef void(^ARAugmentedRealityVIRPresenter)(NSString *imgUrl, CGFloat widthIn, CGFloat heightIn, NSString *artworkSlug, NSString *artworkId);

typedef void(^ARRelativeURLResolver)(NSString *path, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject);

/// While metaphysics is read-only, we need to rely on Eigen's
/// v1 API access to get/set these bits of information.

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, readwrite) ARNotificationPermissionsPrompter notificationPermissionPrompter;

@property (nonatomic, copy, readwrite) ARNotificationReadStatusAssigner notificationReadStatusAssigner;

@property (nonatomic, copy, readwrite) ARAugmentedRealityVIRPresenter augmentedRealityVIRPresenter;

@property (nonatomic, copy, readwrite) ARAuthValidationChecker authValidationChecker;

@property (nonatomic, copy, readwrite) ARRelativeURLResolver urlResolver;

@end
