import * as types from './types';

const initialState = {
  popout:null,
  modal:null,
  modalHistory:[null],
  snackbar:null,
  scheme:'bright_light',
  user_server:{
    reviews:0,
    likes:0,
    changes:0,
    answers_and_questions:0,
    city: null,
  },
  user: {
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    city: {
      id: 0,
      title: null
    },
    photo_100:'https://vk.com/images/camera_100.png',
  },
};

const vkReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_VK_USER:
      return {
        ...state,
        user: {...state.user, ...action.payload}
      };
    case types.SET_SERVER_USER:
      return {
        ...state,
        user_server: action.payload.city ? {...state.user_server, ...action.payload} : {...state.user_server, ...{...action.payload, city:state.user.city.title}}
      };
    case types.SET_SAID_PARAMS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default vkReducer;
