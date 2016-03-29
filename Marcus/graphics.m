//
//  Graphics.m
//  Marcus
//
//  Created by Marcus Lewis on 2/5/16.
//  Copyright (c) 2016 SMGMobile. All rights reserved.
//
//

#import "Graphics.h"


@implementation Graphics

#pragma mark Cache

static UIImage* _imageOfBook = nil;
static UIImage* _imageOfQuote = nil;
static UIImage* _imageOfSettings = nil;
#pragma mark Initialization

+ (void)initialize
{
}

#pragma mark Drawing Methods


//// www.paintcodeapp.com

+ (void)drawBook: (UIColor*) color {
    
    //// Bezier Drawing
    UIBezierPath* bezierPath = [UIBezierPath bezierPath];
    [bezierPath moveToPoint: CGPointMake(13.69, 8.54)];
    [bezierPath addLineToPoint: CGPointMake(13.69, 21.7)];
    [bezierPath addLineToPoint: CGPointMake(22.3, 15.57)];
    [bezierPath addLineToPoint: CGPointMake(22.3, 2.41)];
    [bezierPath addLineToPoint: CGPointMake(13.69, 8.54)];
    [bezierPath closePath];
    bezierPath.miterLimit = 4;
    
    bezierPath.lineCapStyle = kCGLineCapRound;
    
    bezierPath.lineJoinStyle = kCGLineJoinRound;
    
    [color setStroke];
    bezierPath.lineWidth = 1.0;
    [bezierPath stroke];    //// Bezier 2 Drawing
    UIBezierPath* bezier2Path = [UIBezierPath bezierPath];
    [bezier2Path moveToPoint: CGPointMake(11.69, 8.54)];
    [bezier2Path addLineToPoint: CGPointMake(11.69, 21.7)];
    [bezier2Path addLineToPoint: CGPointMake(3.08, 15.57)];
    [bezier2Path addLineToPoint: CGPointMake(3.08, 2.41)];
    [bezier2Path addLineToPoint: CGPointMake(11.69, 8.54)];
    [bezier2Path closePath];
    bezier2Path.miterLimit = 4;
    
    bezier2Path.lineCapStyle = kCGLineCapRound;
    
    bezier2Path.lineJoinStyle = kCGLineJoinRound;
    
    [color setStroke];
    bezier2Path.lineWidth = 1.0;
    [bezier2Path stroke];
    
}

