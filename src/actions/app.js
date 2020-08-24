
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






