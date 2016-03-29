//
//  SMGViewController.m
//  NYC Subway Map
//
//  Created by Marcus Lewis on 12/17/13.
//  Copyright (c) 2013 Marcus Lewis. All rights reserved.
//

#import "SMGViewController.h"
#import "Graphics.h"

@implementation SMGViewController

- (id) initwithTitle:(NSString*)title {
    
    if (self == [super init]) {
        self.title = title;        
    }
    return self;
}

-(BOOL)prefersStatusBarHidden{
    return YES;
}

- (BOOL) shouldAutorotate {
    
    return NO;
}

- (void)viewDidLoad {
    
}

- (void)viewWillAppear:(BOOL)animated {

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
