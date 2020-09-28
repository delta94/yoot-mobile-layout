import React from "react"
import {
    connectWebsocket
} from '../actions/websocketActions'
import { connect } from 'react-redux'

class Realtime extends React.Component {
    componentWillMount() {
        this.props.connectWebsocket(
            "all",
            message => {
                console.log("message", message)
            }
            , true);
    }
    render() {
        return null
    }
}


const mapDispatchToProps = dispatch => {
    return {
        connectWebsocket: (method, onMessage, allOfTime) => dispatch(connectWebsocket(method, onMessage, allOfTime)),
    };
};
export default connect(
    null,
    mapDispatchToProps
)(Realtime);