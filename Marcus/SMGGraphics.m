//
//  SMGGraphics.m
//
//  Created by Marcus Lewis on 2/5/16.
//  Copyright (c) 2016 SMGMobile. All rights reserved.
//

#import "SMGGraphics.h"


@implementation SMGGraphics

#pragma mark Cache

static UIImage* _imageOfBook = nil;
static UIImage* _imageOfBigBook = nil;
static UIImage* _imageOfQuote = nil;
static UIImage* _imageOfBigQuote = nil;
static UIImage* _imageOfSettings = nil;
static UIImage* _imageOfBigSettings = nil;
static UIImage* _imageOfShare = nil;
static UIImage* _imageOfChapters = nil;
static UIImage* _imageOfCloseChapters = nil;

static UIColor* _Gray31 = nil;
static UIColor* _Gray33 = nil;
static UIColor* _Gray4C = nil;
static UIColor* _Gray66 = nil;
static UIColor* _Blue22AADD = nil;

#pragma mark Initialization

+ (void)initialize
{
  _Gray31 = [self colorWithHexString:@"#313131"];
  _Gray33 = [self colorWithHexString:@"#333333"];
  _Gray4C = [self colorWithHexString:@"#4C4C4C"];
  _Gray66 = [self colorWithHexString:@"#666666"];
  _Blue22AADD = [self colorWithHexString:@"#22AADD"];
}

#pragma mark Drawing Methods

+ (UIColor*)Gray31 { return _Gray31; }
+ (UIColor*)Gray33 { return _Gray33; }
+ (UIColor*)Gray4C { return _Gray4C; }
+ (UIColor*)Gray66 { return _Gray66; }
+ (UIColor*)Blue22AADD { return _Blue22AADD; }

+ (UIColor*)colorWithHexString:(NSString*)hex {
  
  NSString *cString = [[hex stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] uppercaseString];
  
  // String should be 6 or 8 characters
  if ([cString length] < 6) return [UIColor grayColor];
  // strip 0X, # if it appears
  if ([cString hasPrefix:@"0X"]) cString = [cString substringFromIndex:2];
  if ([cString hasPrefix:@"#"]) cString = [cString substringFromIndex:1];
  if ([cString length] != 6) return  [UIColor grayColor];
  
  // Separate into r, g, b substrings
  NSRange range;
  range.location = 0;
  range.length = 2;
  NSString *rString = [cString substringWithRange:range];
  range.location = 2;
  NSString *gString = [cString substringWithRange:range];
  range.location = 4;
  NSString *bString = [cString substringWithRange:range];
  
  // Scan values
  unsigned int r, g, b;
  [[NSScanner scannerWithString:rString] scanHexInt:&r];
  [[NSScanner scannerWithString:gString] scanHexInt:&g];
  [[NSScanner scannerWithString:bString] scanHexInt:&b];
  
  return [UIColor colorWithRed:((float) r / 255.0f)
                         green:((float) g / 255.0f)
                          blue:((float) b / 255.0f)
                         alpha:1.0f];
}

+ (UIImage*)imageWithShadowForImage:(UIImage *)initialImage {
  
  CGColorSpaceRef colourSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef shadowContext = CGBitmapContextCreate(NULL, initialImage.size.width, initialImage.size.height + 10, CGImageGetBitsPerComponent(initialImage.CGImage), 0, colourSpace, kCGImageAlphaPremultipliedLast);
  CGColorSpaceRelease(colourSpace);
  
  CGContextSetShadowWithColor(shadowContext, CGSizeMake(0,0), 5, [UIColor yellowColor].CGColor);
  CGContextDrawImage(shadowContext, CGRectMake(5, 5, initialImage.size.width, initialImage.size.height), initialImage.CGImage);
  
  CGImageRef shadowedCGImage = CGBitmapContextCreateImage(shadowContext);
  CGContextRelease(shadowContext);
  
  UIImage * shadowedImage = [UIImage imageWithCGImage:shadowedCGImage];
  CGImageRelease(shadowedCGImage);
  
  return shadowedImage;
}

