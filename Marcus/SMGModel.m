//
//  SMGModel.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 5/5/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "SMGModel.h"

@implementation SMGModel

- (id) init {
  
  if (self = [super init]) {
  //
  // Get user defaults, store as properties
  // --------------------------------------
  [self getUserDefaults];
  } else {
    DLog(@"Model initialization failed.");
  }
  
    DLog(@"Model initialized");
  return self;

}

- (void) getUserDefaults {

  // Get user defaults
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  
  //
  // Reset defaults so app acts like first time launch -- debugging only
  // -------------------------------------------------------------------

  // NSString *domainName = [[NSBundle mainBundle] bundleIdentifier];
  // [defaults removePersistentDomainForName:domainName];
  
    
  // If app has been run at least once already, timesActive setting exists: load saved settings
  if ([defaults integerForKey:@"timesActive"]) {
    DLog(@"App has been run before and quote time set to %ld.", (long)[defaults integerForKey:@"quoteTime"]);
    // Load saved settings
    [self loadAllUserDefaults];
    
  } else { // First run
    DLog(@"First time run.");
    // Create initial default settings
    _timesActive = 0;
    _book = 1;
    _verse = 1;
    _statusBarShown = YES;
    _dailyQuoteOn = NO;
    _quoteTime = 800;
    _daysSinceNotificationsLastScheduled = 0;
//    _dayNotificationsLastScheduled = 16892; //April 1st, 2016 - use for debugging
    _dayNotificationsLastScheduled = 0; // use for production
    _savedDeviceNotificationsEnabledState = NO; // Assume NO for initial states
    _notificationsAttemptedScheduled = NO;
    
    // Save as user defaults
    [self saveAllUserDefaults];
    
    // Also works...
    //[self saveUserDefaultRef: &(_book) settingValue:57 forKey:@"book"];
  }
  
}

- (void) saveAllUserDefaults {
  [self saveUserDefault: _timesActive forKey:@"timesActive"];
  [self saveUserDefault: _book forKey:@"book"];
  [self saveUserDefault: _verse forKey:@"verse"];
  [self saveUserDefault: _statusBarShown forKey:@"statusBarShown"];
  [self saveUserDefault: _dailyQuoteOn forKey:@"dailyQuoteOn"];
  [self saveUserDefault: _quoteTime forKey:@"quoteTime"];
  [self saveUserDefault: _daysSinceNotificationsLastScheduled forKey:@"daysSinceNotificationsLastScheduled"];
  [self saveUserDefault: _dayNotificationsLastScheduled forKey:@"dayNotificationsLastScheduled"];
  [self saveUserDefault: _savedDeviceNotificationsEnabledState forKey:@"savedDeviceNotificationsEnabledState"];
  [self saveUserDefault: _notificationsAttemptedScheduled forKey:@"notificationsAttemptedScheduled"];

}

- (void) saveUserDefaultRef:(NSInteger *)userDefault value:(NSInteger)value forKey:(NSString *)key {
  *userDefault = value;
  DLog(@"TEST: Setting = %li, BookVar = %li", (long)userDefault, (long)_book);
}

- (void) saveUserDefault:(NSInteger)userDefault forKey:(NSString*)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  
  // Don't need to save setting that hasn't changed
  if ((NSInteger)userDefault == [defaults integerForKey:key]) {

    DLog(@"Setting unchanged %@: %li",key,(long)userDefault);

    return;
  } else {
    // Update settings
    [defaults setInteger:(NSInteger)userDefault forKey:key]; //Note: This works for a BOOL setting as well
    [defaults synchronize];

    DLog(@"Saved %@: %li",key,(long)userDefault);

  }
  
  
}

- (void) loadAllUserDefaults {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  _book = [defaults integerForKey:@"chapter"];
  _verse = [defaults integerForKey:@"verse"];
  _dailyQuoteOn = [defaults boolForKey:@"dailyQuoteOn"];
  _quoteTime = [defaults integerForKey:@"quoteTime"];
  _statusBarShown = [defaults boolForKey:@"statusBarShown"];
  _daysSinceNotificationsLastScheduled = [self daysSinceNotificationsLastScheduled];
  _dayNotificationsLastScheduled = [defaults integerForKey:@"dayNotificationsLastScheduled"];
  _savedDeviceNotificationsEnabledState = [defaults integerForKey:@"savedDeviceNotificationsEnabledState"];
  _notificationsAttemptedScheduled = [defaults integerForKey:@"savedDeviceNotificationsEnabledState"];
  _timesActive = [defaults integerForKey:@"timesActive"];


  DLog(@"Settings loaded");

  
}

- (NSInteger) getUserDefaultForKey:(NSString*)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];


  DLog(@"Returning %@: %li",key,(long)[defaults integerForKey:key]);

  return [defaults integerForKey:key];
}

//
// Handle Notifications
// --------------------

