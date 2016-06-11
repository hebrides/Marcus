//
//  SettingsVC.m
//  Marcus
//
//  Created by Marcus Skye Lewis on 4/4/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

#import "SettingsVC.h"

@interface SettingsVC ()

@property (nonatomic, strong) UIDatePicker* timePicker;
@property (nonatomic, strong) UILabel* timeIndicator;
@property (nonatomic, strong) UISwitch *quoteSwitch;
@property (nonatomic, strong) UIButton *pickerOpener;

@end

@implementation SettingsVC


- (id)initWithTabTitle:(NSString*)tabTitle headerTitle: (NSString*)headerTitle {
  
  if (self = [super initWithTabTitle:tabTitle headerTitle:headerTitle]) {
    
    [self setUpSettingsView];
    [self setUpHeader];

  } else NSLog(@"SettingsVC Init Fail");
  return self;
}

- (void)setUpSettingsView {
  
  //
  // Create Switch
  // -------------
  _quoteSwitch = [[UISwitch alloc] init];
  // Fine tune position and size
  _quoteSwitch.onTintColor = [SMGGraphics Blue22AADD];
  _quoteSwitch.transform = CGAffineTransformMakeScale(0.85, 0.85);
  float viewWidth = BOUNDS.size.width;
  float viewHeight = BOUNDS.size.height;
  float rightInset = viewWidth/11.72;
  float leftInset = viewWidth/15.3;
  float topInset = viewHeight/12.82;
  float xpos = viewWidth - rightInset - _quoteSwitch.frame.size.width;
  float ypos = self.viewHeader.frame.size.height + topInset;
  [_quoteSwitch setFrame: CGRectMake(xpos,ypos,_quoteSwitch.frame.size.width,_quoteSwitch.frame.size.height)];

  // Initialize and react to state changes
  _quoteSwitch.on = APPDELEGATE.dailyQuoteOn;
  [_quoteSwitch addTarget:self action:@selector(switchValueChanged) forControlEvents:UIControlEventValueChanged];

  
  //
  // Create Switch Label
  // -------------------
  UILabel* quoteSwitchLabel = [[UILabel alloc] initWithFrame: CGRectMake(leftInset, ypos,leftInset*10,viewHeight/24)];
  quoteSwitchLabel.textColor = [UIColor whiteColor];
  quoteSwitchLabel.text = @"Send Daily Quote";
  quoteSwitchLabel.textAlignment = NSTextAlignmentLeft;
  quoteSwitchLabel.font = [UIFont systemFontOfSize:14];
  //quoteSwitchLabel.backgroundColor = [UIColor greenColor]; // debugging
  
  //
  // Create Horizontal Lines (Fake Table View)
  // -----------------------------------------
  UIView *lineView1 = [[UIView alloc] initWithFrame:CGRectMake(leftInset, ypos+topInset, viewWidth - rightInset - leftInset, 1)];
  lineView1.backgroundColor = [SMGGraphics Gray4C];
  
  UIView *lineView2 = [[UIView alloc] initWithFrame:CGRectMake(leftInset, ypos+topInset + viewHeight/10.7, viewWidth - rightInset - leftInset, 1)];
  lineView2.backgroundColor = [SMGGraphics Gray4C];
  
  //
  // Create Time Picker Label
  // ------------------------
  UILabel* timePickerLabel = [[UILabel alloc] initWithFrame: CGRectMake(leftInset, ypos + viewHeight/9.5 ,leftInset*9,viewHeight/24)];
  timePickerLabel.textColor = [UIColor whiteColor];
  timePickerLabel.text = @"Time for Notification";
  timePickerLabel.textAlignment = NSTextAlignmentLeft;
  timePickerLabel.font = [UIFont systemFontOfSize:14];
  //  timePickerLabel.backgroundColor = [UIColor orangeColor];
  
  
  //
  // Create Time Indicator Label
  // ---------------------------
  _timeIndicator = [[UILabel alloc] initWithFrame: CGRectMake(leftInset*9, ypos + viewHeight/9.5,viewWidth - rightInset - leftInset*9,viewHeight/24)];
  _timeIndicator.textColor = [SMGGraphics Blue22AADD];
  
  // Set Time Indicator Text
  _timeIndicator.text = [NSDateFormatter localizedStringFromDate: [self dateFrom24HourTime:APPDELEGATE.quoteTime] dateStyle:NSDateFormatterNoStyle timeStyle:NSDateFormatterShortStyle];
  _timeIndicator.textAlignment = NSTextAlignmentRight;
  _timeIndicator.font = [UIFont systemFontOfSize:14];
  //  _timeIndicator.backgroundColor = [UIColor yellowColor]; // debugging
  
  
  //
  // Create Button To Open TimePicker
  // --------------------------------
  _pickerOpener = [[UIButton alloc] initWithFrame:CGRectMake(0.0, lineView1.frame.origin.y, BOUNDS.size.width, lineView2.frame.origin.y-lineView1.frame.origin.y)];
  //_pickerOpener.backgroundColor = [UIColor redColor]; // debugging
  [_pickerOpener addTarget:self action:@selector(openCloseTimePicker) forControlEvents:UIControlEventTouchUpInside];

  
  //
  // Create Time Picker
  // ------------------
  _timePicker = [[UIDatePicker alloc] init];
  _timePicker.datePickerMode = UIDatePickerModeTime;
  _timePicker.date = [self dateFrom24HourTime:APPDELEGATE.quoteTime];
  _timePicker.backgroundColor = [UIColor clearColor];
  [_timePicker setValue:[UIColor whiteColor] forKey:@"textColor"];
  _timePicker.frame = CGRectMake(lineView2.frame.origin.x, lineView2.frame.origin.y+15, lineView2.frame.size.width, 200);
  [_timePicker addTarget:self action: @selector(pickerValueChanged) forControlEvents:UIControlEventValueChanged];
  _timePicker.hidden = YES; _timePicker.alpha = 0.0;
  
  
//  //
//  // Make BG Image
//  // -------------
//  UIImage* settingsImage = [SMGGraphics imageOfBigSettingsWithColor:[SMGGraphics Gray31]];
//  CGRect settingsImageFrame = CGRectMake( (BOUNDS.size.width-163)/2, ((BOUNDS.size.height-107)/2)-(BOUNDS.size.height/18) , 163, 107);
//  UIImageView* settingsImageView = [[UIImageView alloc] initWithFrame:settingsImageFrame];
//  settingsImageView.image = settingsImage;
  

  
  //
  // Add Switch, Lines, Time Picker, BG Image to view
  // ------------------------------------------------
 // [self.view insertSubview: settingsImageView atIndex:0];
  [self.view insertSubview: quoteSwitchLabel atIndex: 1];
  [self.view insertSubview: _quoteSwitch atIndex: 1];
  [self.view insertSubview: timePickerLabel atIndex: 1];
  [self.view insertSubview: _timeIndicator atIndex: 1];
  [self.view insertSubview: lineView1 atIndex: 1];
  [self.view insertSubview: lineView2 atIndex: 1];
  [self.view insertSubview: _timePicker atIndex: 1];
  [self.view insertSubview: _pickerOpener atIndex: 1];

}

