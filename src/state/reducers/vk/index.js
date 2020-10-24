import * as types from './actionTypes';

const initialState = {
  form: { title:'', duration: '', link:{}, name:'', description:'', abnormal: false, exclude:false, trailer:false },
  user: {first_name: 'Матвей', last_name: 'Правосудов',
    photo_100:'https://sun9-23.userapi.com/impg/tRuIFWRNOZfwluZoM56CVieUp67NSiSLzgN45A/hcuD0JX3rx0.jpg?size=50x0&quality=88&crop=146,26,207,207&sign=2909f82e720f75ecf953ba2c6e9f4b06&ava=1',
  }
};

const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_VK_USER:
      return {
        ...state,
        user: {...state.user, ...action.payload}
      };
    default:
      return state;
  }
};

export default historyReducer;
