import * as types from "./types";
import bridge from "@vkontakte/vk-bridge";
import axios from 'axios';

export const changeScheme = ( scheme, needChange = false ) => dispatch =>{
    let isLight = ['bright_light', 'client_light'].includes( scheme );

    if( needChange ) {
        isLight = !isLight;
    }

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
    axios.get('https://kalukali.pw:3000/users/info', {params:{
        vk_start_params:window.location.search
      }})
        .then(data=>{
            dispatch(setVkUser(data.data, types.SET_SERVER_USER));
            if (cb) cb();
        });
/** For popout props **/
export const setPopoutView = (popout) => ({
  type: types.SET_POPOUT_VIEW,
  payload: popout,
});
export const setModalView = (modal) => ({
  type: types.SET_MODAL_VIEW,
  payload: modal,
});

export const setVkSaidParams = (params) => ({
    type: types.SET_SAID_PARAMS,
    payload: params,
});
/** VK USER **/
export const abstractVkBridge = (method, params, cb) => dispatch => {
    bridge.send(method, params).then(data=>cb ? cb(data) : null);
};
export const fetchPhoto = (center, access_token,upload_url, cb) => dispatch => {
    axios.post('https://kalukali.pw:3000/centers/upload', {
        image:center.image,
        access_token:access_token,
        upload_url:upload_url,
        vk_start_params:window.location.search
    })
        .then(({data})=>{
            if (cb) cb(data)
        });
};

export const appShowWallPostBox = (center,photo) => dispatch =>{
    bridge.send("VKWebAppShowWallPostBox", {
        message: `Я хожу в ${center.data.name}!`,
        attachments: [
            photo ? photo : ''
        ],
        lat: center.data.map.lat,
        long: center.data.map.lng
    })
};