+ (UIImage*)imageSolidWithSize:(CGSize)size color:(UIColor *)color {
  // Renders a solid colored retangular image
  UIGraphicsBeginImageContext(size);
  CGContextRef context = UIGraphicsGetCurrentContext();

  CGContextSetFillColorWithColor(context, color.CGColor);
  CGContextFillRect(context, (CGRect){.size = size});

  UIImage* solid = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return solid;
}

+ (void)drawShare: (UIColor*) color {
  
  // bezier Drawing -- Custom
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(11.4, 14.55)];
  [bezierPath addLineToPoint: CGPointMake(20.9, 5.05)];
  [bezierPath addLineToPoint: CGPointMake(14.4, 5.05)];
  [bezierPath moveToPoint: CGPointMake(20.9, 11.5)];
  [bezierPath addLineToPoint: CGPointMake(20.9, 5.05)];
  [bezierPath moveToPoint: CGPointMake(15.75, 15.2)];
  [bezierPath addLineToPoint: CGPointMake(15.75, 20.85)];
  [bezierPath addLineToPoint: CGPointMake(5.1, 20.85)];
  [bezierPath addLineToPoint: CGPointMake(5.1, 10.25)];
  [bezierPath addLineToPoint: CGPointMake(10.8, 10.25)];
  bezierPath.miterLimit = 4;
  
  
  bezierPath.lineCapStyle = kCGLineCapRound;
  
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 1;
  [bezierPath stroke];
  
  //iOS share
  
  //  //// bezier Drawing
  //  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  //  [bezierPath moveToPoint: CGPointMake(4.95, 19.75)];
  //  [bezierPath addLineToPoint: CGPointMake(20, 4.75)];
  //  [bezierPath addLineToPoint: CGPointMake(13.15, 4.75)];
  //  [bezierPath moveToPoint: CGPointMake(20, 4.75)];
  //  [bezierPath addLineToPoint: CGPointMake(20, 11.55)];
  //  bezierPath.miterLimit = 4;
  
  //  //// bezier Drawing
  //  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  //  [bezierPath moveToPoint: CGPointMake(6.2, 17.5)];
  //  [bezierPath addLineToPoint: CGPointMake(17.5, 6.7)];
  //  [bezierPath addLineToPoint: CGPointMake(8.87, 6.7)];
  //  [bezierPath moveToPoint: CGPointMake(17.5, 6.7)];
  //  [bezierPath addLineToPoint: CGPointMake(17.5, 14.99)];
  

  
}

+ (void)drawChapters: (UIColor*) color {
  
  //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(5.1, 19.05)];
  [bezierPath addLineToPoint: CGPointMake(17.9, 19.05)];
  [bezierPath moveToPoint: CGPointMake(7.25, 13.75)];
  [bezierPath addLineToPoint: CGPointMake(20.05, 13.75)];
  [bezierPath moveToPoint: CGPointMake(5.1, 8.45)];
  [bezierPath addLineToPoint: CGPointMake(17.9, 8.45)];
  bezierPath.miterLimit = 4;
  
  
  bezierPath.lineCapStyle = kCGLineCapRound;
  
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 1;
  [bezierPath stroke];
  
}

+ (void)drawCloseChapters: (UIColor*) color {
  
  //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(9.300, 10.375)];
  [bezierPath addLineToPoint: CGPointMake(15.250, 16.325)];
  [bezierPath moveToPoint: CGPointMake(9.300, 16.325)];
  [bezierPath addLineToPoint: CGPointMake(15.250, 10.375)];
  bezierPath.miterLimit = 4;
  
  bezierPath.lineCapStyle = kCGLineCapRound;
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 1;
  [bezierPath stroke];
  
}


