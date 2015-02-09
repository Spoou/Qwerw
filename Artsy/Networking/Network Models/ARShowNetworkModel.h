#import <Foundation/Foundation.h>

@interface ARShowNetworkModel : NSObject

- (instancetype)initWithFair:(Fair *)fair show:(PartnerShow *)show;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) PartnerShow *show;

- (void)getShowInfo:(void (^)(PartnerShow *show))success failure:(void (^)(NSError *error))failure;

- (void)getFairMaps:(void (^)(NSArray *maps))success;

- (void)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

- (void)getFairBoothArtworksAndInstallShots:(PartnerShow *)show
                           gotInstallImages:(void (^)(NSArray *images))gotInstallImages
                                gotArtworks:(void (^)(NSArray *images))gotArtworkImages
                                   noImages:(void (^)(void))noImages;

@end
