//
//  SMGButton.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/3/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "SMGButton.h"
#import "SMGGraphics.h"

@implementation SMGButton

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (id)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    // Initialization code.
    _hitSpace = [[UIButton alloc] initWithFrame:frame];
    self.backgroundColor = [UIColor blueColor];
    //_up = [[UIImageView alloc] initWithImage:[SMGGraphics imageOfChapters ]];
    //[_up setFrame: _up.frame];
    //[self addSubview: _up];

  }
  return self;
}

@end
