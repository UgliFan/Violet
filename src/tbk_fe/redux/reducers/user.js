import { SET_USERINFO } from '&/redux/actions/user';

const user = {
    uid: null,
    isLogin: false,
    uname: null,
    avatar: null
};

export default function userInfo(state = user, action) {
    switch (action.type) {
        case SET_USERINFO:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}