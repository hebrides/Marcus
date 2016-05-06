//
//  SMGButton.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/3/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SMGButton : UIView

@property (nonatomic, strong) UILabel*              buttonLabel;
@property (nonatomic, strong) UIButton*             hitSpace;
@property (nonatomic, strong) UIImage*              touched;
@property (nonatomic, strong) UIImage*              inUse;
@property (nonatomic, strong) UIImage*              disabled;
@property (nonatomic, strong) UIImageView*              up;

@end
