//
//  AppDelegate.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//


#import <UIKit/UIKit.h>
#define APPDELEGATE ((SMGAppDelegate*) [[UIApplication sharedApplication] delegate])


@interface SMGAppDelegate : UIResponder <UIApplicationDelegate>


@property (nonatomic, strong) UIWindow *window;

//
// Properties here can be accessed by importing SMGAppDelegate.h
// and creating a pointer to the shared delegate (in lieu of a model class)
// ------------------------------------------------------------------------

// That is, app settings are here for now ;-)
@property (nonatomic) BOOL statusBarShown;
@property (nonatomic) BOOL dailyQuoteOn;
@property (nonatomic) NSInteger quoteTime;
@property (nonatomic) NSUInteger book;
@property (nonatomic) NSUInteger verse;

- (void) saveSetting:(NSInteger)setting forKey:(NSString*)key;

@end