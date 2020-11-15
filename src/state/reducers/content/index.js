import * as types from './types';
import {Snackbar} from "@vkontakte/vkui";
import {setVkSaidParams} from "../vk/actions";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";

const initialState = {
  active_post_index:0,
  active_post_comments:{ content:[] },
  item_offset:0,
  centers:[],
  hasMore:true,
  activeCategory:'',
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SAID_PARAMS:
      return {
        ...state,
        ...action.payload
      };
    case types.SET_CENTERS:
      return {
        ...state,
        centers: action.payload.data,
        activeCategory: action.payload.category,
        hasMore: action.payload.data.length > 0
      };
    case types.APPEND_CENTERS:
      return {
        ...state,
        centers: state.centers.concat(action.payload),
        item_offset: state.item_offset+10,
        hasMore: action.payload.length > 0
      };
    case types.LIKE_CENTER:
      state.centers[action.payload.key].liked=action.payload.state.liked;
      state.centers[action.payload.key].likes=action.payload.state.likes;
      return {
        ...state,
        centers: state.centers,
      };
    case types.SET_COMMENTS:
      return {
        ...state,
        active_post_comments: action.payload
      };
    case types.APPEND_COMMENT:
      if (action.payload.type) state.centers[state.active_post_index].comments=parseInt(state.centers[state.active_post_index].comments)+1;
      return {
        ...state,
        active_post_comments: {
          content:[...state.active_post_comments.content,
            {
              id:action.payload.id,
              post_id:action.payload.center.id,
              first_name:action.payload.user.first_name,
              last_name:action.payload.user.last_name,
              photo_100:action.payload.user.photo_100,
              text:action.payload.comment,
              stars:action.payload.stars,
              type:action.payload.type,
              vk_user_id:action.payload.user.id
            }]
        }
      };
    case types.DELETE_COMMENT:
      if (action.payload.type) state.centers[state.active_post_index].comments=parseInt(state.centers[state.active_post_index].comments)-1;
      return {
        ...state,
        active_post_comments: {
          ...state.active_post_comments,
          content: state.active_post_comments.content.filter(cmt=>cmt.id!==action.payload.id)
        }
      };
    default:
      return state;
  }
};

export default contentReducer;