- (void)cancelDailyNotifications {
  // Cancel this app's local notifications
  [[UIApplication sharedApplication] cancelAllLocalNotifications];


  DLog(@"Canceling current notifications.");

}

- (void)scheduleDailyNotificationAtTime:(NSInteger)time24 {
  
  
  // Register local notifications (iOS 8+)
  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
    [ [UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:nil]];
  }
  
  // Cancel app's existing local notifications
  [self cancelDailyNotifications];
  
  // Set date from user selected daily notification time in 24 hour time (time24)
  NSCalendar *calendar = [NSCalendar currentCalendar];
  // [calendar setTimeZone:[NSTimeZone localTimeZone]];
  NSDateComponents *dateComponents = [calendar components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay fromDate: [NSDate date]];
  dateComponents.hour = time24 / 100;
  dateComponents.minute = time24 % 100;
  
	
	
//****	NOTE PLEASE RECODE WITH THE BELOW, IT WILL ALLOW THE USER TO SET INTERVALS AND NOT BE AFFECTED BY LEAP YEAR, ETC, AND SEE NEW IOS CODE NOTES:
	
//  NSCalendar *calendar=[[NSCalendar alloc] initWithCalendarIdentifier: NSGregorianCalendar] ;
//  NSDateComponents *components=[[NSDateComponents alloc] init] ;
//  components.day=1;
//  NSDate *newDate=[calendar dateByAddingComponents: components toDate:[NSDate date] options: 0];
//  DLog(@"Next day : %@", newDate);
	
//*********
		
  //
  // Interval between notifications
  // ------------------------------
  
	NSTimeInterval interval = 86400.0; // Number of seconds in 1 day = 60*60*24 = 86400.0, change to a smaller number, 30, to test
	
  NSDate *nextNotification = [calendar dateFromComponents:dateComponents];
  if ([nextNotification timeIntervalSinceNow] < 0) {
    nextNotification = [nextNotification dateByAddingTimeInterval:interval];
  }
  
  //
  // Get Quotes
  // ----------
  NSString* path  = [[NSBundle mainBundle] pathForResource:@"meditations-quotes" ofType:@"json"];
  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *jsonError;
  id quotes = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
  
  // Rotates through all quotes by day
  NSUInteger quoteIndex = [self getUnixDayWithTimeZoneAdjust] % [quotes count];


  DLog(@"Quotes: %lu, Quote Index: %lu", (unsigned long)[quotes count], (unsigned long)quoteIndex);

  // Schedule 64 Quotes (Max local notifications allowed by iOS as of 2.1.2016)
  
  for (NSUInteger x = 0; x < 64; x++){
    // Create and schedule notification
    UILocalNotification *dailyNote = [[UILocalNotification alloc] init];
    dailyNote.alertBody = [NSString stringWithFormat:@"Day %lu: %@", (unsigned long)x, [[quotes objectAtIndex:quoteIndex] objectForKey:@"quote"]];

    DLog(@"%lu %lu %@", (unsigned long)x, (unsigned long)quoteIndex, dailyNote.alertBody);

    dailyNote.repeatInterval =  0; // NSCalendarUnitDay;
    dailyNote.timeZone = [NSTimeZone localTimeZone];
    dailyNote.soundName = UILocalNotificationDefaultSoundName;
    dailyNote.fireDate = nextNotification;
    
    [[UIApplication sharedApplication] scheduleLocalNotification:dailyNote];
    
    nextNotification = [nextNotification dateByAddingTimeInterval: interval];
    
    quoteIndex ++;
    if (quoteIndex >= [quotes count]) {quoteIndex = 0;}
  } // end for loop
  
  
  // Reset days since notifications last scheduled
  _daysSinceNotificationsLastScheduled = 0;
  
  // Set this day as unix day notifications last scheduled, and save it to defaults
  _dayNotificationsLastScheduled = [self getUnixDayWithTimeZoneAdjust];
  [self saveUserDefault: _dayNotificationsLastScheduled forKey:@"dayNotificationsLastScheduled"];
  
}

- (NSArray*) getQuoteOfTheDay {

  DLog(@"In app Model, getting quote of the day");
  NSString* path  = [[NSBundle mainBundle] pathForResource:@"meditations-quotes" ofType:@"json"];
  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *jsonError;
  id quotes = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
  
  NSUInteger quoteIndex = [self getUnixDayWithTimeZoneAdjust] % [quotes count];
  NSString* quote = [[quotes objectAtIndex:quoteIndex] objectForKey:@"quote"];
  NSString* book = [[quotes objectAtIndex:quoteIndex] objectForKey:@"chapter"];
  NSString* verse = [[quotes objectAtIndex:quoteIndex] objectForKey:@"verse"];
  book = [self romanNumeral:[book integerValue]];
  verse = [self romanNumeral:[verse integerValue]];
  return @[quote,book,verse];
  
}

