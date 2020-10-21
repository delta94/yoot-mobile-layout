import React from 'react';
import $ from 'jquery'
import './style.scss'

const loading = require('../../../assets/images/loading.png')
const loading1 = require('../../../assets/images/loading-1.png')

export class Loader extends React.Component {
    componentDidMount() {
        $(".bg-overlay").parent().css("position", "relative");
        $(".bg-overlay").parent().addClass("proccessing");
    }
    componentWillUnmount() {
        $(".bg-overlay").parent().removeClass("proccessing");
    }

    render() {
        let {
            type,
            isFullScreen,
            width,
            height,
            style,
            daskMode
        } = this.props
        if (isFullScreen) {
            $("body").css("overflow", "hidden")
        }
        return (
            <div className={"bg-overlay " + type + (isFullScreen ? " full-screen" : "")} style={style}>
                <div>
                    <img className={"spinner-img"} src={daskMode == true ? loading1 : loading} style={{ width: width, height: height }} />
                </div>
            </div>
        )
    }
}
export default Loader
