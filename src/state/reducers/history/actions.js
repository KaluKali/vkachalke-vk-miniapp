import bridge from "@vkontakte/vk-bridge";
import * as types from "./types";
import {BOARD_PANEL} from "../../../constants/Panel";
import {setModalView, setPopoutView, setPreviousModal, setVkSaidParams} from "../vk/actions";

export const setActivePanel = (panelId,needSave=true) => {
  return (dispatch, getState) => {
    const state = getState();
    const { activePanel, activeView } = state.history;
    if (activePanel === panelId) return;
    if (activePanel === BOARD_PANEL) {
      bridge.send('VKWebAppEnableSwipeBack');
    }
    if (state.vk.snackbar) {
      dispatch(setVkSaidParams({snackbar:null}))
    }
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

    if (state.vk.popout) {
      return dispatch(setPopoutView(null))
    }
    if (state.vk.modal) {
      return dispatch(setPreviousModal())
    }
    if (state.vk.snackbar) {
      dispatch(setVkSaidParams({snackbar:null}))
    }

    if (history.length === 1) {
      return bridge.send('VKWebAppClose', { status: "success" });
    }

    const newHistory = history.slice(0, history.length - 1);

    const activePanel = history[history.length - 1];
    if (activePanel === BOARD_PANEL) {
      bridge.send('VKWebAppDisableSwipeBack');
    }

    return dispatch({ type: types.SET_PREVIOUS_PANEL, payload: newHistory });
  };
};

export const setHistorySaidParams = (params) => ({
  type: types.SET_SAID_PARAMS,
  payload: params,
});
