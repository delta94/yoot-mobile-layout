import React from "react";
import './style.scss'
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Avatar,
    GridList,
    GridListTile,
    Menu,
    MenuItem,
    Collapse,
    Button,
    Drawer,
    TextField,
    InputAdornment,
    Radio
} from '@material-ui/core'

import {
    Favorite as FavoriteIcon,
    Share as ShareIcon,
    MoreHoriz as MoreHorizIcon,
    FiberManualRecord as FiberManualRecordIcon,
    ChevronLeft as ChevronLeftIcon,
    MusicOff as MusicOffIcon,
    MusicNote as MusicNoteIcon,
    FullscreenExit as FullscreenExitIcon,
    Fullscreen as FullscreenIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Forward10 as Forward10Icon,
    Replay10 as Replay10Icon,
    Close as CloseIcon
} from '@material-ui/icons'
import {
    togglePostDrawer,
    toggleMediaViewerDrawer,
    setMediaToViewer,
    toggleUserDetail,
    toggleUserPageDrawer
} from '../../actions/app'
import {
    setCurrenUserDetail
} from '../../actions/user'
import {
    updatePosted,
    likePosted,
    dislikePosted,
    likeImage,
    dislikeImage,
    setCurrentPosted,
    deletePostSuccess,
    changeCommentCountForPost,
    changeCommentCountForImage
} from '../../actions/posted'
import {
    setComment,
    commentImageSuccess,
    replyImageCommentSuccess,
    setCommentImage,
} from '../../actions/comment'
import { Player, ControlBar, BigPlayButton } from 'video-react';
import { Privacies, ReactSelectorIcon, backgroundList } from '../../constants/constants'
import FacebookSelector from '../common/facebook-selector'
import moment from "moment"
import Comment from './comment-item'
import { fromNow, objToArray, copyToClipboard, objToQuery } from "../../utils/common";
import { connect } from 'react-redux'
import { SOCIAL_NET_WORK_API, PostLinkToCoppy, CurrentDate } from "../../constants/appSettings";
import { get, post, postFormData } from '../../api'
import MultiInput from '../common/multi-input'
import Dropzone from 'react-dropzone'
import CustomMenu from '../common/custom-menu'

import $ from 'jquery'
import { showInfo } from "../../utils/app";
import { isNull } from "util";

const maxCols = 6
const like1 = require('../../assets/icon/like1@1x.png')
const comment = require('../../assets/icon/comment@1x.png')
const comment1 = require('../../assets/icon/comment1@1x.png')
const share = require('../../assets/icon/share@1x.png')
const share1 = require('../../assets/icon/share1@1x.png')
const Group = require('../../assets/icon/Group@1x.png')
const Picture = require('../../assets/icon/Picture@1x.png')
const Send = require('../../assets/icon/Send.png')
const report = require('../../assets/icon/report@1x.png')
const block = require('../../assets/icon/block@1x.png')
const unfollow = require('../../assets/icon/unfollow@1x.png')
const unfriend = require('../../assets/icon/unfriend@1x.png')


const photos = [
    {
        url: "https://source.unsplash.com/2ShvY8Lf6l0/1600x1200",
    },
    {
        url: "https://source.unsplash.com/Dm-qxdynoEc/1600x1600",
    },
    {
        url: "https://source.unsplash.com/qDkso9nvCg0/1200x1600",
    },
    {
        url: "https://source.unsplash.com/iecJiKe_RNg/1200x1600",
    },
    {
        url: "https://source.unsplash.com/epcsn8Ed8kY/1200x1600",
    }
];

