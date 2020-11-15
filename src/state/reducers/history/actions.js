import bridge from "@vkontakte/vk-bridge";

import * as types from "./types";
import {VK_APP_CLOSE} from "../../../constants/Bridge";

export const setActivePanel = (panelId,needSave=true) => {
  return (dispatch, getState) => {
    const state = getState();
    const { activePanel, activeView } = state.history;

    if (activePanel === panelId) return;

    if (needSave) window.history.pushState({ panel: panelId, view:activeView }, panelId);
    dispatch({
      type: types.SET_ACTIVE_PANEL,
      payload: { panelId: panelId, viewId: activeView, needSave:needSave },
    });
  };
};

export const setActiveView = ({ panelId, viewId }) => {
  return (dispatch, getState) => {
    const state = getState();
    const { activePanel } = state.history;

    if (activePanel === panelId) {
      return;
    }
    window.history.pushState({ panel: panelId, view:viewId }, panelId);
    dispatch({
      type: types.SET_ACTIVE_VIEW,
      payload: { panelId:panelId, viewId:viewId, history:{panelId: panelId, viewId: viewId }},
    })
  }
};

export const setPreviousPanel = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { history } = state.history;

    if (history.length === 1) {
      return bridge.send(VK_APP_CLOSE, { status: "success" });
    }

    const newHistory = history.slice(0, history.length - 1);

    return dispatch({ type: types.SET_PREVIOUS_PANEL, payload: newHistory });
  };
};

export const setHistorySaidParams = (params) => ({
  type: types.SET_SAID_PARAMS,
  payload: params,
});
