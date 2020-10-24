import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";

import reducers from "./reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducers,
    composeEnhancers(applyMiddleware(thunk))
);