const videos = [
    {
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
]

const comments = [
    {
        user: {
            fullName: "Hoang Hai Long",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU"
        },
        comment: "abc def ghi jkl"
    },
    {
        user: {
            fullName: "Hoang Hai Long",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU"
        },
        comment: "abc def ghi jkl"
    },
    {
        user: {
            fullName: "Hoang Hai Long",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU"
        },
        comment: "abc def ghi jkl"
    }
]



class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openReactions: false,
            anchor: null,
            showLocalMenu: false,
            openReactions: false,
            isMuted: false,
            commentContent: '',
            imageSelected: [],
            replyFor: null
        };
        this.player = React.createRef()
        this.commentInput = React.createRef()
    }

    selectImage(acceptedFiles) {
        let {
            imageSelected
        } = this.state
        let that = this

        if (acceptedFiles && acceptedFiles.length > 0) {
            acceptedFiles.map(image => {
                var fr = new FileReader;
                fr.onload = function () {
                    var img = new Image;
                    img.onload = function () {
                        imageSelected = imageSelected.concat({ file: image, width: img.width, height: img.height })
                        that.setState({ imageSelected: imageSelected, isBackgroundSelect: false, isChange: true })
                    };
                    img.src = fr.result;
                };
                fr.readAsDataURL(image);
            })
        }
    }

    handleDeleteImage(image) {
        let {
            imageSelected
        } = this.state
        imageSelected = imageSelected.filter(item => item.file != image.file)
        this.setState({
            imageSelected: imageSelected,
            isChange: true
        })
    }

    handleColumnCal(index, length) {
        switch (length) {
            case 2:
                return maxCols / 2
            case 3:
                if (index == 0) return maxCols
                else return maxCols / 2
            case 4:
                if (index == 0) return maxCols
                else return maxCols / 3
            case 5:
                if (index < 2) return maxCols / 2
                else return maxCols / 3
        }
    }

    handleCellHeightCal(index, length) {
        switch (length) {
            case 2:
                return 300
            case 3:
                return 150
            case 4:
                if (index == 0) return 180
                else return 120
            case 5:
                if (index < 2) return 180
                else return 120
        }
    }

    handlePlayVideo() {
        let {
            data
        } = this.props
        let video = this.player.current
        let thumbnail = this.thumbnail.current
        if (video) {
            this.handleSetMuted(true)
            video.play()
            video.subscribeToStateChange((state, prevState) => {
                if (state.ended == true) {
                    this.setState({
                        isPlaying: false
                    })
                }
            })
            this.setState({
                isPlaying: true
            })
            if (thumbnail) {
                $(thumbnail).fadeOut(1000)
            }
        }
    }

    handlePauseVideo() {
        let video = this.player.current
        if (video) {
            video.pause()
            this.setState({
                isPlaying: false
            })
        }
    }

    handleSetMuted(isMuted) {
        let video = this.player.current
        if (video) {
            video.muted = isMuted
            this.setState({
                isMuted: isMuted
            })
        }
    }

    handleFullScreen() {
        let {
            isFullScreen
        } = this.state
        let video = this.player.current
        if (video) {
            video.toggleFullscreen()
            this.setState({
                isFullScreen: !isFullScreen
            }, () => {
                this.handleSetMuted(isFullScreen)
            })
        }
    }

    handleChangeCurrentTime(seconds) {
        let video = this.player.current
        if (video) {
            const { player } = video.getState();
            video.seek(player.currentTime + seconds)
        }
    }

    getComment(currentPage, postId, image) {
        let {
            imageComments
        } = this.props

        let commentList = imageComments[image.nameimage]
        if (!commentList) commentList = []
        let param = {
            postid: postId,
            currentpage: currentPage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            currentpageRely: 0,
            limitRely: 5,
            commentIdStart: 0,
            relyIdStart: 0,
            nameimage: image.nameimage
        }
        get(SOCIAL_NET_WORK_API, "Comment/GetCommentInPost" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.props.setCommentImage(commentList.concat(result.content.commentModels), image.nameimage)
            }
        })
    }

    handleComment() {
        let {
            commentContent,
            mentionSelected,
            hashtagSelected,
            imageSelected,
            replyFor
        } = this.state
        let {
            data,
            image
        } = this.props

        let formData = new FormData


        formData.append("content", commentContent)
        formData.append("postid", data.nfid)

        if (mentionSelected.length > 0) {
            let ids = []
            mentionSelected.map(item => ids.push(item.id))
            formData.append("labeltags", JSON.stringify(ids))
        }
        if (hashtagSelected.length > 0)
            formData.append("hashtags", JSON.stringify(hashtagSelected))

        if (imageSelected.length > 0) {
            imageSelected.map((image, index) => {
                formData.append("image_" + (index) + "_" + image.width + "_" + image.height, image.file)
            })
        }

        formData.append("commentid", replyFor ? replyFor.commentid : 0)

        if (replyFor && replyFor.tagIds && replyFor.tagIds.length > 0) {
            formData.append("tags", JSON.stringify(replyFor.tagIds))
        }

        if (image) {
            formData.append("nameimage", image.nameimage)
        }

        postFormData(SOCIAL_NET_WORK_API, "Comment/CreateComment", formData, result => {
            if (result.result == 1) {
                if (replyFor) {
                    this.props.replyImageCommentSuccess(result.content.commentModel, replyFor.commentid, image.nameimage)
                } else {
                    this.props.commentImageSuccess(result.content.commentModel, image.nameimage)
                }
                this.props.changeCommentCountForPost(1, data.nfid, data.iduserpost)
                this.props.changeCommentCountForImage(1, data.nfid, data.iduserpost, image.detailimageid)
                this.commentInput.current.setDefaultValue("")
                this.setState({
                    imageSelected: [],
                    replyFor: null
                })
            }
        })
    }

    handleClose() {
        let {
            onClose,
            data,
            image
        } = this.props
        if (onClose) onClose()
        this.props.setCommentImage([], image.nameimage)
    }

    componentDidMount() {
        let {
            data,
            image
        } = this.props
        if (data) {
            this.getComment(0, data.nfid, image)
        }
    }

    render() {
        let {
            onClose,
            data,
            image,
            profile,
            daskMode,
            imageComments
        } = this.props
        let {
            anchor,
            showLocalMenu,
            openReactions,
            isMuted,
            commentContent,
            imageSelected,
            replyFor
        } = this.state
        let PrivacyOptions = objToArray(Privacies)
        let comments = []
        if (image && imageComments && imageComments[image.nameimage])
            comments = imageComments[image.nameimage]

        return (
            data ? <div className="drawer-detail comment-image">
                <div className="drawer-header">
                    <div className="direction" onClick={() => this.handleClose()}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                    </div>
                    <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                        <CardHeader
                            className="card-header"
                            avatar={
                                <Avatar aria-label="recipe" className="avatar">
                                    <div className="img" style={{ background: `url("${data.avataruserpost}")` }} />
                                </Avatar>
                            }
                            action={
                                <CustomMenu placement="bottom-end">
                                    {
                                        data.iduserpost == profile.id && data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => {
                                            this.props.togglePostDrawer(true)
                                            this.props.setCurrentPosted(data)
                                        })}>Chỉnh sửa bài đăng</MenuItem> : ""
                                    }
                                    {
                                        data.iduserpost == profile.id && (data.kindpost == 2 || data.kindpost == 3) ? <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateInfoOfProfilePost: true, postContent: data.nfcontent })}>Chỉnh sửa nội dung</MenuItem> : ""
                                    }
                                    {
                                        data.iduserpost == profile.id && data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.setState({
                                            showConfim: true,
                                            okCallback: () => this.handleDeletePost(),
                                            confirmTitle: "Xoá bài đăng",
                                            confirmMessage: "Bạn có thật sự muốn xoá bài đăng này?"
                                        }))}>Xoá bài đăng</MenuItem> : ""
                                    }
                                    <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => copyToClipboard(PostLinkToCoppy + data.nfid))}>Sao chép liên kết</MenuItem>
                                    {/* {
                  data.iduserpost != profile.id ? <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem> : ""
                } */}
                                    {
                                        data.iduserpost != profile.id ? <MenuItem onClick={() => this.handleOpenReportDrawer()}>Báo cáo vi phạm</MenuItem> : ""
                                    }
                                </CustomMenu>
                            }
                            title={<span className="poster-name">
                                <span className="name" onClick={() => {
                                    if (data.iduserpost == profile.id) {
                                        this.props.history.push("/profile")
                                    } else {
                                        this.props.setCurrenUserDetail({ ...data, friendid: data.iduserpost })
                                        this.props.toggleUserPageDrawer(true)
                                    }
                                }}>{data.nameuserpost} </span>
                                {
                                    data.kindpost == 4 ? <span className="mesage">{data.titlepost.replace("{usernamesend}", " ").replace("{namealbum}", data.albumname)}</span> : ""
                                }
                                {
                                    data.kindpost == 3 ? <span className="mesage">{data.titlepost.replace("{username}", " ")}</span> : ""
                                }
                                {
                                    data.kindpost == 2 ? <span className="mesage">{data.titlepost.replace("{username}", " ")}</span> : ""
                                }
                                {
                                    data.kindpost == 1 && data.newsFeedShare ? <span className="mesage"> đã chia sẽ một bài viết</span> : ""
                                }
                                {
                                    data.usersTag.length > 0 ? <span className="mesage">
                                        <span>cùng với <b onClick={() => {
                                            this.props.setCurrenUserDetail({ ...data.usersTag[0], friendid: data.usersTag[0].id })
                                            this.props.toggleUserPageDrawer(true)
                                        }}>{data.usersTag[0].fullname}</b></span>
                                        {
                                            data.usersTag.length == 2 ? <span> và <b onClick={() => {
                                                this.props.setCurrenUserDetail({ ...data.usersTag[1], friendid: data.usersTag[1].id })
                                                this.props.toggleUserPageDrawer(true)
                                            }}>{data.usersTag[1].fullname}</b></span> : ""
                                        }
                                        {
                                            data.usersTag.length > 2 ? <span> và <b onClick={() => this.setState({ showTagsFriendDrawer: true })}>{data.usersTag.length - 1} người khác</b></span> : ""
                                        }
                                    </span> : ""
                                }
                            </span>}
                            subheader={<div className="poster-subtitle">
                                <div>
                                    <img src={PrivacyOptions.find(privacy => privacy.code == data.postforid).icon1} />
                                    <FiberManualRecordIcon />
                                    {fromNow(moment(data.createdate), moment(new Date))}
                                </div>
                                {
                                    data.groupidpost > 0 ? <div>
                                        <img src={Group} />
                                        <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                        <span><u>{data.groupnamepost}</u></span>
                                    </div> : ""
                                }
                            </div>}
                        />
                    </Card>
                </div>
                <div className="filter"></div>
                <div className="drawer-content" style={{ overflow: "scroll" }}>
                    <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                        <CardContent className="card-content">
                            {
                                image.typeobject == 2 ?
                                    <div>
                                        <div
                                            style={{ position: "relative" }}
                                            onClick={() => {
                                                this.props.setMediaToViewer([image])
                                                this.props.toggleMediaViewerDrawer(true, {
                                                    showInfo: true,
                                                    isvideo: true
                                                })
                                            }}>
                                            <IconButton className="bt-play">
                                                <PlayArrowIcon />
                                            </IconButton>
                                            <img src={image.thumbnailname} style={{ width: "100%" }} />
                                        </div>
                                    </div>
                                    : <img src={image.name} className="image" />
                            }
                            {
                                image.numlike > 0 || image.numcomment > 0 ? <div className="react-reward">
                                    {
                                        image.numlike > 0 ? <span className="like">
                                            {
                                                image.iconNumbers.filter(item => item.icon != image.iconlike).map((item, index) => item.icon > 0 && item.num > 0 && <img key={index} src={ReactSelectorIcon[item.icon].icon}></img>)
                                            }
                                            {
                                                image.islike == 1 ? <img src={ReactSelectorIcon[image.iconlike].icon}></img> : ""
                                            }
                                            <span>{image.numlike}</span>
                                        </span> : <span className="like">
                                            </span>
                                    }
                                    {
                                        image.numcomment > 0 ? <span className="comment">{image.numcomment} bình luận</span> : ""
                                    }
                                </div> : ""
                            }
                        </CardContent>
                        <CardActions disableSpacing className="post-actions">
                            <FacebookSelector
                                open={openReactions}
                                active={image.iconlike > 0 ? image.iconlike : 0}
                                onClose={() => this.setState({ openReactions: false })}
                                onReaction={(reaction) => this.props.onLikeImage(reaction)}
                                onShortPress={(reaction) => image.islike == 1 ? this.props.onDislikeImage() : this.props.onLikeImage(reaction)}
                            />
                            <Button onClick={() => this.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
                        </CardActions>
                        {
                            daskMode ? "" : (data.numcomment > 0 ? <Collapse in={true} timeout="auto" unmountOnExit className={"comment-container"}>
                                <CardContent className={"card-container"}>
                                    <ul className="comment-list" onClick={() => this.setState({ showCommentDrawer: true, currentPost: data })}>
                                        {
                                            comments.map((comment, index) => <Comment
                                                key={index}
                                                comment={comment}
                                                hideReactions={false}
                                                onReply={comment => this.setState({ replyFor: comment })}
                                                image={image}
                                            />)
                                        }
                                    </ul>
                                </CardContent>
                            </Collapse> : "")
                        }
                    </Card>
                </div>
                <div className="comment-input-text">
                    <div className="image-selected">
                        {
                            imageSelected && imageSelected.map((image, index) => <div key={index} >
                                <div style={{ background: "url(" + URL.createObjectURL(image.file) + ")" }}></div>
                                <IconButton onClick={() => this.handleDeleteImage(image)}><CloseIcon /></IconButton>
                            </div>)
                        }
                    </div>
                    {
                        replyFor ? <div className="reply-for-comment">
                            <IconButton onClick={() => this.setState({ replyFor: null })}><CloseIcon /></IconButton>
                            <span>Đang trả lời <span>{replyFor.nameusercomment}</span></span>
                        </div> : ""
                    }
                    <div className="input-box">
                        <Dropzone onDrop={acceptedFiles => this.selectImage(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()} id="bt-select-image">
                                    <input {...getInputProps()} accept="image/*" multiple={false} />
                                    <IconButton><img src={Picture} /></IconButton>
                                </div>
                            )}
                        </Dropzone>
                        <MultiInput
                            ref={this.commentInput}
                            style={{
                                minHeight: "20px",
                                border: "none",
                            }}
                            onChange={value => this.setState({
                                commentContent: value.text,
                                mentionSelected: value.mentionSelected,
                                hashtagSelected: value.hashtagSelected,
                            })}
                            topDown={false}
                            placeholder={"Bình luận của bạn"}
                            enableHashtag={true}
                            enableMention={true}
                            centerMode={false}
                            value={commentContent}
                            suggestionClass="custom-suggestion"
                        />
                        <IconButton onClick={() => this.handleComment()}><img src={Send} /></IconButton>
                    </div>
                </div>
                {
                    renderConfirmDrawer(this)
                }
            </div > : ""
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
    togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
    toggleMediaViewerDrawer: (isShow, features) => dispatch(toggleMediaViewerDrawer(isShow, features)),
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
    updatePosted: (posted, userId) => dispatch(updatePosted(posted, userId)),
    likePosted: (post, likeIcon, targetKey, userId) => dispatch(likePosted(post, likeIcon, targetKey, userId)),
    dislikePosted: (post, targetKey, userId) => dispatch(dislikePosted(post, targetKey, userId)),
    likeImage: (postId, imageId, iconCode, userId) => dispatch(likeImage(postId, imageId, iconCode, userId)),
    dislikeImage: (postId, imageId, userId) => dispatch(dislikeImage(postId, imageId, userId)),
    setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
    toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
    toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
    setCurrentPosted: (post) => dispatch(setCurrentPosted(post)),
    deletePostSuccess: (postId, userId) => dispatch(deletePostSuccess(postId, userId)),
    commentImageSuccess: (comment, nameImage) => dispatch(commentImageSuccess(comment, nameImage)),
    setCommentImage: (comments, nameImage) => dispatch(setCommentImage(comments, nameImage)),
    replyImageCommentSuccess: (comment, replyId, nameImage) => dispatch(replyImageCommentSuccess(comment, replyId, nameImage)),
    changeCommentCountForPost: (number, postId, userId) => dispatch(changeCommentCountForPost(number, postId, userId)),
    changeCommentCountForImage: (number, postId, userId, detailimageid) => dispatch(changeCommentCountForImage(number, postId, userId, detailimageid))
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);

