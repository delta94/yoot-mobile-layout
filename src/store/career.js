

import {
    GET_CAREER_HISTORY_SUCCESS,
    REMOVE_CAREER_HISTORY_SUCCESS,
    GET_CAREER_TEST_LIST_SUCCESS
} from '../actions/career'

const initialState = {
    careerHistory: null,
    careerTestList: null
};

export default (state = initialState, action) => {
    let {
        careerHistory,
        careerTestList
    } = state

    switch (action.type) {
        case GET_CAREER_HISTORY_SUCCESS: {

            careerHistory = action.payload

            return Object.assign({}, state, {
                careerHistory: careerHistory,
            })
        }

        case REMOVE_CAREER_HISTORY_SUCCESS: {
            careerHistory = null
            return Object.assign({}, state, {
                careerHistory: careerHistory,
            })
        }

        case GET_CAREER_TEST_LIST_SUCCESS: {

            careerTestList = action.payload

            return Object.assign({}, state, {
                careerTestList: careerTestList,
            })
        }

        default:
            return state;
    }
};