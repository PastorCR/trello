import { REAUTH, LOGOUT, SIGNIN, ERROR, USERBOARDS } from '../actions/userActions.js';

const initialState = {
    user: {},
    authenticated: false,
    error: ''
}

const userReducer = (state = initialState, action) => {

    switch (action.type) {
        case SIGNIN:
            return { ...state, user: action.payload.user, error: '', authenticated: true };

        case LOGOUT:
            return { ...state, error: '', authenticated: false, user: {} };

        case REAUTH:
            return { ...state, error: '', authenticated: true };

        case ERROR:
            return { ...state, authenticated: false, error: action.payload, user: {} }

        case USERBOARDS: 
            return{ ...state, user: {...state.user, boards: [...state.user.boards, action.payload] } }
        default:
            return state
    }
}


export default userReducer;