import React, { Component } from "react"
import {
    endablePost,

} from '../actions/posted'
import {
    getWorldNoti,
    getSkillNoti,
    setUnreadNotiCount,
    setSkillUnreadNotiCount
} from '../actions/noti'
import {
    SOCKET_API,
    SOCIAL_NET_WORK_API
} from '../constants/appSettings'
import { connect } from 'react-redux'
import { SOCKET_TOCKEN } from "../constants/localStorageKeys";
import { hubConnection } from 'signalr-no-jquery';
import { get } from "../api";

class Realtime extends Component {

    getUnreadNoti() {
        get(SOCIAL_NET_WORK_API, "Notification/CountNotificationNoRead?typeproject=1", result => {
            if (result && result.result == 1) {
                this.props.setUnreadNotiCount(result.content.noUnRead)
            }
        })
        get(SOCIAL_NET_WORK_API, "Notification/CountNotificationNoRead?typeproject=2", result => {
            if (result && result.result == 1) {
                this.props.setSkillUnreadNotiCount(result.content.noUnRead)
            }
        })
    }

    componentDidMount = () => {

        const connection = hubConnection(SOCKET_API);
        const hubProxy = connection.createHubProxy('SNetHub');

        hubProxy.on('talking', (message) => {

            console.log("message", message)
            let content = message.content
            if (message.result == true) {
                if (message.content.typeproject == 1) {
                    this.props.getWorldNoti()

                }
                else {
                    this.props.getSkillNoti()
                }
                this.getUnreadNoti()
            }
            switch (content.type) {
                case 27: {
                    this.props.endablePost(content.newsFeed)
                    break
                }
                default:
                    break
            }
        });

        // set up event listeners i.e. for incoming "message" event
        hubProxy.on('hello', (objBack) => {
            console.log('hello-from-server', objBack);
        });

        // connect
        connection.start({ jsonp: true, transport: ['webSockets', 'longPolling'], xdomain: true })
            .done(() => {
                console.log('Now connected, connection ID=' + connection.id);

                let token = window.localStorage.getItem(SOCKET_TOCKEN)
                let idonesignal = ''

                hubProxy.invoke('connect', token, idonesignal)
                    .done(() => {
                        console.log('direct-response-from-server', "success");
                    }).fail(() => {
                        console.warn('Something went wrong when calling server, it might not be up and running?')
                    });
            })
            .fail(() => {
                console.log('Could not connect');
            });
    }

    render() {
        return (
            <div className="real-time">
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        endablePost: (postId) => dispatch(endablePost(postId)),
        getWorldNoti: () => dispatch(getWorldNoti()),
        getSkillNoti: () => dispatch(getSkillNoti()),
        setSkillUnreadNotiCount: (number) => dispatch(setSkillUnreadNotiCount(number)),
        setUnreadNotiCount: (number) => dispatch(setUnreadNotiCount(number))
    };
};
export default connect(
    null,
    mapDispatchToProps
)(Realtime);