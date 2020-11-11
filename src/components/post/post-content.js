import React from "react";
import $ from 'jquery'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowMore: false
        };
    }

    render() {
        let {
            isShowMore
        } = this.state
        let {
            content,
        } = this.props
        let isOver = content.length > 200
        if (isOver == true) {
            if (isShowMore == true)
                content = content
            else content = content.slice(0, 200) + "... "
        }
        return (
            <div className="post-content-mes">
                <div
                    dangerouslySetInnerHTML={{
                        __html: content
                            .replace(/\n/g, ` <br />`)
                            .replace(
                                /@(\S+)/g,
                                `<span class="draftJsMentionPlugin__mention__29BEd no-bg">@$1</span>`
                            )
                            .replace(
                                /#(\S+)/g,
                                `<span class="draftJsHashtagPlugin__hashtag__1wMVC">#$1</span>`
                            ),
                    }}
                    style={{ display: "inline" }}
                >
                </div>
                {
                    isShowMore == true && isOver ? <span onClick={() => this.setState({ isShowMore: false })}>Rút gọn</span> : ""
                }
                {
                    isShowMore == false && isOver ? <span onClick={() => this.setState({ isShowMore: true })}>Xem thêm</span> : ""
                }
            </div>
        );
    }
}

export default Index;