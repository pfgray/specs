import Lockr from 'Lockr';
export const LAUNCH_IN_FRAME = 'LAUNCH_IN_FRAME';
export const UNLAUNCH = 'UNLAUNCH';
export const OPEN_PREVIOUS = 'OPEN_PREVIOUS';
export const CLOSE_PREVIOUS = 'CLOSE_PREVIOUS';
export const ADD_LAUNCH = 'ADD_LAUNCH';
export const REMOVE_LAUNCH = 'REMOVE_LAUNCH';

const initialState = {
  launched: false,
  previousOpen: false,
  launches: Lockr.get('launches') || []
};

export const launchReducer = (state = initialState, action) => {
  const merge = newState => ({...state, ...newState});
  switch(action.type){
    case LAUNCH_IN_FRAME:
      return merge({
        launched: true,
        params: action.data
      });
    case UNLAUNCH:
      return merge({
        launched: false
      });
    case OPEN_PREVIOUS:
      return merge({
        previousOpen: true
      });
    case CLOSE_PREVIOUS:
      return merge({
        previousOpen: false
      });
    case ADD_LAUNCH:
      return merge({
        launches: [
          ...state.launches,
          action.data
        ]
      });
    case REMOVE_LAUNCH:
      return merge({
        launches: [
          ...state.launches.slice(0, action.data.index),
          ...state.launches.slice(action.data.index + 1, state.launches.length),
        ]
      });
    default:
      return state;
  }
}
