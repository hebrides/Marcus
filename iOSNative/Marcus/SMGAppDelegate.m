//
//  SMGAppDelegate.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2019 SMGMobile. All rights reserved.
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
  DLog(@"Debug Mode!");
  //
  // Initialize main window
  // ----------------------
  CGRect mainViewFrame = CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  _window = [[UIWindow alloc] initWithFrame: mainViewFrame];
  
  
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
  // Configure Main Window
  // ---------------------
  [_window setRootViewController: _tabBarController];
  [_window makeKeyAndVisible];
  _window.backgroundColor = [SMGGraphics Gray33];
  
  return YES;
}

- (void) setUpApp {
  
  
  //
  // Initial App Model
  // -----------------
  _appModel = [[SMGModel alloc] init];
  
  
  //
  // Initialize Main VCs
  // -------------------
  _bookVC = [[BookVC alloc] initWithTabTitle:@"BOOK" headerTitle:@"B O O K" modelObject:_appModel];
  _quoteVC = [[QuoteVC alloc] initWithTabTitle:@"Q.O.D." headerTitle:@"Q U O T E  O F  T H E  D A Y" modelObject:_appModel];
  _settingsVC = [[SettingsVC alloc] initWithTabTitle:@"SETTINGS" headerTitle:@"S E T T I N G S" modelObject:_appModel];
  
  //
  // Set Up TabBar
  // -------------
  _tabBarController = [[RDVTabBarController alloc] init];
  [_tabBarController setViewControllers: @[_bookVC, _quoteVC, _settingsVC]];
  DLog(@"Has Notch, %i", [self hasTopNotch]);
  if ([self hasTopNotch]) {
    [self.tabBarController.tabBar setHeight: 70.0f];
  } else  {
    //    [self.tabBarController.tabBar setHeight: TABBARHEIGHT];
  }

  //
  // Set Status Bar
  // --------------
//  [_tabBarController showStatusBar: _appModel.statusBarShown]; // _statusBarShown also queried by VCs

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
  
  UIOffset titlePositionAdjustment = UIOffsetMake(0.0f, 3.5f);
  UIOffset imagePositionAdjustment = UIOffsetMake(0.0f, 0.0f);
  if ([self hasTopNotch]) { // If iPhone X
    // Nudge up tab bar items
    titlePositionAdjustment = UIOffsetMake(0, -2.0f);
    imagePositionAdjustment = UIOffsetMake(0, -8.0f);
  }
  
  NSInteger count = 1;
  for (RDVTabBarItem *item in tabBar.items) {
    
    UIImage *selectedimage = [SMGGraphics imageForTab:count withColor:[SMGGraphics Blue22AADD]];
    UIImage *unselectedimage = [SMGGraphics imageForTab:count withColor:[UIColor whiteColor]];
    [item setFinishedSelectedImage:selectedimage withFinishedUnselectedImage:unselectedimage];
    [item setUnselectedTitleAttributes:unselectedTextAttributes];
    [item setSelectedTitleAttributes:selectedTextAttributes];
    item.titlePositionAdjustment = titlePositionAdjustment;
    item.imagePositionAdjustment = imagePositionAdjustment;
    count++;
  }
  
  //
  // Make TabBar Line
  // ----------------
  UIView *lineAboveTab = [[UIView alloc] initWithFrame:CGRectMake(0, -1, BOUNDS.size.width, .5)];
  lineAboveTab.backgroundColor = [SMGGraphics Gray66];
  [tabBar.backgroundView addSubview:lineAboveTab];
  
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  
  if (application.applicationState == UIApplicationStateActive){
    // App already in foreground
    DLog(@"Local notification received while app in foreground: %@", notification.alertBody);
  } else {
    // App brought from background to foreground
    _tabBarController.selectedIndex = 1; // Open app in quote view
    DLog(@"User responded to notification while app in background or app paused for alert: %@", notification.alertBody);
  }
  
}

- (BOOL)hasTopNotch {
  if (@available(iOS 11.0, *)) {
    return [[[UIApplication sharedApplication] delegate] window].safeAreaInsets.top > 20.0;
  }
  return  NO;
}

- (void)applicationWillResignActive:(UIApplication *)application {
  
  // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
  // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  [_appModel saveAllUserDefaults];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  DLog(@"App now active.");
  
  _appModel.timesActive ++;
  
  DLog(@"Times active: %li", (long)_appModel.timesActive);
  [_appModel saveUserDefault: _appModel.timesActive forKey:@"timesActive"];
 

  
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
  
  if(_appModel.timesActive > 2) {
  
    // Reschedule notifications every two weeks OR if newly enabled in device settings
    if ( ([_appModel notificationsNewlyEnabled] || _appModel.daysSinceNotificationsLastScheduled >= 14) && _appModel.dailyQuoteOn) {
      DLog(@"It's time to reschedule notifications OR notifications have been recently enabled... reschedule!");
      [_appModel scheduleDailyNotificationAtTime:_appModel.quoteTime];
    } else {
      DLog(@"No reason to reschedule notifications.");
    }
  }
  
}

- (void)applicationWillTerminate:(UIApplication *)application {
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
  [_appModel saveAllUserDefaults];
}

@end


