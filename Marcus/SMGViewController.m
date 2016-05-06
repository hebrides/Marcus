//
//  SMGViewController.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//
//

#import "SMGViewController.h"

@interface SMGViewController ()

@end


@implementation SMGViewController


- (id) initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle {
    
    if (self = [super init]) {
        self.title = tabTitle;
        _viewHeader = [[SMGViewHeader alloc] initWithTitle: headerTitle];
        [self.view addSubview:_viewHeader];
      
    } else NSLog(@"SMGVC Init Fail");
    return self;
}



- (void)viewDidLoad {
  [self setNeedsStatusBarAppearanceUpdate];
 //
}

- (void)viewWillAppear:(BOOL)animated {
 //
}

- (BOOL) shouldAutorotate {
  return NO;
}


-(UIStatusBarStyle)preferredStatusBarStyle{
  return UIStatusBarStyleLightContent;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dereference pointers to free memory
    for (UIView* __strong subView in self.view.subviews){
        subView = nil;
    }
}

- (void)viewDidDisappear:(BOOL)animated
{
	[super viewDidDisappear:animated];
    // Dereference pointers to free memory
    for (UIView* __strong subView in self.view.subviews){
        subView = nil;
    }
}

@end