+ (void)drawQuote: (UIColor*) color {
    //// PaintCode Trial Version
    //// www.paintcodeapp.com
    
    
    //// Bezier Drawing
    UIBezierPath* bezierPath = [UIBezierPath bezierPath];
    [bezierPath moveToPoint: CGPointMake(22.34, 4.02)];
    [bezierPath addLineToPoint: CGPointMake(22.46, 4.16)];
    [bezierPath addCurveToPoint: CGPointMake(22.5, 4.36) controlPoint1: CGPointMake(22.49, 4.22) controlPoint2: CGPointMake(22.5, 4.29)];
    [bezierPath addLineToPoint: CGPointMake(22.5, 13.31)];
    [bezierPath addLineToPoint: CGPointMake(22.48, 13.55)];
    [bezierPath addLineToPoint: CGPointMake(22.41, 13.8)];
    [bezierPath addLineToPoint: CGPointMake(22.33, 14.04)];
    [bezierPath addLineToPoint: CGPointMake(22.21, 14.23)];
    [bezierPath addLineToPoint: CGPointMake(17.45, 21.14)];
    [bezierPath addLineToPoint: CGPointMake(17.29, 21.31)];
    [bezierPath addCurveToPoint: CGPointMake(17.07, 21.44) controlPoint1: CGPointMake(17.22, 21.36) controlPoint2: CGPointMake(17.15, 21.41)];
    [bezierPath addLineToPoint: CGPointMake(16.83, 21.53)];
    [bezierPath addLineToPoint: CGPointMake(16.58, 21.54)];
    [bezierPath addLineToPoint: CGPointMake(13.79, 21.44)];
    [bezierPath addLineToPoint: CGPointMake(13.57, 21.4)];
    [bezierPath addLineToPoint: CGPointMake(13.42, 21.28)];
    [bezierPath addLineToPoint: CGPointMake(13.34, 21.12)];
    [bezierPath addCurveToPoint: CGPointMake(13.34, 20.94) controlPoint1: CGPointMake(13.33, 21.06) controlPoint2: CGPointMake(13.33, 21)];
    [bezierPath addLineToPoint: CGPointMake(15.17, 14.31)];
    [bezierPath addLineToPoint: CGPointMake(15.17, 14.13)];
    [bezierPath addCurveToPoint: CGPointMake(15.08, 13.96) controlPoint1: CGPointMake(15.16, 14.06) controlPoint2: CGPointMake(15.13, 14.01)];
    [bezierPath addCurveToPoint: CGPointMake(14.93, 13.87) controlPoint1: CGPointMake(15.04, 13.92) controlPoint2: CGPointMake(14.99, 13.89)];
    [bezierPath addLineToPoint: CGPointMake(14.73, 13.83)];
    [bezierPath addLineToPoint: CGPointMake(11.55, 13.83)];
    [bezierPath addLineToPoint: CGPointMake(11.32, 13.8)];
    [bezierPath addLineToPoint: CGPointMake(11.15, 13.68)];
    [bezierPath addCurveToPoint: CGPointMake(11.02, 13.54) controlPoint1: CGPointMake(11.08, 13.63) controlPoint2: CGPointMake(11.04, 13.59)];
    [bezierPath addCurveToPoint: CGPointMake(10.97, 13.33) controlPoint1: CGPointMake(11, 13.47) controlPoint2: CGPointMake(10.97, 13.39)];
    [bezierPath addLineToPoint: CGPointMake(10.97, 4.38)];
    [bezierPath addCurveToPoint: CGPointMake(11.02, 4.18) controlPoint1: CGPointMake(10.97, 4.31) controlPoint2: CGPointMake(10.99, 4.24)];
    [bezierPath addCurveToPoint: CGPointMake(11.15, 4.04) controlPoint1: CGPointMake(11.04, 4.13) controlPoint2: CGPointMake(11.08, 4.08)];
    [bezierPath addCurveToPoint: CGPointMake(11.32, 3.91) controlPoint1: CGPointMake(11.2, 3.98) controlPoint2: CGPointMake(11.26, 3.93)];
    [bezierPath addLineToPoint: CGPointMake(11.55, 3.87)];
    [bezierPath addLineToPoint: CGPointMake(21.96, 3.87)];
    [bezierPath addLineToPoint: CGPointMake(22.19, 3.91)];
    [bezierPath addLineToPoint: CGPointMake(22.34, 4.02)];
    [bezierPath closePath];
    [bezierPath moveToPoint: CGPointMake(13.31, 13.92)];
    [bezierPath addLineToPoint: CGPointMake(10.09, 18.83)];
    [bezierPath addCurveToPoint: CGPointMake(9.93, 19) controlPoint1: CGPointMake(10.05, 18.9) controlPoint2: CGPointMake(9.99, 18.95)];
    [bezierPath addLineToPoint: CGPointMake(9.71, 19.14)];
    [bezierPath addLineToPoint: CGPointMake(9.47, 19.24)];
    [bezierPath addLineToPoint: CGPointMake(9.22, 19.25)];
    [bezierPath addLineToPoint: CGPointMake(6.43, 19.14)];
    [bezierPath addLineToPoint: CGPointMake(6.21, 19.1)];
    [bezierPath addLineToPoint: CGPointMake(6.06, 18.98)];
    [bezierPath addCurveToPoint: CGPointMake(5.97, 18.82) controlPoint1: CGPointMake(6.01, 18.94) controlPoint2: CGPointMake(5.99, 18.89)];
    [bezierPath addCurveToPoint: CGPointMake(5.97, 18.64) controlPoint1: CGPointMake(5.96, 18.76) controlPoint2: CGPointMake(5.96, 18.7)];
    [bezierPath addLineToPoint: CGPointMake(7.78, 12)];
    [bezierPath addCurveToPoint: CGPointMake(7.78, 11.81) controlPoint1: CGPointMake(7.8, 11.93) controlPoint2: CGPointMake(7.8, 11.87)];
    [bezierPath addCurveToPoint: CGPointMake(7.7, 11.64) controlPoint1: CGPointMake(7.77, 11.75) controlPoint2: CGPointMake(7.74, 11.69)];
    [bezierPath addLineToPoint: CGPointMake(7.54, 11.55)];
    [bezierPath addLineToPoint: CGPointMake(7.35, 11.51)];
    [bezierPath addLineToPoint: CGPointMake(4.17, 11.51)];
    [bezierPath addLineToPoint: CGPointMake(3.94, 11.47)];
    [bezierPath addLineToPoint: CGPointMake(3.76, 11.36)];
    [bezierPath addLineToPoint: CGPointMake(3.63, 11.21)];
    [bezierPath addCurveToPoint: CGPointMake(3.6, 11) controlPoint1: CGPointMake(3.61, 11.14) controlPoint2: CGPointMake(3.6, 11.08)];
    [bezierPath addLineToPoint: CGPointMake(3.6, 2.05)];
    [bezierPath addCurveToPoint: CGPointMake(3.63, 1.84) controlPoint1: CGPointMake(3.6, 1.98) controlPoint2: CGPointMake(3.61, 1.9)];
    [bezierPath addCurveToPoint: CGPointMake(3.76, 1.7) controlPoint1: CGPointMake(3.67, 1.79) controlPoint2: CGPointMake(3.71, 1.74)];
    [bezierPath addCurveToPoint: CGPointMake(3.94, 1.58) controlPoint1: CGPointMake(3.82, 1.65) controlPoint2: CGPointMake(3.87, 1.61)];
    [bezierPath addLineToPoint: CGPointMake(4.17, 1.54)];
    [bezierPath addLineToPoint: CGPointMake(14.58, 1.54)];
    [bezierPath addLineToPoint: CGPointMake(14.81, 1.58)];
    [bezierPath addLineToPoint: CGPointMake(14.98, 1.7)];
    [bezierPath addLineToPoint: CGPointMake(15.1, 1.84)];
    [bezierPath addCurveToPoint: CGPointMake(15.15, 2.05) controlPoint1: CGPointMake(15.13, 1.9) controlPoint2: CGPointMake(15.15, 1.97)];
    [bezierPath addLineToPoint: CGPointMake(15.17, 3.82)];
    bezierPath.miterLimit = 4;
    
    bezierPath.lineCapStyle = kCGLineCapRound;
    
    bezierPath.lineJoinStyle = kCGLineJoinRound;
    
    [color setStroke];
    bezierPath.lineWidth = 1;
    [bezierPath stroke];

    
}

