//
//  BookVC.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/4/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "BookVC.h"
#import "V8HorizontalPickerView/V8HorizontalPickerView.h"

@interface BookVC () <UIWebViewDelegate, V8HorizontalPickerViewDelegate, V8HorizontalPickerViewDataSource>

@property (nonatomic, strong) UIWebView* bookWV;
@property (nonatomic, strong) UIView* chaptersMenu;
@property (nonatomic) BOOL chaptersMenuOpened;
@property (nonatomic, strong) V8HorizontalPickerView* chaptersPicker;
@property (nonatomic, strong) NSMutableArray* chapters;


@end

@implementation BookVC

- (id) initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle {
  
  if (self = [super initWithTabTitle:tabTitle headerTitle:headerTitle]) {
    [self setUpBookView];
    
  } else NSLog(@"BookVC Init Fail");
  return self;
}

- (void) setUpBookView {
  
  //
  // Make Book WebView
  // ------------------
  _bookWV = [[UIWebView alloc] initWithFrame: BOUNDS];
  NSURL *bookURL = [[NSBundle mainBundle] URLForResource:@"book" withExtension:@"html"];
  [_bookWV loadRequest:[NSURLRequest requestWithURL:bookURL]];
  _bookWV.delegate = self;
  _bookWV.scrollView.bounces = YES;
  _bookWV.opaque = NO;
  _bookWV.backgroundColor = [UIColor clearColor];
  
  //
  // Make BG Image
  // -------------
  UIImage* bookImage = [SMGGraphics imageOfBigBookWithColor:[SMGGraphics Gray31]];
  CGRect bookImageFrame = CGRectMake( (BOUNDS.size.width-163)/2, ((BOUNDS.size.height-175)/2)-(BOUNDS.size.height/18) , 163, 165);
  UIImageView* bookImageView = [[UIImageView alloc] initWithFrame:bookImageFrame];
  bookImageView.image = bookImage;
  
  //
  // Add WebView & background image to VC
  // ------------------------------------
  [self.view insertSubview: bookImageView atIndex:0];
  [self.view insertSubview: _bookWV atIndex:1];
  
  //
  // Make Chapters Opener Button
  // ---------------------------
  [self.viewHeader.leftButton setTintColor:[UIColor whiteColor]];
  [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal];
  
  // Intended to make the left edge of the button spaced from the left edge of the device window exactly the height inset (Paint Code icons are 25.0 canvas size)
  [self.viewHeader.leftButton setImageEdgeInsets: UIEdgeInsetsMake(0,  (25.0 - self.viewHeader.frame.size.height), 0, 0)];
  // Share Action
  [self.viewHeader.leftButton addTarget:self action:@selector(animateChaptersMenu) forControlEvents:UIControlEventTouchUpInside];
  
  //
  // Make Chapters Menu
  // ------------------
  _chaptersMenu = [[UIView alloc] initWithFrame: CGRectMake(0, 0, self.viewHeader.frame.size.width, self.viewHeader.frame.size.height*.8)];
  
  UIView* shadowView = [[UILabel alloc] initWithFrame: CGRectMake(0, 0, _chaptersMenu.frame.size.width, _chaptersMenu.frame.size.height)];
  shadowView.backgroundColor = [SMGGraphics Gray33];
  shadowView.clipsToBounds = NO;
  shadowView.layer.shadowColor = [[UIColor blackColor] CGColor];
  shadowView.layer.shadowOpacity = 0.13;
  shadowView.layer.shadowRadius = 4.0;
  shadowView.layer.shadowOffset = CGSizeMake(0.0f, 7.0f);
  shadowView.layer.shadowPath = [UIBezierPath bezierPathWithRect:_chaptersMenu.bounds].CGPath;
  
  //
  // Make Chapters Menu Label
  // ------------------------
//  UILabel* chaptersLabel = [[UILabel alloc] initWithFrame: shadowView.frame];
//  NSMutableAttributedString* attrStr = [[NSMutableAttributedString alloc] initWithString: @"I  II  III  IV  V  VI  VII  VIII  IX  X  XI  XII"];
//  //[attrStr addAttributes:(nonnull NSDictionary<NSString *,id> *) range:(NSRange)]; // <-- Note: Change below to NSDictionary
//  [attrStr addAttribute:NSKernAttributeName value:@(.5) range:NSMakeRange(0, attrStr.length)];
//  [attrStr addAttribute:NSFontAttributeName value:[UIFont fontWithName:@"Helvetica Neue" size:15] range:NSMakeRange(0, attrStr.length)];
//  chaptersLabel.userInteractionEnabled = YES;
//  chaptersLabel.attributedText = attrStr;
//  chaptersLabel.textColor = [UIColor whiteColor];
//  chaptersLabel.textAlignment = NSTextAlignmentCenter;
  
  //
  // Make Chapters Picker
  // --------------------
  _chaptersPicker = [[V8HorizontalPickerView alloc] initWithFrame: shadowView.frame];
  _chaptersPicker.elementFont = [UIFont systemFontOfSize:14.0f];
  _chaptersPicker.backgroundColor   = [UIColor clearColor];
  _chaptersPicker.selectedTextColor = [SMGGraphics Blue22AADD];
  _chaptersPicker.textColor = [UIColor whiteColor];
  _chaptersPicker.selectionPoint = CGPointMake(_chaptersPicker.frame.size.width/2, 0);
  _chapters = [NSMutableArray arrayWithObjects:@"I", @"II", @"II", @"IV", @"V", @"VI", @"VII", @"VIII", @"IX", @"X", @"XI", @"XII", nil];
  _chaptersPicker.delegate = self; _chaptersPicker.dataSource = self;
  
  // Chapters Menu Line <-- Note: Replace these lineviews with CALayers for better performance
  UIView *lineView = [[UIView alloc] initWithFrame:CGRectMake(0, shadowView.frame.size.height-1, _chaptersMenu.frame.size.width, 1)];
  lineView.backgroundColor = [SMGGraphics Gray66];
  
  // Put views together
  [_chaptersMenu addSubview: shadowView];
  [_chaptersMenu addSubview: lineView];
  //[_chaptersMenu addSubview: chaptersLabel];
  [_chaptersMenu addSubview: _chaptersPicker];
  [_chaptersPicker scrollToElement:0 animated:NO];
  
  // Record initial menu state
  _chaptersMenuOpened = NO;

  [self.view insertSubview: _chaptersMenu atIndex:2];

}


