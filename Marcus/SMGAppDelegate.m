//
//  SMGAppDelegate.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//
//

#import "SMGAppDelegate.h"





@interface SMGAppDelegate () <RDVTabBarControllerDelegate>


@property (nonatomic, strong)          BookVC*              bookVC;
@property (nonatomic, strong)          QuoteVC*             quoteVC;
@property (nonatomic, strong)          SettingsVC*          settingsVC;
@property (nonatomic, strong)          SMGModel*            appModel;

@end

@implementation SMGAppDelegate



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  
#ifdef DEBUG
  NSLog(@"Debug Mode!");
#endif

  
  //
  // Initialize tab bar, views & view controllers
  // --------------------------------------------
  [self setUpApp];
  
  //
  // Open app in quote view if user touches notification
  // ---------------------------------------------------
  UILocalNotification *localNotif = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
  if (localNotif) {
    _tabBarController.selectedIndex = 1; // Open in quote view
  }
  
  //
  // Initialize main window
  // ----------------------
  _window = [[UIWindow alloc] initWithFrame: BOUNDS];
  
  //
  // Configure Main Window
  // ---------------------
  [_window setRootViewController: _tabBarController];
  [_window makeKeyAndVisible];
  _window.backgroundColor = [SMGGraphics Gray33];
  
  return YES;
}


- (void) setUpApp {
  
  //
  // Get App Settings
  //-----------------
  [self getAppSettings];
  
  //
  // Initialize Main VCs
  // -------------------
  _bookVC = [[BookVC alloc] initWithTabTitle:@"BOOK" headerTitle:@"B O O K"];
  _quoteVC = [[QuoteVC alloc] initWithTabTitle:@"Q.O.D." headerTitle:@"Q U O T E  O F  T H E  D A Y"];
  _settingsVC = [[SettingsVC alloc] initWithTabTitle:@"SETTINGS" headerTitle:@"S E T T I N G S"];
  
  //
  // Set Up TabBar
  // -------------
  _tabBarController = [[RDVTabBarController alloc] init];
  [_tabBarController setViewControllers: @[_bookVC, _quoteVC, _settingsVC]];

  //
  // Set Status Bar
  // --------------
  [_tabBarController showStatusBar: _statusBarShown]; // _statusBarShown also queried by VCs

  //
  // Style TabBar
  // ------------
  RDVTabBar* tabBar = _tabBarController.tabBar;
  tabBar.backgroundView.backgroundColor = [SMGGraphics Gray33];

  NSDictionary* unselectedTextAttributes = @{
                                             NSFontAttributeName: [UIFont systemFontOfSize:10.5],
                                             NSForegroundColorAttributeName: [UIColor whiteColor],
                                             };
  NSDictionary* selectedTextAttributes = @{
                                             NSFontAttributeName: [UIFont systemFontOfSize:10.5],
                                             NSForegroundColorAttributeName: [SMGGraphics Blue22AADD],
                                             };
  NSInteger count = 1;
  for (RDVTabBarItem *item in tabBar.items) {
    
    UIImage *selectedimage = [SMGGraphics imageForTab:count withColor:[SMGGraphics Blue22AADD]];
    UIImage *unselectedimage = [SMGGraphics imageForTab:count withColor:[UIColor whiteColor]];
    [item setFinishedSelectedImage:selectedimage withFinishedUnselectedImage:unselectedimage];
    [item setUnselectedTitleAttributes:unselectedTextAttributes];
    [item setSelectedTitleAttributes:selectedTextAttributes];
    [item setTitlePositionAdjustment:UIOffsetMake(0, 3.5)];
    count++;
  }
  
  //
  // Make TabBar Line
  // ----------------
  UIView *lineAboveTab = [[UIView alloc] initWithFrame:CGRectMake(0, -1, BOUNDS.size.width, 1)];
  lineAboveTab.backgroundColor = [SMGGraphics Gray66];
  [tabBar.backgroundView addSubview:lineAboveTab];
  
}

- (void) getAppSettings {
  // Get defaults
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  

  //
  // Reset defaults so app acts like first time launch -- debugging only
  // -------------------------------------------------------------------
//  NSString *domainName = [[NSBundle mainBundle] bundleIdentifier];
//  [defaults removePersistentDomainForName:domainName];

  
  
  // Check if first run by checking for existance of quoteTime setting (or create new key like HasLaunchedOnce)
  if ([defaults integerForKey:@"quoteTime"]) {
    NSLog(@"App has been run before and quote time set to %ld.", (long)[defaults integerForKey:@"quoteTime"]);
    // If not first run, load existing settings
    [self loadSettings];
    
  } else { // Else ** first run **, so set default settings
  NSLog(@"First run.");
  _book = 1;
  _verse = 1;
  _statusBarShown = YES;
  _dailyQuoteOn = NO;
  _quoteTime = 800;
  _daysSinceNotificationsLastScheduled = 0;
  _dayNotificationsLastScheduled = 16892; //April 1st, 2016 - use for debugging
  _savedDeviceNotificationsEnabledState = NO; // Assume NO for initial states
  _notificationsAttemptedScheduled = NO;
  _timesActive = 0;
  [self saveAllSettings];
    
  // Okay this below works, but maybe not right now... implement as mutable dictionary with keys in Model Object
  //[self saveSettingVar: &(_book) settingValue:57 forKey:@"book"];
  }

}

