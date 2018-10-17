export const SET_USERINFO = 'SET_USERINFO';
export const setUserInfo = params => dispatch => {
    dispatch({
        type: SET_USERINFO,
        data: params
    });
}