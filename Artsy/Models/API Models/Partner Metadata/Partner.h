#import "MTLModel.h"

typedef NS_ENUM(NSInteger, ARPartnerType) {
    ARPartnerTypeGallery,
    ARPartnerTypeMuseum,
    ARPartnerTypeArtistEstate,
    ARPartnerTypePrivateCollection,
    ARPartnerTypeFoundation,
    ARPartnerTypePublicDomain,
    ARPartnerTypeImageArchive,
    ARPartnerTypeNonProfit
};

@interface Partner : MTLModel <MTLJSONSerializing>

@property (readonly, nonatomic, assign) BOOL defaultProfilePublic;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *shortName;
@property (readonly, nonatomic, copy) NSString *partnerID;
@property (readonly, nonatomic, copy) NSString *profileID;
@property (readonly, nonatomic, copy) NSString *website;
@property (readonly, nonatomic, assign) ARPartnerType type;

- (NSURL *)imageURLWithFormatName:(NSString *)formatName;

@end
