#import "ARSaleArtworkFlowCollectionViewCell.h"
#import "UIImage+ImageFromColor.h"
@import Expecta_Snapshots;
@import OCMock;

SpecBegin(ARSaleArtworkFlowCollectionViewCell);

__block id saleArtworkMock;

beforeEach(^{
    saleArtworkMock = [OCMockObject mockForClass:[SaleArtworkViewModel class]];
    [[[saleArtworkMock stub] andReturn:@"Yozo Bozo"] artistName];
    [[[saleArtworkMock stub] andReturn:@"A lovely photo"] artworkName];
    [[[saleArtworkMock stub] andReturn:[NSURL URLWithString:@"http://example.com"]] thumbnailURL];
    [[[saleArtworkMock stub] andReturn:@"$1,000"] currentOrStartingBidWithNumberOfBids:NO];
    [[[saleArtworkMock stub] andReturn:@"$1,000 (4 Bids)"] currentOrStartingBidWithNumberOfBids:YES];
    [[[saleArtworkMock stub] andReturn:@"4"] lotNumber];
    [[[saleArtworkMock stub] andReturn:@"4"] numberOfBids];
});

it(@"looks good with compact cells", ^{
    CGSize size = CGSizeMake(375, 120);
    id layoutAttributesMock = [OCMockObject mockForClass:[UICollectionViewLayoutAttributes class]];
    [[[layoutAttributesMock stub] andReturnValue:[NSValue valueWithCGSize:size] ] size];
    ARSaleArtworkFlowCollectionViewCell *subject = [[ARSaleArtworkFlowCollectionViewCompactCell alloc] init];

    [subject applyLayoutAttributes:layoutAttributesMock];
    subject.bounds = (CGRect){CGPointZero, size};
    [subject setupWithRepresentedObject:saleArtworkMock];
    // Just to see it in the snapshot without setting the image from the URL.
    [[subject valueForKey:@"artworkImageView"] setImage:[UIImage imageFromColor:[UIColor artsyGrayRegular]]];

    expect(subject).to.haveValidSnapshot();
});

it(@"looks good with regular cells", ^{
    CGSize size = CGSizeMake(688, 120);
    id layoutAttributesMock = [OCMockObject mockForClass:[UICollectionViewLayoutAttributes class]];
    [[[layoutAttributesMock stub] andReturnValue:[NSValue valueWithCGSize:size] ] size];
    ARSaleArtworkFlowCollectionViewCell *subject = [[ARSaleArtworkFlowCollectionViewRegularCell alloc] init];

    [subject applyLayoutAttributes:layoutAttributesMock];
    subject.bounds = (CGRect){CGPointZero, size};
    [subject setupWithRepresentedObject:saleArtworkMock];
    // Just to see it in the snapshot without setting the image from the URL.
    [[subject valueForKey:@"artworkImageView"] setImage:[UIImage imageFromColor:[UIColor artsyGrayRegular]]];

    expect(subject).to.haveValidSnapshot();

});

SpecEnd;
