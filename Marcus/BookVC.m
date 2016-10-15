//
//  BookVC.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/4/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "BookVC.h"
#import "SMGHorizontalPickerView.h"
#import <DTCoreText/DTAttributedTextView.h>
#import <DTCoreText/NSAttributedString+HTML.h>


@interface BookVC () <SMGHorizontalPickerViewDelegate, SMGHorizontalPickerViewDataSource, UIScrollViewDelegate>

@property (nonatomic) BOOL userDraggingScrollView;
@property (nonatomic) BOOL animatingHeaderFooter;
@property (nonatomic) BOOL headerFooterVisible;
@property (nonatomic, strong) SMGHorizontalPickerView* chaptersMenu;
@property (nonatomic, strong) SMGHorizontalPickerView* versesMenu;
@property (nonatomic, strong) UIView* shadowView;
@property (nonatomic, strong) NSMutableArray* chapters;
@property (nonatomic, strong) NSMutableArray* verses;
@property (nonatomic, strong) DTAttributedTextView* bookView;



@end

@implementation BookVC

- (id)initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle {
  
  if (self = [super initWithTabTitle:tabTitle headerTitle:headerTitle]) {
    [self setUpBookView];
    
  } else NSLog(@"BookVC Init Fail");
  return self;
}

- (void)setUpBookView {

  //
  // Make Book View
  // --------------
  NSData *htmlData = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"meditations-book-lang-english-classic" ofType:@"html"]];
  _bookView = [[DTAttributedTextView alloc] initWithFrame:BOUNDS];
  _bookView.delegate = self;
  _bookView.backgroundColor = [UIColor clearColor];
  NSMutableAttributedString* attrStr = [[NSMutableAttributedString alloc] initWithHTMLData:htmlData documentAttributes:nil];
  // Style read from HTML data, can be changed via below method
  // [attrStr addAttribute:NSFontAttributeName value:[UIFont fontWithName:@"Helvetica Neue" size:15] range:NSMakeRange(0, attrStr.length)];
  _bookView.attributedString = attrStr;
  _bookView.userInteractionEnabled = YES;

  
  //
  // Make BG Image
  // -------------
  UIImage* bookImage = [SMGGraphics imageOfBigBookWithColor:[SMGGraphics Gray31]];
  CGRect bookImageFrame = CGRectMake( (BOUNDS.size.width-163)/2, ((BOUNDS.size.height-175)/2)-(BOUNDS.size.height/18) , 163, 165);
  UIImageView* bookImageView = [[UIImageView alloc] initWithFrame:bookImageFrame];
  bookImageView.image = bookImage;
  
  //
  // Add BookView & background image to VC
  // -------------------------------------
  [self.view insertSubview: bookImageView atIndex:0];
  //[self.view insertSubview: _bookWV atIndex:1];
  [self.view insertSubview: _bookView atIndex:1];

  //
  // Make Chapters Opener Button
  // ---------------------------
  [self.viewHeader.leftButton setTintColor:[UIColor whiteColor]];
  [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal];

  // Intended to make the left edge of the button spaced from the left edge of the device window exactly the height inset (Paint Code icons are 25.0 canvas size)
  [self.viewHeader.leftButton setImageEdgeInsets: UIEdgeInsetsMake(0,  (25.0 - self.viewHeader.frame.size.height), 0, 0)];
  // Share Action
  [self.viewHeader.leftButton addTarget:self action:@selector(animateChaptersMenuOpenClose) forControlEvents:UIControlEventTouchUpInside];
  
  //self.viewHeader.backgroundColor = [UIColor blueColor]; // debugging
  
  //
  // Make Chapters Menu
  // ------------------
  _chaptersMenu = [[SMGHorizontalPickerView alloc] initWithFrame: CGRectMake(0, 0, BOUNDS.size.width, self.viewHeader.frame.size.height*.8)];
  _chaptersMenu.elementFont = [UIFont systemFontOfSize:14.0f];
  _chaptersMenu.backgroundColor   = [SMGGraphics Gray33];
  _chaptersMenu.selectedTextColor = [SMGGraphics Blue22AADD];
  _chaptersMenu.textColor = [UIColor whiteColor];
  _chaptersMenu.selectionPoint = CGPointMake(_chaptersMenu.frame.size.width/2, 0);
  
  // Fix this
  _chapters = [NSMutableArray arrayWithObjects:@"I", @"II", @"III", @"IV", @"V", @"VI", @"VII", @"VIII", @"IX", @"X", @"XI", @"XII", nil];
  _chaptersMenu.delegate = self; _chaptersMenu.dataSource = self;
  
  //
  // Make Verses Menu
  // ----------------
  _versesMenu = [[SMGHorizontalPickerView alloc] initWithFrame: CGRectMake(0,0, BOUNDS.size.width, _chaptersMenu.frame.size.height)];
  _versesMenu.elementFont = [UIFont systemFontOfSize:14.0f];
  _versesMenu.backgroundColor   = [SMGGraphics Gray33];
  _versesMenu.selectedTextColor = [SMGGraphics Blue22AADD];
  _versesMenu.textColor = [UIColor whiteColor];
  _versesMenu.selectionPoint = _chaptersMenu.selectionPoint;
  _versesMenu.delegate = self; _versesMenu.dataSource = self;
  
  //
  // Make Picker Menu Shadow
  // -----------------------
  _shadowView = [[UIView alloc] initWithFrame: CGRectMake(0,0, BOUNDS.size.width, _chaptersMenu.frame.size.height)];
  _shadowView.backgroundColor = [SMGGraphics Gray33];
  _shadowView.clipsToBounds = NO;
  _shadowView.layer.shadowColor = [[UIColor blackColor] CGColor];
  _shadowView.layer.shadowOpacity = 0.13;
  _shadowView.layer.shadowRadius = 4.0;
  _shadowView.layer.shadowOffset = CGSizeMake(0.0f, 7.0f);
  _shadowView.layer.shadowPath = [UIBezierPath bezierPathWithRect: _chaptersMenu.bounds].CGPath;
  
  //
  // Make Bottom Lines for Picker Menu Views  <-- Note: Replace these lineviews with CALayers
  // ---------------------------------------
  UIView *chaptersMenuBottomLine = [[UIView alloc] initWithFrame:CGRectMake(0, _chaptersMenu.frame.size.height-1, _chaptersMenu.frame.size.width, 1)];
  UIView *versesMenuBottomLine = [[UIView alloc] initWithFrame:chaptersMenuBottomLine.frame];
  chaptersMenuBottomLine.backgroundColor = [SMGGraphics Gray66];
  versesMenuBottomLine.backgroundColor = [SMGGraphics Gray66];
 
  //
  // Put Menu Views Together
  // -----------------------
  [_versesMenu insertSubview:_shadowView atIndex:0];
  [_versesMenu insertSubview: versesMenuBottomLine atIndex:2];

  [_chaptersMenu insertSubview:_versesMenu atIndex:0];
  [_chaptersMenu insertSubview: chaptersMenuBottomLine atIndex:2];
  //[_chaptersMenu addSubview: chaptersLabel];

  //
  // Add Menu
  // --------
  [self.view insertSubview:_chaptersMenu atIndex:2];
  //self.viewHeader.backgroundColor = [UIColor greenColor]; // debugging


  //
  // Record initial menu and header/footer states, reset picker to last viewed element
  // ---------------------------------------------------------------------------------
  _chaptersMenu.opened = NO;
  [_chaptersMenu scrollToElement:0 animated:NO]; /*_lastViewedElement*/
  _animatingHeaderFooter = NO;
  _headerFooterVisible = YES;


}

