//
//  SMGViewHeader.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/19/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "SMGViewHeader.h"
#import "SMGGraphics.h"
#import "SMGTools.h"


@implementation SMGViewHeader

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (id)initWithTitle:(NSString*)title modelObject:(SMGModel *)modelObject {
  
  self = [super init];
  if (self) {
    _title = title;
    _appModel = modelObject;
    //
    // Compute Status Bar Adjustment
    // -----------------------------

    DLog(@"Status Bar %i", _appModel.statusBarShown);
    _statusBarAdjust = (_appModel.statusBarShown)? [UIApplication sharedApplication].statusBarFrame.size.height : 0;
    
    //
    // Make ViewHeader & Buttons
    // -------------------------
    [self makeViewHeader];
    [self makeViewHeaderButtons];
    
    }
    return self;
}


- (void)makeViewHeader {
  
  //
  // Make ViewHeader
  // ---------------
  if(!_headerHeightFactor) {
    _headerHeightFactor = 18.0; // default height of view header is 1/18th the  height of device
  }
  self.frame = CGRectMake(0, 0, BOUNDS.size.width, BOUNDS.size.height/_headerHeightFactor + _statusBarAdjust);
  self.backgroundColor = [SMGGraphics Gray33];
  
  //
  // Make ViewHeader Label
  // ---------------------
  _label = [[UILabel alloc] initWithFrame: CGRectMake(0, _statusBarAdjust, self.frame.size.width,  self.frame.size.height - _statusBarAdjust)];
  _label.textColor = [UIColor whiteColor];
  _label.text = _title;
  _label.textAlignment = NSTextAlignmentCenter;
  _label.font = [UIFont systemFontOfSize:14];
  // _viewHeaderLabel.backgroundColor = [UIColor greenColor]; // debugging
  
  //
  // Make ViewHeader Line
  // --------------------
  UIView *lineView1 = [[UIView alloc] initWithFrame:CGRectMake(0, self.frame.size.height, BOUNDS.size.width, 1)];
  lineView1.backgroundColor = [SMGGraphics Gray66];
  
  
  [self addSubview: lineView1];
  [self addSubview: _label];
  
  DLog(@"Made %@ Header",_title);
  
}

- (void)makeViewHeaderButtons {
  if (!_buttonWidthFactor) { //button width depends on width of device, default is 1/5 device width
    _buttonWidthFactor = 5;
  }
  CGFloat buttonWidth = self.frame.size.width/_buttonWidthFactor;
  CGFloat buttonHeight = self.frame.size.height - _statusBarAdjust;
  CGRect leftButtonFrame = CGRectMake(0, _statusBarAdjust, buttonWidth, buttonHeight);
  CGRect rightButtonFrame = CGRectMake(buttonWidth*(_buttonWidthFactor - 1), _statusBarAdjust, buttonWidth, buttonHeight);
  
  _leftButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [_leftButton setFrame:leftButtonFrame];
  _rightButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [_rightButton setFrame:rightButtonFrame];
  
  // _rightButton.backgroundColor = [UIColor redColor]; // debugging

    [self addSubview: _leftButton];
    [self addSubview: _rightButton];
  
}

@end
