//
//  AppDelegate.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2019 SMGMobile. All rights reserved.
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

@property (nonatomic, strong) RDVTabBarController* tabBarController;

- (BOOL)hasTopNotch;

@end