+ (void)drawBook: (UIColor*) color {

  //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(13.6, 9.15)];
  [bezierPath addLineToPoint: CGPointMake(13.6, 21.9)];
  [bezierPath addLineToPoint: CGPointMake(21.85, 15.95)];
  [bezierPath addLineToPoint: CGPointMake(21.85, 3.2)];
  [bezierPath addLineToPoint: CGPointMake(13.6, 9.15)];
  [bezierPath closePath];
  [bezierPath moveToPoint: CGPointMake(11.15, 9.15)];
  [bezierPath addLineToPoint: CGPointMake(11.15, 21.9)];
  [bezierPath addLineToPoint: CGPointMake(2.95, 15.95)];
  [bezierPath addLineToPoint: CGPointMake(2.95, 3.2)];
  [bezierPath addLineToPoint: CGPointMake(11.15, 9.15)];
  [bezierPath closePath];
  bezierPath.miterLimit = 4;

  
  bezierPath.lineCapStyle = kCGLineCapRound;
  
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 1;
  [bezierPath stroke];
    
}

+ (void)drawBigBook: (UIColor*) color {
  
  //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(159, 3.5)];
  [bezierPath addLineToPoint: CGPointMake(90.55, 53.3)];
  [bezierPath addLineToPoint: CGPointMake(90.55, 159.8)];
  [bezierPath addLineToPoint: CGPointMake(159, 110.3)];
  [bezierPath addLineToPoint: CGPointMake(159, 3.5)];
  [bezierPath closePath];
  [bezierPath moveToPoint: CGPointMake(72.9, 53.3)];
  [bezierPath addLineToPoint: CGPointMake(72.9, 159.8)];
  [bezierPath addLineToPoint: CGPointMake(4.5, 110.3)];
  [bezierPath addLineToPoint: CGPointMake(4.5, 3.5)];
  [bezierPath addLineToPoint: CGPointMake(72.9, 53.3)];
  [bezierPath closePath];
  bezierPath.miterLimit = 4;
  
  bezierPath.lineCapStyle = kCGLineCapRound;
  
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 5;
  [bezierPath stroke];
  
}


