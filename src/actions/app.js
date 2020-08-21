
import {
    get
} from '../api'

export const TOGGLE_HEADER = "app@TOGGLE_HEADER"
export const ADD_HEADER_CONTENT = "app@ADD_HEADER_CONTENT"
export const ADD_FOOTER_CONTENT = "app@ADD_FOOTER_CONTENT"
export const TOGGLE_FOOTER = "app@TOGGLE_FOOTER"


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



