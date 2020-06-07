#import "ARGeneFavoritesNetworkModel.h"

#import "ArtsyAPI+ListCollection.h"
#import "ArtsyAPI+OrderedSets.h"
#import "Gene.h"
#import "OrderedSet.h"


@implementation ARGeneFavoritesNetworkModel

- (AFHTTPRequestOperation *)requestOperationAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    if (self.useSampleFavorites) {
        __weak typeof(self) wself = self;

        return [ArtsyAPI getOrderedSetWithKey:@"favorites:suggested-genes" success:^(OrderedSet *set) {
            __strong typeof (wself) sself = wself;
            if (!sself) { return; }

            [ArtsyAPI getOrderedSetItems:set.orderedSetID.copy atPage:page withType:Gene.class success:success failure:failure];

        } failure:failure];
    } else {
        return [ArtsyAPI getGenesFromPersonalCollectionAtPage:page success:success failure:failure];
    }
}

@end