const mediaRootActions = (component) => [
    {
        label: "Lưu vào điện thoại",
        action: (value) => component.downloadImage(value.name)
    },
    {
        label: "Chỉnh sửa nội dung",
        action: (value) => alert("Chỉnh sửa nội dung")
    },
    {
        label: "Đặt làm ảnh đại diện",
        action: (value) => alert("Đặt làm ảnh đại diện")
    },
    {
        label: "Đặt làm ảnh bìa",
        action: (value) => alert("Đặt làm ảnh bìa")
    },
    {
        label: "Chỉnh sửa quyền riêng tư",
        action: (value) => component.setState({
            currentImage: value,
            showUpdatePrivacyDrawer: true,
            privacySelected: component.props.data.postforid,
        })
    },
    {
        label: "Xoá ảnh",
        action: (value) => component.setState({
            showConfim: true,
            okCallback: () => component.deleteImage(value),
            confirmTitle: "",
            confirmMessage: "Khi xoá ảnh sẽ xoá luôn bài đăng, bạn vẫn muốn tiếp tục?"
        })
    },
    {
        label: "Đặt làm ảnh đại diện album",
        action: (value) => component.setImageToAlbumBackground(value)
    }
]

const mediaGuestActions = (component) => [
    {
        label: "Lưu vào điện thoại",
        action: (value) => component.downloadImage(value.name)
    },
    {
        label: "Chỉnh sửa nội dung",
        action: (value) => alert("Chỉnh sửa nội dung")
    },
    {
        label: "Đặt làm ảnh đại diện",
        action: (value) => alert("Đặt làm ảnh đại diện")
    },
    {
        label: "Đặt làm ảnh bìa",
        action: (value) => alert("Đặt làm ảnh bìa")
    },
    {
        label: "Chỉnh sửa quyền riêng tư",
        action: (value) => component.setState({
            currentImage: value,
            showUpdatePrivacyDrawer: true,
            privacySelected: component.props.data.postforid,
        })
    },
    {
        label: "Xoá ảnh",
        action: (value) => component.setState({
            showConfim: true,
            okCallback: () => component.deleteImage(value),
            confirmTitle: "",
            confirmMessage: "Khi xoá ảnh sẽ xoá luôn bài đăng, bạn vẫn muốn tiếp tục?"
        })
    },
    {
        label: "Đặt làm ảnh đại diện album",
        action: (value) => component.setImageToAlbumBackground(value)
    }
]

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
                    <Button className="bt-confirm" onClick={() => component.setState({ showConfim: false }, () => okCallback ? okCallback() : null)}>Đồng ý</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showConfim: false })}>Đóng</Button>
                </div>
            </div>
        </Drawer>
    )
}

