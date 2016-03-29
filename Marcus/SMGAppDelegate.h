//
//  AppDelegate.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "RDVTabBarController.h"


@interface SMGAppDelegate : UIResponder <UIApplicationDelegate>


//
// Properties here can be accessed by importing SMGAppDelegate.h
// and creating a pointer to the shared delegate
// -------------------------------------------------------------

@property (strong, nonatomic)          UIWindow *window;
@property (nonatomic, strong)          UITabBarController * tabBarController;





@end