- (void)scrollViewDidScroll: (DTAttributedTextView*)scrollView {
  NSLog(@"Scrolling");
  CGPoint translation = [scrollView.panGestureRecognizer translationInView:scrollView];
  NSLog(@"Translation X:%f, Y%f", translation.x, translation.y);
  
  // Check if user still dragging and check if already animating
  if (_userDraggingScrollView && _animatingHeaderFooter == NO) {
    // Detect direction by accessing x or y of translation
    if (translation.y < 1 && _headerFooterVisible == YES) {
      NSLog(@"UP! -- Animate AWAY header/footer");
      [self animateHeaderFooterOpenClose];
    }
    
    if (translation.y > 1 && _headerFooterVisible == NO) {
      NSLog(@"DOWN! -- Animate BACK header/footer");
      [self animateHeaderFooterOpenClose];
    }

  }

}

- (void)scrollViewWillBeginDragging: (DTAttributedTextView*)scrollView {
  NSLog(@"******* Begin Dragging Scrollview *********");
  _userDraggingScrollView = YES;
}

- (void)scrollViewDidEndDragging: (DTAttributedTextView*)scrollView willDecelerate: (BOOL) decelerate {
  NSLog(@"******* Finished Dragging Scrollview *********");
  _userDraggingScrollView = NO;
}

