import * as types from '../actions/types';

const initialState = {
  wallet: ""
};

function managerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.SET_WALLET:
      return {
        ...state,
        wallet: payload
      }
    default:
      return state;
  }
}

export default managerReducer;
