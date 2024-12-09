import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Home from './pages/Home/Home.jsx';

ReactDOM.createRoot(document.querySelector('#root')).render(
    <BrowserRouter>
        <Home />
    </BrowserRouter>
);