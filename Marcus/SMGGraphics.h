//
//  SMGGraphics.h
//  Marcus
//
//  Created by Marcus Lewis on 2/5/16.
//  Copyright (c) 2016 SMGMobile. All rights reserved.
//
//  Generated with the help of PaintCode (www.paintcodeapp.com)
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface SMGGraphics : NSObject

// Generate Colors, Solids
+ (UIColor*)Gray31;
+ (UIColor*)Gray33;
+ (UIColor*)Gray4C;
+ (UIColor*)Gray66;
+ (UIColor*)Blue22AADD;
+ (UIColor*)colorWithHexString:(NSString*)hex;
+ (UIImage*)imageWithShadowForImage:(UIImage *)initialImage;
+ (UIImage*)imageSolidWithSize:(CGSize)size color:(UIColor *)color;

// Generate Custom App Images
+ (UIImage*)imageForTab: (NSInteger)tab withColor: (UIColor*)color;
+ (UIImage*)imageOfBook;
+ (UIImage*)imageOfBookWithColor: (UIColor*) color;
+ (UIImage*)imageOfBigBookWithColor: (UIColor*) color;
+ (UIImage*)imageOfQuote;
+ (UIImage*)imageOfQuoteWithColor: (UIColor*) color;
+ (UIImage*)imageOfBigQuoteWithColor: (UIColor*) color;
+ (UIImage*)imageOfSettings;
+ (UIImage*)imageOfSettingsWithColor: (UIColor*) color;
+ (UIImage*)imageOfBigSettingsWithColor: (UIColor*) color;
+ (UIImage*)imageOfShare;
+ (UIImage*)imageOfShareWithColor: (UIColor*) color;
+ (UIImage*)imageOfChapters;
+ (UIImage*)imageOfChaptersWithColor: (UIColor*) color;
+ (UIImage*)imageOfCloseChapters;
+ (UIImage*)imageOfCloseChaptersWithColor: (UIColor*) color;

@end