- (NSString*)romanNumeral:(NSInteger)num {
  if (num < 0 || num > 9999) { return @""; } // out of range
  
  NSArray *r_ones = [NSArray arrayWithObjects:@"I", @"II", @"III", @"IV", @"V", @"VI", @"VII", @"VIII", @"IX", nil];
  NSArray *r_tens = [NSArray arrayWithObjects:@"X", @"XX", @"XXX", @"XL", @"L", @"LX", @"LXX",@"LXXX", @"XC", nil];
  NSArray *r_hund = [NSArray arrayWithObjects:@"C", @"CC", @"CCC", @"CD", @"D", @"DC", @"DCC",@"DCCC", @"CM", nil];
  NSArray *r_thou = [NSArray arrayWithObjects:@"M", @"MM", @"MMM", @"MMMM", @"MMMMM", @"MMMMMM", @"MMMMMMM", @"MMMMMMMM", @"MMMMMMMMM", nil];
  // real romans should have an horizontal   __           ___           _____
  // bar over number to make x 1000: 4000 is IV, 16000 is XVI, 32767 is XXXMMDCCLXVII...
  
  NSInteger thou = num / 1000;
  NSInteger hundreds = (num -= thou*1000) / 100;
  NSInteger tens = (num -= hundreds*100) / 10;
  NSInteger ones = num % 10; // cheap %, 'cause num is < 100!
  
  return [NSString stringWithFormat:@"%@%@%@%@",
          thou ? [r_thou objectAtIndex:thou-1] : @"",
          hundreds ? [r_hund objectAtIndex:hundreds-1] : @"",
          tens ? [r_tens objectAtIndex:tens-1] : @"",
          ones ? [r_ones objectAtIndex:ones-1] : @""];
}

- (NSInteger) getUnixDayWithTimeZoneAdjust {
  
  DLog(@"Unix UTC Day (seconds): %f",[[NSDate date] timeIntervalSince1970]);
  DLog(@"Time Zone Adjust (seconds): %li",(long)[[NSTimeZone localTimeZone] secondsFromGMT]);
  // Number of seconds in 1 day = 60*60*24 = 86400.0
  NSInteger day = ([[NSDate date] timeIntervalSince1970]+[[NSTimeZone localTimeZone] secondsFromGMT])/86400.0;
  DLog(@"The adjusted unix day is %li,", (long)day);
  DLog(@"Date for local timezone is: %@", [NSDateFormatter localizedStringFromDate:[NSDate date] dateStyle:NSDateFormatterMediumStyle timeStyle:NSDateFormatterMediumStyle]);
  return  day;
}

- (NSInteger)daysSinceNotificationsLastScheduled {
  if (_dayNotificationsLastScheduled > 0) { // If notifications have not been scheduled yet, this value is zero
    DLog(@"Days since notifications last scheduled = %li - %li: %ld",(long)[self getUnixDayWithTimeZoneAdjust], (long)_dayNotificationsLastScheduled, [self getUnixDayWithTimeZoneAdjust] - _dayNotificationsLastScheduled);
    return [self getUnixDayWithTimeZoneAdjust] - _dayNotificationsLastScheduled;
  } else {
    DLog(@"Notifications have not been scheduled.");
    return 0;
  }
}

- (BOOL)notificationsCurrentlyEnabledInDeviceSettings {
  UIUserNotificationSettings *settings = [[UIApplication sharedApplication] currentUserNotificationSettings];
  DLog(@"User device settings permit notifications: %i", (settings.types != UIUserNotificationTypeNone));
  return settings.types != UIUserNotificationTypeNone;
}

- (void) application:(UIApplication *)application didRegisterUserNotificationSettings: (UIUserNotificationSettings *)notificationSettings {
  DLog(@"User changed notification settings: %i", (notificationSettings.types != UIUserNotificationTypeNone));
  
}

- (BOOL) notificationsNewlyEnabled {
  
  if ([self notificationsCurrentlyEnabledInDeviceSettings] == YES) {
    if (_savedDeviceNotificationsEnabledState == YES) {
      DLog(@"Notifications not newly enabled.");
      return NO;
    } else { // previous state was NO, so newly changed
      _savedDeviceNotificationsEnabledState = YES; //update saved state
      DLog(@"Notifications newly enabled.");
      return YES;
    }
  } else { // notifications are NOT currently enabled
    _savedDeviceNotificationsEnabledState = NO; //update saved state
    DLog(@"Notifications not currently enabled or user JUST enabled from within APP.");
    return NO;
  }
  
}

- (NSMutableDictionary*)loadJSONfile:(NSString*)filename {
  NSString* url = [filename stringByDeletingPathExtension];
  NSString* path  = [[NSBundle mainBundle] pathForResource:url ofType:@"json"];
  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *jsonError;
  NSMutableDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
  return json;
}



@end