- (void)setUpHeader {
  self.viewHeader.userInteractionEnabled = NO;
  [self.viewHeader.leftButton setTitle:@"Undo" forState:UIControlStateNormal];
  [self.viewHeader.rightButton setTitle:@"Save" forState:UIControlStateNormal];
  [self.viewHeader.leftButton setTintColor:[UIColor darkGrayColor]];
  [self.viewHeader.rightButton setTintColor:[UIColor darkGrayColor]];
  [self.viewHeader.rightButton addTarget:self action:@selector(saveSettings) forControlEvents:UIControlEventTouchUpInside];
  [self.viewHeader.leftButton addTarget:self action:@selector(cancelSettings) forControlEvents:UIControlEventTouchUpInside];
}

-(void)pickerValueChanged {
  NSLog(@"TimePicker State Changed!!");
  _timeIndicator.text = [self timeAsString];
  [self checkForSave];
}

-(void)switchValueChanged {
    NSLog(@"Switch State Changed!!");
  [self checkForSave];
}


-(void)checkForSave {
  BOOL newQuoteTimeSelected;
  BOOL newSwitchStateSelected;
  
  if ([self pickerTimeAs24HourInt] == APPDELEGATE.quoteTime) {
    newQuoteTimeSelected = NO;
  } else { newQuoteTimeSelected = YES; NSLog(@"New Daily Quote time selected.");}

  if (_quoteSwitch.on == APPDELEGATE.dailyQuoteOn) {
    newSwitchStateSelected = NO;
  } else { newSwitchStateSelected = YES; NSLog(@"New Daily Quote On/Off state selected.");}

  if (newQuoteTimeSelected || newSwitchStateSelected) {
    NSLog(@"Save Possible!!");
    [self fadeInSaveUndoButtons];
  } else { [self fadeOutSaveUndoButtons];}
  

}

