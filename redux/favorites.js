import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            //if dish is already in favorites, don't do anything
            if (state.some(el => el === action.payload))
                return state;
            //otherwise add it to the state
            else
                return state.concat(action.payload);
                
        default:
          return state;
      }
};