import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import 'react-modern-drawer/dist/index.css'
import 'react-phone-input-2/lib/style.css'
import 'video-react/dist/video-react.css'
import {Provider} from 'react-redux';
import {store} from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);