-(NSString*)timeAsString {
  return [NSDateFormatter localizedStringFromDate:_timePicker.date dateStyle:NSDateFormatterNoStyle timeStyle:NSDateFormatterShortStyle];
}

-(NSInteger)pickerTimeAs24HourInt {
  NSDateFormatter* timeAs24HourInt = [[NSDateFormatter alloc] init];
  timeAs24HourInt.dateFormat = @"kkmm";
  return [timeAs24HourInt stringFromDate:_timePicker.date].integerValue;
}

-(NSDate*)dateFrom24HourTime:(NSInteger)time24 {
  
  NSDateComponents *dateComponents = [[NSDateComponents alloc] init];
  dateComponents.hour = time24 / 100;
  dateComponents.minute = time24 % 100;
  NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
  return [calendar dateFromComponents:dateComponents];
}

-(void)openCloseTimePicker {
  if (_timePicker.hidden) { //Use hidden property to detect state
    [self fadeInTimePicker];
  } else {
    [self fadeOutTimePicker];
  }
  
}

-(void)fadeInTimePicker {
    _timePicker.hidden = NO; // Permit input
    [UIView animateWithDuration:0.3 animations:^{ // Fade out
      _timePicker.alpha = 1.0;
    } completion:^(BOOL finished) {}];
}

-(void)fadeOutTimePicker {
    [UIView animateWithDuration:0.2 animations:^{
      _timePicker.alpha = 0.0;
    } completion:^(BOOL finished) {
      _timePicker.hidden = YES; // Prevent input
    }];
}

-(void)fadeInSaveUndoButtons {

  [UIView animateWithDuration:0.3 animations:^{
      NSLog(@"Fading In buttons");
    [self.viewHeader.leftButton setTintColor:[SMGGraphics Blue22AADD]];
    [self.viewHeader.rightButton setTintColor:[SMGGraphics Blue22AADD]];
  } completion:^(BOOL finished) {
    self.viewHeader.userInteractionEnabled = YES;}];
}

-(void)fadeOutSaveUndoButtons {
  [UIView animateWithDuration:0.3 animations:^{
      NSLog(@"Fading Out buttons");
    [self.viewHeader.rightButton setTintColor:[UIColor darkGrayColor]];
    [self.viewHeader.leftButton setTintColor:[UIColor darkGrayColor]];
  } completion:^(BOOL finished) {
    self.viewHeader.userInteractionEnabled = NO;}];
}

-(void)saveSettings {
  
  // Set and write settings
  APPDELEGATE.quoteTime = [self pickerTimeAs24HourInt];
  [APPDELEGATE saveSetting:APPDELEGATE.quoteTime forKey:@"quoteTime"];
  APPDELEGATE.dailyQuoteOn = _quoteSwitch.on; // consolidate later
  [APPDELEGATE saveSetting:APPDELEGATE.dailyQuoteOn forKey:@"dailyQuoteOn"];
  
  // Schedule notifications if possible
  [self scheduleNotificationsCheck];
  
  // Fade out buttons
  [self fadeOutSaveUndoButtons];
  if (_timePicker.hidden) { return; } // If timePicker already hidden, don't bother fading out
    else { [self fadeOutTimePicker]; }

}

