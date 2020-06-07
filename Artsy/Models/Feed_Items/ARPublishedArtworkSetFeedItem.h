#import "ARFeedItem.h"

@class Artist, Gene;

@interface ARPublishedArtworkSetFeedItem : ARFeedItem

@property (readonly, nonatomic) Artist *artist;
@property (readonly, nonatomic) Gene *gene;
@property (readonly, nonatomic) NSArray *artworks;

- (NSString *)entityName;
@end
