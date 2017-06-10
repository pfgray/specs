export const LAUNCH_IN_FRAME = 'LAUNCH_IN_FRAME';
export const UNLAUNCH = 'UNLAUNCH';

const initialState = {
  launched: false
};

export const launchReducer = (state = initialState, action) => {
  switch(action.type){
    case LAUNCH_IN_FRAME:
      return {
        launched: true,
        params: action.data
      };
    case UNLAUNCH:
      return {
        launched: false
      };
    default:
      return state;
  }
}
