//
//  SMGModelSingleton.h
//  Marcus
//
//  Created by Marcus Skye Lewis on 5/4/16.
//  Copyright © 2016 SMGMobile. All rights reserved.
//

// Singleton via http://www.galloway.me.uk/tutorials/singleton-classes/



// **** Note: Not implementing this!! ****

#import <Foundation/Foundation.h>

@interface SMGModelSingleton : NSObject {
  BOOL statusBarShown;
  BOOL dailyQuoteOn;
  NSInteger quoteTime;
  NSUInteger book;
  NSUInteger verse;
}

// App Model
@property (nonatomic) BOOL statusBarShown;
@property (nonatomic) BOOL dailyQuoteOn;
@property (nonatomic) NSInteger quoteTime;
@property (nonatomic) NSUInteger book;
@property (nonatomic) NSUInteger verse;

+ (id)sharedModelSingleton;

@end
