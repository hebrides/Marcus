//
//  SMGModel.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 5/5/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "SMGModel.h"

@implementation SMGModel


//- (void) getAppSettings {
//  // Reset defaults -- debugging
//  NSString *domainName = [[NSBundle mainBundle] bundleIdentifier];
//  [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:domainName];
//  
//  
//  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
//  
//  // Check if first run by checking for existance of quoteTime
//  if ([defaults integerForKey:@"quoteTime"]) {
//    NSLog(@"App has been run before and quote time set to %ld.", (long)[defaults integerForKey:@"quoteTime"]);
//    // If not, load existing settings
//    [self loadSettings];
//    
//  } else { // Else ** first run **, so set default settings
//    NSLog(@"First run.");
//    _statusBarShown = YES;
//    _dailyQuoteOn = NO;
//    _quoteTime = 800;
//    _book = 1;
//    _verse = 1;
//    [self saveAllSettings];
//  }
//  
//}
//
//- (void) loadSettings {
//  
//  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
//  _book = [defaults integerForKey:@"chapter"];
//  _verse = [defaults integerForKey:@"verse"];
//  _dailyQuoteOn = (BOOL)[defaults integerForKey:@"dailyQuoteOn"];
//  _quoteTime = [defaults integerForKey:@"quoteTime"];
//  _statusBarShown = (BOOL)[defaults integerForKey:@"statusBarShown"];
//  NSLog(@"Data loaded");
//  
//  // If allowed reschedule 64 local notifications (not using push notifications for now)
//  if (_dailyQuoteOn == YES) {
//    NSLog(@"**Attempting to reschedule notifications**");
//    [self scheduleDailyNotificationAtTime:_quoteTime];
//  } else  { }
//  
//}
//
//- (void) saveSetting:(NSInteger)setting forKey:(NSString*)key {
//  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
//  
//  // Don't save a setting that isn't new
//  if (setting == [defaults integerForKey:key]) {
//    NSLog(@"Setting unchanged %@: %li",key,(long)setting);
//    return;
//  } else {
//    // Update settings
//    [defaults setInteger:setting forKey:key];
//    [defaults synchronize];
//    NSLog(@"Saved %@: %li",key,(long)setting);
//  };
//  
//  // Handle notifications for new daily quote time OR turning on daily notifications
//  if (
//      ([key isEqual: @"quoteTime"] && _dailyQuoteOn == YES) || // new quote time and turned on?
//      ([key isEqual: @"dailyQuoteOn"] && _dailyQuoteOn == YES) // notifications switched to on?
//      ) {
//    // Schedule/Reschedule notifications
//    [self scheduleDailyNotificationAtTime:_quoteTime];
//    NSLog(@"**Attempting to schedule notifications**");
//  }
//  
//}
//
//- (NSInteger) getSettingforKey:(NSString*)key {
//  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
//  NSLog(@"Returning %@: %li",key,(long)[defaults integerForKey:key]);
//  return [defaults integerForKey:key];
//}
//
//- (void) saveAllSettings {
//  [self saveSetting:(NSInteger)_statusBarShown forKey:@"statusBarShown"];
//  [self saveSetting:(NSInteger)_dailyQuoteOn forKey:@"dailyQuoteOn"];
//  [self saveSetting: _quoteTime forKey:@"quoteTime"];
//  [self saveSetting: _book forKey:@"book"];
//  [self saveSetting: _verse forKey:@"verse"];
//}
//
//- (void)cancelDailyNotifications {
//  // Cancel this app's local notifications
//  [[UIApplication sharedApplication] cancelAllLocalNotifications];
//}
//
//- (void)scheduleDailyNotificationAtTime:(NSInteger)time24 {
//  
//  // Register local notifications (iOS 8+)
//  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
//    [ [UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:nil]];
//  }
//  
//  // Cancel app's existing local notifications
//  [[UIApplication sharedApplication] cancelAllLocalNotifications];
//  
//  // Set date
//  NSCalendar *calendar = [NSCalendar currentCalendar];
//  NSDateComponents *dateComponents = [calendar components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay fromDate: [NSDate date]];
//  dateComponents.hour = time24 / 100;
//  dateComponents.minute = time24 % 100;
//  
//  NSDate *nextNotification = [calendar dateFromComponents:dateComponents];
//  if ([nextNotification timeIntervalSinceNow] < 0) {
//    nextNotification = [nextNotification dateByAddingTimeInterval:60*60*24];
//  }
//  
//  //
//  // Get Quotes
//  // ----------
//  NSString* path  = [[NSBundle mainBundle] pathForResource:@"meditations-quotes" ofType:@"json"];
//  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
//  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
//  NSError *jsonError;
//  id quotes = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
//  
//  NSLog(@"%i",  (int) ceil( [[NSDate date] timeIntervalSince1970]/(3600 * 24) )   );
//  
//  // Rotates through all quotes by day
//  NSUInteger quoteIndex = (int) ceil( [[NSDate date] timeIntervalSince1970]/(3600 * 24) ) % [quotes count];
//  NSLog(@"%lu %lu", (unsigned long)[quotes count], (unsigned long)quoteIndex);
//  
//  // Schedule 64 Quotes (Max local notifications allowed by iOS as of 2.1.2016)
//  
//  for (NSUInteger x = 0; x < 64; x++){
//    // Create and schedule notification
//    UILocalNotification *dailyNote = [[UILocalNotification alloc] init];
//    dailyNote.alertBody = [[quotes objectAtIndex:quoteIndex] objectForKey:@"quote"];
//    NSLog(@"%lu %lu %@",(unsigned long)x,(unsigned long)quoteIndex, dailyNote.alertBody);
//    dailyNote.repeatInterval =  0; // NSCalendarUnitDay;
//    dailyNote.timeZone = [NSTimeZone localTimeZone];
//    dailyNote.soundName = UILocalNotificationDefaultSoundName;
//    dailyNote.fireDate = nextNotification;
//    
//    [[UIApplication sharedApplication] scheduleLocalNotification:dailyNote];
//    
//    nextNotification = [nextNotification dateByAddingTimeInterval:10];
//    quoteIndex ++;
//    if (quoteIndex >= [quotes count]) {quoteIndex = 0;}
//  } // end for loop
//  
//}
//
//- (NSMutableDictionary*)loadJSONfile:(NSString*)filename {
//  NSString* url = [filename stringByDeletingPathExtension];
//  NSString* path  = [[NSBundle mainBundle] pathForResource:url ofType:@"json"];
//  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
//  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
//  NSError *jsonError;
//  NSMutableDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
//  return json;
//}

@end
