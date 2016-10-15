//
//  SMGHorizontalPickerViewProtocol.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 6/12/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//
//  Forked from:
//  V8HorizontalPickerView by Shawn Veader: https://github.com/veader/V8HorizontalPickerView/
//

@class SMGHorizontalPickerView;

// ------------------------------------------------------------------
// SMGHorizontalPickerView DataSource Protocol
@protocol SMGHorizontalPickerViewDataSource <NSObject>
@required
// data source is responsible for reporting how many elements there are
- (NSInteger)numberOfElementsInHorizontalPickerView:(SMGHorizontalPickerView *)picker;
@end


// ------------------------------------------------------------------
// SMGHorizontalPickerView Delegate Protocol
@protocol SMGHorizontalPickerViewDelegate <NSObject>

@optional
// delegate callback to notify delegate selected element has changed
- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker didSelectElementAtIndex:(NSInteger)index;

// delegate callback to notify delegate long press detected at element
- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker longPressDetectedAtIndex:(NSInteger)index;

// delegate callback to notify delegate of content offset of the picker
- (void) horizontalPickerView:(SMGHorizontalPickerView *)picker contentOffset: (CGPoint) offset;

// one of these two methods must be defined
- (NSString *)horizontalPickerView:(SMGHorizontalPickerView *)picker titleForElementAtIndex:(NSInteger)index;
- (UIView *)horizontalPickerView:(SMGHorizontalPickerView *)picker viewForElementAtIndex:(NSInteger)index;
// any view returned from this must confirm to the SMGHorizontalPickerElementState protocol

@required
// delegate is responsible for reporting the size of each element
- (NSInteger)horizontalPickerView:(SMGHorizontalPickerView *)picker widthForElementAtIndex:(NSInteger)index;

@end

// ------------------------------------------------------------------
// SMGHorizontalPickerElementState Protocol
@protocol SMGHorizontalPickerElementState <NSObject>
@required
// element views should know how display themselves based on selected status
- (void)setSelectedElement:(BOOL)selected;
@end