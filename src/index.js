import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import {Provider} from "react-redux";

import App from "./core/App";

import registerServiceWorker from "./core/serviceWorker";
import {VK_APP_INIT} from "./constants/Bridge";
import store from "./state";


bridge.send(VK_APP_INIT);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);

