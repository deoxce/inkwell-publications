import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';

import "./Profile.css";

export default function Profile() {

    const location = useLocation();
    const navigate = useNavigate();

    const [profileFullscreen, setProfileFullscreen] = useState(false);
    const [uriBuffer, setUriBuffer] = useState('/');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    const backendHost = 'http://localhost:3000/api';

    useEffect(() => {
        if (location.pathname === '/profile') {
            navigate('/profile/personal');
        }

        if (location.pathname.startsWith('/profile')) {
            if (isAuthorized) {
                openProfileFullscreen();
            } else {
                navigate('/news');
            }
        } else {
            setUriBuffer(location.pathname);
        }
    }, [location.pathname]);

    function panelTransition(duration, open, fullscreen) {
        const startTime = performance.now();

        requestAnimationFrame(animate);

        function animate(currentTime) {
            let timeFraction = (currentTime - startTime) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = easeOutExpo(timeFraction);
            if (progress < 0) progress = 0;

            animatePanelTransition(progress, open, fullscreen);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }
    }

    function animatePanelTransition(progress, open, fullscreen) {
        const panel = document.querySelector('.panel');
        const panelWidth = 350;
        if (open) {
            if (fullscreen) {
                panel.style.left = (window.innerWidth - 350) - (window.innerWidth - 350) * progress + 'px';
            } else {
                panel.style.right = -panelWidth + panelWidth * progress + 'px';
            }
        } else {
            if (fullscreen) {
                panel.style.removeProperty('left');
                panel.style.right = (window.innerWidth - 350) - (window.innerWidth - 350) * progress + 'px';
            } else {
                panel.style.right = -panelWidth * progress + 'px';
            }
        }
    }

    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function easeInOutExpo(x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }

    function hidePanel() {
        if (profileFullscreen) {
            navigate(uriBuffer);
            panelTransition(1000, false, true);
            setProfileFullscreen(false);
        } else {
            panelTransition(1000, false, false);
        }
    }

    function showPanel() {
        if (localStorage.getItem('jwt_token') !== null) {
            showUserProfile();
        }
        panelTransition(1000, true, false);
    }

    function openProfileFullscreen() {
        if (!profileFullscreen) {
            panelTransition(1000, true, true);
            setProfileFullscreen(true);
        }
    }

    function showSignIn() {
        document.querySelector('.panel-top > h3').innerHTML = "авторизация";
        authTransition(1000, true);
    }

    function showSignUp() {
        document.querySelector('.panel-top > h3').innerHTML = "регистрация";
        authTransition(1000, false);
    }

    function authTransition(duration, toLeft) {
        const startTime = performance.now();

        requestAnimationFrame(animate);

        function animate(currentTime) {
            let timeFraction = (currentTime - startTime) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = easeInOutExpo(timeFraction);
            if (progress < 0) progress = 0;

            animateAuthTransition(progress, toLeft);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }
    }

    function animateAuthTransition(progress, toLeft) {
        const form = document.querySelector('.forms');

        if (toLeft) {
            form.style.right = 350 * progress + 'px';
        } else {
            form.style.right = 350 - 350 * progress + 'px';
        }
    }

    async function handleSignIn(event) {
        event.preventDefault();

        const user = {
            login: event.target.login.value,
            password: event.target.password.value
        };

        const response = await fetch(`${backendHost}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const loginMessage = document.querySelector('.sign-in-login-message');
        const passwordMessage = document.querySelector('.sign-in-password-message');

        if (response.status === 200) {
            loginMessage.innerHTML = '';
            passwordMessage.innerHTML = '';

            const data = await response.json();

            localStorage.setItem('jwt_token', data.token);

            document.querySelector('.sign-in-form > form').reset();

            showUserProfile();
        } else if (response.status === 409) {
            const data = await response.json();
            console.log(data);

            loginMessage.innerHTML = data.loginMessage;
            passwordMessage.innerHTML = data.passwordMessage;
        } else {
            console.log(response);
        }
    }

    async function handleSignUp(event) {
        event.preventDefault();

        const user = {
            email: event.target.email.value,
            login: event.target.login.value,
            password: event.target.password.value
        };

        const response = await fetch(`${backendHost}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const emailMessage = document.querySelector('.sign-up-email-message');
        const loginMessage = document.querySelector('.sign-up-login-message');
        const passwordMessage = document.querySelector('.sign-up-password-message');

        if (response.status === 201) {
            const message = await response.text();
            console.log(message);

            emailMessage.innerHTML = '';
            loginMessage.innerHTML = '';
            passwordMessage.innerHTML = '';

            document.querySelector('.sign-up-form > form').reset();

            showSignIn();
        } else if (response.status === 409) {
            const data = await response.json();
            console.log(data);

            emailMessage.innerHTML = data.emailMessage;
            loginMessage.innerHTML = data.loginMessage;
            passwordMessage.innerHTML = data.passwordMessage;
        } else {
            console.log(response);
        }
    }

    function handleSignOut(event) {
        event.preventDefault();

        localStorage.removeItem('jwt_token');

        if (profileFullscreen) {
            navigate(uriBuffer);
            panelTransition(1000, false, true);
            setProfileFullscreen(false);
        }

        showUserProfile();
    }

    async function getUserData() {
        const response = await fetch(`${backendHost}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            }
        });

        if (response.status === 200) {
            const profileData = await response.json();
            return [profileData.user_id, profileData.user_type_id];
        } else if (response.status === 400 || response.status === 401) {
            return [0, 0];
        } else {
            console.log(response);
        }
    }

    async function showUserProfile() {
        const [user_id, user_type_id] = await getUserData();

        if (user_id === 0) {
            document.querySelector('.profile').style.display = 'none';
            document.querySelector('.forms').style.display = 'flex';
            document.querySelector('.forms').style.right = '350px';
            document.querySelector('.panel-top > h3').innerHTML = 'авторизация';
            return;
        }

        document.querySelector('.profile').style.display = 'block';
        document.querySelector('.forms').style.display = 'none';
        document.querySelector('.panel-top > h3').innerHTML = 'профиль';

        setIsAuthorized(true);
        if (user_type_id === 1) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }

    return (
        <>
            <div className="profile-button-block" onClick={showPanel}>
                <div className="profile-button">
                    <img src="/img/profile-icon.png" alt="profile icon" />
                </div>
            </div>
            <div className="panel">
                <div className="panel-top">
                    <img src="/img/arrow1.png" alt="arrow" onClick={hidePanel} />
                    <h3>регистрация</h3>
                </div>
                <div className="mask">
                    <div className="profile">
                        <ul>
                            <li><Link to={"/profile/personal"} onClick={openProfileFullscreen} className="link">личный кабинет</Link></li>
                            <li><Link to={"/profile/cart"} onClick={openProfileFullscreen} className="link">корзина</Link></li>
                            <li><Link to={"/profile/books"} onClick={openProfileFullscreen} className="link">печать книг</Link></li>
                            <li><Link to={"/profile/settings"} onClick={openProfileFullscreen} className="link">настройки</Link></li>
                            {isAdmin && <li><Link to={"/profile/admin"} onClick={openProfileFullscreen} className="link">панель администратора</Link></li>}
                            <li><Link onClick={handleSignOut} className="link">выход</Link></li>
                        </ul>
                    </div>
                    <div className="forms">
                        <div className="sign-up-form">
                            <form method="post" onSubmit={handleSignUp}>
                                <input className="input" type="text" name="email" placeholder="email" />
                                <p className="auth-message sign-up-email-message"></p>
                                <input className="input" type="text" name="login" placeholder="login" />
                                <p className="auth-message sign-up-login-message"></p>
                                <input className="input" type="password" name="password" placeholder="password" />
                                <p className="auth-message sign-up-password-message"></p>
                                <input className="button sign-up-button" type="submit" value="sign up" />
                            </form>
                            <div className="auth-button-block" onClick={showSignIn}>
                                <h4>авторизация</h4>
                                <img src="/img/arrow2.png" alt="arrow" />
                            </div>
                        </div>
                        <div className="sign-in-form">
                            <form method="post" onSubmit={handleSignIn}>
                                <input className="input" type="text" name="login" placeholder="login" />
                                <p className="auth-message sign-in-login-message"></p>
                                <input className="input" type="password" name="password" placeholder="password" />
                                <p className="auth-message sign-in-password-message"></p>
                                <input className="button sign-in-button" type="submit" value="sign in" />
                            </form>
                            <div className="auth-button-block" onClick={showSignUp}>
                                <img src="/img/arrow3.png" alt="arrow" />
                                <h4>регистрация</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block">
                    <Routes>
                        <Route path="/profile/personal" element={<h3>личный кабинет</h3>} />
                        <Route path="/profile/cart" element={<h3>корзина</h3>} />
                        <Route path="/profile/books" element={<h3>печать книги</h3>} />
                        <Route path="/profile/settings" element={<h3>настройки</h3>} />
                        <Route path="/profile/admin" element={<h3>панель управления</h3>} />
                        <Route path="*" element />
                    </Routes>
                </div>
            </div>
        </>
    )
}