//
//  AppDelegate.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//


#import <UIKit/UIKit.h>
#import "SMGTools.h"
#import "SettingsVC.h"
#import "BookVC.h"
#import "QuoteVC.h"
#import "SMGGraphics.h"
#import "RDVTabBarController.h"
#import "RDVTabBar.h"
#import "RDVTabBarItem.h"
#import "SMGModel.h"


@interface SMGAppDelegate : UIResponder <UIApplicationDelegate>


@property (nonatomic, strong) UIWindow *window;

//
// Note: Properties in app delegate can be accessed by importing
// SMGAppDelegate.h and creating a pointer to the shared delegate:
// ((SMGAppDelegate*) [[UIApplication sharedApplication] delegate])
// ------------------------------------------------------------------------

//@property (nonatomic) BOOL statusBarShown;
//@property (nonatomic) BOOL dailyQuoteOn;
//@property (nonatomic) BOOL savedDeviceNotificationsEnabledState;
//@property (nonatomic) BOOL notificationsAttemptedScheduled;
//@property (nonatomic) NSInteger timesActive;
//@property (nonatomic) NSInteger daysSinceNotificationsLastScheduled;
//@property (nonatomic) NSInteger dayNotificationsLastScheduled;
//@property (nonatomic) NSInteger quoteTime;
//@property (nonatomic) NSInteger book;
//@property (nonatomic) NSInteger verse;
@property (nonatomic, strong) RDVTabBarController* tabBarController;


//- (void) saveSetting:(NSInteger)setting forKey:(NSString*)key;
//- (void) scheduleDailyNotificationAtTime:(NSInteger)time24;
//- (void) cancelDailyNotifications;
//- (BOOL) notificationsCurrentlyEnabledInDeviceSettings;
//- (NSArray*) getQuoteOfTheDay;

@end