+ (void)drawQuote: (UIColor*) color {
   //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(14.75, 4.35)];
  [bezierPath addCurveToPoint: CGPointMake(14.55, 4.4) controlPoint1: CGPointMake(14.6, 4.35) controlPoint2: CGPointMake(14.6, 4.35)];
  [bezierPath addCurveToPoint: CGPointMake(14.45, 4.6) controlPoint1: CGPointMake(14.45, 4.5) controlPoint2: CGPointMake(14.45, 4.5)];
  [bezierPath addLineToPoint: CGPointMake(14.45, 18.85)];
  [bezierPath addCurveToPoint: CGPointMake(14.55, 19.05) controlPoint1: CGPointMake(14.45, 19) controlPoint2: CGPointMake(14.45, 19)];
  [bezierPath addCurveToPoint: CGPointMake(14.65, 19) controlPoint1: CGPointMake(14.6, 19.05) controlPoint2: CGPointMake(14.6, 19.05)];
  [bezierPath addLineToPoint: CGPointMake(22.4, 11.95)];
  [bezierPath addCurveToPoint: CGPointMake(22.55, 11.75) controlPoint1: CGPointMake(22.45, 11.9) controlPoint2: CGPointMake(22.45, 11.9)];
  [bezierPath addCurveToPoint: CGPointMake(22.6, 11.5) controlPoint1: CGPointMake(22.6, 11.6) controlPoint2: CGPointMake(22.6, 11.6)];
  [bezierPath addLineToPoint: CGPointMake(22.6, 4.6)];
  [bezierPath addCurveToPoint: CGPointMake(22.5, 4.4) controlPoint1: CGPointMake(22.6, 4.5) controlPoint2: CGPointMake(22.6, 4.5)];
  [bezierPath addCurveToPoint: CGPointMake(22.35, 4.35) controlPoint1: CGPointMake(22.4, 4.35) controlPoint2: CGPointMake(22.4, 4.35)];
  [bezierPath addLineToPoint: CGPointMake(14.75, 4.35)];
  [bezierPath closePath];
  [bezierPath moveToPoint: CGPointMake(2.95, 4.35)];
  [bezierPath addCurveToPoint: CGPointMake(2.75, 4.4) controlPoint1: CGPointMake(2.8, 4.35) controlPoint2: CGPointMake(2.8, 4.35)];
  [bezierPath addCurveToPoint: CGPointMake(2.65, 4.6) controlPoint1: CGPointMake(2.65, 4.5) controlPoint2: CGPointMake(2.65, 4.5)];
  [bezierPath addLineToPoint: CGPointMake(2.65, 18.85)];
  [bezierPath addCurveToPoint: CGPointMake(2.75, 19.05) controlPoint1: CGPointMake(2.65, 19) controlPoint2: CGPointMake(2.65, 19)];
  [bezierPath addCurveToPoint: CGPointMake(2.85, 19) controlPoint1: CGPointMake(2.8, 19.05) controlPoint2: CGPointMake(2.8, 19.05)];
  [bezierPath addLineToPoint: CGPointMake(10.6, 11.95)];
  [bezierPath addCurveToPoint: CGPointMake(10.75, 11.75) controlPoint1: CGPointMake(10.65, 11.9) controlPoint2: CGPointMake(10.65, 11.9)];
  [bezierPath addCurveToPoint: CGPointMake(10.8, 11.5) controlPoint1: CGPointMake(10.8, 11.6) controlPoint2: CGPointMake(10.8, 11.6)];
  [bezierPath addLineToPoint: CGPointMake(10.8, 4.6)];
  [bezierPath addCurveToPoint: CGPointMake(10.7, 4.4) controlPoint1: CGPointMake(10.8, 4.5) controlPoint2: CGPointMake(10.8, 4.5)];
  [bezierPath addCurveToPoint: CGPointMake(10.55, 4.35) controlPoint1: CGPointMake(10.6, 4.35) controlPoint2: CGPointMake(10.6, 4.35)];
  [bezierPath addLineToPoint: CGPointMake(2.95, 4.35)];
  [bezierPath closePath];
  bezierPath.miterLimit = 4;


  
  bezierPath.lineCapStyle = kCGLineCapRound;
  
  bezierPath.lineJoinStyle = kCGLineJoinRound;

  [color setStroke];
  bezierPath.lineWidth = 1;
  [bezierPath stroke];


  
}

