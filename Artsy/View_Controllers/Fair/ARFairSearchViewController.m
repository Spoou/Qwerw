#import "ARFairSearchViewController.h"

#import "ArtsyAPI+Search.h"
#import "ARFonts.h"
#import "ARSearchViewController+Private.h"
#import "Fair.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "ARDispatchManager.h"

#import "MTLModel+JSON.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@implementation ARFairSearchViewController

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super init];

    if (!self) {
        return nil;
    }

    _fair = fair;

    return self;
}

- (void)viewDidLoad
{
    self.defaultInfoLabelText = @"Find Exhibitors & Artists";
    self.searchIconImageName = @"SearchIcon_HeavyGrey";

    [super viewDidLoad];

    self.view.backgroundColor = [UIColor whiteColor];
    self.textField.textColor = [UIColor artsyGraySemibold];
    self.textField.tintColor = [UIColor artsyGraySemibold];
    self.textField.clearButtonMode = UITextFieldViewModeWhileEditing;
    [self.closeButton setTitleColor:[UIColor artsyGraySemibold] forState:UIControlStateNormal];

    self.searchDataSource.textColor = [UIColor artsyGraySemibold];
    self.searchDataSource.placeholderImage = [UIImage imageNamed:@"SearchThumb_HeavyGrey"];

    // fair search is a solid grey background
    UIView *searchBox = [[UIView alloc] init];
    searchBox.backgroundColor = [UIColor artsyGrayLight];

    [searchBox constrainHeight:@"44"];

    [self.view insertSubview:searchBox atIndex:0];

    [self.view alignLeadingEdgeWithView:searchBox predicate:@"-10"];
    [searchBox alignTrailingEdgeWithView:self.closeButton predicate:@"-46"];
    [self.view alignTopEdgeWithView:searchBox predicate:@"-10"];

    [searchBox alignCenterYWithView:self.searchBoxView predicate:@"0"];
}

- (void)fetchSearchResults:(NSString *)text replace:(BOOL)replaceResults
{
    ar_dispatch_async(^{
        NSArray *partnerSearchResults = [self searchPartners:text];
        ar_dispatch_main_queue(^{
            [self addResults:partnerSearchResults replace:replaceResults];
            [super fetchSearchResults:text replace:NO];
        });
    });
}

- (NSArray *)searchPartners:(NSString *)query
{
    query = query.lowercaseString;
    NSMutableArray *results = [NSMutableArray array];
    NSSet *allShows = self.fair.shows;
    for (PartnerShow *show in allShows) {
        // boths are usually some text that ends with the booth number
        if ([show.locationInFair.lowercaseString hasSuffix:query]) {
            [results addObject:[SearchResult modelWithJSON:@{
                @"id" : show.showID,
                @"display" : show.locationInFair,
                @"model" : @"partnershow",
                @"label" : show.partner.partnerID,
                @"published" : @YES
            }]];
        } else {
            // partner names match by prefix and within each word of the partner name
            NSString *partnerName = show.partner.name.lowercaseString;
            NSString *partnerShortName = show.partner.shortName.lowercaseString;
            if ([partnerName hasPrefix:query] || [[partnerName componentsSeparatedByCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] includes:query] || [partnerShortName hasPrefix:query] || [[partnerShortName componentsSeparatedByCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] includes:query]) {
                [results addObject:[SearchResult modelWithJSON:@{
                    @"id" : show.showID,
                    @"display" : show.partner.name,
                    @"model" : @"partnershow",
                    @"label" : show.partner.partnerID,
                    @"published" : @YES
                }]];
            }
        }

        if (results.count == 5) {
            break;
        }
    }
    return results;
}

- (AFHTTPRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    AFHTTPRequestOperation *request = [ArtsyAPI searchWithFairID:self.fair.fairID andQuery:query success:^(NSArray *searchResults) {
        success([searchResults select:^BOOL(SearchResult *searchResult) {
            // we have local search results for shows
            return ! [searchResult.model isEqual:[PartnerShow class]];
        }]);
    } failure:failure];

    return request;
}

- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    [self.delegate selectedResult:result ofType:type fromQuery:query];
}

- (void)closeSearch:(id)sender
{
    [super closeSearch:sender];
    if ([self.delegate respondsToSelector:@selector(cancelledSearch:)]) {
        [self.delegate cancelledSearch:self];
    } else {
        [self clearSearchAnimated:YES];
    }
}

@end
