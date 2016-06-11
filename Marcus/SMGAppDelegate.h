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
// Note: Properties here can be accessed by importing SMGAppDelegate.h
// and creating a pointer to the shared delegate (in lieu of a model class)
// ------------------------------------------------------------------------

// App settings are just a few so are here for now
@property (nonatomic) BOOL statusBarShown;
@property (nonatomic) BOOL dailyQuoteOn;
@property (nonatomic) BOOL savedDeviceNotificationsEnabledState;
@property (nonatomic) BOOL notificationsAttemptedScheduled;
@property (nonatomic) NSInteger timesActive;
@property (nonatomic) NSInteger daysSinceNotificationsLastScheduled;
@property (nonatomic) NSInteger dayNotificationsLastScheduled;
@property (nonatomic) NSInteger quoteTime;
@property (nonatomic) NSInteger book;
@property (nonatomic) NSInteger verse;


- (void) saveSetting:(NSInteger)setting forKey:(NSString*)key;
- (void) scheduleDailyNotificationAtTime:(NSInteger)time24;
- (void) cancelDailyNotifications;
- (BOOL) notificationsCurrentlyEnabledInDeviceSettings;
- (NSArray*) getQuoteOfTheDay;

@end