+ (void)drawBigQuote: (UIColor*) color {

//// bezier Drawing
UIBezierPath* bezierPath = [UIBezierPath bezierPath];
[bezierPath moveToPoint: CGPointMake(169.8, 65.55)];
[bezierPath addCurveToPoint: CGPointMake(170.5, 63.5) controlPoint1: CGPointMake(170.5, 64.5) controlPoint2: CGPointMake(170.5, 64.5)];
[bezierPath addLineToPoint: CGPointMake(170.5, 6.85)];
[bezierPath addCurveToPoint: CGPointMake(169.8, 5.15) controlPoint1: CGPointMake(170.5, 5.85) controlPoint2: CGPointMake(170.5, 5.85)];
[bezierPath addCurveToPoint: CGPointMake(168.05, 4.5) controlPoint1: CGPointMake(169.15, 4.5) controlPoint2: CGPointMake(169.15, 4.5)];
[bezierPath addLineToPoint: CGPointMake(105.75, 4.5)];
[bezierPath addCurveToPoint: CGPointMake(104.05, 5.15) controlPoint1: CGPointMake(104.75, 4.5) controlPoint2: CGPointMake(104.75, 4.5)];
[bezierPath addCurveToPoint: CGPointMake(103.4, 6.85) controlPoint1: CGPointMake(103.4, 5.85) controlPoint2: CGPointMake(103.4, 5.85)];
[bezierPath addLineToPoint: CGPointMake(103.4, 124.95)];
[bezierPath moveToPoint: CGPointMake(72.3, 65.55)];
[bezierPath addCurveToPoint: CGPointMake(72.6, 63.5) controlPoint1: CGPointMake(72.6, 64.5) controlPoint2: CGPointMake(72.6, 64.5)];
[bezierPath addLineToPoint: CGPointMake(72.6, 6.85)];
[bezierPath addCurveToPoint: CGPointMake(71.95, 5.15) controlPoint1: CGPointMake(72.6, 5.85) controlPoint2: CGPointMake(72.6, 5.85)];
[bezierPath addCurveToPoint: CGPointMake(70.6, 4.5) controlPoint1: CGPointMake(71.25, 4.5) controlPoint2: CGPointMake(71.25, 4.5)];
[bezierPath addLineToPoint: CGPointMake(7.95, 4.5)];
[bezierPath addCurveToPoint: CGPointMake(6.2, 5.15) controlPoint1: CGPointMake(6.9, 4.5) controlPoint2: CGPointMake(6.9, 4.5)];
[bezierPath addCurveToPoint: CGPointMake(5.5, 6.85) controlPoint1: CGPointMake(5.5, 5.85) controlPoint2: CGPointMake(5.5, 5.85)];
[bezierPath addLineToPoint: CGPointMake(5.5, 124.95)];
[bezierPath moveToPoint: CGPointMake(6.2, 126.35)];
[bezierPath addCurveToPoint: CGPointMake(7.25, 125.95) controlPoint1: CGPointMake(6.55, 126.35) controlPoint2: CGPointMake(6.55, 126.35)];
[bezierPath addLineToPoint: CGPointMake(70.95, 67.25)];
[bezierPath moveToPoint: CGPointMake(103.75, 126.35)];
[bezierPath addCurveToPoint: CGPointMake(105.1, 125.95) controlPoint1: CGPointMake(104.4, 126.35) controlPoint2: CGPointMake(104.4, 126.35)];
[bezierPath addLineToPoint: CGPointMake(168.75, 67.25)];
bezierPath.miterLimit = 4;

bezierPath.lineCapStyle = kCGLineCapRound;

bezierPath.lineJoinStyle = kCGLineJoinRound;

[color setStroke];
bezierPath.lineWidth = 5;
[bezierPath stroke];
  
}

