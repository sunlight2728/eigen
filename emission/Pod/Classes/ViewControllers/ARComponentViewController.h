#import <UIKit/UIKit.h>

@class AREmission;
@class RCTRootView;

NS_ASSUME_NONNULL_BEGIN

/// The base subclass for any UIViewController that wraps a React Native root view
@interface ARComponentViewController : UIViewController

/// The React View
@property (nonatomic, strong) RCTRootView *rootView;


- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithNibName:(nullable NSString *)nibNameOrNil bundle:(nullable NSBundle *)nibBundleOrNil NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_DESIGNATED_INITIALIZER;

/// This sets a prop on the rootView, or sets a prop to be passed in on rootView initialization.
- (void)setProperty:(id)value forKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
