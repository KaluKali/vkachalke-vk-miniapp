import 'core-js/es/map';
import 'core-js/es/set';
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import './styles/index.scss';
import '@vkontakte/vkui/dist/vkui.css';
import App from "./core/App";
import store from "./state";

import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";


Sentry.init({
    dsn: "https://f8c9977da1fc4eaaa5660cb17643b50b@o481121.ingest.sentry.io/5529172",
    integrations: [
        new Integrations.BrowserTracing(),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

// if (process.env.NODE_ENV === "development") {
//     import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
