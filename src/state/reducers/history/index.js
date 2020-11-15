import * as types from "./types";

import {ROOT_VIEW} from "../../../constants/View";
import {FIND_PANEL} from "../../../constants/Panel";

const initialState = {
  activeView: ROOT_VIEW,
  activePanel: FIND_PANEL,
  history: [{panelId: FIND_PANEL, viewId: ROOT_VIEW}],
};

const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SAID_PARAMS:
      return {
        ...state,
        ...action.payload
      };
    case types.SET_ACTIVE_PANEL:
      return {
        ...state,
        activePanel: action.payload.panelId,
        history: action.payload.needSave ? [...state.history, {panelId: action.payload.panelId, viewId: action.payload.viewId}] : state.history,
      };

    case types.SET_ACTIVE_VIEW: {
      const { viewId, panelId } = action.payload;

      return {
        ...state,
        activeView: viewId,
        activePanel: panelId,
        history: [...state.history, action.payload.history],
      };
    }

    case types.SET_PREVIOUS_PANEL:
      return {
        ...state,
        activeView: action.payload[action.payload.length - 1].viewId,
        activePanel: action.payload[action.payload.length - 1].panelId,
        history: [...action.payload],
      };
    default:
      return state;
  }
};

export default historyReducer;
