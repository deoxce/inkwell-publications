import { useEffect, useState, useRef, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { NavigationContext } from '../Navigation/NavigationContext.jsx';

import About from '../../pages/About/About.jsx';
import News from '../../pages/News/News.jsx';
import Contacts from '../../pages/Contacts/Contacts.jsx';
import Catalog from '../../pages/Catalog/Catalog.jsx';

import './Pages.css';

export default function Pages() {
    const location = useLocation();

    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState("");

    const contentRef = useRef(null);
    const newPageOffset = useRef(0);

    const pageTransitionDuration = 1000;
    const pageTransitionDistance = 17;

    const {activeLinkRef, selectionRef} = useContext(NavigationContext);

    useEffect(() => {
        if (location === displayLocation) return;

        setTransitionStage("fadeOut");
        newPageOffset.current = 0;

        pageTransition(pageTransitionDuration);
    }, [location.pathname]);

    function pageTransition(duration) {
        const navDirectionIsRight = isNavDirectionRight();
        const startTime = performance.now();

        requestAnimationFrame(animate);

        function animate(currentTime) {
            let timeFraction = (currentTime - startTime) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = easeOutExpo(timeFraction);
            if (progress < 0) progress = 0;

            animatePageTransition(progress, navDirectionIsRight);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }
    }

    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function animatePageTransition(progress, navDirectionIsRight) {
        if (navDirectionIsRight) {
            contentRef.current.style.right = -newPageOffset.current + progress * pageTransitionDistance + 'vw';
        } else {
            contentRef.current.style.right = newPageOffset.current - progress * pageTransitionDistance + 'vw';
        }
    }

    function isNavDirectionRight() {
        const currentLeft = selectionRef.current.offsetLeft;
        const currentWidth = selectionRef.current.offsetWidth;

        if (activeLinkRef.current == null) return false;

        const activeLeft = activeLinkRef.current.offsetLeft;

        if (currentLeft <= activeLeft || currentWidth == 0) return true;
        if (currentLeft > activeLeft) return false;
    }

    function setNewPage() {
        if (transitionStage === "fadeOut") {
            newPageOffset.current = pageTransitionDistance;
            setTransitionStage("fadeIn");
            setDisplayLocation(location);
        }
    }

    return (
        <div ref={contentRef} className={`${transitionStage} content`} onAnimationEnd={setNewPage}>
            <Routes location={displayLocation}>
                <Route path="/" element/>
                <Route path="/about" element={<About />} />
                <Route path="/news" element={<News />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/catalog" element={<Catalog />} />

                <Route path="*" element />
            </Routes>
        </div>
    )
}