- (void)animateHeaderFooterOpenClose {
  _animatingHeaderFooter = YES;
  NSLog(@"Animating Header/Footer: More Room to Read!!");

  //
  // Get current frame, check if menu open, assign open and closed menu states
  // -------------------------------------------------------------------------
  CGRect headerCurrentFrame = self.viewHeader.frame;
  CGRect menuCurrentFrame = _chaptersMenu.frame;
  
  // OffsetY is how far the menu moves up or down
  CGFloat headerOffsetY = self.viewHeader.frame.size.height + 1 /*1 = bottom border line*/;
  CGFloat menuOffsetY = _chaptersMenu.frame.size.height + 1 /*1 = bottom border line*/;
  CGFloat newHeaderOffsetY = (_headerFooterVisible)? -headerOffsetY : headerOffsetY;
  CGFloat newMenuOffsetY = (_headerFooterVisible)? -menuOffsetY : menuOffsetY;
  BOOL footerVisible = (_headerFooterVisible)? YES : NO;

  //
  // Animate Header/Footer
  // ---------------------
  
  // Handle Menus
  /*
   Logic for accordian-style closing of chapter and verses menus, then closing of header/footer:
      
    closeMenus(array theMenus):
      array allmenus;
      for each menu in allmenus:
        if menu.open:
          transaction:
            closemenu;
          completion: continue;

      closeheaderfooter;
  */
  
  
  /* 
   Logic for moving any view to a before and after state
  
   moveView(currentFrame, offSetX, offSetY, {completion}):
   
  */
  
  
  if (_chaptersMenu.opened) {
    [CATransaction begin];
    [CATransaction setCompletionBlock:^{
      // Menu animation has finished
      NSLog(@"Done tucking away the menus :-) !!!!");
      [APPDELEGATE.tabBarController setTabBarHidden:footerVisible animated: YES];
      [UIView animateWithDuration:0.35 animations:^{
        self.viewHeader.frame = CGRectOffset(headerCurrentFrame, 0, newHeaderOffsetY);
        _chaptersMenu.frame = CGRectOffset(menuCurrentFrame, 0, newMenuOffsetY);
      } completion:^(BOOL finished) {
        _headerFooterVisible = !_headerFooterVisible;
        _animatingHeaderFooter = NO;
      }];

    }];
    [self animateChaptersMenuOpenClose];
    [CATransaction commit];
    
  } else {
    [APPDELEGATE.tabBarController setTabBarHidden:footerVisible animated: YES];
    [UIView animateWithDuration:0.35 animations:^{
      self.viewHeader.frame = CGRectOffset(headerCurrentFrame, 0, newHeaderOffsetY);
      _chaptersMenu.frame = CGRectOffset(menuCurrentFrame, 0, newMenuOffsetY);
    } completion:^(BOOL finished) {
      _headerFooterVisible = !_headerFooterVisible;
      _animatingHeaderFooter = NO;
    }];
  }
  
}

