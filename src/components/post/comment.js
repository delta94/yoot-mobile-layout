import React from "react";
import './style.scss'
import {
    Avatar
} from '@material-ui/core'
import {
    FiberManualRecord as FiberManualRecordIcon
} from '@material-ui/icons'
import FacebookSelector from '../common/facebook-selector'
import moment from "moment"


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openReactions: false
        };
    }



    render() {
        let {
            comment,
            hideReactions
        } = this.props
        let {
            openReactions
        } = this.state
        return (
            <li style={{ position: "relative" }}>
                <div>
                    <Avatar className="avatar">
                        <img src={comment.avatarusercomment} />
                    </Avatar>
                    <div className="comment-info">
                        <div className="info">
                            <label>{comment.nameusercomment}</label>
                            <span>{comment.commentcontent}</span>
                        </div>
                        {
                            hideReactions ? "" : <div className="actions">
                                <span>Trả lời</span>
                                <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                <span>Xoá</span>
                                <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                <span>{moment(new Date).format("DD/MM/YYYY")}</span>
                            </div>
                        }
                    </div>
                    {
                        hideReactions ? "" : <FacebookSelector open={openReactions} type="MiniButton" onClose={() => this.setState({ openReactions: false })} onReaction={(reaction) => console.log("reaction", reaction)} />
                    }
                </div>

            </li>
        );
    }
}


export default Index;