import * as types from "./actionTypes";
import bridge from "@vkontakte/vk-bridge";
import axios from 'axios';

export const setVkUser = (user) => ({
  type: types.SET_VK_USER,
  payload: user,
});

export const getUser = () => dispatch => {
  bridge.send('VKWebAppGetUserInfo')
      .then(data =>dispatch(setVkUser(data)));
};
