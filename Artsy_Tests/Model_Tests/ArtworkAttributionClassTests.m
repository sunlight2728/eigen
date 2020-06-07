#import "Artwork+AttributionClassStrings.h"

SpecBegin(ArtworkAttributionClass);

describe(@"shortDescriptionForAttributionClass", ^{
    it(@"returns the correct short description for a given attribution class", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"mp_attribution_class" : @{ @"name": @"ephemera" } }];
        expect(artwork.shortDescriptionForAttributionClass).to.equal(@"This is ephemera, an artifact related to the artist.");
    });

    it(@"ignores case", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"mp_attribution_class" : @{ @"name": @"Ephemera" } }];
        expect(artwork.shortDescriptionForAttributionClass).to.equal(@"This is ephemera, an artifact related to the artist.");
    });

    it(@"ignores missing attribution class", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id" }];
        expect(artwork.shortDescriptionForAttributionClass).to.beNil();
    });

    it(@"ignores nil attribution class", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"mp_attribution_class" : [NSNull null] }];
        expect(artwork.shortDescriptionForAttributionClass).to.beNil();
    });
});


SpecEnd;