- (void) loadSettings {

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
  NSLog(@"Data loaded");
  
}

- (void) saveSettingVar:(NSInteger *)variable settingValue:(NSInteger)setting forKey:(NSString *)key {
  *variable = setting;
  NSLog(@"TEST: Setting = %li, BookVar = %li", (long)setting, (long)_book);
}


- (void) saveSetting:(NSInteger)setting forKey:(NSString*)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];

  // Don't bother to save a setting that isn't new
  if ((NSInteger)setting == [defaults integerForKey:key]) {
    NSLog(@"Setting unchanged %@: %li",key,(long)setting);
    return;
  } else {
    // Update settings
    [defaults setInteger:(NSInteger)setting forKey:key]; //Note: This works for a BOOL setting as well
    [defaults synchronize];
    NSLog(@"Saved %@: %li",key,(long)setting);
  }


}

- (NSInteger) getSettingforKey:(NSString*)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSLog(@"Returning %@: %li",key,(long)[defaults integerForKey:key]);
  return [defaults integerForKey:key];
}

- (void) saveAllSettings {
  [self saveSetting: _book forKey:@"book"];
  [self saveSetting: _verse forKey:@"verse"];
  [self saveSetting: _statusBarShown forKey:@"statusBarShown"];
  [self saveSetting: _dailyQuoteOn forKey:@"dailyQuoteOn"];
  [self saveSetting: _quoteTime forKey:@"quoteTime"];
  [self saveSetting: _daysSinceNotificationsLastScheduled forKey:@"daysSinceNotificationsLastScheduled"];
  [self saveSetting: _dayNotificationsLastScheduled forKey:@"dayNotificationsLastScheduled"];
  [self saveSetting: _savedDeviceNotificationsEnabledState forKey:@"savedDeviceNotificationsEnabledState"];
  [self saveSetting: _notificationsAttemptedScheduled forKey:@"notificationsAttemptedScheduled"];
  [self saveSetting: _timesActive forKey:@"timesActive"];
}

- (void)cancelDailyNotifications {
  // Cancel this app's local notifications
  [[UIApplication sharedApplication] cancelAllLocalNotifications];
  NSLog(@"Canceling current notifications.");
}

