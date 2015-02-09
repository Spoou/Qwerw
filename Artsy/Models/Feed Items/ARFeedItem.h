#import <Foundation/Foundation.h>
#import "MTLModel.h"

@interface ARFeedItem : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *feedItemID;
@property (nonatomic, copy, readonly) NSDate *feedTimestamp;

+ (NSString *)cellIdentifier;
+ (NSValueTransformer *)standardDateTransformer;

- (NSString *)cellIdentifier;
- (NSArray *)dataForActivities;

- (NSString *)localizedStringForActivity;

@end