- (void)animateChaptersMenuOpenClose {
  
  (_chaptersMenu.opened)?  [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal] : [self.viewHeader.leftButton setImage:[SMGGraphics imageOfCloseChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal] ;
  
  self.viewHeader.leftButton.userInteractionEnabled = NO;
  NSLog(@"#Animating chapters menu#");
  NSLog(@"### menu Y = %f ###", _chaptersMenu.frame.origin.y);

  //
  // Get current frame, check if menu open, assign open and closed menu states
  // -------------------------------------------------------------------------
  CGRect menuCurrentFrame = _chaptersMenu.frame;
  
  // OffsetY is how far the menu moves up or down
  CGFloat offsetY = self.viewHeader.frame.size.height;
  CGFloat newOffsetY = (_chaptersMenu.opened)? -offsetY : offsetY;
  //CGFloat newAlpha = (_chaptersMenu.opened)? 0.0 : 1.0;
  
  //
  // Animate Chapters Menu
  // ---------------------
  [UIView animateWithDuration:0.35 animations:^{
    _chaptersMenu.frame = CGRectOffset(menuCurrentFrame, 0, newOffsetY);
    } completion:^(BOOL finished) {
    _chaptersMenu.opened = !_chaptersMenu.opened;
        self.viewHeader.leftButton.userInteractionEnabled = YES;
  }];

}

- (void)animateVersesMenuOpenClose {
  
 // (_chaptersMenu.opened)?  [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal] : [self.viewHeader.leftButton setImage:[SMGGraphics imageOfCloseChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal] ;
  

  
  _chaptersMenu.userInteractionEnabled = NO;
  NSLog(@"#Animating verses menu#");
  NSLog(@"### menu Y = %f ###", _versesMenu.frame.origin.y);
  
  //
  // Get current frame, check if menu open, assign open and closed menu states
  // -------------------------------------------------------------------------
  CGRect menuCurrentFrame = _versesMenu.frame;
  
  // OffsetY is how far the menu moves up or down
  CGFloat offsetY = _versesMenu.frame.size.height;
  CGFloat newOffsetY = (_versesMenu.opened)? -offsetY : offsetY;
  //CGFloat newAlpha = (_chaptersMenu.opened)? 0.0 : 1.0;
  
  //
  // Animate Verses Menu
  // -------------------
  [UIView animateWithDuration:0.35 animations:^{
    _versesMenu.frame = CGRectOffset(menuCurrentFrame, 0, newOffsetY);
  } completion:^(BOOL finished) {
    _versesMenu.opened = !_versesMenu.opened;
    _chaptersMenu.userInteractionEnabled = YES;
  }];
  
}

- (void)animateBookViewToRange:(NSRange)range  {

// [_bookView setContentOffset:CGPointMake(0, scrollPos) animated:animated];
  
  [_bookView scrollRangeToVisible:range animated:YES];
}



#pragma mark - HorizontalPickerView DataSource Methods
- (NSInteger)numberOfElementsInHorizontalPickerView:(SMGHorizontalPickerView *)picker {
  return [_chapters count];
}

#pragma mark - HorizontalPickerView Delegate Methods
- (NSString *)horizontalPickerView:(SMGHorizontalPickerView *)picker titleForElementAtIndex:(NSInteger)index {
  return [_chapters objectAtIndex:index];
}

- (NSInteger)horizontalPickerView:(SMGHorizontalPickerView *)picker widthForElementAtIndex:(NSInteger)index {
//  CGSize constrainedSize = CGSizeMake(MAXFLOAT, MAXFLOAT);
//  NSString *text = [_chapters objectAtIndex:index];
//  CGSize textSize = [text sizeWithFont:[UIFont systemFontOfSize:14.0f]
//                     constrainedToSize:constrainedSize
//                         lineBreakMode:UILineBreakModeWordWrap];
//  return textSize.width + 40.0f; // 20px padding on each side
  return 25.f;
}

- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker didSelectElementAtIndex:(NSInteger)index {
  [_bookView scrollToAnchorNamed:[NSString stringWithFormat:@"meditations-book-%li", index+1 ] animated:YES];
  NSLog (@"Selected index %ld", (long)index);
}

- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker longPressDetectedAtIndex:(NSInteger)index {
  NSLog (@"Delegate message: LongPress detected...");
  
  if (index == picker.currentSelectedIndex) {
    NSLog (@"on current index");
    if(!_versesMenu.opened) {[self populateVerses];}
    [self animateVersesMenuOpenClose];
  } else {NSLog(@"on new index");}
  
}

- (void)populateVerses {
    _verses = [NSMutableArray arrayWithObjects:@"I", @"II", @"III", @"IV", @"V", @"VI", @"VII", @"VIII", @"IX", @"X", @"XI", @"XII", nil];
}

- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker contentOffset: (CGPoint) offset {
  NSLog(@"Picker offset: %f", offset.x);
  // distance = distance between left end of chapter I label, and right end of chapter XII label
  // verticle offset = absolute horizontal offset (selectpoint minus relative offset)
  // x (height of verticle scollview / distance)
  
  float multiplier = _bookView.attributedTextContentView.frame.size.height/_chaptersMenu.frame.size.width;
  NSLog(@"%f", multiplier); // 198.621872 (this is too much because label I-XII a little shorter)
//  [_bookView setContentOffset:CGPointMake(0.,(offset.x+148)*168.621872) animated:YES];
}

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
  
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
