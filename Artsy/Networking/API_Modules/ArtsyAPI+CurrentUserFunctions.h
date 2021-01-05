#import "ArtsyAPI.h"

@class User, Bidder;

NS_ASSUME_NONNULL_BEGIN

@interface ArtsyAPI (CurrentUserFunctions)

+ (void)getMeHEADWithSuccess:(void (^)(void))success failure:(void (^)(NSHTTPURLResponse *response, NSError *error))failure;
+ (void)getMe:(void (^)(User *))success failure:(void (^)(NSError *error))failure;

+ (void)updateCurrentUserProperty:(NSString *)property toValue:(id)value success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure;

/// If the user is logged in, performs a request for their bidder model(s) for the corresponding sale.
/// Calls success callback based on presence of any model in the response. A failure invocation indicates a failure in the network request.
+ (void)getCurrentUserBiddersForSale:(NSString *)saleID success:(void (^)(NSArray<Bidder *> *))success failure:(void (^)(NSError *error))failure;

@end

NS_ASSUME_NONNULL_END
