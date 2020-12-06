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
// export const fetchVkUser = () => dispatch =>
//     bridge.send('VKWebAppGetUserInfo')
//         .then(data=>dispatch(setVkUser(data, types.SET_VK_USER)));

export const fetchServerSupports = (city) =>
    axios.get(`${MAIN_SERVER_URL}/users/supports`, {params:{
            city:city,
            vk_start_params:window.location.search
        }})
export const fetchServerUser = () =>
    axios.get(`${MAIN_SERVER_URL}/users/info`, {params:{
        vk_start_params:window.location.search
      }})
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
export const setSnackBar = (snackbar) => ({
    type: types.SET_SAID_PARAMS,
    payload: {snackbar:snackbar},
});

export const setPreviousModal = () =>{
    return (dispatch, getState) => {
        const state = getState();
        const { modalHistory } = state.vk;

        let newHistory;
        if (modalHistory.length!==1) newHistory = modalHistory.slice(0, modalHistory.length - 1)
        else newHistory = [null]

        // console.log(modalHistory,newHistory)
        window.history.pushState({ panel: state.history.panelId, view:state.history.activeView }, state.history.panelId)
        dispatch({
            type: types.SET_SAID_PARAMS,
            payload: {modal:newHistory[newHistory.length-1], modalHistory:newHistory},
        })
    };
}
export const setModalView = (modal) => {
    return (dispatch, getState) => {
        const state = getState();
        const { modalHistory } = state.vk;
        // console.log(modalHistory,[...modalHistory, modal])
        dispatch({
            type: types.SET_SAID_PARAMS,
            payload: {modal:modal, modalHistory:[...modalHistory, modal]},
        })
    };
};

export const setVkSaidParams = (params) => ({
    type: types.SET_SAID_PARAMS,
    payload: params,
});
/** VK USER **/
export const abstractVkBridge = (method, params, cb) => {
    bridge.send(method, params)
        .then(cb)
        .catch(err=>cb(null,err));
};
export const abstractVkBridgePromise = (method, params) => bridge.send(method, params);
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
export const sendUserChanges = (user) =>
    axios.post(`${MAIN_SERVER_URL}/users/info`, {
        user:user,
        vk_start_params:window.location.search
})
export const fetchCities = (input, cb, limit=10,offset=0) => {
    axios.get(`${MAIN_SERVER_URL}/centers/cities`, {params:{
            q:input,
            limit:limit,
            offset:offset,
            vk_start_params:window.location.search
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
