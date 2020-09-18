import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import {
    ConnectedRouter,
    routerReducer,
    routerMiddleware
} from "react-router-redux";
import appReducer from "./reducer";
import thunk from "redux-thunk";

import App from "./app";
const yootFull = require('./assets/images/yoot-full.png')
const imgBg = require('./assets/images/img-bg.png')

const history = createBrowserHistory();
const middleware = routerMiddleware(history);
const store = createStore(
    combineReducers({
        ...appReducer,
        router: routerReducer
    }),
    applyMiddleware(middleware, thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
