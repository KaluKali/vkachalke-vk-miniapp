import * as types from "./types";
import bridge from "@vkontakte/vk-bridge";
import axios from 'axios';

/** Fetch centers **/
export const setActiveCenters = (centers) => ({
    type: types.SET_ACTIVE_CENTERS,
    payload: centers,
});
export const getCenters = (city, vk_start_params, limit=10, offset=0) => dispatch =>
    axios.get('https://kalukali.pw:3000/centers', {params:{
            city:city,
            limit:limit,
            offset:offset,
            vk_start_params:vk_start_params
        }
    })
        .then(data=>dispatch(setActiveCenters(data.data)))
        .catch(err=>console.error(err));
/** Post-request for liking centers **/
export const likeCenter = (key, event) => ({
    type: types.LIKE_CENTER,
    payload: {key:key, state:event},
});
export const postLiking = (id, key, vk_start_params) => dispatch =>
    axios.post('https://kalukali.pw:3000/centers/like', {
        id:id,
        vk_start_params:vk_start_params
    })
        .then(data=>dispatch(likeCenter(key, data.data)))
        .catch(err=>console.error(err));
/** For Post-panel **/
export const setActivePost = (post) => ({
    type: types.SET_ACTIVE_POST,
    payload: post,
});
