
import {
    get
} from '../api'


export const SET_PROCCESS_DURATION = "app@SET_PROCCESS_DURATION"
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
export const UPDATE_MEDIA_TO_VIEWER = 'app@UPDATE_MEDIA_TO_VIEWER'
export const REMOVE_MEDIA_FROM_VIEWER = 'app@REMOVE_MEDIA_FROM_VIEWER'
export const TOGGLE_USER_PAGE = 'app@TOGGLE_USER_PAGE'
export const TOGGLE_GROUP_DRAWER = "app@TOGGLE_GROUP_DRAWER"
export const TOGGLE_CREATE_GROUP_DRAWER = "app@TOGGLE_CREATE_GROUP_DRAWER"
export const TOGGLE_GROUP_INVITE_DRAWER = "app@TOGGLE_GROUP_INVITE_DRAWER"
export const TOGGLE_STYLE_TEST_DRAWER = "app@TOGGLE_STYLE_TEST_DRAWER"
export const TOGGLE_YOUR_JOB_DRAWER = "app@TOGGLE_YOUR_JOB_DRAWER"
export const TOGGLE_DISC_DRAWER = "app@TOGGLE_DISC_DRAWER"
export const TOGGLE_YOUR_MAJORS_DRAWER = "app@TOGGLE_YOUR_MAJORS_DRAWER"
export const TOGGLE_SEARCH_FRIENDS_DRAWER = "app@TOGGLE_SEARCH_FRIENDS_DRAWER"
export const SET_CURRENT_FRIEND_ID = "app@SET_CURRENT_FRIEND_ID"
export const TOGGLE_CREATE_ALBUM_DRAWER = "app@TOGGLE_CREATE_ALBUM_DRAWER"
export const TOGGLE_ALBUM_DETAIL_DRAWER = "app@TOGGLE_ALBUM_DETAIL_DRAWER"
export const SET_CURRENNT_ALBUM = "app@SET_CURRENNT_ALBUM"
export const SELECT_ALBUM_TO_POST = "app@SELECT_ALBUM_TO_POST"
export const TOGGLE_GROUP_DETAIL_DRAWER = "app@TOGGLE_GROUP_DETAIL_DRAWER"
export const SET_CURRENT_NETWORK = "app@SET_CURRENT_NETWORK"
export const TOGGLE_USER_INFO_FORM_DRAWER = "app@TOGGLE_USER_INFO_FORM_DRAWER"
export const TOGGLE_COMMENT_DRAWER = "app@TOGGLE_COMMENT_DRAWER"
export const TOGGLE_COMMENT_IMAGE_DRAWER = "app@TOGGLE_COMMENT_IMAGE_DRAWER"
export const TOGGLE_SEARCH_POST_DRAWER = "app@TOGGLE_SEARCH_POST_DRAWER"
export const TOGGLE_REPORT_COMMENT = "app@TOGGLE_REPORT_COMMENT"


export const toggleReportComment = (isShow, data) => dispatch => {
    return dispatch({
        type: TOGGLE_REPORT_COMMENT,
        payload: { isShow, data }
    })
}
export const setProccessDuration = (percent) => {
    return dispatch => {
        dispatch({
            type: SET_PROCCESS_DURATION,
            payload: percent
        })
    }
}

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
            payload: headerContent,
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

export const selectAlbumToPost = (album) => {
    return dispatch => {
        dispatch({
            type: SELECT_ALBUM_TO_POST,
            payload: album,
        })
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

export const updateMediaViewed = (media) => {
    return dispatch => {
        dispatch({
            type: UPDATE_MEDIA_TO_VIEWER,
            payload: media,
        })
    }
}


export const removeMediaViewed = (media) => {
    return dispatch => {
        dispatch({
            type: REMOVE_MEDIA_FROM_VIEWER,
            payload: media,
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


export const toggleDISCDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_DISC_DRAWER,
            payload: isShow,
        })
    }
}
export const toggleYourMajorsDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_YOUR_MAJORS_DRAWER,
            payload: isShow,
        })
    }
}

export const toggleSeachFriends = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_SEARCH_FRIENDS_DRAWER,
            payload: isShow,
        })
    }
}

export const setCurrentFriendId = (friendId) => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_FRIEND_ID,
            payload: friendId,
        })
    }
}

export const toggleCreateAlbumDrawer = (isShow, callback) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_CREATE_ALBUM_DRAWER,
            payload: isShow,
            callback: callback
        })
    }
}

export const toggleAlbumDetailDrawer = (isShow, callback) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_ALBUM_DETAIL_DRAWER,
            payload: isShow,
            callback: callback
        })
    }
}

export const setCurrentAlbum = (album) => {
    return dispatch => {
        dispatch({
            type: SET_CURRENNT_ALBUM,
            payload: album,
        })
    }
}

export const toggleGroupDetailDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_GROUP_DETAIL_DRAWER,
            payload: isShow,
        })
    }
}

export const setCurrentNetwork = (networkType) => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_NETWORK,
            payload: networkType,
        })
    }
}

export const toggleUserInfoFormDrawer = (isShow) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_USER_INFO_FORM_DRAWER,
            payload: isShow,
        })
    }
}

export const toggleCommentDrawer = (isShow, currentPostForComment) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_COMMENT_DRAWER,
            payload: isShow,
            currentPostForComment: currentPostForComment
        })
    }
}

export const toggleCommentImageDrawer = (isShow, currentImageForComment, currentPostForComment) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_COMMENT_IMAGE_DRAWER,
            payload: isShow,
            currentPostForComment: currentPostForComment,
            currentImageForComment: currentImageForComment
        })
    }
}

export const toggleSeachPosts = (isShow, hashtag) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_SEARCH_POST_DRAWER,
            payload: isShow,
            hashtag: hashtag
        })
    }
}














