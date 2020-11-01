import {combineReducers} from "redux";

import vk from "./reducers/vk";
import history from "./reducers/history";
import content from "./reducers/content";

export default combineReducers({
  history, vk, content
});
