import React from "react";
import './style.scss'
import {
    Avatar,
    Drawer,
    Button
} from '@material-ui/core'
import {
    FiberManualRecord as FiberManualRecordIcon
} from '@material-ui/icons'
import {
    deleteCommentSuccess,
    deleteImageCommentSuccess,
    likePostComment,
    dislikePostComment,
    likeImageComment,
    dislikeImageComment
} from '../../actions/comment'
import {
    changeCommentCountForPost,
    changeCommentCountForImage
} from '../../actions/posted'
import FacebookSelector from '../common/facebook-selector'
import { confirmSubmit, fromNow, objToQuery, showNotification } from "../../utils/common";
import { Privacies, ReactSelectorIcon, backgroundList } from '../../constants/constants'
import moment from "moment"
import Comment from './comment-item.js'
import { connect } from 'react-redux'
import { post } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openReactions: false
        };
    }

    handleDeleteComment(comment) {
        let {
            parent,
            posted,
            image
        } = this.props
        post(SOCIAL_NET_WORK_API, "Comment/DeleteComment?commentid=" + comment.commentid, null, result => {
            if (result && result.result == 1) {
                if (posted) {
                    this.props.deleteCommentSuccess(comment.commentid, posted.nfid, parent)
                    this.props.changeCommentCountForPost(-1, posted.nfid, posted.iduserpost)
                }
                if (image) {
                    this.props.deleteImageCommentSuccess(comment.commentid, image.nameimage, parent)
                    this.props.changeCommentCountForImage(-1, posted.nfid, posted.iduserpost, image.detailimageid)
                }
            }
        })
    }


    likeComment(reaction) {
        let {
            comment,
            posted,
            parent,
            image
        } = this.props

        if (!comment) return
        let param = {
            commentid: comment.commentid,
            icon: reaction.code
        }
        if (posted)
            this.props.likePostComment(comment, reaction.code, posted.nfid, parent)
        if (image)
            this.props.likeImageComment(comment, reaction.code, image.nameimage, parent)
        post(SOCIAL_NET_WORK_API, "Comment/LikeComment" + objToQuery(param), null, (result) => {
        })
    }

    dislikeComment() {
        let {
            comment,
            posted,
            parent,
            image
        } = this.props
        if (!comment) return
        let param = {
            commentid: comment.commentid,
            icon: -1
        }
        if (posted)
            this.props.dislikePostComment(comment, posted.nfid, parent)
        if (image)
            this.props.dislikeImageComment(comment, image.nameimage, parent)
        post(SOCIAL_NET_WORK_API, "Comment/LikeComment" + objToQuery(param), null, (result) => {
        })
    }



    render() {
        let {
            comment,
            hideReactions,
            profile,
            onReply,
            posted,
            image
        } = this.props

        let {
            openReactions
        } = this.state


        let content = comment.commentcontent
        if (comment.userTags && comment.userTags.length > 0) {
            content = `<span class="tag-friend-comment">${comment.userTags[0].fullname} </span> ${comment.commentcontent}`
        }
        return (
            <li style={{ position: "relative" }}>
                {
                    comment ? <div>
                        <Avatar className="avatar">
                            <img src={comment.avatarusercomment} />
                        </Avatar>
                        <div className="comment-info">
                            <div className="info">
                                <label>{comment.nameusercomment}</label>
                                <div>
                                    {
                                        content && content != "" ?
                                            <pre dangerouslySetInnerHTML={{
                                                __html: content.replace(/@(\S+)/g, `<span class="draftJsMentionPlugin__mention__29BEd no-bg">@$1</span>`).replace(/#(\S+)/g, `<span class="draftJsHashtagPlugin__hashtag__1wMVC">#$1</span>`)
                                            }} ></pre> : ""
                                    }
                                    {
                                        comment.mediaPlays && comment.mediaPlays.map(media => <img src={media.name}></img>)
                                    }
                                </div>
                            </div>
                            {
                                hideReactions ? "" : <div className="actions">
                                    {
                                        comment.numlike > 0 ? <span className="like">
                                            <span>{comment.numlike}</span>
                                            {
                                                comment.iconNumbers.filter(item => item.icon != comment.iconlike).map((item, index) => item.icon > 0 && item.num > 0 && <img key={index} src={ReactSelectorIcon[item.icon].icon}></img>)
                                            }
                                            {
                                                comment.islike == 1 ? <img src={ReactSelectorIcon[comment.iconlike].icon}></img> : ""
                                            }
                                        </span> : ""
                                    }
                                    {
                                        comment.numlike > 0 ? <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} /> : ""
                                    }
                                    <span onClick={() => onReply ? onReply(comment) : ""}>Trả lời</span>
                                    {
                                        comment.idusercomment == profile.id ? <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} /> : ""
                                    }
                                    {
                                        comment.idusercomment == profile.id ? <span onClick={() => this.setState({
                                            showConfim: true,
                                            okCallback: () => this.handleDeleteComment(comment),
                                            confirmTitle: "",
                                            confirmMessage: "Bạn có muốn xoá bình luận này không?"
                                        })}>Xoá</span> : ""
                                    }
                                    <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                    <span>{fromNow(moment(comment.createdate), moment(new Date), true)}</span>

                                </div>
                            }

                            <div className="overlay" onClick={() => onReply ? onReply(comment) : ""}></div>

                        </div>
                        {
                            hideReactions ? "" : <FacebookSelector
                                open={openReactions}
                                active={comment.iconlike > 0 ? comment.iconlike : 0}
                                onClose={() => this.setState({ openReactions: false })}
                                onReaction={(reaction) => this.likeComment(reaction, comment)}
                                onShortPress={(reaction) => comment.islike == 1 ? this.dislikeComment(comment) : this.likeComment(reaction, comment)}
                                type="MiniButton"
                            />
                        }
                    </div> : ""
                }
                <ul className="reply-box">
                    {
                        comment.commentRelies
                        && comment.commentRelies.map((replyCommment, index) =>
                            <Comment
                                key={index}
                                parent={comment}
                                comment={replyCommment}
                                hideReactions={false}
                                onReply={(childComment) => onReply({ ...childComment, commentid: comment.commentid, tagIds: [childComment.idusercomment] })}
                                posted={posted}
                                image={image}
                            />
                        )
                    }
                </ul>
                {
                    renderConfirmDrawer(this)
                }
            </li>
        );
    }
}


