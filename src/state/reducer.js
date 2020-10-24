import {combineReducers} from "redux";

import vk from "./reducers/vk";
import history from "./reducers/history";

export default combineReducers({
  history, vk
});