- (void)animateChaptersMenu {
  
  (_chaptersMenuOpened)?  [self.viewHeader.leftButton setImage:[SMGGraphics imageOfChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal] : [self.viewHeader.leftButton setImage:[SMGGraphics imageOfCloseChaptersWithColor:[UIColor whiteColor]] forState:UIControlStateNormal] ;
  
  self.viewHeader.leftButton.userInteractionEnabled = NO;
  NSLog(@"#Animating menu#");
  NSLog(@"### menu Y = %f ###", _chaptersMenu.frame.origin.y);

  //
  // Get current frame, check if menu open, assign open and closed menu states
  // -------------------------------------------------------------------------
  
  CGRect menuCurrentFrame = _chaptersMenu.frame;
  
  // OffsetY is how far the menu moves up or down
  CGFloat offsetY = self.viewHeader.frame.size.height;
  CGFloat newOffsetY = (_chaptersMenuOpened)? -offsetY : offsetY;
  //CGFloat newAlpha = (_chaptersMenuOpened)? 0.0 : 1.0;
  
  //
  // Animate Chapters Menu
  // ---------------------
  [UIView animateWithDuration:0.35 animations:^{
    _chaptersMenu.frame = CGRectOffset(menuCurrentFrame, 0, newOffsetY);
    } completion:^(BOOL finished) {
    _chaptersMenuOpened = !_chaptersMenuOpened;
        self.viewHeader.leftButton.userInteractionEnabled = YES;
  }];

}

- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRanges { return 0;}

- (BOOL)webView: (UIWebView*)webView shouldStartLoadWithRequest: (NSURLRequest*)request navigationType: (UIWebViewNavigationType)navigationType {
  
  //
  // Map links starting with "file://" ending with #action with the
  // action of the controller if it exists. Open other links in Safari.
  // ------------------------------------------------------------------
  
#ifdef DEBUG
  NSLog(@"Action from UIWebView!");
#endif
  
  NSString *fragment, *scheme;
  if (navigationType == UIWebViewNavigationTypeLinkClicked) {
    [webView stopLoading];
    fragment = [[request URL] fragment];
    scheme = [[request URL] scheme];
    
    // Call a custom selector!! ;-)
    if ([scheme isEqualToString: @"file"] && [self respondsToSelector: NSSelectorFromString(fragment)]) {
      [self performSelector: NSSelectorFromString(fragment)];
      return NO;
    }
    
    // Open other links in Safari!!
    [[UIApplication sharedApplication] openURL: [request URL]];
  }
  return YES;
}

- (void) openChapters {
  NSLog(@"Chapters opened");
}

#pragma mark - HorizontalPickerView DataSource Methods
- (NSInteger)numberOfElementsInHorizontalPickerView:(V8HorizontalPickerView *)picker {
  return [_chapters count];
}

#pragma mark - HorizontalPickerView Delegate Methods
- (NSString *)horizontalPickerView:(V8HorizontalPickerView *)picker titleForElementAtIndex:(NSInteger)index {
  return [_chapters objectAtIndex:index];
}

- (NSInteger) horizontalPickerView:(V8HorizontalPickerView *)picker widthForElementAtIndex:(NSInteger)index {
//  CGSize constrainedSize = CGSizeMake(MAXFLOAT, MAXFLOAT);
//  NSString *text = [_chapters objectAtIndex:index];
//  CGSize textSize = [text sizeWithFont:[UIFont systemFontOfSize:14.0f]
//                     constrainedToSize:constrainedSize
//                         lineBreakMode:UILineBreakModeWordWrap];
//  return textSize.width + 40.0f; // 20px padding on each side
  return 25.f;
}

- (void)horizontalPickerView:(V8HorizontalPickerView *)picker didSelectElementAtIndex:(NSInteger)index {
  NSLog (@"Selected index %ld", (long)index);
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
