#import "ARArtworkFavoritesNetworkModel.h"
#import "ARFavoritesNetworkModel+Private.h"

#import "ArtsyAPI+Artworks.h"
#import "User.h"

@interface ARArtworkFavoritesNetworkModel()

@property (nonatomic, copy) NSString *nextPageCursor;

@end

@implementation ARArtworkFavoritesNetworkModel

#pragma mark - Public functions

// Other subclasses of ARFavoritesNetworkModel use an integer page-based system for requests.
// We use a string cursor instead, so we can't rely on the superclass' implementation and need
// to provide one from scratch.
- (void)getFavorites:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    if (self.currentRequest) {
        // Not the best API, to just return silently, but we need to adhere to the contract in our superclass.
        return;
    }

    __weak typeof(self) wself = self;
    self.currentRequest = [self requestOperationAfterCursor:self.nextPageCursor withSuccess:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artists) {
        __strong typeof (wself) sself = wself;

        sself.nextPageCursor = nextPageCursor;
        sself.allDownloaded = !hasNextPage;

        if (success) {
            success(artists);
        }
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;

        sself.allDownloaded = YES;
        if (success) {
            success(@[]);
        }
    }];
}

#pragma mark - Private functions

- (AFHTTPRequestOperation *)requestOperationAfterCursor:(NSString *)cursor withSuccess:(void (^)(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    return [ArtsyAPI getArtworkFromUserFavorites:cursor success:success failure:failure];
}

#pragma mark - Do not use

- (AFHTTPRequestOperation *)requestOperationAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    [NSException raise:NSInvalidArgumentException format:@"ARArtworkFavoritesNetworkModel %@[%@]: selector not recognized - use a cursor-based paging instead: ", NSStringFromClass([self class]), NSStringFromSelector(_cmd)];
    return nil;
}

@end
