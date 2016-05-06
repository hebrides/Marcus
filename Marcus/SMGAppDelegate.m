//
//  SMGAppDelegate.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//
//

#import "SMGAppDelegate.h"
#import "SettingsVC.h"
#import "BookVC.h"
#import "QuoteVC.h"
#import "SMGGraphics.h"
#import "RDVTabBarController.h"
#import "RDVTabBar.h"
#import "RDVTabBarItem.h"



@interface SMGAppDelegate () <RDVTabBarControllerDelegate>

@property (nonatomic, strong)          RDVTabBarController* tabBarController;
@property (nonatomic, strong)          BookVC*              bookVC;
@property (nonatomic, strong)          QuoteVC*             quoteVC;
@property (nonatomic, strong)          SettingsVC*          settingsVC;

@end

@implementation SMGAppDelegate



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  
#ifdef DEBUG
  NSLog(@"Debug Mode!");
#endif
  
  //
  // Initialize Tab Bar, Views & View Controllers
  // --------------------------------------------
  [self setUpApp];
  
  //
  // Initialize Main Window
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
  _bookVC = [[BookVC alloc] initWithTabTitle:@"BOOK" headerTitle:@"M E D I T A T I O N S"];
  _quoteVC = [[QuoteVC alloc] initWithTabTitle:@"Q.O.D." headerTitle:@"Q U O T E"];
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
  // Reset defaults -- debugging
   NSString *domainName = [[NSBundle mainBundle] bundleIdentifier];
   [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:domainName];
  
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  
  // Check if first run by checking for existance of quoteTime
  if ([defaults integerForKey:@"quoteTime"]) {
    NSLog(@"App has been run before and quote time set to %ld.", (long)[defaults integerForKey:@"quoteTime"]);
    // If not, load existing settings
    [self loadSettings];
    
  } else { // Else ** first run **, so set default settings
  NSLog(@"First run.");
  _statusBarShown = YES;
  _dailyQuoteOn = NO;
  _quoteTime = 800;
  _book = 1;
  _verse = 1;
  [self saveAllSettings];
  }

}

- (void) loadSettings {

  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  _book = [defaults integerForKey:@"chapter"];
  _verse = [defaults integerForKey:@"verse"];
  _dailyQuoteOn = (BOOL)[defaults integerForKey:@"dailyQuoteOn"];
  _quoteTime = [defaults integerForKey:@"quoteTime"];
  _statusBarShown = (BOOL)[defaults integerForKey:@"statusBarShown"];
  NSLog(@"Data loaded");
  
  // If allowed reschedule 64 local notifications (not using push notifications for now)
  if (_dailyQuoteOn == YES) {
    NSLog(@"**Attempting to reschedule notifications**");
    [self scheduleDailyNotificationAtTime:_quoteTime];
  } else  { }
  
}

- (void) saveSetting:(NSInteger)setting forKey:(NSString*)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];

  // Don't save a setting that isn't new
  if (setting == [defaults integerForKey:key]) {
    NSLog(@"Setting unchanged %@: %li",key,(long)setting);
    return;
  } else {
    // Update settings
    [defaults setInteger:setting forKey:key];
    [defaults synchronize];
    NSLog(@"Saved %@: %li",key,(long)setting);
  };

  // Handle notifications for new daily quote time OR turning on daily notifications
  if (
      ([key isEqual: @"quoteTime"] && _dailyQuoteOn == YES) || // new quote time and turned on?
      ([key isEqual: @"dailyQuoteOn"] && _dailyQuoteOn == YES) // notifications switched to on?
     ) {
      // Schedule/Reschedule notifications
    [self scheduleDailyNotificationAtTime:_quoteTime];
     NSLog(@"**Attempting to schedule notifications**");
  }
  
}

- (NSInteger) getSettingforKey:(NSString*)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSLog(@"Returning %@: %li",key,(long)[defaults integerForKey:key]);
  return [defaults integerForKey:key];
}

- (void) saveAllSettings {
  [self saveSetting:(NSInteger)_statusBarShown forKey:@"statusBarShown"];
  [self saveSetting:(NSInteger)_dailyQuoteOn forKey:@"dailyQuoteOn"];
  [self saveSetting: _quoteTime forKey:@"quoteTime"];
  [self saveSetting: _book forKey:@"book"];
  [self saveSetting: _verse forKey:@"verse"];
}

- (void)cancelDailyNotifications {
  // Cancel this app's local notifications
  [[UIApplication sharedApplication] cancelAllLocalNotifications];
}

- (void)scheduleDailyNotificationAtTime:(NSInteger)time24 {
    
  // Register local notifications (iOS 8+)
  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
    [ [UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:nil]];
  }
  
  // Cancel app's existing local notifications
  [[UIApplication sharedApplication] cancelAllLocalNotifications];
  
  // Set date
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDateComponents *dateComponents = [calendar components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay fromDate: [NSDate date]];
  dateComponents.hour = time24 / 100;
  dateComponents.minute = time24 % 100;
  
  NSDate *nextNotification = [calendar dateFromComponents:dateComponents];
  if ([nextNotification timeIntervalSinceNow] < 0) {
    nextNotification = [nextNotification dateByAddingTimeInterval:60*60*24];
  }
  
  //
  // Get Quotes
  // ----------
  NSString* path  = [[NSBundle mainBundle] pathForResource:@"meditations-quotes" ofType:@"json"];
  NSString* jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *jsonError;
  id quotes = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:&jsonError];
  
  NSLog(@"%i",  (int) ceil( [[NSDate date] timeIntervalSince1970]/(3600 * 24) )   );
  
  // Rotates through all quotes by day
  NSUInteger quoteIndex = (int) ceil( [[NSDate date] timeIntervalSince1970]/(3600 * 24) ) % [quotes count];
  NSLog(@"%lu %lu", (unsigned long)[quotes count], (unsigned long)quoteIndex);
  
  // Schedule 64 Quotes (Max local notifications allowed by iOS as of 2.1.2016)
  
  for (NSUInteger x = 0; x < 64; x++){
    // Create and schedule notification
    UILocalNotification *dailyNote = [[UILocalNotification alloc] init];
    dailyNote.alertBody = [[quotes objectAtIndex:quoteIndex] objectForKey:@"quote"];
    NSLog(@"%lu %lu %@",(unsigned long)x,(unsigned long)quoteIndex, dailyNote.alertBody);
    dailyNote.repeatInterval =  0; // NSCalendarUnitDay;
    dailyNote.timeZone = [NSTimeZone localTimeZone];
    dailyNote.soundName = UILocalNotificationDefaultSoundName;
    dailyNote.fireDate = nextNotification;
    
    [[UIApplication sharedApplication] scheduleLocalNotification:dailyNote];
    
    nextNotification = [nextNotification dateByAddingTimeInterval:10];
    quoteIndex ++;
    if (quoteIndex >= [quotes count]) {quoteIndex = 0;}
  } // end for loop
  
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
}

- (void)applicationWillTerminate:(UIApplication *)application {
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
  [self saveAllSettings];
}

@end


