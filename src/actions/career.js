
import { get } from "../api"
import { BUILD_YS_API, CurrentDate, SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const GET_CAREER_HISTORY_SUCCESS = "user@GET_CAREER_HISTORY_SUCCESS"
export const GET_CAREER_TEST_LIST_SUCCESS = "user@GET_CAREER_TEST_LIST_SUCCESS"

export const getCareerHistory = () => {
    return dispatch => {

        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 100,
            bundleid: 1
        }
        get(BUILD_YS_API, "BundleQuestion/GetListHistory" + objToQuery(param), result => {
            if (result && result.result == 1) {
                dispatch({
                    type: GET_CAREER_HISTORY_SUCCESS,
                    payload: result.content.history[0],
                })
            }
        })
    }
}

export const getCareerTestList = () => {
    return dispatch => {

        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 100,
            kind: "DISC"
        }
        get(BUILD_YS_API, "BundleQuestion/GetList" + objToQuery(param), result => {
            if (result && result.result == 1) {
                console.log("result", result)
                dispatch({
                    type: GET_CAREER_TEST_LIST_SUCCESS,
                    payload: result.content.bundleQuestions[0],
                })
            }
        })
    }
}
