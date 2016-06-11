//
//  SMGViewHeader.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/19/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SMGButton.h"

@interface SMGViewHeader : UIView

@property (nonatomic, strong)         UILabel*              label;
@property (nonatomic, strong)         NSString*             title;
@property (nonatomic, strong)         UIView*               view;
@property (nonatomic, strong)         UIButton*             leftButton;
@property (nonatomic, strong)         UIButton*             rightButton;
@property (nonatomic)                 CGFloat               statusBarAdjust;
@property (nonatomic)                 CGRect                mainFrame;
@property (nonatomic)                 CGFloat               buttonWidthFactor;
@property (nonatomic)                 CGFloat               headerHeightFactor;

- (id)initWithTitle:(NSString*) title;

@end