-(void)showAlertWithMessage: (NSString*) message {
  
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
  
  //
  // Interval between notifications (every day)
  // ------------------------------------------
  NSTimeInterval interval = 30; // Number of seconds in 1 day = 60*60*24 = 86400.0, change to a smaller number, 30, to test
  
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
  NSLog(@"Quotes: %lu, Quote Index: %lu", (unsigned long)[quotes count], (unsigned long)quoteIndex);
  
  // Schedule 64 Quotes (Max local notifications allowed by iOS as of 2.1.2016)
  
  for (NSUInteger x = 0; x < 64; x++){
    // Create and schedule notification
    UILocalNotification *dailyNote = [[UILocalNotification alloc] init];
    dailyNote.alertBody = [NSString stringWithFormat:@"Day %lu: %@", (unsigned long)x, [[quotes objectAtIndex:quoteIndex] objectForKey:@"quote"]];
    NSLog(@"%lu %lu %@", (unsigned long)x, (unsigned long)quoteIndex, dailyNote.alertBody);
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
  [self saveSetting: _dayNotificationsLastScheduled forKey:@"dayNotificationsLastScheduled"];

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

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  
  if (application.applicationState == UIApplicationStateActive){
    // App already in foreground
    NSLog(@"Local notification received while app in foreground: %@", notification.alertBody);
  } else {
    // App brought from background to foreground
    _tabBarController.selectedIndex = 1; // Open app in quote view
    NSLog(@"User responded to notification while app in background or app paused for alert: %@", notification.alertBody);
  }
  
}

- (NSArray*) getQuoteOfTheDay {

  //
  // Get Quotes
  // ----------
  NSString* path  = [[NSBundle mainBundle] pathForResource:@"meditations-quotes" ofType:@"json"];
  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *jsonError;
  id quotes = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
  
  NSUInteger quoteIndex = [self getUnixDayWithTimeZoneAdjust] % [quotes count];

  NSString* quote = [[quotes objectAtIndex:quoteIndex] objectForKey:@"quote"];
  NSString* book = [[quotes objectAtIndex:quoteIndex] objectForKey:@"book"];
  book = [self romanNumeral:[book integerValue]];
  NSString* verse = [[quotes objectAtIndex:quoteIndex] objectForKey:@"verse"];
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
  
  NSLog(@"Unix UTC Day (seconds): %f",[[NSDate date] timeIntervalSince1970]);
  NSLog(@"Time Zone Adjust (seconds): %li",(long)[[NSTimeZone localTimeZone] secondsFromGMT]);
  NSInteger day = ([[NSDate date] timeIntervalSince1970]+[[NSTimeZone localTimeZone] secondsFromGMT])/86400.0;       // Number of seconds in 1 day = 60*60*24 = 86400.0
  NSLog(@"The adjusted unix day is %li,", (long)day);
  NSLog(@"Date for local timezone is: %@", [NSDateFormatter localizedStringFromDate:[NSDate date] dateStyle:NSDateFormatterMediumStyle timeStyle:NSDateFormatterMediumStyle]);
   // timeIntervalSince1970 returns seconds since Jan. 1 1970 UTC
  return  day;

}

- (NSInteger)daysSinceNotificationsLastScheduled {
  if (_dayNotificationsLastScheduled > 0) { // If notifications have not been scheduled yet, this value is zero
    NSLog(@"Days since notifications last scheduled = %li - %li: %ld",(long)[self getUnixDayWithTimeZoneAdjust], (long)_dayNotificationsLastScheduled, [self getUnixDayWithTimeZoneAdjust] - _dayNotificationsLastScheduled);
    return [self getUnixDayWithTimeZoneAdjust] - _dayNotificationsLastScheduled;
  } else {
    NSLog(@"Notifications have not been scheduled.");
    return 0;
  }
}

- (BOOL)notificationsCurrentlyEnabledInDeviceSettings {
  UIUserNotificationSettings *settings = [[UIApplication sharedApplication] currentUserNotificationSettings];
  NSLog(@"User device settings permit notifications: %i", (settings.types != UIUserNotificationTypeNone));
  return settings.types != UIUserNotificationTypeNone;
}

- (void) application:(UIApplication *)application didRegisterUserNotificationSettings: (UIUserNotificationSettings *)notificationSettings {
  NSLog(@"User changed notification settings: %i", (notificationSettings.types != UIUserNotificationTypeNone));
  
}

- (BOOL) notificationsNewlyEnabled {

  if ([self notificationsCurrentlyEnabledInDeviceSettings] == YES) {
    if (_savedDeviceNotificationsEnabledState == YES) {
      NSLog(@"Notifications not newly enabled.");
      return NO;
    } else { // previous state was NO, so newly changed
      _savedDeviceNotificationsEnabledState = YES; //update saved state
      NSLog(@"Notifications newly enabled.");
      return YES;
    }
  } else { // notifications are NOT currently enabled
    _savedDeviceNotificationsEnabledState = NO; //update saved state
    NSLog(@"Notifications not currently enabled or user JUST enabled from within APP.");
    return NO;
  }
  
}

- (void)applicationWillResignActive:(UIApplication *)application {
  
  // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
  // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  [self saveAllSettings];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  NSLog(@"App now active.");
  
  _timesActive ++;
  NSLog(@"Times active: %li", (long)_timesActive);
  [self saveSetting:_timesActive forKey:@"timesActive"];

  //
  // Reschedule notifications if possible/ necessary
  // -----------------------------------------------
  
  /* Notes about the _timesActive variable below:
   
    This check is meant to prevent incorrect actions from notificationsNewlyEnabled.
   
    iOS calls applicationDidBecomeActive (where we are now) ***AFTER*** presenting a
   notifications permission alert view ***BUT BEFORE*** calling
   didRegisterUserNotificationSettings.
   
    This means that the call below to notificationsNewlyEnabled will give incorrect results
   immediately after the first time the user enables notifications.
   
    Since iOS calls applicationDidBecomeActive function at least twice (once when app first run,
   one during alert) we'll ignore these two times -- this is not a fullproof check, at all, and
   should be rethought in future updates.
  
    One workaround would be to check if notificationsCurrentlyEnabledInDeviceSettings and set the 
   Send Daily Quote button to OFF in settingsVC, which forces the user to reschedule.
   
    The current logic "silently" reschedules  notifications after the user changes permissions to
   YES when app next becomes active.
   
   */
  
  if(_timesActive > 2) {
  
  
    // This will reschedule notifications every two weeks, or if newly enabled in device settings
  if ( ([self notificationsNewlyEnabled] || _daysSinceNotificationsLastScheduled >= 14) && _dailyQuoteOn) {
    NSLog(@"It's time to reschedule notifications OR notifications have been recently enabled... reschedule!");
    [self scheduleDailyNotificationAtTime:_quoteTime];
  } else {
    NSLog(@"No reason to reschedule notifications.");
  }
    
    
    
  }
  
}

- (void)applicationWillTerminate:(UIApplication *)application {
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
  [self saveAllSettings];
}

@end


