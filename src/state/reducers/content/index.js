import * as types from './types';

const initialState = {
  active_post_index:0,
  active_post_comments:{content:[],stars:{
      medium:0,
      lines:[]
    }},
  centers:[],
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ACTIVE_POST:
      return {
        ...state,
        active_post_index: action.payload
      };
    case types.SET_ACTIVE_CENTERS:
      return {
        ...state,
        centers: state.centers.concat(action.payload)
      };
    case types.LIKE_CENTER:
      state.centers[action.payload.key].liked=action.payload.state.liked;
      state.centers[action.payload.key].likes=action.payload.state.likes;
      return {
        ...state,
        centers: state.centers
      };
    case types.SET_COMMENTS:
      return {
        ...state,
        active_post_comments: action.payload
      };
    case types.APPEND_COMMENT:
      state.centers[state.active_post_index].comments=parseInt(state.centers[state.active_post_index].comments)+1;
      return {
        ...state,
        active_post_comments: {
          stars:state.active_post_comments.stars,
          content:[...state.active_post_comments.content,
            {
              id:action.payload.id,
              post_id:action.payload.center.id,
              first_name:action.payload.user.first_name,
              last_name:action.payload.user.last_name,
              photo_100:action.payload.user.photo_100,
              text:action.payload.comment,
              vk_user_id:action.payload.user.id
            }]
        }
      };
    case types.DELETE_COMMENT:
      state.centers[state.active_post_index].comments=parseInt(state.centers[state.active_post_index].comments)-1;
      return {
        ...state,
        active_post_comments: state.active_post_comments.content.filter(cmt=>cmt.id!==action.payload.id)
      };
    default:
      return state;
  }
};

export default contentReducer;
