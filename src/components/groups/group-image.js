import React from "react";

class Index extends React.Component {
    constructor(props) {
        super(props);
        console.log("sádfasdfa")
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.groupCoverImage == this.props.groupCoverImage)
            return false
        return true
    }

    render() {
        let {
            groupCoverImage,
            backgroundPosted
        } = this.props
        return (
            <div className="image" style={{ background: 'url(' + (groupCoverImage ? URL.createObjectURL(groupCoverImage) : backgroundPosted) + ')' }}></div>
        );
    }
}

export default Index;