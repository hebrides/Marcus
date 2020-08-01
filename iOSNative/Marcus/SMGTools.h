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

// ** Smarter Debug Logging ***
// NOTE: Currently using a different, but similar scheme in PrefixHeader.pch file
// Create this file and and link to it in build setting, under "Prefix Header", like so:
// $(SRCROOT)/$(PROJECT_NAME)/ProjectName-Prefix.pch
// PCH prevents the need for including Log macros (or whatever else you like) in every file
// Ref: https://stackoverflow.com/questions/24305211/pch-file-in-xcode-6#26126037

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
