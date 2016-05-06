//
//  BookVC.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/4/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "BookVC.h"

@interface BookVC () <UIWebViewDelegate>

@property (nonatomic, strong) UIWebView* bookWV;

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
  // Make Quote WebView
  // ------------------
  _bookWV = [[UIWebView alloc] initWithFrame: BOUNDS];
  NSURL *bookURL = [[NSBundle mainBundle] URLForResource:@"book" withExtension:@"html"];
  [_bookWV loadRequest:[NSURLRequest requestWithURL:bookURL]];
  _bookWV.delegate = self;
  _bookWV.scrollView.bounces = NO;
  
  //
  // Add WebView to VC
  // -----------------
  [self.view insertSubview: _bookWV atIndex:0];
}

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
