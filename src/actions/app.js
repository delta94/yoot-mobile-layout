
import {
    get
} from '../api'

export const TOGGLE_HEADER = "app@TOGGLE_HEADER"
export const ADD_HEADER_CONTENT = "app@ADD_HEADER_CONTENT"
export const ADD_FOOTER_CONTENT = "app@ADD_FOOTER_CONTENT"
export const TOGGLE_FOOTER = "app@TOGGLE_FOOTER"
export const TOGGLE_USER_DETAIL = "app@TOGGLE_USER_DETAIL"
export const TOGGLE_USER_HISTORY = "app@TOGGLE_USER_HISTORY"
export const TOGGLE_CHANGE_PASSWORD_FORM = "app@TOGGLE_CHANGE_PASSWORD_FORM"
export const TOGGLE_BLOCK_FRIEND_FORM = "app@TOGGLE_BLOCK_FRIEND_FORM"
export const TOGGLE_FRIENDS_FOR_BLOCK_FORM = "app@TOGGLE_FRIENDS_FOR_BLOCK_FORM"
export const TOGGLE_FRIEND_DRAWER = "app@TOGGLE_FRIEND_DRAWER"
export const TOGGLE_FIND_FRIEND_DRAWER = "app@TOGGLE_FIND_FRIEND_DRAWER"
export const TOGGLE_POST_DRAWER = "app@TOGGLE_POST_DRAWER"
export const TOGGLE_MEDIA_VIEWER_DRAWER = "app@TOGGLE_MEDIA_VIEWER_DRAWER"
export const SET_MEDIA_TO_VIEWER = 'app@SET_MEDIA_TO_VIEWER'
export const TOGGLE_USER_PAGE = 'app@TOGGLE_USER_PAGE'
export const TOGGLE_REPORT_DRAWER = "app@TOGGLE_REPORT_DRAWER"
export const TOGGLE_GROUP_DRAWER = "app@TOGGLE_GROUP_DRAWER"
export const TOGGLE_CREATE_GROUP_DRAWER = "app@TOGGLE_CREATE_GROUP_DRAWER"
export const TOGGLE_GROUP_INVITE_DRAWER = "app@TOGGLE_GROUP_INVITE_DRAWER"
export const TOGGLE_STYLE_TEST_DRAWER = "app@TOGGLE_STYLE_TEST_DRAWER"
export const TOGGLE_YOUR_JOB_DRAWER = "app@TOGGLE_YOUR_JOB_DRAWER"


export const toggleHeader = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_HEADER,
            payload: isShow
        })
    }
}

export const toggleFooter = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_FOOTER,
            payload: isShow
        })
    }
}

export const addHeaderContent = (headerContent) => {
    return dispatch => {
        dispatch({
            type: ADD_HEADER_CONTENT,
            payload: headerContent
        })
    }
}
export const addFooterContent = (footerContent) => {
    return dispatch => {
        dispatch({
            type: ADD_FOOTER_CONTENT,
            payload: footerContent
        })
    }
}
export const toggleUserPageDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_USER_PAGE,
            payload: isShow
        })
    }
}
export const toggleUserDetail = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_USER_DETAIL,
            payload: isShow
        })
    }
}
export const toggleUserHistory = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_USER_HISTORY,
            payload: isShow
        })
    }
}
export const toggleChangePasswordForm = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_CHANGE_PASSWORD_FORM,
            payload: isShow
        })
    }
}
export const toggleBlockFriendForm = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_BLOCK_FRIEND_FORM,
            payload: isShow
        })
    }
}

export const toggleFriendsForBlockForm = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_FRIENDS_FOR_BLOCK_FORM,
            payload: isShow
        })
    }
}

export const toggleFriendDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_FRIEND_DRAWER,
            payload: isShow
        })
    }
}

export const toggleFindFriendDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_FIND_FRIEND_DRAWER,
            payload: isShow
        })
    }
}

export const togglePostDrawer = (isShow, isPostToGroup, successCallback) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_POST_DRAWER,
            payload: isShow,
            isPostToGroup: isPostToGroup ? isPostToGroup : false
        })
        if (successCallback) successCallback()
    }
}
export const toggleMediaViewerDrawer = (isShow, feature) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_MEDIA_VIEWER_DRAWER,
            payload: isShow,
            feature: feature
        })
    }
}

export const setMediaToViewer = (media) => {
    return dispatch => {
        dispatch({
            type: SET_MEDIA_TO_VIEWER,
            payload: media,
        })
    }
}

export const toggleReportDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_REPORT_DRAWER,
            payload: isShow,
        })
    }
}

export const toggleGroupDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_GROUP_DRAWER,
            payload: isShow,
        })
    }

}

export const toggleCreateGroupDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_CREATE_GROUP_DRAWER,
            payload: isShow,
        })
    }
}

export const toggleGroupInviteDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_GROUP_INVITE_DRAWER,
            payload: isShow,
        })
    }
}

export const toggleStyleTestDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_STYLE_TEST_DRAWER,
            payload: isShow,
        })
    }
}

export const toggleYourJobDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_YOUR_JOB_DRAWER,
            payload: isShow,
        })
    }
}











