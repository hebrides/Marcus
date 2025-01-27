////
////  SMGAppModelSingleton.m
////  Marcus
////
////  Created by Marcus Skye Lewis on 5/4/16.
////  Copyright © 2016 SMGMobile. All rights reserved.
//
//
//#import "SMGModelSingleton.h"
//
//
//// **** !!!!! Note: Not used, not implementing this !!!!! ****
//
//
//@implementation SMGModelSingleton
//
//@synthesize statusBarShown;
//@synthesize dailyQuoteOn;
//@synthesize quoteTime;
//@synthesize book;
//@synthesize verse;
//
//#pragma mark Singleton Methods
//
//+ (id)sharedModelSingleton {
//  static SMGModelSingleton *sharedModelSingleton = nil;
//  static dispatch_once_t onceToken;
//  dispatch_once(&onceToken, ^{
//    sharedModelSingleton = [[self alloc] init];
//  });
//  return sharedModelSingleton;
//}
//
//- (id)init {
//  if (self = [super init]) {
//    // defaults
//    statusBarShown = YES;
//    dailyQuoteOn = NO;
//    quoteTime = 800;
//    book = 1;
//    verse = 1;
//  }
//  return self;
//}
//
//- (void)dealloc {
//  // Should never be called, but here for clarity.
//}
//
//@end
