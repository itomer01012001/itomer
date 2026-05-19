import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.2,
        });

        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                return arguments.length
                    ? lenis.scrollTo(value, { immediate: true })
                    : lenis.scroll;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            pinType: document.body.style.transform ? "transform" : "fixed"
        });

        const updateScroller = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateScroller);

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();

        return () => {
            gsap.ticker.remove(updateScroller);

            lenis.off("scroll", ScrollTrigger.update);
            lenis.destroy();

            ScrollTrigger.scrollerProxy(document.body, null);
        };
    }, []);

    return children;
}

export default SmoothScroll;