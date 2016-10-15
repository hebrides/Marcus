//
//  SMGTools.h
//
//  Copyright (c) 2016 SMGMobile. All rights reserved.
//

#import <Foundation/Foundation.h>

#pragma mark -
#pragma mark Useful Macro Definitions


// Reference AppDelegate
#define APPDELEGATE ((SMGAppDelegate*) [[UIApplication sharedApplication] delegate])

// Smarter Debug Logging
#define DEBUG_MODE
#ifdef DEBUG_MODE
#define DebugLog( s, ... ) NSLog( @"<%p %@:(%d)> %@", self, [[NSString stringWithUTF8String:__FILE__] lastPathComponent], __LINE__, [NSString stringWithFormat:(s), ##__VA_ARGS__] )
#else
#define DebugLog( s, ... )
#endif

// String to URL
#define URLIFY(urlString) [NSURL URLWithString:urlString]

// Format String
#define FSTRING(string, args...) [NSString stringWithFormat:string, args]

// Easy Alert
#define ALERT(title, msg) [[[UIAlertView alloc]     initWithTitle:title\
message:msg\
delegate:nil\
cancelButtonTitle:@"OK"\
otherButtonTitles:nil] show]

// Screen Properties
#define BOUNDS UIScreen.mainScreen.bounds
#define SCREEN_WIDTH ((([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortrait) || ([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortraitUpsideDown)) ? [[UIScreen mainScreen] bounds].size.width : [[UIScreen mainScreen] bounds].size.height)
#define SCREEN_HEIGHT ((([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortrait) || ([UIApplication sharedApplication].statusBarOrientation == UIInterfaceOrientationPortraitUpsideDown)) ? [[UIScreen mainScreen] bounds].size.height : [[UIScreen mainScreen] bounds].size.width)



@interface SMGTools : NSObject

@end