const mapStateToProps = state => {
    return {
        ...state.user,
        ...state.comment
    }
};
const mapDispatchToProps = dispatch => ({
    deleteCommentSuccess: (commentId, postId, parent) => dispatch(deleteCommentSuccess(commentId, postId, parent)),
    changeCommentCountForPost: (number, postId, userId) => dispatch(changeCommentCountForPost(number, postId, userId)),
    changeCommentCountForImage: (number, postId, userId, detailimageid) => dispatch(changeCommentCountForImage(number, postId, userId, detailimageid)),
    deleteImageCommentSuccess: (commentId, namgeImage, parent) => dispatch(deleteImageCommentSuccess(commentId, namgeImage, parent)),
    likePostComment: (comment, icon, postId, parent) => dispatch(likePostComment(comment, icon, postId, parent)),
    dislikePostComment: (comment, postId, parent) => dispatch(dislikePostComment(comment, postId, parent)),
    likeImageComment: (comment, icon, imageName, parent) => dispatch(likeImageComment(comment, icon, imageName, parent)),
    dislikeImageComment: (comment, imageName, parent) => dispatch(dislikeImageComment(comment, imageName, parent))
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);


const renderConfirmDrawer = (component) => {
    let {
        showConfim,
        okCallback,
        confirmTitle,
        confirmMessage
    } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showConfim} onClose={() => component.setState({ showConfim: false })}>
            <div className='jon-group-confirm'>
                <label>{confirmTitle}</label>
                <p>{confirmMessage}</p>
                <div className="mt20">
                    <Button className="bt-confirm" onClick={() => component.setState({ showConfim: false }, () => okCallback ? okCallback() : null)}>Có</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showConfim: false })}>Không</Button>
                </div>
            </div>
        </Drawer>
    )
}
