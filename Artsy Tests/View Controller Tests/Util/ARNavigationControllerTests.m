#import "ARNavigationController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARPendingOperationViewController.h"


@interface ARNavigationController (Testing)

@property (nonatomic, strong) ARPendingOperationViewController *pendingOperationViewController;

@end

SpecBegin(ARNavigationController)

__block ARNavigationController *navigationController;


describe(@"visuals", ^{
    it(@"should be empty for a rootVC", ^{
        UIViewController *viewController = [[UIViewController alloc] init];
        navigationController = [[ARNavigationController alloc] initWithRootViewController:viewController];
        expect(navigationController).to.haveValidSnapshot();
    });

    it(@"should be show a back button with 2 view controllers", ^{
        UIViewController *viewController = [[UIViewController alloc] init];
        UIViewController *viewController2 = [[UIViewController alloc] init];
        navigationController = [[ARNavigationController alloc] initWithRootViewController:viewController];
        [navigationController pushViewController:viewController2 animated:NO];
        expect(navigationController).to.haveValidSnapshot();
    });
});

describe(@"presenting pending operation layover", ^{
    __block ARNavigationController *navigationController;
    
    before(^{
        UIViewController *viewController = [[UIViewController alloc] init];
        navigationController = [[ARNavigationController alloc] initWithRootViewController:viewController];
    });
    
    it(@"should animate layover transitions", ^{
        expect(navigationController.animatesLayoverChanges).to.beTruthy();
    });
    
    it(@"should call through to nil when the message isn't included", ^{
        id mock = [OCMockObject partialMockForObject:navigationController];
        [[mock expect] presentPendingOperationLayoverWithMessage:[OCMArg isNil]];
        
        [mock presentPendingOperationLayover];
        
        [mock verify];
    });
    
    describe(@"without animations", ^{
        beforeEach(^{
            navigationController.animatesLayoverChanges = NO;
        });
        
        it(@"should present the new view controller", ^{
            id mock = [OCMockObject partialMockForObject:navigationController];
            [[mock expect] ar_addModernChildViewController:[OCMArg checkForClass:[ARPendingOperationViewController class]]];
            
            [mock presentPendingOperationLayover];
            
            [mock verify];
        });
        
        it(@"should dismiss the view controller once the command's execution is completed", ^{
            id mock = [OCMockObject partialMockForObject:navigationController];
            [[mock expect] ar_removeChildViewController:[OCMArg checkForClass:[ARPendingOperationViewController class]]];
            
            RACCommand *command = [mock presentPendingOperationLayover];
            [command execute:nil];
            
            [mock verify];
        });
        
        describe(@"with a message", ^{
            it(@"should present the new view controller", ^{
                NSString *message = @"Hello fine sir or madam";
                
                id mock = [OCMockObject partialMockForObject:navigationController];
                [[mock expect] ar_addModernChildViewController:[OCMArg checkWithBlock:^BOOL(ARPendingOperationViewController *obj) {
                    return [obj.message isEqualToString:message];
                }]];
                
                [mock presentPendingOperationLayoverWithMessage:message];
                
                [mock verify];
            });
        });
    });
});

SpecEnd
