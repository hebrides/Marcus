////
////  AppDelegate.h
////  Marcus
////
////  Created by Marcus Skye Lewis on 11/7/15.
////  Copyright © 2015 SMGMobile. All rights reserved.
////
//
//#import <UIKit/UIKit.h>
//#import <QuartzCore/QuartzCore.h>
//#import "RDVTabBarController.h"
//
//@interface SMGAppDelegate : UIResponder <UIApplicationDelegate>
//
////
//// Properties here can be accessed by importing SMGAppDelegate.h
//// and creating a pointer to the shared delegate
//// -------------------------------------------------------------
//
//@property (strong, nonatomic)          UIWindow *window;
//@property (nonatomic, strong)          UITabBarController * tabBarController;
//
//@end
//
//
////
////  SMGAppDelegate.m
////  Marcus
////
////  Created by Marcus Skye Lewis on 11/7/15.
////  Copyright © 2015 SMGMobile. All rights reserved.
////
////
//
//
//#import "SMGAppDelegate.h"
//#import "SMGViewController.h"
//#import "graphics.h"
//
//
//@interface SMGAppDelegate () <UIScrollViewDelegate, UITabBarControllerDelegate, UIWebViewDelegate, UITableViewDelegate, UITableViewDataSource>
//
//@property (nonatomic)                  CGRect               mainViewFrame;
//@property (nonatomic, strong)          SMGViewController*   bookVC;
//@property (nonatomic, strong)          SMGViewController*   quoteVC;
//@property (nonatomic, strong)          SMGViewController*   settingsVC;
//@property (nonatomic, strong)          SMGViewController*   tableVC;
//
//@property (nonatomic, strong)          UILabel*             myNavLabel;
//@property (nonatomic, strong)          UIView*              myNavView;
//@property (nonatomic, strong)          UIView*              settingsView;
//@property (nonatomic, strong)          UIWebView*           bookWebView;
//@property (nonatomic, strong)          UIWebView*           quoteWebView;
//@property (nonatomic, strong)          NSMutableDictionary* appState;
//@property (nonatomic, strong)          UIImage*             bgSelected;
//@property (nonatomic, strong)          UIButton*             menuButton;
//
//@property (nonatomic, strong)          UITableView*         tableView;
//@property (nonatomic, strong)          NSArray*             books;
//
//@end
//
//@implementation SMGAppDelegate
//
//- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
//    
//#ifdef DEBUG
//    NSLog(@"Debug Mode!");
//#endif
//    
//    //
//    // Construct frame for views
//    // -------------------------
//    _mainViewFrame = UIScreen.mainScreen.bounds;
//    
//    //
//    // Initialize Tab Bar, Views & View Controllers
//    // --------------------------------------------
//    [self setUpApp];
//    
//    //
//    // Initialize Main Window
//    // ----------------------
//    _window = [[UIWindow alloc] initWithFrame:_mainViewFrame];
//    
//    
//    //
//    // Configure Main Window
//    // ---------------------
//    [_window setRootViewController:_tabBarController];
//    [_window makeKeyAndVisible];
//    
//    return YES;
//}
//
//
//
//- (void) setUpApp {
//    
//    // Initialize Tab Bar Controller
//    _tabBarController = [[UITabBarController alloc] init];
//    _tabBarController.viewControllers = NULL;
//    
//    // Init VCs
//    _bookVC = [[SMGViewController alloc] initwithTitle:@"BOOK"];
//    _quoteVC = [[SMGViewController alloc] initwithTitle:@"Q.O.D."];
//    _settingsVC = [[SMGViewController alloc] initwithTitle:@"SETTINGS"];
//    _tableVC = [[SMGViewController alloc] init];
//    
//    // Add VCs to Tab Bar Controller
//    [_tabBarController setViewControllers: @[_bookVC,_quoteVC, _settingsVC]];
//    
//    // Initialize Views
//    // Book WebView
//    _bookWebView = [[UIWebView alloc] initWithFrame: _mainViewFrame];
//    NSURL *bookURL = [[NSBundle mainBundle] URLForResource:@"book" withExtension:@"html"];
//    [_bookWebView loadRequest:[NSURLRequest requestWithURL:bookURL]];
//    _bookWebView.delegate = self;
//    _bookWebView.scrollView.bounces = NO;
//    
//    // Quote WebView
//    _quoteWebView = [[UIWebView alloc] initWithFrame: _mainViewFrame];
//    NSURL *quoteURL = [[NSBundle mainBundle] URLForResource:@"quote" withExtension:@"html"];
//    [_quoteWebView loadRequest:[NSURLRequest requestWithURL:quoteURL]];
//    _quoteWebView.delegate = self;
//    _quoteWebView.scrollView.bounces = NO;
//    
//    // Settings View
//    
//    // Table Views
//    _tableView = [[UITableView alloc] initWithFrame:_mainViewFrame];
//    _tableView.delegate = self;
//    _tableView.dataSource = self;
//    [_tableView reloadData];
//    
//    
//    // Add Views to VCs
//    _bookVC.view = _bookWebView;
//    _quoteVC.view = _quoteWebView;
//    _tableVC.view = _tableView;
//    
//    // Set Up Tab, Nav Bars Color & Style, NavBar
//    [self customizeTabBar];
//    [self makeNavBar];
//    
//    
//    // Hide Tab Bar When Pressing on Book View
//    //_bookVC.hidesBottomBarWhenPushed = YES;
//    
//}
//
//- (void)tabBarController:(UITabBarController *)tabBarController didSelectViewController:(UIViewController *)viewController {
//    // If a certain view selected do something spesh
//    
//}
//
//
//- (void) makeNavBar {
//    
//    // Custom Nav Bar
//    _myNavView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, _mainViewFrame.size.width, _mainViewFrame.size.height/18.0)];
//    _myNavLabel = [[UILabel alloc] initWithFrame: _myNavView.frame];
//    
//    _myNavLabel.textColor = [UIColor whiteColor];
//    _myNavLabel.text = @"M E D I T A T I O N S";
//    _myNavLabel.textAlignment = NSTextAlignmentCenter;
//    _myNavLabel.font = [UIFont boldSystemFontOfSize:14];
//    _myNavView.backgroundColor = [[self colorWithHexString:@"#22aadd"] colorWithAlphaComponent:.9];
//    
//    UIImageView * myNavBG = [[UIImageView alloc] initWithImage:_bgSelected]; //make better later
//    myNavBG.frame =  _myNavView.frame;
//    
//    [_myNavView addSubview:myNavBG];
//    [_tabBarController.view addSubview: _myNavView];
//    [_tabBarController.view addSubview: _myNavLabel];
//    //[_bookVC.view addSubview: _myNavView];
//    
//    // Create Menu Button
//    _menuButton = [[UIButton alloc] init];
//    _menuButton.frame = CGRectMake(0, 0, _myNavView.frame.size.width/10, _myNavView.frame.size.height);
//    //[self makeButtonStates];
//    [_menuButton setTitle:@"☰" forState:UIControlStateNormal];
//    //    UILabel *menuLabel = [[UILabel alloc]initWithFrame:_menuButton.frame];
//    //  menuLabel.text = @"☰";
//    // _menuButton.backgroundColor = [[UIColor whiteColor] colorWithAlphaComponent:.2];
//    
//    //setBackgroundImage:_menuClosedBI forState:UIControlStateNormal];
//    [_myNavView addSubview:_menuButton];
//    
//    
//    
//}
//
//- (void) customizeTabBar {
//    
//    UITabBar* tabBar = _tabBarController.tabBar;
//    
//    //tabBar.frame = CGRectMake(0,_mainViewFrame.size.height-35.0, _mainViewFrame.size.width,35.0);
//    
//    UIColor * selectedColor =  [UIColor whiteColor];
//    UIColor * unselectedColor =  [self colorWithHexString:@"#22aadd"]; //colorWithAlphaComponent:.2];
//    
//    UIColor * selectedBGColor =  [self colorWithHexString:@"#22aadd"]; // colorWithAlphaComponent:.2];
//    
//    
//    // Background color of the Tab Bar Views
//    _tabBarController.view.backgroundColor = [self colorWithHexString:@"191919"];
//    
//    // Background color of the Tab Bar
//    tabBar.barTintColor = [UIColor blackColor];
//    
//    // Translucent Tab Bar
//    /*tabBar.barStyle = UIBarStyleBlack;
//     tabBar.translucent = YES;*/
//    
//    // Image of tab bar icon when selected
//    [tabBar.items objectAtIndex:0].selectedImage = [Graphics imageOfBook];
//    [tabBar.items objectAtIndex:1].selectedImage = [Graphics imageOfQuote];
//    [tabBar.items objectAtIndex:2].selectedImage = [Graphics imageOfSettings];
//    
//    // Color of the tab bar icons when selected
//    tabBar.tintColor = selectedColor;
//    
//    // Image and color of the tab bar icons when unselected
//    [tabBar.items objectAtIndex:0].image = [[Graphics imageOfBookWithColor:unselectedColor] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
//    [tabBar.items objectAtIndex:1].image = [[Graphics imageOfQuoteWithColor:unselectedColor] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
//    [tabBar.items objectAtIndex:2].image = [[Graphics imageOfSettingsWithColor:unselectedColor] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
//    
//    // Tab Bar Fonts, Selected & Unselected Colors
//    [[UITabBarItem appearance] setTitleTextAttributes:@{NSFontAttributeName : [UIFont fontWithName:@"HelveticaNeue-Bold" size:10.0f], NSForegroundColorAttributeName : unselectedColor }
//                                             forState:UIControlStateNormal];
//    [[UITabBarItem appearance] setTitleTextAttributes:@{ NSForegroundColorAttributeName : selectedColor }
//                                             forState:UIControlStateSelected];
//    
//    
//    
//    // Renders selection indicator background
//    NSInteger numTabs = tabBar.items.count;
//    CGSize tabBarItemSize = CGSizeMake(tabBar.frame.size.width / numTabs, tabBar.frame.size.height);
//    UIGraphicsBeginImageContext(tabBarItemSize);
//    CGContextRef context = UIGraphicsGetCurrentContext();
//    
//    // This renders a solid background
//    UIColor *bgColor = selectedBGColor;
//    CGContextSetFillColorWithColor(context, bgColor.CGColor);
//    CGContextFillRect(context, (CGRect){.size = tabBarItemSize});
//    
//    // This renders a gradient overlay
//    CGGradientRef myGradient;
//    CGColorSpaceRef myColorspace;
//    size_t num_locations = 2;
//    CGFloat locations[2] = { 0.0, 1.0 };
//    CGFloat components[8] = { 0, 0, 0, .2,  // Start color
//        0.9, 0.9, 1.0, .2}; // End color
//    myColorspace = CGColorSpaceCreateWithName(kCGColorSpaceGenericRGB);
//    myGradient = CGGradientCreateWithColorComponents (myColorspace, components,
//                                                      locations, num_locations);
//    CGContextDrawLinearGradient (context, myGradient, CGPointZero, CGPointMake(0, tabBarItemSize.height), 0);
//    
//    // Set selection indicator background
//    _bgSelected = UIGraphicsGetImageFromCurrentImageContext();
//    UIGraphicsEndImageContext();
//    tabBar.selectionIndicatorImage = _bgSelected;
//}
//
//
//-(UIColor*) colorWithHexString:(NSString*)hex {
//    
//    NSString *cString = [[hex stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] uppercaseString];
//    
//    // String should be 6 or 8 characters
//    if ([cString length] < 6) return [UIColor grayColor];
//    // strip 0X, # if it appears
//    if ([cString hasPrefix:@"0X"]) cString = [cString substringFromIndex:2];
//    if ([cString hasPrefix:@"#"]) cString = [cString substringFromIndex:1];
//    if ([cString length] != 6) return  [UIColor grayColor];
//    
//    // Separate into r, g, b substrings
//    NSRange range;
//    range.location = 0;
//    range.length = 2;
//    NSString *rString = [cString substringWithRange:range];
//    range.location = 2;
//    NSString *gString = [cString substringWithRange:range];
//    range.location = 4;
//    NSString *bString = [cString substringWithRange:range];
//    
//    // Scan values
//    unsigned int r, g, b;
//    [[NSScanner scannerWithString:rString] scanHexInt:&r];
//    [[NSScanner scannerWithString:gString] scanHexInt:&g];
//    [[NSScanner scannerWithString:bString] scanHexInt:&b];
//    
//    return [UIColor colorWithRed:((float) r / 255.0f)
//                           green:((float) g / 255.0f)
//                            blue:((float) b / 255.0f)
//                           alpha:1.0f];
//}
//
//- (UIImage*)imageWithShadowForImage:(UIImage *)initialImage {
//    
//    CGColorSpaceRef colourSpace = CGColorSpaceCreateDeviceRGB();
//    CGContextRef shadowContext = CGBitmapContextCreate(NULL, initialImage.size.width, initialImage.size.height + 10, CGImageGetBitsPerComponent(initialImage.CGImage), 0, colourSpace, kCGImageAlphaPremultipliedLast);
//    CGColorSpaceRelease(colourSpace);
//    
//    CGContextSetShadowWithColor(shadowContext, CGSizeMake(0,0), 5, [UIColor yellowColor].CGColor);
//    CGContextDrawImage(shadowContext, CGRectMake(5, 5, initialImage.size.width, initialImage.size.height), initialImage.CGImage);
//    
//    CGImageRef shadowedCGImage = CGBitmapContextCreateImage(shadowContext);
//    CGContextRelease(shadowContext);
//    
//    UIImage * shadowedImage = [UIImage imageWithCGImage:shadowedCGImage];
//    CGImageRelease(shadowedCGImage);
//    
//    return shadowedImage;
//}
//
//
//
//- (BOOL)webView: (UIWebView*)webView shouldStartLoadWithRequest: (NSURLRequest*)request navigationType: (UIWebViewNavigationType)navigationType {
//    
//    //
//    // Map links starting with "file://" ending with #action with the
//    // action of the controller if it exists. Open other links in Safari.
//    // ------------------------------------------------------------------
//    
//#ifdef DEBUG
//    NSLog(@"Action from UIWebView!");
//#endif
//    
//    NSString *fragment, *scheme;
//    if (navigationType == UIWebViewNavigationTypeLinkClicked) {
//        [webView stopLoading];
//        fragment = [[request URL] fragment];
//        scheme = [[request URL] scheme];
//        
//        // Call a custom selector!! ;-)
//        if ([scheme isEqualToString: @"file"] && [self respondsToSelector: NSSelectorFromString(fragment)]) {
//            [self performSelector: NSSelectorFromString(fragment)];
//            return NO;
//        }
//        
//        // Open other links in Safari!!
//        [[UIApplication sharedApplication] openURL: [request URL]];
//    }
//    return YES;
//}
//
//
//
//
//
//// Table View Delegate & Data Source Methods
//
//- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
//    return 2;
//}
//
//- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
//    // Number of rows
//    if (section == 0) { return 1; }
//    return 12;
//}
//
//- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
//    // The header for the section
//    if (section == 0) { return @"Set Bookmark"; }
//    return @"Select section";//nil;
//    
//}
//
//- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
//    static NSString *MyIdentifier = @"MyReuseIdentifier";
//    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:MyIdentifier];
//    if (cell == nil) {
//        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault  reuseIdentifier:MyIdentifier];
//    }
//    
//    
//    cell.textLabel.text = [NSString stringWithFormat:@"Book %ld", (long)indexPath.item + 1];
//    
//    return cell;
//    
//}
//
//
//
//
//
//
//- (void)applicationWillResignActive:(UIApplication *)application {
//    
//    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
//    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
//}
//
//- (void)applicationDidEnterBackground:(UIApplication *)application {
//    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
//    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
//}
//
//- (void)applicationWillEnterForeground:(UIApplication *)application {
//    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
//}
//
//- (void)applicationDidBecomeActive:(UIApplication *)application {
//    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
//}
//
//- (void)applicationWillTerminate:(UIApplication *)application {
//    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
//}
//
//@end
