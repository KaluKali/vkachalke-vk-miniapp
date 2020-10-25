import * as types from "./types";
import bridge from "@vkontakte/vk-bridge";

export const setVkUser = (user) => ({
  type: types.SET_VK_USER,
  payload: user,
});

export const getUser = () => dispatch =>
    bridge.send('VKWebAppGetUserInfo')
    .then(data =>dispatch(setVkUser(data)));

export const setPopoutView = (popout) => ({
  type: types.SET_POPOUT_VIEW,
  payload: popout,
});
