#import "ARModalViewController.h"
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@implementation ARModalViewController

- (instancetype)initWithStack:(UINavigationController *)stack
{
    self = [super init];
    _stack = stack;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self addChildViewController:self.stack];
    [self.view addSubview:self.stack.view];
}

@end
