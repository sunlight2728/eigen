#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>

@class AREventsModule, ARSwitchBoardModule, ARTemporaryAPIModule, ARRefineOptionsModule, ARTakeCameraPhotoModule, ARTopMenuModule, RCTBridge, ARNotificationsManager, ARGraphQLQueryPreloader, ARGraphQLQueryCache;

NS_ASSUME_NONNULL_BEGIN

extern NSString *const AREnvProduction;
extern NSString *const AREnvStaging;
extern NSString *const AREnvTest;

/// A configuration object for running Emission
@interface AREmissionConfiguration : NSObject <RCTBridgeModule>

// Pre-requisites for Emission to work
@property (nonatomic, copy, readonly) NSString *userID;
@property (nonatomic, copy, readonly) NSString *authenticationToken;
@property (nonatomic, copy, readonly) NSDictionary *options;
// How many times the app has been launched. We assign this on startup because this number
// increases quite often (any time the app loses focus and regains it). By injecting it
// here, we get the count of launches at the time _of_ app launch.
@property (nonatomic, assign, readonly) NSInteger launchCount;

// ENV Variables
@property (nonatomic, copy, readonly, nullable) NSString *stripePublishableKey;
@property (nonatomic, copy, readonly, nullable) NSString *sentryDSN;
@property (nonatomic, copy, readonly, nullable) NSString *googleMapsAPIKey;
@property (nonatomic, copy, readonly, nullable) NSString *mapBoxAPIClientKey;

// Server configuration
@property (nonatomic, copy, readonly) NSString *gravityURL;
@property (nonatomic, copy, readonly) NSString *metaphysicsURL;
@property (nonatomic, copy, readonly) NSString *userAgent;
@property (nonatomic, copy, readonly) NSString *predictionURL;
// env = production | staging | test
@property (nonatomic, copy, readonly) NSString *env;



- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;


// Forces us to always include all properties
- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)token
                   launchCount:(NSInteger)launchCount
                     sentryDSN:(nullable NSString *)sentryDSN
          stripePublishableKey:(nullable NSString *)stripePublishableKey
              googleMapsAPIKey:(nullable NSString *)googleAPIKey
            mapBoxAPIClientKey:(nullable NSString *)mapBoxAPIClientKey
                    gravityURL:(NSString *)gravity
                metaphysicsURL:(NSString *)metaphysics
                 predictionURL:(NSString *)prediction
                     userAgent:(NSString *)userAgent
                           env:(NSString *)env
                       options:(NSDictionary *)options;
@end


@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) AREventsModule *eventsModule;
@property (nonatomic, strong, readonly) ARSwitchBoardModule *switchBoardModule;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;
@property (nonatomic, strong, readonly) ARRefineOptionsModule *refineModule;
@property (nonatomic, strong, readonly) ARTakeCameraPhotoModule *cameraModule;
@property (nonatomic, strong, readonly) ARTopMenuModule *topMenuModule;
@property (nonatomic, strong, readonly) ARNotificationsManager *notificationsManagerModule;
@property (nonatomic, strong, readonly) ARGraphQLQueryPreloader *graphQLQueryPreloaderModule;
@property (nonatomic, strong, readonly) ARGraphQLQueryCache *graphQLQueryCacheModule;

@property (nonatomic, strong, readwrite) AREmissionConfiguration *configurationModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;
+ (void)teardownSharedInstance;

- (instancetype)initWithConfiguration:(AREmissionConfiguration *)config packagerURL:(nullable NSURL *)packagerURL NS_DESIGNATED_INITIALIZER;

- (instancetype)init NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
