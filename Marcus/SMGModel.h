//
//  SMGModel.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 5/5/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface SMGModel : NSObject

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

- (void) getUserDefaults;
- (void) saveAllUserDefaults;
- (void) saveUserDefaultRef:(NSInteger *)userDefault value:(NSInteger)value forKey:(NSString *)key;
- (void) saveUserDefault:(NSInteger)userDefault forKey:(NSString*)key;
- (void) loadAllUserDefaults;
- (NSInteger) getUserDefaultForKey:(NSString*)key;

- (void) scheduleDailyNotificationAtTime:(NSInteger)time24;
- (void) cancelDailyNotifications;
- (BOOL) notificationsNewlyEnabled;
- (BOOL) notificationsCurrentlyEnabledInDeviceSettings;
- (NSArray*) getQuoteOfTheDay;

@end
