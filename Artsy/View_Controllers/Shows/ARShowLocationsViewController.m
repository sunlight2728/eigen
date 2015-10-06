#import "ARShowLocationsViewController.h"
#import "ARNavigationButtonsViewController.h"
#import "ARNavigationButton.h"
#import "ARSwitchBoard.h"

@interface ARShowLocationsViewController ()
@property (nonatomic, strong) ORStackScrollView *view;
@end

@implementation ARShowLocationsViewController
@dynamic view;

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] init];
    self.view.stackView.bottomMarginHeight = 20;
    self.view.backgroundColor = [UIColor whiteColor];
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSArray *cities = [self featuredCities];
    ARNavigationButtonsViewController *navigationButtons = [[ARNavigationButtonsViewController alloc] init];
    navigationButtons.buttonDescriptions = [cities map:^id(id object) {
        return [self buttonDescriptionForCity:object];
    }];

    [self.view.stackView addViewController:navigationButtons toParent:self withTopMargin:@"20" sideMargin:@"40"];
}

- (NSArray *)featuredCities
{
    return @[
        @{ @"slug": @"/shows/new-york", @"name": @"New York" },
        @{ @"slug": @"/shows/london", @"name": @"London" },
        @{ @"slug": @"/shows/los-angeles", @"name": @"Los Angeles" },
        @{ @"slug": @"/shows/paris", @"name": @"Paris" },
        @{ @"slug": @"/shows/berlin", @"name": @"Berlin" },
        @{ @"slug": @"/shows/miami", @"name": @"Miami" },
        @{ @"slug": @"/shows/san-francisco", @"name": @"San Francisco" },
        @{ @"slug": @"/shows/hong-kong", @"name": @"Hong Kong" },
        @{ @"slug": @"/shows/milan", @"name": @"Milan" },
        @{ @"slug": @"/shows/sao-paolo", @"name": @"Sao Paolo" },
        @{ @"slug": @"/shows/tokyo", @"name": @"Tokyo" },
        @{ @"slug": @"/all-cities", @"name": @"All Cities..." },

  ];
}

- (NSDictionary *)buttonDescriptionForCity:(NSDictionary *)city
{
    return @{
        ARNavigationButtonClassKey: ARNavigationButton.class,
        ARNavigationButtonPropertiesKey: @{
            @keypath(ARNavigationButton.new, title): city[@"name"]
        },
        ARNavigationButtonHandlerKey: ^(UIButton *sender) {
            UIViewController *vc = [[ARSwitchBoard sharedInstance] loadPath:city[@"slug"]];
            [self.navigationController pushViewController:vc animated:YES];
        }
    };
}

@end
