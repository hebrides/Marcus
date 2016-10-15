//
//  SMGHorizontalPickerView.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 6/11/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//
//  Forked from:
//  V8HorizontalPickerView by Shawn Veader: https://github.com/veader/V8HorizontalPickerView/
//


#import <UIKit/UIKit.h>
#import "SMGHorizontalPickerViewProtocol.h"

// position of indicator view, if shown
typedef enum {
  SMGHorizontalPickerIndicatorBottom = 0,
  SMGHorizontalPickerIndicatorTop
} SMGHorizontalPickerIndicatorPosition;



@interface SMGHorizontalPickerView : UIView <UIScrollViewDelegate> { }

// delegate and datasources to feed scroll view. this view only maintains a weak reference to these
@property (nonatomic, weak) IBOutlet id <SMGHorizontalPickerViewDataSource> dataSource;
@property (nonatomic, weak) IBOutlet id <SMGHorizontalPickerViewDelegate> delegate;

@property (nonatomic, readonly) NSInteger numberOfElements;
@property (nonatomic, readonly) NSInteger currentSelectedIndex;

// what font to use for the element labels?
@property (nonatomic, strong) UIFont *elementFont;

// color of labels used in picker
@property (nonatomic, strong) UIColor *textColor;
@property (nonatomic, strong) UIColor *selectedTextColor; // color of current selected element

// the point, defaults to center of view, where the selected element sits
@property (nonatomic, assign) CGPoint selectionPoint;
@property (nonatomic, strong) UIView *selectionIndicatorView;

@property (nonatomic, assign) SMGHorizontalPickerIndicatorPosition indicatorPosition;

// views to display on edges of picker (eg: gradients, etc)
@property (nonatomic, strong) UIView *leftEdgeView;
@property (nonatomic, strong) UIView *rightEdgeView;

// views for left and right of scrolling area
@property (nonatomic, strong) UIView *leftScrollEdgeView;
@property (nonatomic, strong) UIView *rightScrollEdgeView;

// padding for left/right scroll edge views
@property (nonatomic, assign) CGFloat scrollEdgeViewPadding;

// index for multiple instances of object
@property (nonatomic, assign) NSUInteger pickerInstanceNumber;

// use this property to store open or closed state (if implementing such...)
@property (nonatomic, assign) BOOL opened;

- (void)reloadData;
- (void)scrollToElement:(NSInteger)index animated:(BOOL)animate;

@end


// sub-class of UILabel that knows how to change its state
@interface SMGHorizontalPickerLabel : UILabel <SMGHorizontalPickerElementState> { }

@property (nonatomic, assign) BOOL selectedElement;
@property (nonatomic, strong) UIColor *selectedStateColor;
@property (nonatomic, strong) UIColor *normalStateColor;

@end