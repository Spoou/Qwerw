#import "ARStubbedArtistNetworkModel.h"

@implementation ARStubbedArtistNetworkModel

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    success(self.artistForArtistInfo);
}

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure

{
    success(self.artworksForArtworksAtPage);
}

@end
