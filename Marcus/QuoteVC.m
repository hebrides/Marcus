//
//  QuoteVC.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/4/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "QuoteVC.h"
#import "SMGGraphics.h"
// #import "SHK.h"
// #import "SHKItem.h"
// #import "SHKAlertController.h"
// #import "TTTAttributedLabel.h"

@interface QuoteVC () <UIWebViewDelegate>

@property (nonatomic, strong) UIView* quoteView;
@property (nonatomic, strong) UILabel* quoteLabel;
@property (nonatomic, strong) NSString* attributionLabel;


@end

@implementation QuoteVC


- (id)initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle modelObject:(SMGModel *)modelObject {
  
  if (self = [super initWithTabTitle:tabTitle headerTitle:headerTitle modelObject:modelObject]) {
    
    [self setUpQuoteView];
    
  } else DLog(@"QuoteVC Init Fail");
  return self;
}

- (void) setUpQuoteView {

  //
  // Make Share Button
  // -----------------
  /*
  [self.viewHeader.rightButton setImage:[SMGGraphics imageOfShareWithColor:[UIColor whiteColor]] forState:UIControlStateNormal];
    [self.viewHeader.rightButton setImage:[SMGGraphics imageOfShareWithColor:[UIColor whiteColor]] forState:UIControlStateSelected];
  [self.viewHeader.rightButton setTintColor:[UIColor whiteColor]];
  
  // Intended to make the right edge of the button spaced from the right edge of the device window exactly the height inset (Paint Code icons are 25.0 canvas size)
  [self.viewHeader.rightButton setImageEdgeInsets: UIEdgeInsetsMake(0, 0, 0, (25.0 - self.viewHeader.frame.size.height))];
  // Share Action
  [self.viewHeader.rightButton addTarget:self action:@selector(shareQuote) forControlEvents:UIControlEventTouchUpInside];
  */
  
  //
  // Make Quote Label
  // ----------------
  CGRect quoteTextFrame = CGRectMake(BOUNDS.size.width/8.0, self.viewHeader.frame.size.height + (self.viewHeader.frame.size.height/3.0), BOUNDS.size.width - ( (BOUNDS.size.width/8.0)*2 ), BOUNDS.size.height - BOUNDS.size.height/3.0);
  

      // Method 1: UILabel, text centered vertically in frame & shrinks to fit frame for larger quotes
      _quoteLabel = [[UILabel alloc] initWithFrame:quoteTextFrame];
      _quoteLabel.textColor = [UIColor whiteColor];
      _quoteLabel.backgroundColor = [UIColor clearColor];
      _quoteLabel.numberOfLines = 0;
      _quoteLabel.adjustsFontSizeToFitWidth = YES; // or NO and uncomment out below line
      //[_quoteLabel setFont: [UIFont fontWithName:@"Helvetica Neue" size:14]];
      _quoteLabel.minimumScaleFactor = .5;
      _quoteLabel.userInteractionEnabled = YES;

  
      //  // Attributed string for coloring/underlining citation
      //  NSMutableAttributedString* quoteOfTheDayAttributedText = [[NSMutableAttributedString alloc] initWithString:quoteOfTheDay];
      //  [quoteOfTheDayAttributedText addAttribute:NSUnderlineStyleAttributeName
      //                        value: [NSNumber numberWithInt:NSUnderlineStyleSingle]
      //                        range:[quoteOfTheDay rangeOfString:citation]];
      //
      //  _quoteLabel.attributedText = quoteOfTheDayAttributedText;

        _quoteLabel.text = [self getQuoteOfTheDay];

        // React to tap on label
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                                     action:@selector(invokeQuoteMenu)];
        // tapGesture.delegate=self;
        [_quoteLabel addGestureRecognizer:tapGesture];


      //  // Method 2: TextView, text aligns to top of frame, scrolls for larger quotes
      //  UITextView* quoteTextView = [[UITextView alloc] initWithFrame:quoteTextFrame];
      //  quoteTextView.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0];
      //  quoteTextView.textColor = [UIColor whiteColor];
      //  quoteTextView.text = quoteOfTheDay;
      //  quoteTextView.font = [UIFont systemFontOfSize:15.5];
      //  quoteTextView.userInteractionEnabled = YES;
      //  quoteTextView.editable = NO;

  
  //
  // Make BG Image
  // -------------
  UIImage* quoteImage = [SMGGraphics imageOfBigQuoteWithColor: [SMGGraphics Gray31]];
  CGRect quoteImageFrame = CGRectMake( (BOUNDS.size.width-175)/2, ((BOUNDS.size.height-132)/2)-(BOUNDS.size.height/18) , 175, 132);
  UIImageView* quoteImageView = [[UIImageView alloc] initWithFrame:quoteImageFrame];
  quoteImageView.image = quoteImage;

  
  //
  // Add quote label and background image to VC View
  // -----------------------------------------------
  [self.view insertSubview: quoteImageView atIndex:0];
  [self.view insertSubview: _quoteLabel atIndex:1];
  //[self.view insertSubview: quoteTextView atIndex:1];
}