+ (void)drawSettings: (UIColor*) color {

    UIBezierPath* aPath = [UIBezierPath bezierPath];
    [aPath moveToPoint: CGPointMake(19.67, 1.58)];
    [aPath addCurveToPoint: CGPointMake(20, 1.06) controlPoint1: CGPointMake(19.8, 1.46) controlPoint2: CGPointMake(19.9, 1.28)];
    [aPath addCurveToPoint: CGPointMake(17.77, 1.1) controlPoint1: CGPointMake(19.28, 1.06) controlPoint2: CGPointMake(18.53, 1.07)];
    [aPath addCurveToPoint: CGPointMake(17, 1.31) controlPoint1: CGPointMake(17.54, 1.17) controlPoint2: CGPointMake(17.28, 1.24)];
    [aPath addCurveToPoint: CGPointMake(15.08, 2.42) controlPoint1: CGPointMake(16.28, 1.47) controlPoint2: CGPointMake(15.64, 1.84)];
    [aPath addCurveToPoint: CGPointMake(13.95, 4.36) controlPoint1: CGPointMake(14.54, 2.94) controlPoint2: CGPointMake(14.16, 3.58)];
    [aPath addCurveToPoint: CGPointMake(13.99, 6.75) controlPoint1: CGPointMake(13.71, 5.12) controlPoint2: CGPointMake(13.72, 5.92)];
    [aPath addCurveToPoint: CGPointMake(13.86, 7.19) controlPoint1: CGPointMake(14.03, 6.92) controlPoint2: CGPointMake(14, 7.07)];
    [aPath addLineToPoint: CGPointMake(12.09, 8.97)];
    [aPath addLineToPoint: CGPointMake(10.38, 10.69)];
    [aPath addLineToPoint: CGPointMake(3.08, 17.99)];
    [aPath addCurveToPoint: CGPointMake(2.52, 19.4) controlPoint1: CGPointMake(2.71, 18.4) controlPoint2: CGPointMake(2.52, 18.86)];
    [aPath addCurveToPoint: CGPointMake(3.01, 20.79) controlPoint1: CGPointMake(2.51, 19.92) controlPoint2: CGPointMake(2.67, 20.38)];
    [aPath addCurveToPoint: CGPointMake(4.39, 21.57) controlPoint1: CGPointMake(3.4, 21.25) controlPoint2: CGPointMake(3.85, 21.51)];
    [aPath addCurveToPoint: CGPointMake(5.82, 21.25) controlPoint1: CGPointMake(4.95, 21.63) controlPoint2: CGPointMake(5.42, 21.52)];
    [aPath addCurveToPoint: CGPointMake(6.53, 20.63) controlPoint1: CGPointMake(6.1, 21.05) controlPoint2: CGPointMake(6.34, 20.85)];
    [aPath addLineToPoint: CGPointMake(12.78, 14.37)];
    [aPath addLineToPoint: CGPointMake(15.79, 11.36)];
    [aPath addLineToPoint: CGPointMake(15.79, 11.36)];
    [aPath addLineToPoint: CGPointMake(15.9, 11.25)];
    [aPath addLineToPoint: CGPointMake(16.56, 10.59)];
    [aPath addCurveToPoint: CGPointMake(16.86, 10.29) controlPoint1: CGPointMake(16.65, 10.47) controlPoint2: CGPointMake(16.76, 10.37)];
    [aPath addCurveToPoint: CGPointMake(17.38, 10.15) controlPoint1: CGPointMake(17, 10.13) controlPoint2: CGPointMake(17.17, 10.09)];
    [aPath addCurveToPoint: CGPointMake(19.45, 10.29) controlPoint1: CGPointMake(18.03, 10.36) controlPoint2: CGPointMake(18.73, 10.41)];
    [aPath addCurveToPoint: CGPointMake(21.25, 9.46) controlPoint1: CGPointMake(20.1, 10.16) controlPoint2: CGPointMake(20.7, 9.87)];
    [aPath addCurveToPoint: CGPointMake(22.53, 7.89) controlPoint1: CGPointMake(21.81, 9.05) controlPoint2: CGPointMake(22.24, 8.53)];
    [aPath addCurveToPoint: CGPointMake(22.99, 6.5) controlPoint1: CGPointMake(22.75, 7.42) controlPoint2: CGPointMake(22.91, 6.96)];
    [aPath addCurveToPoint: CGPointMake(23.14, 5.04) controlPoint1: CGPointMake(23.06, 5.99) controlPoint2: CGPointMake(23.11, 5.5)];
    [aPath addCurveToPoint: CGPointMake(23.08, 4.44) controlPoint1: CGPointMake(23.15, 4.84) controlPoint2: CGPointMake(23.13, 4.64)];
    [aPath addCurveToPoint: CGPointMake(22.71, 4.29) controlPoint1: CGPointMake(23.03, 4.19) controlPoint2: CGPointMake(22.91, 4.15)];
    [aPath addCurveToPoint: CGPointMake(22.5, 4.5) controlPoint1: CGPointMake(22.63, 4.36) controlPoint2: CGPointMake(22.56, 4.44)];
    [aPath addCurveToPoint: CGPointMake(20.98, 6.03) controlPoint1: CGPointMake(21.99, 5.02) controlPoint2: CGPointMake(21.48, 5.52)];
    [aPath addCurveToPoint: CGPointMake(19.73, 6.56) controlPoint1: CGPointMake(20.65, 6.33) controlPoint2: CGPointMake(20.24, 6.51)];
    [aPath addCurveToPoint: CGPointMake(18.46, 6.3) controlPoint1: CGPointMake(19.26, 6.61) controlPoint2: CGPointMake(18.82, 6.53)];
    [aPath addCurveToPoint: CGPointMake(17.64, 5.41) controlPoint1: CGPointMake(18.07, 6.11) controlPoint2: CGPointMake(17.8, 5.82)];
    [aPath addCurveToPoint: CGPointMake(17.55, 4.24) controlPoint1: CGPointMake(17.53, 5.03) controlPoint2: CGPointMake(17.5, 4.64)];
    [aPath addCurveToPoint: CGPointMake(18.13, 3.12) controlPoint1: CGPointMake(17.62, 3.8) controlPoint2: CGPointMake(17.81, 3.43)];
    [aPath addCurveToPoint: CGPointMake(19.67, 1.58) controlPoint1: CGPointMake(18.66, 2.6) controlPoint2: CGPointMake(19.16, 2.09)];
    [aPath closePath];
    [aPath moveToPoint: CGPointMake(12.8, 14.37)];
    [aPath addCurveToPoint: CGPointMake(12.85, 14.47) controlPoint1: CGPointMake(12.83, 14.4) controlPoint2: CGPointMake(12.84, 14.44)];
    [aPath addCurveToPoint: CGPointMake(12.97, 15.09) controlPoint1: CGPointMake(12.87, 14.77) controlPoint2: CGPointMake(12.91, 14.98)];
    [aPath addCurveToPoint: CGPointMake(13.2, 15.5) controlPoint1: CGPointMake(13.04, 15.24) controlPoint2: CGPointMake(13.12, 15.38)];
    [aPath addCurveToPoint: CGPointMake(13.72, 16.09) controlPoint1: CGPointMake(13.37, 15.7) controlPoint2: CGPointMake(13.55, 15.9)];
    [aPath addCurveToPoint: CGPointMake(13.74, 16.11) controlPoint1: CGPointMake(13.72, 16.09) controlPoint2: CGPointMake(13.73, 16.1)];
    [aPath addCurveToPoint: CGPointMake(16.68, 19.08) controlPoint1: CGPointMake(15.38, 17.76) controlPoint2: CGPointMake(16.36, 18.75)];
    [aPath addCurveToPoint: CGPointMake(17.55, 19.95) controlPoint1: CGPointMake(16.95, 19.35) controlPoint2: CGPointMake(17.23, 19.63)];
    [aPath addCurveToPoint: CGPointMake(17.57, 19.97) controlPoint1: CGPointMake(17.56, 19.96) controlPoint2: CGPointMake(17.56, 19.97)];
    [aPath addCurveToPoint: CGPointMake(19.07, 21.47) controlPoint1: CGPointMake(18.04, 20.44) controlPoint2: CGPointMake(18.55, 20.94)];
    [aPath addCurveToPoint: CGPointMake(19.66, 21.63) controlPoint1: CGPointMake(19.23, 21.62) controlPoint2: CGPointMake(19.43, 21.67)];
    [aPath addCurveToPoint: CGPointMake(20.15, 21.46) controlPoint1: CGPointMake(19.82, 21.64) controlPoint2: CGPointMake(19.97, 21.57)];
    [aPath addCurveToPoint: CGPointMake(21.45, 20.15) controlPoint1: CGPointMake(20.52, 21.1) controlPoint2: CGPointMake(20.95, 20.67)];
    [aPath addCurveToPoint: CGPointMake(21.47, 20.13) controlPoint1: CGPointMake(21.46, 20.14) controlPoint2: CGPointMake(21.47, 20.14)];
    [aPath addCurveToPoint: CGPointMake(21.58, 20.02) controlPoint1: CGPointMake(21.5, 20.1) controlPoint2: CGPointMake(21.53, 20.05)];
    [aPath addLineToPoint: CGPointMake(22.62, 18.97)];
    [aPath addCurveToPoint: CGPointMake(22.9, 18.69) controlPoint1: CGPointMake(22.72, 18.87) controlPoint2: CGPointMake(22.81, 18.78)];
    [aPath addCurveToPoint: CGPointMake(23.06, 18.21) controlPoint1: CGPointMake(23.01, 18.52) controlPoint2: CGPointMake(23.06, 18.35)];
    [aPath addCurveToPoint: CGPointMake(22.92, 17.61) controlPoint1: CGPointMake(23.11, 17.97) controlPoint2: CGPointMake(23.06, 17.77)];
    [aPath addCurveToPoint: CGPointMake(21.42, 16.11) controlPoint1: CGPointMake(22.39, 17.1) controlPoint2: CGPointMake(21.88, 16.6)];
    [aPath addCurveToPoint: CGPointMake(21.4, 16.09) controlPoint1: CGPointMake(21.41, 16.1) controlPoint2: CGPointMake(21.4, 16.1)];
    [aPath addCurveToPoint: CGPointMake(20.53, 15.23) controlPoint1: CGPointMake(21.08, 15.78) controlPoint2: CGPointMake(20.8, 15.49)];
    [aPath addCurveToPoint: CGPointMake(17.56, 12.28) controlPoint1: CGPointMake(20.21, 14.9) controlPoint2: CGPointMake(19.22, 13.92)];
    [aPath addCurveToPoint: CGPointMake(17.55, 12.27) controlPoint1: CGPointMake(17.55, 12.27) controlPoint2: CGPointMake(17.55, 12.27)];
    [aPath addCurveToPoint: CGPointMake(16.96, 11.75) controlPoint1: CGPointMake(17.36, 12.09) controlPoint2: CGPointMake(17.16, 11.92)];
    [aPath addCurveToPoint: CGPointMake(16.55, 11.52) controlPoint1: CGPointMake(16.83, 11.67) controlPoint2: CGPointMake(16.7, 11.58)];
    [aPath addCurveToPoint: CGPointMake(15.93, 11.41) controlPoint1: CGPointMake(16.44, 11.46) controlPoint2: CGPointMake(16.23, 11.42)];
    [aPath addCurveToPoint: CGPointMake(15.83, 11.36) controlPoint1: CGPointMake(15.89, 11.39) controlPoint2: CGPointMake(15.87, 11.38)];
    [aPath addLineToPoint: CGPointMake(15.94, 11.25)];
    [aPath moveToPoint: CGPointMake(12.12, 8.96)];
    [aPath addCurveToPoint: CGPointMake(8.11, 5.02) controlPoint1: CGPointMake(10.18, 7.04) controlPoint2: CGPointMake(8.84, 5.73)];
    [aPath addCurveToPoint: CGPointMake(7.6, 4.28) controlPoint1: CGPointMake(7.93, 4.87) controlPoint2: CGPointMake(7.76, 4.62)];
    [aPath addCurveToPoint: CGPointMake(7.43, 3.88) controlPoint1: CGPointMake(7.52, 4.1) controlPoint2: CGPointMake(7.47, 3.97)];
    [aPath addCurveToPoint: CGPointMake(7.29, 3.45) controlPoint1: CGPointMake(7.36, 3.72) controlPoint2: CGPointMake(7.32, 3.58)];
    [aPath addCurveToPoint: CGPointMake(6.07, 1.91) controlPoint1: CGPointMake(7.08, 2.81) controlPoint2: CGPointMake(6.67, 2.29)];
    [aPath addCurveToPoint: CGPointMake(5.14, 1.35) controlPoint1: CGPointMake(5.72, 1.69) controlPoint2: CGPointMake(5.41, 1.5)];
    [aPath addCurveToPoint: CGPointMake(4.39, 0.82) controlPoint1: CGPointMake(4.89, 1.15) controlPoint2: CGPointMake(4.63, 0.98)];
    [aPath addCurveToPoint: CGPointMake(3.95, 0.64) controlPoint1: CGPointMake(4.21, 0.69) controlPoint2: CGPointMake(4.06, 0.62)];
    [aPath addCurveToPoint: CGPointMake(3.57, 0.9) controlPoint1: CGPointMake(3.85, 0.64) controlPoint2: CGPointMake(3.73, 0.73)];
    [aPath addCurveToPoint: CGPointMake(3.41, 1.05) controlPoint1: CGPointMake(3.49, 0.97) controlPoint2: CGPointMake(3.44, 1.01)];
    [aPath addLineToPoint: CGPointMake(2.38, 2.12)];
    [aPath addCurveToPoint: CGPointMake(2.21, 2.3) controlPoint1: CGPointMake(2.29, 2.21) controlPoint2: CGPointMake(2.23, 2.27)];
    [aPath addCurveToPoint: CGPointMake(2.14, 2.5) controlPoint1: CGPointMake(2.15, 2.37) controlPoint2: CGPointMake(2.13, 2.43)];
    [aPath addCurveToPoint: CGPointMake(2.31, 2.95) controlPoint1: CGPointMake(2.12, 2.62) controlPoint2: CGPointMake(2.19, 2.77)];
    [aPath addCurveToPoint: CGPointMake(2.84, 3.68) controlPoint1: CGPointMake(2.42, 3.11) controlPoint2: CGPointMake(2.6, 3.35)];
    [aPath addCurveToPoint: CGPointMake(3.41, 4.6) controlPoint1: CGPointMake(2.91, 3.8) controlPoint2: CGPointMake(3.1, 4.11)];



    [aPath closePath];
    aPath.miterLimit = 4;
    
    aPath.lineCapStyle = kCGLineCapRound;
    
    aPath.lineJoinStyle = kCGLineJoinRound;
    
    [color setStroke];
    aPath.lineWidth = 1;
    [aPath stroke];

}


