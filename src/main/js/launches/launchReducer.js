import users from './users/users';
import contexts from './contexts/contexts';

export const UPDATE_FORM = 'UPDATE_FORM';

const initialUser = users[0];
const initialContext = contexts[0];

const initialState = {
  ...initialUser,
  ...initialContext
};

export const launchReducer = (state = initialState, action) => {
  switch(action.type){
    case UPDATE_FORM:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}