- (NSString*) getQuoteOfTheDay {
  
  NSArray* quoteOfTheDayElements = [self.appModel getQuoteOfTheDay];
  NSString* quote = [NSString stringWithFormat:@"\"%@\"", quoteOfTheDayElements[0]];
  NSString* spacer = @"\n\n        - ";
  NSString* citation = [NSString stringWithFormat:@"Book %@, Verse %@", quoteOfTheDayElements[1], quoteOfTheDayElements[2]];
  DLog(@"%@\n %@", quote, citation);
  
  return [NSString stringWithFormat:@"%@%@%@", quote, spacer, citation];

}

- (void) invokeQuoteMenu {
  DLog(@"Touched");
  //[self turnQuoteBlue];
}

- (void) copyQuoteToClipboard {
  UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
  pasteboard.string = [self getQuoteOfTheDay];
}

-(void)turnQuoteBlue {
  
  [UIView transitionWithView:_quoteLabel duration:.25 options:UIViewAnimationOptionTransitionCrossDissolve animations:^{
    _quoteLabel.textColor = [SMGGraphics Blue22AADD];
  } completion:^(BOOL finished) {
  }];
}

- (void) shareQuote {
//
//  // Create the item to share (in this example, a url)
//   NSURL *url = [NSURL URLWithString:@"http://getsharekit.com"];
//   SHKItem *item = [SHKItem URL:url title:@"ShareKit is Awesome!"];
//  
//  // ShareKit detects top view controller (the one intended to present ShareKit UI) automatically,
//  // but sometimes it may not find one. To be safe, set it explicitly
//  [SHK setRootViewController:self];
//  
//  
//  //iOS 8+
//  SHKAlertController *alertController = [SHKAlertController actionSheetForItem:item];
//  [alertController setModalPresentationStyle:UIModalPresentationPopover];
//  UIPopoverPresentationController *popPresenter = [alertController popoverPresentationController];
//  popPresenter.barButtonItem = self.toolbarItems[1];
//  [self presentViewController:alertController animated:YES completion:nil];

//  Sharekit pod (above) removed for 1.0 release -- needs to be configured
  
  DLog(@"ShareButton pressed");
  NSString *stringtoshare= _quoteLabel.text;
  UIImage *imagetoshare = [SMGGraphics imageOfQuoteWithColor:[SMGGraphics Blue22AADD]]; //This is an image to share.
  
  NSArray *activityItems = @[stringtoshare, imagetoshare];
  UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:activityItems applicationActivities:nil];
  activityVC.excludedActivityTypes = @[UIActivityTypeAssignToContact];
  [self presentViewController:activityVC animated:TRUE completion:nil];

}

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
}

- (void)viewWillAppear:(BOOL)animated {
  //
    DLog(@"Quoteview appeared");
  _quoteLabel.text = [self getQuoteOfTheDay];
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
