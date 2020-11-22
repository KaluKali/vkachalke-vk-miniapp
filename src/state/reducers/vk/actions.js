import * as types from "./types";
import bridge from "@vkontakte/vk-bridge";
import axios from 'axios';
import {MAIN_SERVER_URL} from "../../../constants/Backend";


export const changeScheme = ( scheme, needChange = false ) => dispatch =>{
    let isLight = ['bright_light', 'client_light'].includes( scheme );

    if( needChange ) isLight = !isLight;

    bridge.send('VKWebAppSetViewSettings', {
        'status_bar_style': isLight ? 'dark' : 'light',
        'action_bar_color': isLight ? '#ffffff' : '#191919'
    });
    dispatch(setVkSaidParams({scheme:isLight ? 'bright_light' : 'space_gray'}))
};
/** User-info **/
export const setVkUser = (user, type) => ({
  type: type,
  payload: user,
});
export const fetchVkUser = () => dispatch =>
    bridge.send('VKWebAppGetUserInfo')
        .then(data=>dispatch(setVkUser(data, types.SET_VK_USER)));
export const fetchServerUser = (cb) => dispatch =>
    axios.get(`${MAIN_SERVER_URL}/users/info`, {params:{
        vk_start_params:window.location.search
      }})
        .then(({data})=>{
            dispatch(setVkUser(data, types.SET_SERVER_USER));
            if (cb) cb(data);
        });
export const sendRequest = (type, params, cb) => dispatch =>{
    axios.post(`${MAIN_SERVER_URL}/centers/requests`, {
        type:type,
        params:params,
        vk_start_params:window.location.search
    })
    .then(({data})=>{
        if (cb) cb(data)
    });
}
/** For popout props **/
export const setPopoutView = (popout) => ({
  type: types.SET_SAID_PARAMS,
  payload: {popout:popout},
});
export const setModalView = (modal) => ({
  type: types.SET_SAID_PARAMS,
  payload: {modal:modal},
});

export const setVkSaidParams = (params) => ({
    type: types.SET_SAID_PARAMS,
    payload: params,
});
/** VK USER **/
export const abstractVkBridge = (method, params, cb) => {
    bridge.send(method, params).then(data=>cb ? cb(data) : null);
};
export const fetchPhoto = (image,upload_url, cb) => {
    axios.post(`${MAIN_SERVER_URL}/centers/upload`, {
        image:image,
        upload_url:upload_url,
        vk_start_params:window.location.search
    })
        .then(({data})=>{
            if (cb) cb(data)
        });
};
export const sendUserChanges = (user) => {
    axios.post(`${MAIN_SERVER_URL}/users/info`, {
        user:user,
        vk_start_params:window.location.search
    })
        .catch(err=>console.trace(err))
}
export const fetchCities = (input, cb, limit=10,offset=0) => {
    axios.get(`${MAIN_SERVER_URL}/centers/cities`, {params:{
            q:input,
            limit:limit,
            offset:offset
        }}).then(({data})=> cb ? cb(data) : null)
}
export const appShowWallPostBox = (center,photo) =>{
    bridge.send('VKWebAppShowWallPostBox', {
        message: `Я хожу в ${center.data.name}!`,
        attachments: [
            photo ? photo : ''
        ],
        lat: center.data.map.lat,
        long: center.data.map.lng
    })
};