+ (void)drawSettings: (UIColor*) color {

  //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(0, 8.25)];
  [bezierPath addLineToPoint: CGPointMake(15.8, 8.25)];
  [bezierPath addLineToPoint: CGPointMake(15.8, 5.8)];
  [bezierPath addCurveToPoint: CGPointMake(15.9, 5.55) controlPoint1: CGPointMake(15.8, 5.65) controlPoint2: CGPointMake(15.8, 5.65)];
  [bezierPath addCurveToPoint: CGPointMake(16.1, 5.5) controlPoint1: CGPointMake(15.95, 5.5) controlPoint2: CGPointMake(15.95, 5.5)];
  [bezierPath addLineToPoint: CGPointMake(20.85, 5.5)];
  [bezierPath addCurveToPoint: CGPointMake(21.05, 5.55) controlPoint1: CGPointMake(20.95, 5.5) controlPoint2: CGPointMake(20.95, 5.5)];
  [bezierPath addCurveToPoint: CGPointMake(21.15, 5.8) controlPoint1: CGPointMake(21.15, 5.65) controlPoint2: CGPointMake(21.15, 5.65)];
  [bezierPath addLineToPoint: CGPointMake(21.15, 8.25)];
  [bezierPath addLineToPoint: CGPointMake(25, 8.25)];
  [bezierPath moveToPoint: CGPointMake(21.15, 8.25)];
  [bezierPath addLineToPoint: CGPointMake(21.15, 10.75)];
  [bezierPath addCurveToPoint: CGPointMake(21.05, 10.9) controlPoint1: CGPointMake(21.15, 10.85) controlPoint2: CGPointMake(21.15, 10.85)];
  [bezierPath addCurveToPoint: CGPointMake(20.85, 11) controlPoint1: CGPointMake(20.95, 11) controlPoint2: CGPointMake(20.95, 11)];
  [bezierPath addLineToPoint: CGPointMake(16.1, 11)];
  [bezierPath addCurveToPoint: CGPointMake(15.9, 10.9) controlPoint1: CGPointMake(15.95, 11) controlPoint2: CGPointMake(15.95, 11)];
  [bezierPath addCurveToPoint: CGPointMake(15.8, 10.75) controlPoint1: CGPointMake(15.8, 10.85) controlPoint2: CGPointMake(15.8, 10.85)];
  [bezierPath addLineToPoint: CGPointMake(15.8, 8.25)];
  [bezierPath moveToPoint: CGPointMake(8.6, 18.1)];
  [bezierPath addLineToPoint: CGPointMake(8.6, 15.65)];
  [bezierPath addCurveToPoint: CGPointMake(8.55, 15.4) controlPoint1: CGPointMake(8.6, 15.5) controlPoint2: CGPointMake(8.6, 15.5)];
  [bezierPath addCurveToPoint: CGPointMake(8.35, 15.35) controlPoint1: CGPointMake(8.5, 15.35) controlPoint2: CGPointMake(8.5, 15.35)];
  [bezierPath addLineToPoint: CGPointMake(3.6, 15.35)];
  [bezierPath addCurveToPoint: CGPointMake(3.45, 15.4) controlPoint1: CGPointMake(3.5, 15.35) controlPoint2: CGPointMake(3.5, 15.35)];
  [bezierPath addCurveToPoint: CGPointMake(3.35, 15.65) controlPoint1: CGPointMake(3.35, 15.5) controlPoint2: CGPointMake(3.35, 15.5)];
  [bezierPath addLineToPoint: CGPointMake(3.35, 18.1)];
  [bezierPath addLineToPoint: CGPointMake(3.35, 20.5)];
  [bezierPath addCurveToPoint: CGPointMake(3.45, 20.7) controlPoint1: CGPointMake(3.35, 20.6) controlPoint2: CGPointMake(3.35, 20.6)];
  [bezierPath addCurveToPoint: CGPointMake(3.6, 20.8) controlPoint1: CGPointMake(3.5, 20.8) controlPoint2: CGPointMake(3.5, 20.8)];
  [bezierPath addLineToPoint: CGPointMake(8.35, 20.8)];
  [bezierPath addCurveToPoint: CGPointMake(8.55, 20.7) controlPoint1: CGPointMake(8.5, 20.8) controlPoint2: CGPointMake(8.5, 20.8)];
  [bezierPath addCurveToPoint: CGPointMake(8.6, 20.5) controlPoint1: CGPointMake(8.6, 20.6) controlPoint2: CGPointMake(8.6, 20.6)];
  [bezierPath addLineToPoint: CGPointMake(8.6, 18.1)];
  [bezierPath addLineToPoint: CGPointMake(25, 18.1)];
  [bezierPath moveToPoint: CGPointMake(0, 18.1)];
  [bezierPath addLineToPoint: CGPointMake(3.35, 18.1)];
  bezierPath.miterLimit = 4;

  bezierPath.lineCapStyle = kCGLineCapRound;
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 1;
  [bezierPath stroke];

}

