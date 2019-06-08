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

typedef NS_ENUM(NSInteger, menuState) {
  onceDown,
  onceUp,
  twiceUp,
};

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

- (id)initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle modelObject:(SMGModel *)modelObject {
  
  if (self = [super initWithTabTitle:tabTitle headerTitle:headerTitle modelObject:modelObject]) {
    [self setUpBookView];
    
  } else DLog(@"BookVC Init Fail");
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
  self.viewHeader.leftButton.imageEdgeInsets = ([APPDELEGATE hasTopNotch]) ? UIEdgeInsetsMake(0,(50.0 - self.viewHeader.frame.size.height), 0, 0) : UIEdgeInsetsMake(0,(25.0 - self.viewHeader.frame.size.height), 0, 0);
  // Share Action
  [self.viewHeader.leftButton addTarget:self action:@selector(leftButtonTouched) forControlEvents:UIControlEventTouchUpInside];
  
  //self.viewHeader.backgroundColor = [UIColor blueColor]; // debugging
  
  //
  // Make Chapters Menu
  // ------------------
  _chaptersMenu = [[SMGHorizontalPickerView alloc] initWithFrame: CGRectMake(0, 0, BOUNDS.size.width, self.viewHeader.frame.size.height*.8)];
  _chaptersMenu.elementFont = ([APPDELEGATE hasTopNotch]) ? [UIFont systemFontOfSize:17.0f] : [UIFont systemFontOfSize:14.0f] ;
  _chaptersMenu.backgroundColor   = [SMGGraphics Gray33];
  _chaptersMenu.selectedTextColor = [SMGGraphics Blue22AADD];
  _chaptersMenu.textColor = [UIColor whiteColor];
  _chaptersMenu.selectionPoint = CGPointMake(_chaptersMenu.frame.size.width/2, 0);
  
  // Make Chapters Select Buttons
  _chapters = ([APPDELEGATE hasTopNotch]) ? [NSMutableArray arrayWithObjects:@"I", @"II", @"III", @"IV", @"V", @"VI", @"VII", @"VIII", @"IX", @"X", @"XI", @"XII", nil] :
      [NSMutableArray arrayWithObjects:@"I", @"II", @"III", @"IV ", @"V", @"VI ", @"VII ", @"VIII", @" IX", @"X", @"XI ", @" XII", nil];
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
  
  [_chaptersMenu insertSubview:_shadowView atIndex:0];
  
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
//  [_versesMenu insertSubview:_shadowView atIndex:0];
//  [_versesMenu insertSubview: versesMenuBottomLine atIndex:2];

  
//  [_chaptersMenu insertSubview:_versesMenu atIndex:0];

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
  _chaptersMenu.opened = NO; // Hidden Menu
  [_chaptersMenu scrollToElement:0 animated:NO]; /*_lastViewedElement*/
  _animatingHeaderFooter = NO;
  _headerFooterVisible = YES; // Hidden Header, NO


}

- (void)scrollViewDidScroll: (DTAttributedTextView*)scrollView {
  DLog(@"Scrolling");
  CGPoint translation = [scrollView.panGestureRecognizer translationInView:scrollView];
  DLog(@"Translation X:%f, Y%f", translation.x, translation.y);
  
  // Check if user still dragging and check if already animating (If already animating do nothing)
  if (_userDraggingScrollView && _animatingHeaderFooter == NO) {
    // Detect scroll direction by accessing x or y of translation
    // If scrolling up, and the header/footer/menu is not already offscreen, animate header/footer/menu offscreen
    if (translation.y < 1 && _headerFooterVisible == YES) {
      DLog(@"UP! -- Animate AWAY header/footer");
      [self animateHeaderFooter];
      if (_chaptersMenu.opened) { // if menu open, move menu from open position all the way offscreen
        [self animateChaptersMenu:twiceUp];
         // then swap menu icon back to hamburger (close menu)
         [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal];
        _chaptersMenu.opened = NO;
      } else { // if menu closed, move menu from closed position all the way offscreen
        [self animateChaptersMenu:onceUp];
      }
    }
    // If scrolling down, and the header/footer is already offscreen, animate header onscreen
    if (translation.y > 1 && _headerFooterVisible == NO) {
      DLog(@"DOWN! -- Animate BACK header/footer");
      [self animateHeaderFooter];
      [self animateChaptersMenu: onceDown];
    }
  }
}

