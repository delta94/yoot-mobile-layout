import {
    TOGGLE_HEADER,
    ADD_HEADER_CONTENT,
    ADD_FOOTER_CONTENT,
    TOGGLE_FOOTER,
    TOGGLE_USER_DETAIL,
    TOGGLE_USER_HISTORY,
    TOGGLE_CHANGE_PASSWORD_FORM,
    TOGGLE_BLOCK_FRIEND_FORM,
    TOGGLE_FRIENDS_FOR_BLOCK_FORM,
    TOGGLE_FIND_FRIEND_DRAWER,
    TOGGLE_FRIEND_DRAWER
} from '../actions/app'

const initialState = {
    showHeader: false,
    headerContent: null,
    showFooter: false,
    footerContent: null,
    showUserDetail: false,
    showUserHistory: false,
    showChangePasswordForm: false,
    showBlockFriendForm: false,
    showFriendsForBlockForm: false,
    showFindFriendDrawer: false,
    showFriendDrawer: false
};

export default (state = initialState, action) => {
    let {
        showHeader
    } = state

    switch (action.type) {
        case TOGGLE_HEADER: {
            return Object.assign({}, state, {
                showHeader: action.payload
            });
        }
        case TOGGLE_FOOTER: {
            return Object.assign({}, state, {
                showFooter: action.payload
            });
        }
        case ADD_HEADER_CONTENT: {
            return Object.assign({}, state, {
                headerContent: action.payload
            });
        }
        case ADD_FOOTER_CONTENT: {
            return Object.assign({}, state, {
                footerContent: action.payload
            });
        }
        case TOGGLE_USER_DETAIL: {
            return Object.assign({}, state, {
                showUserDetail: action.payload
            });
        }
        case TOGGLE_USER_HISTORY: {
            return Object.assign({}, state, {
                showUserHistory: action.payload
            });
        }
        case TOGGLE_CHANGE_PASSWORD_FORM: {
            return Object.assign({}, state, {
                showChangePasswordForm: action.payload
            });
        }
        case TOGGLE_BLOCK_FRIEND_FORM: {
            return Object.assign({}, state, {
                showBlockFriendForm: action.payload
            });
        }
        case TOGGLE_FRIENDS_FOR_BLOCK_FORM: {
            return Object.assign({}, state, {
                showFriendsForBlockForm: action.payload
            });
        }
        case TOGGLE_FRIEND_DRAWER: {
            return Object.assign({}, state, {
                showFriendDrawer: action.payload
            });
        }
        case TOGGLE_FIND_FRIEND_DRAWER: {
            return Object.assign({}, state, {
                showFindFriendDrawer: action.payload
            });
        }
        default:
            return state;
    }
};