+ (void)drawBigSettings: (UIColor*) color {
  
  //// bezier Drawing
  UIBezierPath* bezierPath = [UIBezierPath bezierPath];
  [bezierPath moveToPoint: CGPointMake(159.4, 21.2)];
  [bezierPath addLineToPoint: CGPointMake(135.25, 21.2)];
  [bezierPath addLineToPoint: CGPointMake(135.25, 37)];
  [bezierPath addCurveToPoint: CGPointMake(134.7, 38.35) controlPoint1: CGPointMake(135.25, 37.8) controlPoint2: CGPointMake(135.25, 37.8)];
  [bezierPath addCurveToPoint: CGPointMake(133.4, 38.9) controlPoint1: CGPointMake(134.2, 38.9) controlPoint2: CGPointMake(134.2, 38.9)];
  [bezierPath addLineToPoint: CGPointMake(104.15, 38.9)];
  [bezierPath addCurveToPoint: CGPointMake(102.8, 38.35) controlPoint1: CGPointMake(103.35, 38.9) controlPoint2: CGPointMake(103.35, 38.9)];
  [bezierPath addCurveToPoint: CGPointMake(102.25, 37) controlPoint1: CGPointMake(102.25, 37.8) controlPoint2: CGPointMake(102.25, 37.8)];
  [bezierPath addLineToPoint: CGPointMake(102.25, 21.2)];
  [bezierPath addLineToPoint: CGPointMake(4.5, 21.2)];
  [bezierPath moveToPoint: CGPointMake(102.25, 21.2)];
  [bezierPath addLineToPoint: CGPointMake(102.25, 5.35)];
  [bezierPath addCurveToPoint: CGPointMake(102.8, 4) controlPoint1: CGPointMake(102.25, 4.55) controlPoint2: CGPointMake(102.25, 4.55)];
  [bezierPath addCurveToPoint: CGPointMake(104.15, 3.5) controlPoint1: CGPointMake(103.35, 3.5) controlPoint2: CGPointMake(103.35, 3.5)];
  [bezierPath addLineToPoint: CGPointMake(133.4, 3.5)];
  [bezierPath addCurveToPoint: CGPointMake(134.7, 4) controlPoint1: CGPointMake(134.2, 3.5) controlPoint2: CGPointMake(134.2, 3.5)];
  [bezierPath addCurveToPoint: CGPointMake(135.25, 5.35) controlPoint1: CGPointMake(135.25, 4.55) controlPoint2: CGPointMake(135.25, 4.55)];
  [bezierPath addLineToPoint: CGPointMake(135.25, 21.2)];
  [bezierPath moveToPoint: CGPointMake(4.5, 84.35)];
  [bezierPath addLineToPoint: CGPointMake(25.15, 84.35)];
  [bezierPath addLineToPoint: CGPointMake(25.15, 68.55)];
  [bezierPath addCurveToPoint: CGPointMake(25.7, 67.2) controlPoint1: CGPointMake(25.15, 67.7) controlPoint2: CGPointMake(25.15, 67.7)];
  [bezierPath addCurveToPoint: CGPointMake(26.9, 66.65) controlPoint1: CGPointMake(26.2, 66.65) controlPoint2: CGPointMake(26.2, 66.65)];
  [bezierPath addLineToPoint: CGPointMake(56.25, 66.65)];
  [bezierPath addCurveToPoint: CGPointMake(57.6, 67.2) controlPoint1: CGPointMake(57.05, 66.65) controlPoint2: CGPointMake(57.05, 66.65)];
  [bezierPath addCurveToPoint: CGPointMake(58.15, 68.55) controlPoint1: CGPointMake(58.15, 67.7) controlPoint2: CGPointMake(58.15, 67.7)];
  [bezierPath addLineToPoint: CGPointMake(58.15, 84.35)];
  [bezierPath addLineToPoint: CGPointMake(159.4, 84.35)];
  [bezierPath moveToPoint: CGPointMake(25.15, 84.35)];
  [bezierPath addLineToPoint: CGPointMake(25.15, 100.2)];
  [bezierPath addCurveToPoint: CGPointMake(25.7, 101.5) controlPoint1: CGPointMake(25.15, 101) controlPoint2: CGPointMake(25.15, 101)];
  [bezierPath addCurveToPoint: CGPointMake(26.9, 102.05) controlPoint1: CGPointMake(26.2, 102.05) controlPoint2: CGPointMake(26.2, 102.05)];
  [bezierPath addLineToPoint: CGPointMake(56.25, 102.05)];
  [bezierPath addCurveToPoint: CGPointMake(57.6, 101.5) controlPoint1: CGPointMake(57.05, 102.05) controlPoint2: CGPointMake(57.05, 102.05)];
  [bezierPath addCurveToPoint: CGPointMake(58.15, 100.2) controlPoint1: CGPointMake(58.15, 101) controlPoint2: CGPointMake(58.15, 101)];
  [bezierPath addLineToPoint: CGPointMake(58.15, 84.35)];
  bezierPath.miterLimit = 4;
  
  bezierPath.lineCapStyle = kCGLineCapRound;
  bezierPath.lineJoinStyle = kCGLineJoinRound;
  
  [color setStroke];
  bezierPath.lineWidth = 5;
  [bezierPath stroke];
  
}



