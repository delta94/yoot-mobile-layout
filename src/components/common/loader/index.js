import React from 'react';
import $ from 'jquery'
import './style.scss'

const loading = require('../../../assets/images/loading.png')

export class Loader extends React.Component {
    componentDidMount() {
        $(".bg-overlay").parent().css("position", "relative");
    }

    render() {
        let {
            type,
            isFullScreen,
            width,
            height,
            style
        } = this.props
        if (isFullScreen) {
            $("body").css("overflow", "hidden")
        }
        return (
            <div className={"bg-overlay " + type + (isFullScreen ? " full-screen" : "")} style={style}>
                <div>
                    <img className={"spinner-img"} src={loading} style={{ width: width, height: height }} />
                </div>
            </div>
        )
    }
}
export default Loader
