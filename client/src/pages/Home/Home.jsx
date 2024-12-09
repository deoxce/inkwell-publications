import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import NavigationProvider from "../../components/Navigation/NavigationContext.jsx";
import Navigation from "../../components/Navigation/Navigation.jsx";
import Pages from "../../components/Pages/Pages.jsx";
import Profile from "../../components/Profile/Profile.jsx";

import "./Home.css";

export default function Home() {

    const location = useLocation();
    const navigate = useNavigate();

    const [headerIsOpen, setHeaderIsOpen] = useState(true);
    const [scrollPermission, setScrollPermission] = useState(true);

    const scrollDuration = 1500;
    // let startX, startY, endX, endY;
    // let minDistance = 50;

    useEffect(() => {
        // addEventListener('touchstart', handleTouchStart);
        // addEventListener('touchend', handleTouchEnd);

        // return () => {
        //     removeEventListener('touchstart', handleTouchStart);
        //     removeEventListener('touchend', handleTouchEnd);
        // }
        addEventListener('wheel', scrollHomePage, { passive: false });

        return () => {
            removeEventListener('wheel', scrollHomePage, { passive: false });
        }
    });

    // function handleTouchStart(event) {
    //     startX = event.touches[0].clientX;
    //     startY = event.touches[0].clientY;
    // }

    // function handleTouchEnd(event) {
    //     endX = event.changedTouches[0].clientX;
    //     endY = event.changedTouches[0].clientY;

    //     var deltaX = Math.abs(endX - startX);
    //     var deltaY = Math.abs(endY - startY);

    //     const block1Position = document.querySelector('#intro-block-1').offsetTop;
    //     const block2Position = document.querySelector('#intro-block-2').offsetTop;
    //     const block3Position = document.querySelector('main').offsetTop;

    //     if (!scrollPermission) return;

    //     if (deltaX > minDistance || deltaY > minDistance) {
    //         if (deltaX > deltaY) {
    //             if (endX > startX) {
    //                 // Right swipe
    //             } else {
    //                 // Left swipe
    //             }
    //         } else {
    //             if (endY > startY) {
    //                 const isDown = false;
    //                 if (scrollY > block2Position + 150) {
    //                     scroll(scrollDuration, block2Position, scrollY, isDown);
    //                 } else if (scrollY > block1Position + 150) {
    //                     scroll(scrollDuration, block1Position, scrollY, isDown);
    //                 }
    //             } else {
    //                 const isDown = true;
    //                 if (scrollY < block2Position - 150) {
    //                     scroll(scrollDuration, block2Position, scrollY, isDown);
    //                 } else if (scrollY < block3Position - 150) {
    //                     scroll(scrollDuration, block3Position, scrollY, isDown);
    //                 }
    //             }
    //         }
    //     }
    // }

    function scrollHomePage(event) {
        event.preventDefault();
        
        if (!scrollPermission) return;

        if (event.deltaY == 100) {
            if (headerIsOpen) {
                navigate('/news');
                scroll(scrollDuration, true);
            }
            setHeaderIsOpen(false);
        }
    }

    function scroll(duration, isDown) {
        setScrollPermission(false);
        const startTime = performance.now();

        requestAnimationFrame(animate);

        function animate(currentTime) {
            let timeFraction = (currentTime - startTime) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = easeInOutExpo(timeFraction);

            animateScroll(progress, isDown);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                setScrollPermission(true);
            }
        }
    }

    function easeInOutExpo(x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }

    function animateScroll(progress, isDown) {
        if (isDown) {
            document.querySelector('header').style.height = 80 - (80 - 17) * progress + 'vh';
        } else {
            document.querySelector('header').style.height = 17 + (80 - 17) * progress + 'vh';
        }
    }

    if (location.pathname !== '/' && headerIsOpen) {
        scroll(scrollDuration, true);
        setHeaderIsOpen(false);
    }

    return (
        <>
            <header>
                <h1>Inkwell publications</h1>
                <img src="img/INKWELL.png" alt="" id="intro" />
            </header>
            <main>
                <NavigationProvider>
                    <Navigation />
                    <Pages />
                </NavigationProvider>
                <Profile />
            </main>
        </>
    )
}