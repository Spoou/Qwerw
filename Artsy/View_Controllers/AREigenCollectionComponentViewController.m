#import "AREigenCollectionComponentViewController.h"

@interface AREigenCollectionComponentViewController () <ARMenuAwareViewController>

@end

@implementation AREigenCollectionComponentViewController

- (BOOL)hidesStatusBarBackground
{
    return YES;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