- (void)scrollViewWillBeginDragging: (DTAttributedTextView*)scrollView {
  DLog(@"******* Begin Dragging Scrollview *********");
  _userDraggingScrollView = YES;
}

- (void)scrollViewDidEndDragging: (DTAttributedTextView*)scrollView willDecelerate: (BOOL) decelerate {
  DLog(@"******* Finished Dragging Scrollview *********");
  _userDraggingScrollView = NO;
}

- (void)animateHeaderFooter {
  _animatingHeaderFooter = YES; // prevent changes during animation

  CGRect headerCurrentFrame = self.viewHeader.frame;
  
  // headerOffsetY is how far the header moves up or down to hide; it is equal to the height of the header
  CGFloat headerOffsetY = self.viewHeader.frame.size.height + 1; // 1px extra for bottom border line
  CGFloat newHeaderOffsetY = (_headerFooterVisible)? -headerOffsetY : headerOffsetY;
  BOOL footerVisible = (_headerFooterVisible)? YES : NO;

  // Animate Header/Footer
  
    [APPDELEGATE.tabBarController setTabBarHidden:footerVisible animated: YES];
    [UIView animateWithDuration:0.35 animations:^{
      self.viewHeader.frame = CGRectOffset(headerCurrentFrame, 0, newHeaderOffsetY);
     } completion:^(BOOL finished) {
      self.headerFooterVisible = !self.headerFooterVisible;
      self.animatingHeaderFooter = NO;
    }];
}


- (void) leftButtonTouched {
  if (_chaptersMenu.opened == NO) {
    // Swap Icon to X
    [self.viewHeader.leftButton setImage:[SMGGraphics imageOfCloseChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal];
    [self animateChaptersMenu: onceDown];
    _chaptersMenu.opened = YES;
  } else {
    // Swap Icon to Hamburger
    [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal];
    [self animateChaptersMenu: onceUp];
    _chaptersMenu.opened = NO;
  }
  
}

- (void)animateChaptersMenu: (menuState) menuState  {
  
  self.viewHeader.leftButton.userInteractionEnabled = NO; // Disable leftbutton while animating
  CGFloat dy; // position change to move menu: show / hide / offscreen
  switch (menuState) {
    case onceDown:
      dy = self.viewHeader.frame.size.height; //move below header, or onscreen if offscreen
      break;
    case onceUp:
      dy = -self.viewHeader.frame.size.height; //move behind header, or offscreen if already behind header
      break;
    case twiceUp:
      dy = -2*self.viewHeader.frame.size.height; //move offscreen if already open
  }

  [UIView animateWithDuration:0.35
                   animations:^{ self.chaptersMenu.frame = CGRectOffset(self.chaptersMenu.frame, 0, dy);}
                   completion:^(BOOL finished) {
                     
                     // Enable leftbutton after animating
                     self.viewHeader.leftButton.userInteractionEnabled = YES;
                   }];
}

- (void)animateBookViewToRange:(NSRange)range  {
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
  DLog (@"Selected index %ld", (long)index);
}

//- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker longPressDetectedAtIndex:(NSInteger)index {
//  DLog (@"Delegate message: LongPress detected...");
//
//  if (index == picker.currentSelectedIndex) {
//    DLog (@"on current index");
//    if(!_versesMenu.opened) {[self populateVerses];}
//    [self animateVersesMenuOpenClose];
//  } else {DLog(@"on new index");}
//
//}

- (void)populateVerses {
    _verses = [NSMutableArray arrayWithObjects:@"I", @"II", @"III", @"IV", @"V", @"VI", @"VII", @"VIII", @"IX", @"X", @"XI", @"XII", nil];
}

- (void)horizontalPickerView:(SMGHorizontalPickerView *)picker contentOffset: (CGPoint) offset {
  DLog(@"Picker offset: %f", offset.x);
  // distance = distance between left end of chapter I label, and right end of chapter XII label
  // verticle offset = absolute horizontal offset (selectpoint minus relative offset)
  // x (height of verticle scollview / distance)
  
  float multiplier = _bookView.attributedTextContentView.frame.size.height/_chaptersMenu.frame.size.width;
  DLog(@"%f", multiplier); // 198.621872 (this is too much because label I-XII a little shorter)
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
