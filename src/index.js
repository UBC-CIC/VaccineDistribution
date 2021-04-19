/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import config from './aws-exports';
import thunk from "redux-thunk";
import Amplify from "aws-amplify";

import './index.css';
import reducers from "./Reducers";
// import "./assets/css/generalStyling.css"
// import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import 'semantic-ui-css/semantic.min.css';

import {Provider} from "react-redux";
import App from "./App";

Amplify.configure(config);

const store = createStore(
    reducers, applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);
