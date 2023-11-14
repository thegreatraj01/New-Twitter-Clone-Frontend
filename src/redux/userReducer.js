const initialState = {
    user: {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state, user: action.payload
            }
        case "LOGOUT":
            return initialState;
        default:
            return state;
    }
}