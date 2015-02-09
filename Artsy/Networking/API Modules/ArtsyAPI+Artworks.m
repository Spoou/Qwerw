#import "ArtsyAPI+Private.h"

@implementation ArtsyAPI (Artworks)

+ (void)getArtworkInfo:(NSString *)artworkID success:(void (^)(Artwork *artwork))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworkInfoRequestForArtworkID:artworkID];
    [self getRequest:request parseIntoAClass:Artwork.class success:success failure:failure];
}

+ (void)getArtistArtworks:(Artist *)artist andPage:(NSInteger)page withParams:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSMutableDictionary *newParams = [[NSMutableDictionary alloc] initWithDictionary:@{@"size" : @10, @"page" : @(page)}];
    [newParams addEntriesFromDictionary:params];
    NSURLRequest *request = [ARRouter newArtistArtworksRequestWithParams:newParams andArtistID:artist.artistID];
    [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}

+ (void)getArtworkFromUserFavorites:(NSString *)userID page:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksFromUsersFavoritesRequestWithID:userID page:page];
    [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}

+ (AFJSONRequestOperation *)getArtworksForGene:(Gene *)gene atPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksFromGeneRequest:gene.geneID atPage:page];
    return [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}

+ (AFJSONRequestOperation *)getAuctionComparablesForArtwork:(Artwork *)artwork success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    NSURLRequest *request = [ARRouter newArtworkComparablesRequest:artwork];
    return [self getRequest:request parseIntoAnArrayOfClass:AuctionLot.class success:success failure:failure];
}

// TODO: This method should be moved into ARRouter, exposing our http client shouldn't really happen
+ (void)getAuctionArtworkWithSale:(NSString *)saleID artwork:(NSString *)artworkID success:(void (^)(id auctionArtwork))success failure:(void (^)(NSError *error))failure
{
    // get sale artwork
    NSURLRequest *request = [ARRouter saleArtworkRequestForSaleID:saleID artworkID:artworkID];
    AFJSONRequestOperation *saleArtworkOperation = [AFJSONRequestOperation JSONRequestOperationWithRequest:request success:nil failure:nil];

    // get bidder registration
    request = [ARRouter biddersRequest];
    AFJSONRequestOperation *biddersOperation = [AFJSONRequestOperation JSONRequestOperationWithRequest:request success:nil failure:nil];

    // get bidder position
    request = [ARRouter bidderPositionsRequestForSaleID:saleID artworkID:artworkID];
    AFJSONRequestOperation *positionsOperation = [AFJSONRequestOperation JSONRequestOperationWithRequest:request success:nil failure:nil];

    NSArray *operations = @[ biddersOperation, saleArtworkOperation, positionsOperation ];
    AFHTTPClient *client = [ARRouter httpClient];
    [client enqueueBatchOfHTTPRequestOperations:operations progressBlock:nil completionBlock:^(NSArray *operations) {

        // Doing all parsing here since completion blocks fire async per: https://github.com/AFNetworking/AFNetworking/issues/362

        // Parse sale artwork
        SaleArtwork *saleArtwork = nil;
        if (saleArtworkOperation.hasAcceptableStatusCode) {
            saleArtwork = [SaleArtwork modelWithJSON:saleArtworkOperation.responseJSON];
        }

        // Parse bidders
        if (biddersOperation.hasAcceptableStatusCode) {
            for (NSDictionary *dictionary in biddersOperation.responseJSON) {
                Bidder *bidder = [Bidder modelWithJSON:dictionary];
                if ([bidder.saleID isEqualToString:saleID]) {
                    saleArtwork.bidder = bidder;
                    break;
                }
            }
        }

        // Parse bidder positions
        if (positionsOperation.hasAcceptableStatusCode) {
            saleArtwork.positions = [positionsOperation.responseJSON map:^id(NSDictionary *dictionary) {
                NSError *error = nil;
                BidderPosition *position =[BidderPosition  modelWithJSON:dictionary error:&error];
                if (error) {
                    ARErrorLog(@"Couldn't parse bidder position. Error: %@", error.localizedDescription);
                }
                return position;

            }];
        }

        if (success) {
            success(saleArtwork);
        }
    }];
}

+ (AFJSONRequestOperation *)getFairsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    // The API returns related fairs regardless of whether or not they have the associated
    // data necessary to render the fair view. Fairs without an organizer/profile should
    // not be rendered as a fair. It is up to the client to make this distinction.

    NSURLRequest *request = [ARRouter newFairsRequestForArtwork:artwork];
    return [self getRequest:request
        parseIntoAnArrayOfClass:[Fair class]
        success:^(NSArray *fairs) {
            NSPredicate *predicate = [NSPredicate predicateWithFormat:@"organizer.profileID!=nil"];
            fairs = [fairs filteredArrayUsingPredicate:predicate];
            success(fairs);
        }
        failure:failure];
}

+ (AFJSONRequestOperation *)getShowsForArtworkID:(NSString *)artworkID
                                        inFairID:(NSString *)fairID
                                         success:(void (^)(NSArray *shows))success
                                         failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newShowsRequestForArtworkID:artworkID andFairID:fairID];
    return [self getRequest:request
        parseIntoAnArrayOfClass:[PartnerShow class]
        success:success
        failure:failure];
}

@end
