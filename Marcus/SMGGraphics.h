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

#define DEBUG_MODE

#ifdef DEBUG_MODE
#define DebugLog( s, ... ) NSLog( @"<%p %@:(%d)> %@", self, [[NSString stringWithUTF8String:__FILE__] lastPathComponent], __LINE__, [NSString stringWithFormat:(s), ##__VA_ARGS__] )
#else
#define DebugLog( s, ... )
#endif

#define URLIFY(urlString) [NSURL URLWithString:urlString]
#define FSTRING(string, args...) [NSString stringWithFormat:string, args]
#define ALERT(title, msg) [[[UIAlertView alloc]     initWithTitle:title\
message:msg\
delegate:nil\
cancelButtonTitle:@"OK"\
otherButtonTitles:nil] show]

// For screen size, screen size after orientation change
#define BOUNDS UIScreen.mainScreen.bounds
#define SCREEN_WIDTH ((([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortrait) || ([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortraitUpsideDown)) ? [[UIScreen mainScreen] bounds].size.width : [[UIScreen mainScreen] bounds].size.height)
#define SCREEN_HEIGHT ((([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortrait) || ([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortraitUpsideDown)) ? [[UIScreen mainScreen] bounds].size.height : [[UIScreen mainScreen] bounds].size.width)


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