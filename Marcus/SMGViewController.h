//
//  SMGViewController.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 11/7/15.
//  Copyright © 2015 SMGMobile. All rights reserved.
//
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "SMGViewHeader.h"
#import "SMGGraphics.h"

@interface SMGViewController : UIViewController

@property (nonatomic, strong)     SMGViewHeader*     viewHeader;


// RDV TabBar Controller uses Title to set TabBar Titles.
// THerefore create viewHeaderTitle attribute so NavBar title can be different value

-(id) initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle;
//-(void) setModel: (SMGModel*) modelObject;
@end