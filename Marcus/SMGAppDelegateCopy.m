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
//#import <Foundation/Foundation.h>
//#import "SMGAppDelegate.h"
//#import "SMGViewController.h"
//#import "graphics.h"
//
//
//
//@interface SMGAppDelegate () <UIScrollViewDelegate, UITabBarControllerDelegate, UIWebViewDelegate>
//
//@property (nonatomic)                  CGRect               mainViewFrame;
//@property (nonatomic, strong)          SMGViewController*   bookVC;
//@property (nonatomic, strong)          SMGViewController*   quoteVC;
//@property (nonatomic, strong)          SMGViewController*   settingsVC;
//
//@property (nonatomic, strong)          UILabel*             myNavLabel;
//@property (nonatomic, strong)          UIView*              myNavView;
//@property (nonatomic, strong)          UIView*              settingsView;
//@property (nonatomic, strong)          UIWebView*           bookWebView;
//@property (nonatomic, strong)          UIWebView*           quoteWebView;
//@property (nonatomic, strong)          NSMutableDictionary* appState;
//@property (nonatomic, strong)          UIImage*             bgSelected;
//
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
//    self.mainViewFrame = UIScreen.mainScreen.bounds;
//    
//    //
//    // Initialize Tab Bar, Views & View Controllers
//    // --------------------------------------------
//    [self setUpApp];
//    
//    //
//    // Initialize Main Window
//    // ----------------------
//    self.window = [[UIWindow alloc] initWithFrame:self.mainViewFrame];
//    
//    
//    //
//    // Configure Main Window
//    // ---------------------
//    [self.window setRootViewController:self.tabBarController];
//    [self.window makeKeyAndVisible];
//    
//    return YES;
//}
//
//
//
//- (void) setUpApp {
//    
//    // Initialize Tab Bar Controller
//    self.tabBarController = [[UITabBarController alloc] init];
//    self.tabBarController.viewControllers = NULL;
//    
//    // Init VCs
//    self.bookVC = [[SMGViewController alloc] initwithTitle:@"BOOK"];
//    self.quoteVC = [[SMGViewController alloc] initwithTitle:@"Q.O.D."];
//    self.settingsVC = [[SMGViewController alloc] initwithTitle:@"SETTINGS"];
//    
//    // Add VCs to Tab Bar Controller
//    [self.tabBarController setViewControllers: @[self.bookVC, self.quoteVC, self.settingsVC]];
//    
//    
//    // Initialize Views
//    // Book WebView
//    self.bookWebView = [[UIWebView alloc] initWithFrame: self.mainViewFrame];
//    NSURL *bookURL = [[NSBundle mainBundle] URLForResource:@"book" withExtension:@"html"];
//    [self.bookWebView loadRequest:[NSURLRequest requestWithURL:bookURL]];
//    self.bookWebView.delegate = self;
//    self.bookWebView.scrollView.bounces = NO;
//    
//    // Quote WebView
//    self.quoteWebView = [[UIWebView alloc] initWithFrame: self.mainViewFrame];
//    NSURL *quoteURL = [[NSBundle mainBundle] URLForResource:@"quote" withExtension:@"html"];
//    [self.quoteWebView loadRequest:[NSURLRequest requestWithURL:quoteURL]];
//    self.quoteWebView.delegate = self;
//    self.quoteWebView.scrollView.bounces = NO;
//    
//    // Settings View
//    
//    // Add Views to VCs
//    [self.bookVC.view addSubview: self.bookWebView];
//    [self.quoteVC.view addSubview:self.quoteWebView];
//    
//    // Set Up Tab, Nav Bars Color & Style, NavBar
//    [self customizeTabBar];
//    [self makeNavBar];
//    
//    // Hide Tab Bar When Pressing on Book View
//    //self.bookVC.hidesBottomBarWhenPushed = YES;
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
//    self.myNavView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.mainViewFrame.size.width, self.mainViewFrame.size.height/18.0)];
//    self.myNavLabel = [[UILabel alloc] initWithFrame: self.myNavView.frame];
//    
//    self.myNavLabel.textColor = [UIColor whiteColor];
//    self.myNavLabel.text = @"M E D I T A T I O N S";
//    self.myNavLabel.textAlignment = NSTextAlignmentCenter;
//    self.myNavLabel.font = [UIFont boldSystemFontOfSize:14];
//    self.myNavView.backgroundColor = [[self colorWithHexString:@"#22aadd"] colorWithAlphaComponent:.9];
//    
//    UIImageView * myNavBG = [[UIImageView alloc] initWithImage:self.bgSelected]; //make better later
//    myNavBG.frame =  self.myNavView.frame;
//    
//    [self.myNavView addSubview:myNavBG];
//    [self.tabBarController.view addSubview: self.myNavView];
//    [self.tabBarController.view addSubview: self.myNavLabel];
//    //[self.bookVC.view addSubview: self.myNavView];
//    
//    
//}
//
//- (void) customizeTabBar {
//    
//    UITabBar* tabBar = self.tabBarController.tabBar;
//    
//    UIColor * selectedColor =  [UIColor whiteColor];
//    UIColor * unselectedColor =  [self colorWithHexString:@"#22aadd"]; //colorWithAlphaComponent:.2];
//    
//    UIColor * selectedBGColor =  [self colorWithHexString:@"#22aadd"]; // colorWithAlphaComponent:.2];
//    
//    
//    // Background color of the Tab Bar Views
//    self.tabBarController.view.backgroundColor = [self colorWithHexString:@"191919"];
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
//    
//    // Color of the tab bar icons when selected
//    tabBar.tintColor = selectedColor;
//    
//    // Image and color of the tab bar icons when unselected
//    [tabBar.items objectAtIndex:0].image = [[Graphics imageOfBookWithColor:unselectedColor] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
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
//    self.bgSelected = UIGraphicsGetImageFromCurrentImageContext();
//    UIGraphicsEndImageContext();
//    tabBar.selectionIndicatorImage = self.bgSelected;
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
//*/
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
