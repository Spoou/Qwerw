#import "ARSlideshowViewController.h"

#import "ARSlideshowView.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARSlideshowViewController ()
@property (nonatomic, readonly) NSArray *slides;
@property (nonatomic) ARSlideshowView *view;
@end


@implementation ARSlideshowViewController

@dynamic view;

- (instancetype)initWithSlides:(NSArray *)slides
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _slides = slides;

    return self;
}

- (void)loadView
{
    self.view = [[ARSlideshowView alloc] initWithSlides:self.slides];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    NSString *imageName = NSStringWithFormat(@"full_logo_white_%@", [UIDevice isPad] ? @"large" : @"small");
    UIImageView *logo = [[UIImageView alloc] initWithImage:[UIImage imageNamed:imageName]];
    logo.contentMode = UIViewContentModeScaleAspectFit;
    [self.view addSubview:logo];
    [logo alignCenterWithView:self.view];

    [self runSlideshow];
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)runSlideshow
{
    [self performSelector:@selector(nextSlide) withObject:nil afterDelay:0.6];
}

- (void)nextSlide
{
    if (![self.view hasNext]) {
        [self endSlideshow];
        return;
    }

    [self.view next];

    NSInteger currentSlide = self.view.index + 1;
    NSInteger slidesLeft = self.slides.count - currentSlide;
    CGFloat delay = 0.6 + (0.1 * slidesLeft);

    [self performSelector:@selector(nextSlide) withObject:nil afterDelay:delay];
}

- (void)endSlideshow
{
    [self.delegate slideshowDone];
}
@end