#pragma mark Generate Images

+ (UIImage*)imageForTab: (NSInteger)tab withColor: (UIColor*)color {

  switch (tab) {
    case 1:
      return [SMGGraphics imageOfBookWithColor:color];
      break;
    case 2:
      return [SMGGraphics imageOfQuoteWithColor:color];
    case 3:
      return [SMGGraphics imageOfSettingsWithColor:color];
    default:
      break;
  }
  return [SMGGraphics imageOfBook];
}


+ (UIImage*)imageOfBook
{
    if (_imageOfBook)
        return _imageOfBook;
    
    // default uses white
    UIColor* color = [UIColor whiteColor];
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [SMGGraphics drawBook:color];
    
    _imageOfBook = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfBook;
}

+ (UIImage*)imageOfQuote
{
    if (_imageOfQuote)
        return _imageOfQuote;
    
    // default uses white
    UIColor* color = [UIColor whiteColor];
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [SMGGraphics drawQuote:color];
    
    _imageOfQuote= UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfQuote;
}

+ (UIImage*)imageOfSettings
{
    if (_imageOfSettings)
        return _imageOfSettings;
    
    // default uses white
    UIColor* color = [UIColor whiteColor];
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [SMGGraphics drawSettings:color];
    
    _imageOfSettings= UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfSettings;
}

+ (UIImage*)imageOfShare
{
  if (_imageOfShare)
    return _imageOfShare;
  
  // default uses white
  UIColor* color = [UIColor whiteColor];
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawShare:color];
  
  _imageOfShare= UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfShare;
}

+ (UIImage*)imageOfChapters
{
  if (_imageOfChapters)
    return _imageOfChapters;
  
  // default uses white
  UIColor* color = [UIColor whiteColor];
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawChapters:color];
  
  _imageOfChapters= UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfChapters;
}

+ (UIImage*)imageOfCloseChapters
{
  if (_imageOfCloseChapters)
    return _imageOfCloseChapters;
  
  // default uses white
  UIColor* color = [UIColor whiteColor];
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawCloseChapters:color];
  
  _imageOfCloseChapters= UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfCloseChapters;
}


+ (UIImage*)imageOfBookWithColor: (UIColor*) color
{
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [SMGGraphics drawBook:color];
    
    _imageOfBook = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfBook;
}

+ (UIImage*)imageOfBigBookWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(163, 165), NO, 0.0f);
  [SMGGraphics drawBigBook:color];
  
  _imageOfBigBook = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfBigBook;
}



+ (UIImage*)imageOfQuoteWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawQuote:color];
  
  _imageOfQuote = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfQuote;
}

+ (UIImage*)imageOfBigQuoteWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(175, 132), NO, 0.0f);
  [SMGGraphics drawBigQuote:color];
  
  _imageOfBigQuote = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfBigQuote;
}

+ (UIImage*)imageOfSettingsWithColor: (UIColor*) color
{
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [SMGGraphics drawSettings:color];
    
    _imageOfSettings = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfSettings;
}

+ (UIImage*)imageOfBigSettingsWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(163, 107), NO, 0.0f);
  [SMGGraphics drawBigSettings:color];
  
  _imageOfBigSettings = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfBigSettings;
}


+ (UIImage*)imageOfShareWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawShare:color];
  
  _imageOfShare = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfShare;
}

+ (UIImage*)imageOfChaptersWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawChapters:color];
  
  _imageOfChapters = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfChapters;
}

+ (UIImage*)imageOfCloseChaptersWithColor: (UIColor*) color
{
  
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
  [SMGGraphics drawCloseChapters:color];
  
  _imageOfCloseChapters = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return _imageOfCloseChapters;
}


@end