#pragma mark Generated Images

+ (UIImage*)imageOfBook
{
    if (_imageOfBook)
        return _imageOfBook;
    
    // default uses white
    UIColor* color = [UIColor whiteColor];
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [Graphics drawBook:color];
    
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
    [Graphics drawQuote:color];
    
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
    [Graphics drawSettings:color];
    
    _imageOfSettings= UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfSettings;
}

#pragma mark Customization Infrastructure

- (void)setBookTargets: (NSArray*)bookTargets
{
    _bookTargets = bookTargets;
    
    for (id target in self.bookTargets)
        [target performSelector: @selector(setImage:) withObject: Graphics.imageOfBook];
}

- (void)setQuoteTargets: (NSArray*)quoteTargets
{
    _quoteTargets = quoteTargets;
    
    for (id target in self.quoteTargets)
        [target performSelector: @selector(setImage:) withObject: Graphics.imageOfQuote];
}
- (void)setSettingsTargets: (NSArray*)settingsTargets
{
    _settingsTargets = settingsTargets;
    
    for (id target in self.settingsTargets)
        [target performSelector: @selector(setImage:) withObject: Graphics.imageOfSettings];
}


+ (UIImage*)imageOfBookWithColor: (UIColor*) color
{
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [Graphics drawBook:color];
    
    _imageOfBook = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfBook;
}

+ (UIImage*)imageOfQuoteWithColor: (UIColor*) color
{
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [Graphics drawQuote:color];
    
    _imageOfQuote = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfQuote;
}

+ (UIImage*)imageOfSettingsWithColor: (UIColor*) color
{
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(25, 25), NO, 0.0f);
    [Graphics drawSettings:color];
    
    _imageOfSettings = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return _imageOfSettings;
}





@end