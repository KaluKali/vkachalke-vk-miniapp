import * as types from './types';

const initialState = {
  active_post_index:0,
  centers:[]
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
    default:
      return state;
  }
};

export default contentReducer;
