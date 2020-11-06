import * as types from "./types";
import axios from 'axios';


export const setActiveCenters = (centers) => ({
    type: types.SET_ACTIVE_CENTERS,
    payload: centers,
});
/** Fetch centers **/
export const fetchCenters = (city, limit=10, offset=0) => dispatch =>
    axios.get('https://kalukali.pw:3000/centers', {params:{
            city:city,
            limit:limit,
            offset:offset,
            vk_start_params:window.location.search
        }
    })
        .then(data=>dispatch(setActiveCenters(data.data)))
        .catch(err=>console.error(err));
/** Post-request for comment centers **/
export const manageComment = (payload, event_type) => ({
    type: event_type,
    payload: payload,
});
export const fetchComments = (center, cb) => dispatch =>
    axios.get('https://kalukali.pw:3000/centers/comment', {params:{
            id:center.id
        }
    })
        .then(data=>{
            dispatch(manageComment(data.data, types.SET_COMMENTS));
            if (cb) cb();
        })
        .catch(err=>console.log(err));
export const appendComment = (user, center, comment, type=0,stars=0) => dispatch =>
    axios.post('https://kalukali.pw:3000/centers/comment/insert', {
        id:center.id,
        f_n:user.first_name,
        l_n:user.last_name,
        ava:user.photo_100,
        txt:comment,
        vk_s_p:window.location.search,
        type:type,
        stars:stars
    })
        .then(data=>dispatch(manageComment({user,center,comment, id:data.data.id}, types.APPEND_COMMENT)))
        .catch(err=>console.error(err));
export const deleteComment = (comment) => dispatch =>
    axios.post('https://kalukali.pw:3000/centers/comment/delete',
        {
            post_id:comment.post_id,
            comment_id:comment.id,
            vk_start_params: window.location.search
        })
        .then(()=>dispatch(manageComment(comment, types.DELETE_COMMENT)))
        .catch(err=>console.log(err));
/** Post-request for liking centers **/
export const likeCenter = (key, event) => ({
    type: types.LIKE_CENTER,
    payload: {key:key, state:event},
});
export const postLiking = (id, key) => dispatch =>
    axios.post('https://kalukali.pw:3000/centers/like', {
        id:id,
        vk_start_params:window.location.search
    })
        .then(data=>dispatch(likeCenter(key, data.data)))
        .catch(err=>console.error(err));
/** For Post-panel **/
export const setActivePost = (post) => ({
    type: types.SET_ACTIVE_POST,
    payload: post,
});
