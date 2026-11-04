import clsx from "clsx";
import type { EmblaOptionsType } from "embla-carousel";
import Accessibility from "embla-carousel-accessibility";
import AutoHeight from "embla-carousel-auto-height";
import useEmblaCarousel, { type EmblaRootNodeRefType } from "embla-carousel-react";
import { type ComponentProps, createContext, type ElementType, type PropsWithChildren, useContext, useEffect, useMemo } from "react";

import styles from "./Carousel.module.scss";
import { useArrowKeyNavigation } from "./useArrowKeyNavigation";
import { useEmblaAccessibilityPluginOptions } from "./useEmblaAccessibilityPluginOptions";
import { type EmblaCarouselState, useEmblaCarouselState } from "./useEmblaCarouselState";
import { useInertHiddenSlides } from "./useInertHiddenSlides";

type CarouselContextValue = EmblaCarouselState & {
    viewportRef: EmblaRootNodeRefType;
    hasNavigation: boolean;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

const useCarousel = () => {
    const context = useContext(CarouselContext);

    if (!context) {
        throw new Error("Carousel sub components must be rendered inside a Carousel.");
    }

    return context;
};

const emblaOptions: EmblaOptionsType = {
    align: "start",
    // The accessibility plugin hides the slides of all other snaps, so a snap has to contain all slides in view.
    slidesToScroll: "auto",
    breakpoints: {
        "(prefers-reduced-motion: reduce)": { duration: 0 },
    },
};

const getCarouselRoot = (viewport: HTMLElement) => viewport.closest<HTMLElement>("[data-carousel]");

const previousButtonSelector = ':scope > [data-carousel-part="previousButton"]';
const nextButtonSelector = ':scope > [data-carousel-part="nextButton"]';
const statusSelector = ':scope > [data-carousel-part="status"]';

type CarouselProps = PropsWithChildren<{
    label: string;
    slideCount: number;
    className?: string;
}>;

export const Carousel = ({ label, slideCount, className, children }: CarouselProps) => {
    const accessibilityPluginOptions = useEmblaAccessibilityPluginOptions(label);
    const emblaPlugins = useMemo(
        () => [Accessibility({ ...accessibilityPluginOptions, rootNode: getCarouselRoot }), AutoHeight()],
        [accessibilityPluginOptions],
    );
    const [viewportRef, emblaApi] = useEmblaCarousel(emblaOptions, emblaPlugins);
    const carouselState = useEmblaCarouselState({ emblaApi });
    // Until Embla has measured the slides, each slide is assumed to be a snap.
    const hasNavigation = (carouselState.snapCount ?? slideCount) > 1;

    useArrowKeyNavigation({ emblaApi, getRootNode: getCarouselRoot });
    useInertHiddenSlides({ emblaApi });

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        const setUpControls = () => {
            const accessibility = emblaApi.plugins().accessibility;

            accessibility?.setupPrevAndNextButtons(previousButtonSelector, nextButtonSelector);
            accessibility?.setupLiveRegion(statusSelector);
        };

        setUpControls();
        emblaApi.on("reinit", setUpControls);

        return () => {
            emblaApi.off("reinit", setUpControls);
        };
    }, [emblaApi, hasNavigation]);

    const contextValue = useMemo<CarouselContextValue>(
        () => ({ ...carouselState, viewportRef, hasNavigation }),
        [carouselState, viewportRef, hasNavigation],
    );

    return (
        <CarouselContext.Provider value={contextValue}>
            <div data-carousel className={clsx(styles.root, className)}>
                {children}
            </div>
        </CarouselContext.Provider>
    );
};

type CarouselViewportProps = PropsWithChildren<{
    className?: string;
    containerClassName?: string;
}>;

export const CarouselViewport = ({ className, containerClassName, children }: CarouselViewportProps) => {
    const { viewportRef } = useCarousel();

    return (
        // Receives the focus when the focused slide scrolls out of view.
        <div ref={viewportRef} tabIndex={-1} className={clsx(styles.viewport, className)}>
            <div className={clsx(styles.container, containerClassName)}>{children}</div>
        </div>
    );
};

type CarouselSlideProps = PropsWithChildren<{
    className?: string;
}>;

export const CarouselSlide = ({ className, children }: CarouselSlideProps) => <div className={clsx(styles.slide, className)}>{children}</div>;

type CarouselButtonProps = Omit<ComponentProps<"button">, "aria-disabled" | "aria-label" | "disabled" | "onClick" | "ref" | "type">;

export const CarouselPreviousButton = ({ className, ...restProps }: CarouselButtonProps) => {
    const { hasNavigation, goToPrev } = useCarousel();

    if (!hasNavigation) {
        return null;
    }

    return <button type="button" data-carousel-part="previousButton" onClick={goToPrev} className={clsx(styles.button, className)} {...restProps} />;
};

export const CarouselNextButton = ({ className, ...restProps }: CarouselButtonProps) => {
    const { hasNavigation, goToNext } = useCarousel();

    if (!hasNavigation) {
        return null;
    }

    return <button type="button" data-carousel-part="nextButton" onClick={goToNext} className={clsx(styles.button, className)} {...restProps} />;
};

type CarouselStatusProps<T extends ElementType> = {
    as?: T;
} & Omit<ComponentProps<T>, "aria-atomic" | "aria-live" | "children">;

export const CarouselStatus = <T extends ElementType = "p">(props: CarouselStatusProps<T>) => {
    const { as = "p", ...restProps } = props;
    // The generic props of `as` can't be combined with the data attribute.
    const Component: ElementType = as;
    const { hasNavigation } = useCarousel();

    if (!hasNavigation) {
        return null;
    }

    // The plugin writes the text.
    return <Component {...restProps} data-carousel-part="status" />;
};
