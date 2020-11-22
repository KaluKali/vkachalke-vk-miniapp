import * as types from './types';
import axios from 'axios';
import {MAIN_SERVER_URL} from "../../../constants/Backend";

/** Fetch centers **/
export const manageCenters = (centers, event_type) => ({
    type: event_type,
    payload: centers,
});
export const appendCenters = (city, limit=10, offset=0, search='',category='') => dispatch =>
    axios.get(`${MAIN_SERVER_URL}/centers`, {params:{
            city:city,
            limit:limit,
            offset:offset,
            search:search,
            category:category,
            vk_start_params:window.location.search
        }
    })
        .then(data=>dispatch(manageCenters(data.data, types.APPEND_CENTERS)))
        .catch(err=>console.error(err));
export const fetchCenters = (city, limit=10, offset=0, search='', category='') => dispatch => {
    axios.get(`${MAIN_SERVER_URL}/centers`, {params:{
            city:city,
            limit:limit,
            offset:offset,
            search:search,
            category:category,
            vk_start_params:window.location.search
        }
    })
        .then(({data})=>dispatch(manageCenters({data:data, category:category}, types.SET_CENTERS)))
        .catch(err=>console.error(err));
};
/** Rating **/
export const fetchRatingCenters = (city, limit=10, offset=0, cb) =>{
    axios.get(`${MAIN_SERVER_URL}/centers`, {params:{
            city:city,
            limit:limit,
            offset:offset,
            reviews: 0,
            vk_start_params:window.location.search
        }
    })
        .then(cb)
        .catch(err=>console.error(err));
}
/** **/
export const fetchComments = (center, cb) => dispatch =>
    axios.get(`${MAIN_SERVER_URL}/centers/comment`, {params:{
            id:center.id,
            vk_start_params:window.location.search
        }
    })
        .then(({data})=>{
            dispatch(manageCenters(data, types.SET_COMMENTS));
            if (cb) cb();
        })
        .catch(err=>console.log(err));
export const appendComment = (user, center, comment, type=0,stars=0, works=null) => dispatch =>
    axios.post(`${MAIN_SERVER_URL}/centers/comment/insert`, {
        id:center.id,
        f_n:user.first_name,
        l_n:user.last_name,
        ava:user.photo_100,
        txt:comment,
        vk_s_p:window.location.search,
        type:type,
        stars:stars
    })
        .then(data=>{
            dispatch(manageCenters({user,center,comment, id:data.data.id, type, stars}, types.APPEND_COMMENT))
            works && dispatch(works)
        })
        .catch(err=>console.error(err));
export const deleteComment = (comment) => dispatch =>
    axios.post(`${MAIN_SERVER_URL}/centers/comment/delete`,
        {
            post_id:comment.post_id,
            comment_id:comment.id,
            type:comment.type,
            vk_start_params: window.location.search
        })
        .then(()=>dispatch(manageCenters(comment, types.DELETE_COMMENT)))
        .catch(err=>console.log(err));
/** Comments-request for liking centers **/
export const postLiking = (id, key) => dispatch =>
    axios.post(`${MAIN_SERVER_URL}/centers/like`, {
        id:id,
        vk_start_params:window.location.search
    })
        .then(({data})=>dispatch(manageCenters({key:key, state:data}, types.LIKE_CENTER)))
        .catch(err=>console.error(err));
/** For Comments-panel **/
export const setCenterSaidParams = (params) => ({
    type: types.SET_SAID_PARAMS,
    payload: params,
});
/** Edit center **/
export const sendCenterChanges = (id, images, changes,cb ) => dispatch =>(
    axios.post(`${MAIN_SERVER_URL}/centers/edit`, {
        id:id,
        image:images,
        changes:changes,
        vk_start_params:window.location.search
    }).then(cb)
)
export const fetchFeed = (cb) => dispatch =>(
    axios.get(`${MAIN_SERVER_URL}/centers/feed`, { params:{vk_start_params:window.location.search}})
        .then(({data})=>{
            dispatch(setCenterSaidParams({feed:data}))
            if (cb) cb();
        })
)
