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
    TOGGLE_FRIEND_DRAWER,
    TOGGLE_POST_DRAWER,
    TOGGLE_MEDIA_VIEWER_DRAWER,
    SET_MEDIA_TO_VIEWER,
    TOGGLE_USER_PAGE,
    TOGGLE_REPORT_DRAWER,
    TOGGLE_GROUP_DRAWER,
    TOGGLE_CREATE_GROUP_DRAWER,
    TOGGLE_GROUP_INVITE_DRAWER,
    TOGGLE_STYLE_TEST_DRAWER,
    TOGGLE_YOUR_JOB_DRAWER,
    TOGGLE_DISC_DRAWER,
    TOGGLE_YOUR_MAJORS_DRAWER,
    TOGGLE_SEARCH_FRIENDS_DRAWER,
    SET_CURRENT_FRIEND_ID,
    TOGGLE_CREATE_ALBUM_DRAWER,
    TOGGLE_ALBUM_DETAIL_DRAWER,
    SET_CURRENNT_ALBUM
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
    showFriendDrawer: false,
    showPostDrawer: false,
    isPostToGroup: false,
    showMediaViewerDrawer: false,
    mediaViewerFeature: null,
    mediaToView: null,
    showUserPage: false,
    showReportDrawer: false,
    showGroupDrawer: false,
    showCreateGroupDrawer: false,
    showGroupInviteDrawer: false,
    showStyleTestPage: false,
    showYourJobPage: false,
    showDISCDrawer: false,
    showYourMajorsPage: false,
    showSearchFriendDrawer: false,
    currentFriendId: null,
    showCreateAlbumDrawer: false,
    currentAlbum: null,
    createAlbumSuccessCallback: null,
    updateAlbumSuccessCallback: null
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
        case TOGGLE_POST_DRAWER: {
            return Object.assign({}, state, {
                showPostDrawer: action.payload,
                isPostToGroup: action.isPostToGroup
            });
        }
        case TOGGLE_MEDIA_VIEWER_DRAWER: {
            return Object.assign({}, state, {
                showMediaViewerDrawer: action.payload,
                mediaViewerFeature: action.feature ? action.feature : null
            });
        }
        case SET_MEDIA_TO_VIEWER: {
            return Object.assign({}, state, {
                mediaToView: action.payload,
            });
        }
        case TOGGLE_USER_PAGE: {
            return Object.assign({}, state, {
                showUserPage: action.payload,
            });
        }
        case TOGGLE_REPORT_DRAWER: {
            return Object.assign({}, state, {
                showReportDrawer: action.payload,
            });
        }
        case TOGGLE_GROUP_DRAWER: {
            return Object.assign({}, state, {
                showGroupDrawer: action.payload,
            });
        }
        case TOGGLE_CREATE_GROUP_DRAWER: {
            return Object.assign({}, state, {
                showCreateGroupDrawer: action.payload,
            });
        }
        case TOGGLE_GROUP_INVITE_DRAWER: {
            return Object.assign({}, state, {
                showGroupInviteDrawer: action.payload,
            });
        }
        case TOGGLE_STYLE_TEST_DRAWER: {
            return Object.assign({}, state, {
                showStyleTestPage: action.payload,
            });
        }
        case TOGGLE_YOUR_JOB_DRAWER: {
            return Object.assign({}, state, {
                showYourJobPage: action.payload,
            });
        }
        case TOGGLE_DISC_DRAWER: {
            return Object.assign({}, state, {
                showDISCDrawer: action.payload,
            });
        }
        case TOGGLE_YOUR_MAJORS_DRAWER: {
            return Object.assign({}, state, {
                showYourMajorsPage: action.payload,
            });
        }

        case TOGGLE_SEARCH_FRIENDS_DRAWER: {
            return Object.assign({}, state, {
                showSearchFriendDrawer: action.payload,
            });
        }
        case SET_CURRENT_FRIEND_ID: {
            return Object.assign({}, state, {
                currentFriendId: action.payload,
            });
        }
        case TOGGLE_CREATE_ALBUM_DRAWER: {
            return Object.assign({}, state, {
                showCreateAlbumDrawer: action.payload,
                createAlbumSuccessCallback: action.callback
            });
        }
        case TOGGLE_ALBUM_DETAIL_DRAWER: {
            return Object.assign({}, state, {
                showAlbumDetailDrawer: action.payload,
                updateAlbumSuccessCallback: action.callback
            });
        }
        case SET_CURRENNT_ALBUM: {
            return Object.assign({}, state, {
                currentAlbum: action.payload,
            });
        }


        default:
            return state;
    }
};