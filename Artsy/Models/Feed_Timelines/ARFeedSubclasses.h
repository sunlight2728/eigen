#import "ARFeed.h"

@class Fair, FairOrganizer, Partner, Profile;

@interface ARFileFeed : ARFeed
- (instancetype)initWithFileAtPath:(NSString *)fileName;
@end


@interface ARShowFeed : ARFileFeed
@end


@interface ARProfileFeed : ARFeed
- (instancetype)initWithProfile:(Profile *)profile;
@end


@interface ARFairOrganizerFeed : ARFeed
- (instancetype)initWithFairOrganizer:(FairOrganizer *)fairOrganizer;
@end


@interface ARFairShowFeed : ARFeed
- (instancetype)initWithFair:(Fair *)fair;
- (instancetype)initWithFair:(Fair *)fair partner:(Partner *)partner;
@end
