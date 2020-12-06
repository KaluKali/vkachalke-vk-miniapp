import 'core-js/features/map';
import 'core-js/features/set';
import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import './styles/index.scss';
import '@vkontakte/vkui/dist/vkui.css';
import store from "./state";
import App from "./core/App";
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import bridge from "@vkontakte/vk-bridge";
import {fetchServerSupports, fetchServerUser} from "./state/reducers/vk/actions";
import {Spinner} from "@vkontakte/vkui";
// import('scroll-restoration-polyfill');

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


// function once(target, type, listener, useCapture) {
//     target.addEventListener(type, listener, useCapture);
//     target.addEventListener(type, function selfRemoving() {
//         target.removeEventListener(type, listener, useCapture);
//         target.removeEventListener(type, selfRemoving, useCapture);
//     }, useCapture);
// }
//
// once.promise = function (target, type, useCapture) { return new Promise(function (resolve) { return once(target, type, resolve, useCapture); }); };
//
// // import once from 'one-event';
// import { getScrollTop, getScrollLeft } from 'get-scroll';
//
// var state = 'auto';
//
// function waitForScroll() {
//     once(window, 'scroll',scrollTo.bind(window, getScrollLeft(), getScrollTop()));
// }
//
// Object.defineProperty(history, 'scrollRestoration', {
//     enumerable: true,
//     get: function () { return state; },
//     set: function (requestedState) {
//         if (requestedState === state) {
//             return;
//         }
//         if (requestedState === 'auto') {
//             window.removeEventListener('popstate', waitForScroll);
//             state = requestedState;
//         } else if (requestedState === 'manual') {
//             window.addEventListener('popstate', waitForScroll);
//             state = requestedState;
//         }
//     }
// });


function useResource() {
    return {
        user_info:wrapPromise(bridge.send('VKWebAppGetUserInfo'), fetchServerUser().then(({data})=>data))
    }
}
function wrapPromise(promise_bridge, promise_server) {
    let status = 'pending'
    let result;

    const suspender = Promise.all([promise_bridge, promise_server])
        .then(data=>{
            result = data[1].city ? {user:data[0], user_server:data[1]} : {user:data[0], user_server:{...data[1], city:data[0].city.title}}
            fetchServerSupports(result.user_server.city)
                .then(({data})=>{
                    result.user_server.isCitySupport=data.city
                    status = 'success'
                })
        }, err=>{
            status = 'error'
            result=err
        })
    return {
        read() {
            if (status==='pending') {
                throw suspender
            } else if (status === 'error') {
                throw result
            } else {
                return result
            }
        }
    }
}
ReactDOM.render(
    <Provider store={store}>
        <Suspense fallback={<Spinner />}>
            <App user_info={useResource().user_info} />
        </Suspense>
    </Provider>,
    document.getElementById("root")
);
