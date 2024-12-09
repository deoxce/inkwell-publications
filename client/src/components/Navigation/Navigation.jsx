import { useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from 'react-router-dom';
import { NavigationContext } from './NavigationContext.jsx';

import './Navigation.css';

export default function Navigation() {

    const location = useLocation();

    const {activeLinkRef, selectionRef} = useContext(NavigationContext);

    useEffect(() => {
        moveSelection(800);
    }, [location.pathname]);

    function moveSelection(duration) {
        const currentLeft = selectionRef.current.offsetLeft;
        const currentWidth = selectionRef.current.offsetWidth;

        const startTime = performance.now();

        requestAnimationFrame(animate);

        function animate(currentTime) {
            let timeFraction = (currentTime - startTime) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = easeOutExpo(timeFraction);
            if (progress < 0) progress = 0;

            animateSelection(progress, currentLeft, currentWidth);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }
    }

    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function animateSelection(progress, currentLeft, currentWidth) {
        if (activeLinkRef.current == null) {
            selectionRef.current.style.width = currentWidth - currentWidth * progress + 'px';
            return;
        }

        if (currentWidth == 0) {
            selectionRef.current.style.left = activeLinkRef.current.offsetLeft + 'px';
            currentLeft = selectionRef.current.style.left;
        }

        const widthDistance = Math.abs(activeLinkRef.current.offsetWidth - currentWidth);
        const leftDistance = Math.abs(activeLinkRef.current.offsetLeft - currentLeft);

        if (currentWidth < activeLinkRef.current.offsetWidth) {
            selectionRef.current.style.width = currentWidth + widthDistance * progress + 'px';
        } else if (currentWidth > activeLinkRef.current.offsetWidth) {
            selectionRef.current.style.width = currentWidth - widthDistance * progress + 'px';
        }

        if (currentLeft < activeLinkRef.current.offsetLeft) {
            selectionRef.current.style.left = currentLeft + leftDistance * progress + 'px';
        } else if (currentLeft > activeLinkRef.current.offsetLeft) {
            selectionRef.current.style.left = currentLeft - leftDistance * progress + 'px';
        }
    }

    useEffect(() => {
        addEventListener('resize', fixSelection);

        document.querySelectorAll('a').forEach(item => {
            item.addEventListener('dragstart', prevent);
        });

        activeLinkRef.current = document.querySelector('.active');

        return () => {
            removeEventListener('resize', fixSelection);

            document.querySelectorAll('a').forEach(item => {
                item.removeEventListener('dragstart', prevent);
            });

            activeLinkRef.current = null;
        }
    });

    function fixSelection() {
        moveSelection(0);
    }

    function prevent(event) {
        event.preventDefault();
    }

    return (
        <nav>
            <ul>
                <li><NavLink to={"/about"} className={"link"}>о нас</NavLink></li>
                <li><NavLink to={"/news"} className={"link"}>новости</NavLink></li>
                <li><NavLink to={"/contacts"} className={"link"}>контакты</NavLink></li>
                <li><NavLink to={"/catalog"} className={"link"}>каталог</NavLink></li>
                <div ref={selectionRef} className="selection"></div>
            </ul>
        </nav>
    )
}