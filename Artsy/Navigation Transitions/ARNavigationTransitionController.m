#import "ARNavigationTransitionController.h"

#import "ARDefaultNavigationTransition.h"
#import "ARViewInRoomTransition.h"
#import "ARZoomImageTransition.h"

#import "ARArtworkSetViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARZoomArtworkImageViewController.h"

@implementation ARNavigationTransitionController

+ (ARNavigationTransition *)animationControllerForOperation:(UINavigationControllerOperation)operation
                                         fromViewController:(UIViewController *)fromVC
                                           toViewController:(UIViewController *)toVC
{
    ARNavigationTransition *transition = nil;

    if ([self objects:fromVC andSecond:toVC areTransitionsFromClass:[ARArtworkSetViewController class] andClass:[ARViewInRoomViewController class]]) {
        transition = [[ARViewInRoomTransition alloc] init];

    } else if ([self objects:fromVC andSecond:toVC areTransitionsFromClass:[ARArtworkSetViewController class] andClass:[ARZoomArtworkImageViewController class]]) {
        transition = [[ARZoomImageTransition alloc] init];

    } else {
        transition = [[ARDefaultNavigationTransition alloc] init];
    }

    transition.operationType = operation;
    return transition;
}

+ (BOOL)objects:(id)first andSecond:(id)second areTransitionsFromClass:(Class)klass1 andClass:(Class)klass2
{
    return ([first isKindOfClass:[klass1 class]] && [second isKindOfClass:[klass2 class]]) ||
           ([first isKindOfClass:[klass2 class]] && [second isKindOfClass:[klass1 class]]);
}

@end