-(void) scheduleNotificationsCheck {

  NSLog(@"Attempting to schedule notifications... ");
  
  // Are notifications on?
  if (APPDELEGATE.dailyQuoteOn == YES) {
    NSLog(@"User has turned ON daily quote in app.");
    // Has the user allowed us to schedule notifications in device permissions?
    if([APPDELEGATE notificationsCurrentlyEnabledInDeviceSettings]) {

      
      // iOS requests user permission only after schedule code first executed.
      // i.e., there is no "undetermined" state
      // So, is this the app's first attempt to schedule notifications?
      
      if (APPDELEGATE.notificationsAttemptedScheduled == NO) {
        // Record and save first attempt to schedule
        APPDELEGATE.notificationsAttemptedScheduled = YES; // maybe refactor in model later so this is one method call to save and set
        [APPDELEGATE saveSetting:YES forKey:@"notificationsAttemptedScheduled"];
        NSLog(@"First attempt to schedule notifications.");
      }
      
      // Now we can schedule notifications
      [APPDELEGATE scheduleDailyNotificationAtTime: APPDELEGATE.quoteTime];
      
      
    } else { // The user has not enabled notifications in device permissions.
      

        // Again: iOS requests user permission only after schedule code first executed.
        // i.e., there is no "undetermined" state
        // So, is this the app's first attempt to schedule notifications?

        if (APPDELEGATE.notificationsAttemptedScheduled == NO) {
          // First attempt, so schedule notifications
          [APPDELEGATE scheduleDailyNotificationAtTime: APPDELEGATE.quoteTime];
          
          // Record and save first attempt to schedule
          APPDELEGATE.notificationsAttemptedScheduled = YES; // maybe refactor in model later so this is one method call to save and set
          [APPDELEGATE saveSetting:YES forKey:@"notificationsAttemptedScheduled"];
          NSLog(@"First attempt to schedule notifications.");
          
        } else { // This is not the app's first attempt to schedule notifications.

          // Pop up an alert requesting the user change permissions
          [self showSettingsAlert]; // maybe move to a utilities class later
          
        }
    }
    
  } else { // dailyQuote is OFF
      // cancel notifications, but don't bother if not enabled in device settings
      NSLog(@"User has turned OFF daily quote in app.");
      if ([APPDELEGATE notificationsCurrentlyEnabledInDeviceSettings]) {
        [APPDELEGATE cancelDailyNotifications];
      }
  }
  
}

-(void)showSettingsAlert{
  
  UIAlertController* alert = [UIAlertController alertControllerWithTitle: @"M E D I T A T I O N S"
                                                                 message:@"Please enable notifications in settings."
                                                          preferredStyle: UIAlertControllerStyleAlert];
  
  UIAlertAction* cancelAction = [UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleDestructive
                                                        handler:^(UIAlertAction * action) {}];
  [alert addAction:cancelAction];

  UIAlertAction* settingsAction = [UIAlertAction actionWithTitle:@"Settings" style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction * action) {[self goToSettings];}];
  [alert addAction:settingsAction];

  [self presentViewController:alert animated:YES completion:nil];
  
  NSLog(@"Please enable notifications in settings.");

}

-(void) goToSettings {
  NSLog(@"Going to device settings.");
  NSURL*url=[NSURL URLWithString:UIApplicationOpenSettingsURLString];

  dispatch_async(dispatch_get_main_queue(), ^{
    if([[UIApplication sharedApplication] canOpenURL:url]){
        [[UIApplication sharedApplication] openURL: url];
      } else {
        NSLog(@"Can't open URL!");
      }
    });
  
}

-(void)cancelSettings {
  
  NSLog(@"Undoing changes to settings.");
  
  // Restore settings
  _quoteSwitch.on = APPDELEGATE.dailyQuoteOn;
  _timePicker.date = [self dateFrom24HourTime:APPDELEGATE.quoteTime];
  _timeIndicator.text = [NSDateFormatter localizedStringFromDate: [self dateFrom24HourTime:APPDELEGATE.quoteTime] dateStyle:NSDateFormatterNoStyle timeStyle:NSDateFormatterShortStyle];

  // Fade out buttons
  [self fadeOutSaveUndoButtons];
  if (_timePicker.hidden) { return; } // If timePicker already hidden, don't bother fading out
    else { [self fadeOutTimePicker]; }
}


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
