import {
    TOGGLE_HEADER,
    ADD_HEADER_CONTENT,
    ADD_FOOTER_CONTENT,
    TOGGLE_FOOTER
} from '../actions/app'

const initialState = {
    showHeader: false,
    headerContent: null,
    showFooter: false,
    footerContent: null
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
        default:
            return state;
    }
};