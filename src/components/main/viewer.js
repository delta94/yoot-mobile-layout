import React from "react";
import "./viewer.scss";
import { connect } from 'react-redux'
import {
    toggleMediaViewerDrawer,
    updateMediaViewed,
    removeMediaViewed,
    toggleCommentDrawer,
    toggleCommentImageDrawer
} from '../../actions/app'
import {
    updatePrivacyPosted,
    likePosted,
    dislikePosted,
    likeImage,
    dislikeImage,
} from '../../actions/posted'
import {
    Drawer,
    IconButton,
    Button,
    Radio
} from '@material-ui/core'
import {
    Close as CloseIcon,
    MoreVert as MoreVertIcon,
    ChevronLeft as ChevronLeftIcon,
    Replay10 as Replay10Icon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Forward10 as Forward10Icon
} from '@material-ui/icons'
import Slider from "react-slick";
import moment from 'moment'
import { fromNow, objToArray, objToQuery, srcToFile } from "../../utils/common";
import { Player, ControlBar, ReplayControl, ForwardControl } from 'video-react';
import $ from 'jquery'
import { Privacies } from "../../constants/constants";
import Loader from '../common/loader'
import { get, post, postFormData } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import MultiInput from '../common/multi-input'
import Cropper from '../common/cropper'
import ShowMoreText from 'react-show-more-text';
import FacebookSelector from "../common/facebook-selector";

const coin = require('../../assets/icon/Coins_Y.png')
const search = require('../../assets/icon/Find@1x.png')
const like1 = require('../../assets/icon/like1@1x.png')
const likeActive = require('../../assets/icon/like@1x.png')
const comment = require('../../assets/icon/comment1@1x.png')
const share = require('../../assets/icon/share1@1x.png')

const NewGr = require('../../assets/icon/NewGr@1x.png')

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showControl: true,
            isPlaying: true,
            crop: {
                unit: '%',
                width: 100,
                height: 100
            },
        }
        this.player = React.createRef()
    }

    likePosted(reaction) {
        let data = this.state.currentPost
        if (!data) return;
        let param = {
            postid: data.nfid,
            icon: reaction.code,
        };
        this.props.likePosted(data, reaction.code, "", data.iduserpost);
        if (data.usersTag.length > 0) {
            data.usersTag.map(item => {
                this.props.likePosted(data, reaction.code, "myPosteds", item.id)
                if (data.mediaPlays.length == 1) {
                    let image = data.mediaPlays[0];
                    this.props.likeImage(data, image.detailimageid, reaction.code, item.id);
                }
            })

        }
        if (data.mediaPlays.length == 1) {
            let image = data.mediaPlays[0];
            this.props.likeImage(data, image.detailimageid, reaction.code, data.iduserpost);
        }
        this.setState({ isProccesing: false });
        post(
            SOCIAL_NET_WORK_API,
            "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
            null,
            (result) => { }
        );
    }

    dislikePosted() {
        let data = this.state.currentPost
        if (!data) return;
        let param = {
            postid: data.nfid,
            icon: -1,
        };
        this.setState({ isProccesing: false });
        this.props.dislikePosted(data, "myPosteds", data.iduserpost);

        if (data.usersTag.length > 0) {
            data.usersTag.map(item => {
                this.props.dislikePosted(data, "myPosteds", item.id);
                if (data.mediaPlays.length == 1) {
                    let image = data.mediaPlays[0];
                    this.props.dislikeImage(data, image.detailimageid, item.id);
                }
            })

        }

        if (data.mediaPlays.length == 1) {
            let image = data.mediaPlays[0];
            this.props.dislikeImage(data, image.detailimageid, data.iduserpost);
        }
        post(
            SOCIAL_NET_WORK_API,
            "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
            null,
            (result) => { }
        );
    }

    likeImage(reaction, image) {
        let data = this.state.currentPost
        if (!data) return;
        let param = {
            postid: data.nfid,
            icon: reaction.code,
            nameimage: image.nameimage,
        };
        this.props.likeImage(data, image.detailimageid, reaction.code, data.iduserpost);
        this.setState({ isProccesing: false });
        post(
            SOCIAL_NET_WORK_API,
            "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
            null,
            (result) => { }
        );
    }

    dislikeImage(image) {
        let data = this.state.currentPost
        if (!data) return;
        let param = {
            postid: data.nfid,
            icon: -1,
            nameimage: image.nameimage,
        };
        this.props.dislikeImage(data, image.detailimageid, data.iduserpost);
        this.setState({ isProccesing: false });

        post(
            SOCIAL_NET_WORK_API,
            "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
            null,
            (result) => { }
        );
    }

    toggleControl() {
        let {
            showControl
        } = this.state
        if (showControl == true) {
            $(".video-react-controls-enabled").addClass("video-react-user-inactive")
            $(".video-react-controls-enabled").removeClass("video-react-user-active")
        } else {
            $(".video-react-controls-enabled").removeClass("video-react-user-inactive")
            $(".video-react-controls-enabled").addClass("video-react-user-active")
        }
        this.setState({
            showControl: !showControl
        })
    }

    handlePlayVideo() {

        let video = this.player.current

        if (video) {
            video.play()
            video.subscribeToStateChange((state, prevState) => {
                if (state.isActive == false) {
                    this.setState({
                        showControl: false
                    })
                }
                this.setState({
                    isPlaying: !state.paused
                })
            })
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

    handleChangeCurrentTime(seconds) {
        let video = this.player.current
        if (video) {
            const { player } = video.getState();
            video.seek(player.currentTime + seconds)
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

    updateImagePrivacy() {
        let {
            currentImage,
            privacySelected,
            callbackAction
        } = this.state
        let {
            profile
        } = this.props
        if (currentImage && privacySelected) {
            let param = {
                postid: currentImage.postid,
                postfor: privacySelected
            }
            this.setState({
                isProccesing: true
            })
            post(SOCIAL_NET_WORK_API, "PostNewsFeed/ChangePostFor" + objToQuery(param), null, result => {
                if (result && result.result == 1) {
                    this.setState({
                        isProccesing: false,
                        showUpdatePrivacyDrawer: false
                    })
                    this.props.updateMediaViewed({ ...currentImage, postfor: privacySelected })
                    this.props.updatePrivacyPosted(profile.id, currentImage.postid, privacySelected)
                    if (callbackAction) callbackAction()
                }
            })
        }
    }

    handleUpdateInfoOfProfilePost() {
        let {
            currentImage,
            callbackAction,
            postContent
        } = this.state

        let param = {
            "postid": currentImage.postid,
            "nameImage": currentImage.name.split('/').slice(-1).pop(),
            "content": postContent,
            "isclear": 0
        }

        this.setState({
            isPosting: false
        })

        post(SOCIAL_NET_WORK_API, "PostNewsFeed/AddContentImageNewsFeed", param, result => {
            if (result && result.result == 1) {
                this.props.updateMediaViewed({ ...currentImage, postcontent: postContent })
                setTimeout(() => {
                    this.setState({ showUpdateInfoOfProfilePost: false })
                }, 200);
                if (callbackAction) callbackAction()
            }
        })
    }

    deleteImage() {
        let {
            currentImage,
            callbackAction,
        } = this.state
        let {
            mediaToView
        } = this.props
        let param = {
            postid: currentImage.postid
        }
        this.setState({
            isProccesing: true
        })
        post(SOCIAL_NET_WORK_API, "PostNewsFeed/DeleteNewsFeed" + objToQuery(param), null, result => {
            if (result && result.result == 1) {
                if (mediaToView && mediaToView.length <= 1) {
                    this.props.toggleMediaViewerDrawer(false)
                }
                else {
                    this.props.removeMediaViewed(currentImage)
                    setTimeout(() => {
                        this.setState({ showUpdateInfoOfProfilePost: false })
                    }, 200);
                }
                if (callbackAction) callbackAction()
            }
        })
    }

    updateAvatar() {
        let {
            avatarToUpload,
            rootAvatarToUpload,
            isProccessing,
            postContent,
            callbackAction
        } = this.state
        var fr = new FileReader;
        let that = this
        if (isProccessing == true) return
        this.setState({
            isProccessing: true
        })
        fr.onload = function () {
            var img = new Image;
            img.onload = function () {

                const formData = new FormData();
                if (avatarToUpload) {
                    let avatarFileToUpload = new File(
                        [avatarToUpload.file],
                        avatarToUpload.file.name,
                        {
                            type: avatarToUpload.file.type,
                            lastModified: new Date,
                            part: avatarToUpload.file.name
                        }
                    )
                    formData.append("avatarcut_1_" + avatarToUpload.width + "_" + avatarToUpload.height, avatarFileToUpload)
                } else {
                    formData.append("avatarcut_1_" + img.width + "_" + img.height, rootAvatarToUpload)
                }

                formData.append("content", postContent ? postContent : "")
                formData.append("avatarroot_0_" + img.width + "_" + img.height, rootAvatarToUpload)

                postFormData(SOCIAL_NET_WORK_API, "User/UpdateAvatar", formData, result => {
                    that.setState({
                        openAvatarCropperDrawer: false,
                        openUploadAvatarReview: false,
                        isReviewMode: false,
                        isProccessing: false
                    })
                    if (callbackAction) callbackAction()
                })
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(rootAvatarToUpload);
    }

    updateBackground() {
        let {
            backgroundToUpload,
            rootBackgroundToUpload,
            isProccessing,
            postContent,
            callbackAction
        } = this.state
        var fr = new FileReader;
        let that = this
        if (isProccessing == true) return
        this.setState({
            isProccessing: true
        })
        fr.onload = function () {
            var img = new Image;
            img.onload = function () {

                const formData = new FormData();

                if (backgroundToUpload) {
                    let backgroundFileToUpload = new File(
                        [backgroundToUpload.file],
                        backgroundToUpload.file.name,
                        {
                            type: backgroundToUpload.file.type,
                            lastModified: new Date,
                            part: backgroundToUpload.file.name
                        }
                    )
                    formData.append("avatarcut_1_" + backgroundToUpload.width + "_" + backgroundToUpload.height, backgroundFileToUpload)
                } else {
                    formData.append("avatarcut_1_" + img.width + "_" + img.height, rootBackgroundToUpload)
                }

                formData.append("content", postContent ? postContent : "")
                formData.append("avatarroot_0_" + img.width + "_" + img.height, rootBackgroundToUpload)


                postFormData(SOCIAL_NET_WORK_API, "User/UpdateBackground", formData, result => {
                    that.setState({
                        openBackgroundCropperDrawer: false,
                        openUploadBackgroundReview: false,
                        isReviewMode: false,
                        isProccessing: false
                    })
                    if (callbackAction) callbackAction()
                })
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(rootBackgroundToUpload);
    }

    updateAlbumBackground() {
        let {
            rootAlbumBackgroundToUpload,
            albumBackgroundToUpload,
            isProccessing,
            albumDetail,
            callbackAction,
            currentImage
        } = this.state
        var fr = new FileReader;
        let that = this
        if (isProccessing == true) return
        this.setState({
            isProccessing: true
        })
        fr.onload = function () {
            var img = new Image;
            img.onload = function () {

                const formData = new FormData();

                if (albumBackgroundToUpload) {
                    let newfile = new File(
                        [albumBackgroundToUpload.file],
                        albumBackgroundToUpload.file.name,
                        {
                            type: albumBackgroundToUpload.file.type,
                            lastModified: new Date,
                            part: albumBackgroundToUpload.file.name
                        }
                    )
                    formData.append("avatarcut_1_" + albumBackgroundToUpload.width + "_" + albumBackgroundToUpload.height, newfile)
                } else {
                    formData.append("avatarcut_1_" + img.width + "_" + img.height, rootAlbumBackgroundToUpload)
                }

                formData.append("albumid", currentImage.albumid)
                formData.append("avatarroot_0_" + img.width + "_" + img.height, rootAlbumBackgroundToUpload)


                postFormData(SOCIAL_NET_WORK_API, "Media/UpdateBackground", formData, result => {
                    that.setState({
                        openAlbumBackgroundCropperDrawer: false,
                        openUploadAlbumBackgroundReview: false,
                        isReviewMode: false,
                        isProccessing: false
                    })
                    if (callbackAction) callbackAction()
                })
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(rootAlbumBackgroundToUpload);
    }

    handleAction(activeItem, key, callBack) {
        let {
            mediaToView
        } = this.props
        this.setState({ showMediaViewerMenu: false })
        switch (key) {
            case "UpdatePrivacy": {
                this.setState({
                    currentImage: activeItem,
                    showUpdatePrivacyDrawer: true,
                    privacySelected: activeItem.postfor,
                    callbackAction: () => callBack(mediaToView.find(item => item.postid == activeItem.postid))
                })
                return
            }
            case "UpdateInfo": {
                this.setState({
                    currentImage: activeItem,
                    showUpdateInfoOfProfilePost: true,
                    postContent: activeItem.postcontent,
                    callbackAction: () => callBack(mediaToView.find(item => item.postid == activeItem.postid))
                })
                return
            }
            case "Delete": {
                this.setState({
                    currentImage: activeItem,
                    showConfim: true,
                    okCallback: () => this.deleteImage(),
                    confirmTitle: "",
                    confirmMessage: "Khi xoá ảnh sẽ xoá luôn bài đăng, bạn vẫn muốn tiếp tục?",
                    callbackAction: () => callBack(mediaToView.find(item => item.postid == activeItem.postid))
                })
                return
            }
            case "SetToAvatar": {
                let that = this
                if (activeItem.nameroot == "" || !activeItem.nameroot) activeItem.nameroot = activeItem.name
                if (activeItem.nameimage == "") activeItem.nameimage = activeItem.nameroot.split('/').slice(-1).pop()
                srcToFile(
                    activeItem.nameroot,
                    activeItem.nameimage,
                    'image/' + activeItem.nameimage.split(".")[1]
                ).then(function (file) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () =>
                        that.setState({
                            currentImage: activeItem,
                            avatarSelected: reader.result,
                            rootAvatarToUpload: file,
                            openUploadAvatarReview: true,
                            callbackAction: () => callBack(mediaToView.find(item => item.postid == activeItem.postid))
                        }, () => {
                            setTimeout(() => {
                                that.setState({
                                    openAvatarCropperDrawer: true
                                })
                            }, 1000);
                        })
                    );
                    reader.readAsDataURL(file);

                })
                return
            }
            case "SetToBackground": {
                let that = this
                if (activeItem.nameroot == "" || !activeItem.nameroot) activeItem.nameroot = activeItem.name
                if (activeItem.nameimage == "") activeItem.nameimage = activeItem.nameroot.split('/').slice(-1).pop()
                srcToFile(
                    activeItem.nameroot,
                    activeItem.nameimage,
                    'image/' + activeItem.nameimage.split(".")[1]
                ).then(function (file) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () =>
                        that.setState({
                            currentImage: activeItem,
                            backgroundSrc: reader.result,
                            rootBackgroundToUpload: file,
                            openUploadBackgroundReview: true,
                            callbackAction: () => callBack(mediaToView.find(item => item.postid == activeItem.postid))
                        }, () => {
                            setTimeout(() => {
                                that.setState({
                                    openBackgroundCropperDrawer: true
                                })
                            }, 1000);
                        })
                    );
                    reader.readAsDataURL(file);

                })
                return
            }
            case "SetToAlbumBackground": {
                let that = this
                if (activeItem.nameroot == "" || !activeItem.nameroot) activeItem.nameroot = activeItem.name
                if (activeItem.nameimage == "") activeItem.nameimage = activeItem.nameroot.split('/').slice(-1).pop()
                srcToFile(
                    activeItem.nameroot,
                    activeItem.nameimage,
                    'image/' + activeItem.nameimage.split(".")[1]
                ).then(function (file) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () =>
                        that.setState({
                            currentImage: activeItem,
                            albumBackgroundSelected: reader.result,
                            rootAlbumBackgroundToUpload: file,
                            openUploadAlbumBackgroundReview: true,
                            callbackAction: () => callBack(mediaToView.find(item => item.postid == activeItem.postid))
                        }, () => {
                            setTimeout(() => {
                                that.setState({ openAlbumBackgroundCropperDrawer: true })
                            }, 1000);
                        })
                    );
                    reader.readAsDataURL(file);
                })
                return
            }
            default:
                return
        }
    }

    handleGetPost(postId) {
        let param = {
            newsfeedid: postId
        }
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetOneNewsFeed" + objToQuery(param), result => {
            if (result && result.result == 1)
                this.setState({
                    currentPost: result.content.newsFeed
                })
        })
    }

    slideChange(current) {
        let {
            mediaToView
        } = this.props
        let active = mediaToView ? mediaToView[current ? current : 0] : null
        this.setState({
            activeItem: active
        })
        this.handleGetPost(active.postid)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showMediaViewerDrawer != this.props.showMediaViewerDrawer) {
            let { mediaViewerFeature } = nextProps
            if (nextProps.showMediaViewerDrawer == true) {
                $("body > div").addClass("blur")
                setTimeout(() => {
                    $("body > div").last().removeClass("blur")
                }, 500);
            } else {
                $("body > div").removeClass("blur")
            }
            setTimeout(() => {
                if (mediaViewerFeature && mediaViewerFeature.videoCurrentTime) this.handleChangeCurrentTime(mediaViewerFeature.videoCurrentTime)
            }, 200);
        }
        if (this.props.mediaToView && this.props.mediaToView.length > 0) {
            if (nextProps.mediaToView && nextProps.mediaToView.length > 0 && nextProps.mediaToView[0].postid != this.props.mediaToView[0].postid) {
                this.handleGetPost(nextProps.mediaToView[0].postid)
            }
        } else {
            if (nextProps.mediaToView && nextProps.mediaToView.length > 0) {
                this.handleGetPost(nextProps.mediaToView[0].postid)
            }
        }

    }


    render() {
        let {
            showMediaViewerDrawer,
            mediaViewerFeature,
            mediaToView,

        } = this.props
        
        let actions = {}
        if (mediaViewerFeature && mediaViewerFeature.actions) {
            actions = mediaViewerFeature.actions
        }

        let {
            onSharePost
        } = actions

        let {
            isHideMediaHeadFoot,
            activeMeidaSlideIndex,
            activeItem,
            showControl,
            isPlaying,
            currentPost,
            openReactions
        } = this.state

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            afterChange: current => this.slideChange(current),
            easing: "ease-in-out",
            infinite: true,
            initialSlide: mediaViewerFeature && mediaViewerFeature.activeIndex ? mediaViewerFeature && mediaViewerFeature.activeIndex : 0
        };

        if (!activeItem) {
            activeItem = mediaToView && mediaViewerFeature && mediaViewerFeature.activeIndex >= 0 ? mediaToView[mediaViewerFeature.activeIndex] : null
        }



        return (
            <div>
                <Drawer anchor="bottom" className="custom-viewer-drawer" open={showMediaViewerDrawer} onClose={() => this.props.toggleMediaViewerDrawer(false)}>
                    {
                        <div className="viewer-content">
                            {
                                mediaViewerFeature && mediaViewerFeature.isvideo == true ? "" : <div className={"header " + (showControl == false ? "hide" : "")} >
                                    <IconButton onClick={() => {
                                        this.props.toggleMediaViewerDrawer(false)
                                    }}><CloseIcon /></IconButton>
                                    {
                                        mediaViewerFeature && mediaViewerFeature.actions ? <IconButton onClick={(e) => this.setState({ showMediaViewerMenu: true })}>
                                            <MoreVertIcon />
                                        </IconButton> : ""
                                    }
                                </div>
                            }
                            <div className="content">
                                {
                                    mediaToView && mediaToView.length > 0 ? <Slider {...settings} >
                                        {
                                            mediaToView.map((item, index) => <div key={index} className="media-slide-item">
                                                {
                                                    item.typeobject == 1
                                                        ? <div className="image" style={{ background: `url("${item.nameroot ? item.nameroot : item.name} ")` }} onClick={() => this.toggleControl()} />
                                                        : <div className="video">
                                                            <Player
                                                                ref={this.player}
                                                                src={item.nameroot ? item.nameroot : item.name}
                                                                playsInline={true}
                                                                autoPlay={true}
                                                            >
                                                                <ControlBar autoHide={true}>
                                                                    <div className="overlay" onClick={() => this.toggleControl()}></div>
                                                                    <div className="blank-content">
                                                                        <IconButton onClick={() => {
                                                                            this.props.toggleMediaViewerDrawer(false)
                                                                            if (mediaViewerFeature.onCloseVideo) {
                                                                                mediaViewerFeature.onCloseVideo(this.player.current.getState().player.currentTime)
                                                                            }
                                                                        }}><CloseIcon /></IconButton>
                                                                    </div>
                                                                    <ReplayControl seconds={10} order={2.2} />
                                                                    <ForwardControl seconds={10} order={3.2} />
                                                                    <div className="footer-info">
                                                                        <div className={"footer"}>
                                                                            {
                                                                                mediaViewerFeature && mediaViewerFeature.showInfo ? <div className={"viewer-footer " + (isHideMediaHeadFoot ? "hide" : "")}>
                                                                                    {
                                                                                        activeItem && currentPost ? <div className="footer-infor">
                                                                                            <div className="user-info">
                                                                                                <span>{currentPost.nameuserpost}</span>
                                                                                            </div>
                                                                                            {/* <div className="post-content">
                                                                                                {
                                                                                                    showControl ?
                                                                                                        <ShowMoreText
                                                                                                            lines={4}
                                                                                                            more={<span> Xem thêm</span>}
                                                                                                            less={<span> Rút gọn</span>}
                                                                                                            className='content-css'
                                                                                                            anchorClass='toggle-button blued'
                                                                                                            expanded={false}
                                                                                                        >
                                                                                                            <pre>{currentPost.nfcontent}</pre>
                                                                                                        </ShowMoreText> : ""
                                                                                                }
                                                                                            </div> */}
                                                                                            <div className="post-time">
                                                                                                <span>{fromNow(moment(currentPost.createdate), new Date)}</span>
                                                                                            </div>
                                                                                        </div> : ""
                                                                                    }
                                                                                    {
                                                                                        activeItem ? <div className="footer-reward">
                                                                                            {
                                                                                                activeItem.numlike > 0 || activeItem.numcomment > 0 || activeItem.numview > 0 ? <ul>
                                                                                                    {
                                                                                                        activeItem.numlike > 0 ? <li>
                                                                                                            <img src={likeActive} />
                                                                                                            <span className="ml05">{activeItem ? activeItem.numlike : 0}</span>
                                                                                                        </li> : <li></li>
                                                                                                    }
                                                                                                    {
                                                                                                        activeItem.numcomment > 0 || activeItem.numview > 0 ? <li>
                                                                                                            {
                                                                                                                activeItem.numcomment > 0 ? <span>{activeItem ? activeItem.numcomment : 0} bình luận </span> : ""
                                                                                                            }
                                                                                                            {
                                                                                                                activeItem.numview > 0 ? <span className="ml05">{activeItem ? activeItem.numview : 0} lượt xem </span> : ""
                                                                                                            }

                                                                                                        </li> : <li></li>
                                                                                                    }

                                                                                                </ul> : ""
                                                                                            }
                                                                                        </div> : ""
                                                                                    }
                                                                                    {
                                                                                        activeItem && currentPost ? <div className="footer-action">
                                                                                            <ul>
                                                                                                <li>
                                                                                                    <FacebookSelector
                                                                                                        open={openReactions}
                                                                                                        active={activeItem.iconlike}
                                                                                                        onClose={() => this.setState({ openReactions: false })}
                                                                                                        onReaction={(reaction) => currentPost.mediaPlays && currentPost.mediaPlays.length == 1 ? this.likePosted(reaction) : this.likeImage(reaction, activeItem)}
                                                                                                        onShortPress={(reaction) =>
                                                                                                            activeItem.islike == 1
                                                                                                                ? currentPost.mediaPlays && currentPost.mediaPlays.length == 1 ? this.dislikePosted(reaction) : this.dislikeImage(activeItem)
                                                                                                                : currentPost.mediaPlays && currentPost.mediaPlays.length == 1 ? this.likePosted(reaction) : this.likeImage(reaction, activeItem)
                                                                                                        }
                                                                                                    />
                                                                                                </li>
                                                                                                <li>
                                                                                                    <Button onClick={() => {
                                                                                                        this.handlePauseVideo()
                                                                                                        this.props.toggleCommentDrawer(true, currentPost)
                                                                                                    }}>
                                                                                                        <img src={comment} />
                                                                                                        <span>Bình luận</span>
                                                                                                    </Button>
                                                                                                </li>
                                                                                                <li>
                                                                                                    <Button onClick={() => {
                                                                                                        if (onSharePost)
                                                                                                            onSharePost()
                                                                                                        this.handlePauseVideo()
                                                                                                    }}>
                                                                                                        <img src={share} />
                                                                                                        <span>Chia sẻ</span>
                                                                                                    </Button>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </div> : ""
                                                                                    }
                                                                                </div> : ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-bt-control-bar">
                                                                        <IconButton onClick={() => this.handleChangeCurrentTime(-10)}><Replay10Icon /></IconButton>
                                                                        <IconButton onClick={() => isPlaying == true ? this.handlePauseVideo() : this.handlePlayVideo()}>
                                                                            {
                                                                                isPlaying == true ? <PauseIcon /> : <PlayArrowIcon />
                                                                            }
                                                                        </IconButton>
                                                                        <IconButton onClick={() => this.handleChangeCurrentTime(10)}><Forward10Icon /></IconButton>
                                                                    </div>
                                                                </ControlBar>
                                                            </Player>
                                                        </div>
                                                }
                                            </div>)
                                        }
                                    </Slider> : ""
                                }
                            </div>
                            {
                                mediaViewerFeature && mediaViewerFeature.isvideo == true ? "" : <div className={"footer " + (showControl == false ? "hide" : "")}>
                                    {
                                        mediaViewerFeature && mediaViewerFeature.showInfo ? <div className={"viewer-footer " + (isHideMediaHeadFoot ? "hide" : "")}>
                                            {
                                                activeItem && currentPost ? <div className="footer-infor">
                                                    <div className="user-info">
                                                        <span>{currentPost.nameuserpost}</span>
                                                    </div>
                                                    {
                                                        mediaToView && mediaToView.length == 1 ? < div className="post-content">
                                                            {
                                                                showControl ?
                                                                    <ShowMoreText
                                                                        lines={4}
                                                                        more={<span> Xem thêm</span>}
                                                                        less={<span> Rút gọn</span>}
                                                                        className='content-css'
                                                                        anchorClass='toggle-button blued'
                                                                        expanded={false}
                                                                    >
                                                                        <pre>{currentPost.nfcontent}</pre>
                                                                    </ShowMoreText> : ""
                                                            }
                                                        </div> : ""
                                                    }
                                                    <div className="post-time">
                                                        <span>{fromNow(moment(currentPost.createdate), new Date)}</span>
                                                    </div>
                                                </div> : ""
                                            }
                                            {
                                                activeItem ? <div className="footer-reward">
                                                    {
                                                        activeItem.numlike > 0 || activeItem.numcomment > 0 ? <ul>
                                                            {
                                                                activeItem.numlike > 0 ? <li>
                                                                    <img src={likeActive} />
                                                                    <span className="ml05">{activeItem ? activeItem.numlike : 0}</span>
                                                                </li> : <li></li>
                                                            }
                                                            {
                                                                activeItem.numcomment > 0 ? <li>
                                                                    <span>{activeItem ? activeItem.numcomment : 0} bình luận</span>
                                                                </li> : <li></li>
                                                            }
                                                        </ul> : ""
                                                    }
                                                </div> : ""
                                            }
                                            {activeItem && <div className="footer-action">
                                                <ul>
                                                    <li>
                                                        <FacebookSelector
                                                            open={openReactions}
                                                            active={activeItem.iconlike}
                                                            onClose={() => this.setState({ openReactions: false })}
                                                            onReaction={(reaction) => mediaToView.length == 1 ? this.likePosted(reaction) : this.likeImage(reaction, activeItem)}
                                                            onShortPress={(reaction) =>
                                                                activeItem.islike == 1
                                                                    ? mediaToView.length == 1 ? this.dislikePosted(reaction) : this.dislikeImage(activeItem)
                                                                    : mediaToView.length == 1 ? this.likePosted(reaction) : this.likeImage(reaction, activeItem)
                                                            }
                                                        />
                                                    </li>
                                                    <li>
                                                        <Button onClick={() => this.props.toggleCommentImageDrawer(true, activeItem, currentPost)}>
                                                            <img src={comment} />
                                                            <span>Bình luận</span>
                                                        </Button>
                                                    </li>
                                                    <li>
                                                        <Button onClick={() => onSharePost ? onSharePost() : null}>
                                                            <img src={share} />
                                                            <span>Chia sẻ</span>
                                                        </Button>
                                                    </li>
                                                </ul>
                                            </div>}
                                        </div> : ""
                                    }
                                </div>
                            }
                        </div>
                    }
                </Drawer >
                {
                    renderMediaViewerMenu(this)
                }
                {
                    renderUpdatePrivacyImageDrawer(this)
                }
                {
                    renderUpdateInfoOfProfilePostDrawer(this)
                }
                {
                    renderConfirmDrawer(this)
                }
                {
                    renderUpdateAlbumBackgroundReviewDrawer(this)
                }
                {
                    renderCropperDrawer(this)
                }
                {
                    renderUpdateAvatarReviewDrawer(this)
                }
                {
                    renderAvatarCropperDrawer(this)
                }
                {
                    renderUpdateBackgroundReviewDrawer(this)
                }
                {
                    renderBackgroundCropperDrawer(this)
                }
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.app,
        ...state.user
    }
};

const mapDispatchToProps = dispatch => ({
    toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
    updateMediaViewed: (media) => dispatch(updateMediaViewed(media)),
    removeMediaViewed: (media) => dispatch(removeMediaViewed(media)),
    updatePrivacyPosted: (userId, postId, privacy) => dispatch(updatePrivacyPosted(userId, postId, privacy)),
    likePosted: (post, likeIcon, targetKey, userId) =>
        dispatch(likePosted(post, likeIcon, targetKey, userId)),
    dislikePosted: (post, targetKey, userId) =>
        dispatch(dislikePosted(post, targetKey, userId)),
    likeImage: (postId, imageId, iconCode, userId) =>
        dispatch(likeImage(postId, imageId, iconCode, userId)),
    dislikeImage: (postId, imageId, userId) =>
        dispatch(dislikeImage(postId, imageId, userId)),
    toggleCommentDrawer: (isShow, currentPostForComment) => dispatch(toggleCommentDrawer(isShow, currentPostForComment)),
    toggleCommentImageDrawer: (isShow, currentImageForComment, currentPostForComment) => dispatch(toggleCommentImageDrawer(isShow, currentImageForComment, currentPostForComment))
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
                    <Button className="bt-confirm" onClick={() => component.setState({ showConfim: false }, () => okCallback ? okCallback() : null)}>Đồng ý</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showConfim: false })}>Đóng</Button>
                </div>
            </div>
        </Drawer>
    )
}

const renderMediaViewerMenu = (component) => {
    let {
        showMediaViewerMenu,
        activeItem
    } = component.state
    let {
        mediaViewerFeature,
        mediaToView
    } = component.props
    if (!activeItem && mediaViewerFeature && mediaViewerFeature.activeIndex >= 0) {
        activeItem = mediaToView[mediaViewerFeature.activeIndex]
    }

    let actions = {}
    if (mediaViewerFeature && mediaViewerFeature.actions) {
        actions = mediaViewerFeature.actions
    }
    let {
        onSaveImage,
        onUpdateInfo,
        onSetToAvatar,
        onSetToBackground,
        onUpdatePrivacy,
        onDelete,
        onSetToAlbumBackground
    } = actions


    return (
        <Drawer anchor="bottom" className="media-viewer-menu" open={showMediaViewerMenu} onClose={() => component.setState({ showMediaViewerMenu: false })}>
            <div className="menu-content">
                <div className="menu-header">
                    <div className="direction" onClick={() => component.setState({ showMediaViewerMenu: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Tác vụ</label>
                    </div>
                </div>
                {/* {
                    mediaViewerFeature && mediaViewerFeature.actions ? <div className="menu-list">
                        <ul>
                            {
                                mediaViewerFeature.actions.length > 0 ? mediaViewerFeature.actions.map((action, index) => action && <li key={index}>
                                    <Button onClick={() => {
                                        action.action(mediaToView.find(item => item.postid == activeItem.postid))
                                        component.setState({ showMediaViewerMenu: false })
                                    }}><span>{action.label}</span></Button>
                                </li>) : ""
                            }
                        </ul>
                    </div> : ""
                } */}
                <div className="menu-list">
                    <ul>
                        {
                            onSaveImage ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "Save", (item) => onSaveImage(item))}><span>Lưu vào điện thoại</span></Button>
                            </li> : ""
                        }
                        {
                            onUpdateInfo ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "UpdateInfo", (item) => onUpdateInfo(item))}><span>Chỉnh sửa nội dung</span></Button>
                            </li> : ""
                        }
                        {
                            onSetToAvatar ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "SetToAvatar", (item) => onSetToAvatar(item))}><span>Đặt làm ảnh đại diện</span></Button>
                            </li> : ""
                        }
                        {
                            onSetToBackground ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "SetToBackground", (item) => onSetToBackground(item))}><span>Đặt làm ảnh bìa</span></Button>
                            </li> : ""
                        }
                        {
                            onUpdatePrivacy ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "UpdatePrivacy", (item) => onUpdatePrivacy(item))}><span>Chỉnh sửa quyền riêng tư</span></Button>
                            </li> : ""
                        }
                        {
                            onDelete ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "Delete", (item) => onDelete(item))}><span>Xoá ảnh</span></Button>
                            </li> : ""
                        }
                        {
                            onSetToAlbumBackground && activeItem && activeItem.albumid > 0 ? <li>
                                <Button onClick={() => component.handleAction(activeItem, "SetToAlbumBackground", (item) => onSetToAlbumBackground(item))}><span>Đặt làm ảnh đại diện album</span></Button>
                            </li> : ""
                        }
                    </ul>
                </div>
            </div>
        </Drawer>
    )
}

const renderUpdatePrivacyImageDrawer = (component) => {
    let {
        showUpdatePrivacyDrawer,
        isProccesing,
        privacySelected,

    } = component.state


    let PrivacyOptions = objToArray(Privacies)

    return (
        <Drawer anchor="bottom" className="update-privacy-image-drawer" open={showUpdatePrivacyDrawer} >
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.setState({ showUpdatePrivacyDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Chỉnh sửa quyền riêng tư</label>
                    </div>
                    <Button onClick={() => component.updateImagePrivacy()}>Lưu</Button>
                </div>
                <div className="filter"></div>
                <div className="drawer-content" style={{ overflow: "scroll" }}>
                    <ul>
                        {
                            PrivacyOptions.map((privacy, index) => <li key={index} onClick={() => component.setState({ privacySelected: privacy.code })}>
                                <Button>
                                    <Radio
                                        className={"custom-radio " + (privacySelected == privacy.code ? "active" : "")}
                                        checked={privacySelected == privacy.code}
                                        onChange={() => component.setState({ privacySelected: privacy.code })}
                                    />
                                    <img src={privacy.icon1} />
                                    <span>
                                        <label>{privacy.label}</label>
                                        <span>{privacy.description}</span>
                                    </span>
                                </Button>
                            </li>)
                        }
                    </ul>
                </div>

            </div>

            {
                isProccesing == true ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </Drawer>
    )
}

const renderUpdateInfoOfProfilePostDrawer = (component) => {
    let {
        showUpdateInfoOfProfilePost,
        postContent
    } = component.state

    return (
        <Drawer anchor="bottom" className="update-info-profile-post-drawer" open={showUpdateInfoOfProfilePost}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.setState({ showUpdateInfoOfProfilePost: false, postContent: "" })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Chỉnh sửa nội dung</label>
                    </div>
                    <Button className="bt-submit" onClick={() => component.handleUpdateInfoOfProfilePost()}>Đăng</Button>
                </div>
                <div className="filter"></div>
                <div className="drawer-content" style={{ overflow: "scroll", padding: "10px" }}>
                    <MultiInput
                        style={{
                            minHeight: "220px",
                            padding: "15px",
                            background: "#ededed",
                            border: "none"
                        }}
                        onChange={value => component.setState({
                            postContent: value.text,
                        })}
                        topDown={true}
                        placeholder={"Nhập nội dung mô tả"}
                        enableHashtag={false}
                        enableMention={false}
                        centerMode={false}
                        value={postContent}
                    />
                </div>

            </div>
        </Drawer>
    )
}

const renderUpdateAlbumBackgroundReviewDrawer = (component) => {
    let {
        openUploadAlbumBackgroundReview,
        isReviewMode,
        isProccessing,
        albumBackgroundToUpload
    } = component.state
    return (
        <div>
            <Drawer anchor="bottom" className="update-avatar-review-drawer upate-background-album" open={openUploadAlbumBackgroundReview} >
                <div className="drawer-detail media-drawer">
                    <div className="drawer-header">
                        <div className="direction" onClick={() => isReviewMode == false ? component.setState({ openUploadAlbumBackgroundReview: false }) : component.setState({ openAlbumBackgroundCropperDrawer: true, isReviewMode: false })}>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                            <label>{
                                isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"
                            }
                            </label>
                        </div>
                        <Button onClick={() => component.updateAlbumBackground()}>Đăng</Button>
                    </div>
                    <div className="filter">
                    </div>
                    <div className="content-form" style={{ overflow: "scroll" }}>
                        {
                            albumBackgroundToUpload ? <div className="profile-page" >
                                <div className="background-box" style={{ background: "url(" + (URL.createObjectURL(albumBackgroundToUpload.file)) + ")" }}>
                                </div>
                            </div> : ""
                        }
                    </div>
                </div>

            </Drawer>
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </div>
    )
}

const renderCropperDrawer = (component) => {
    let {
        openAlbumBackgroundCropperDrawer,
        crop,
        isProccessing,
        albumBackgroundSelected,
        albumBackgroundCropped
    } = component.state

    return (
        <div>
            <Drawer anchor="bottom" className="cropper-drawer" open={openAlbumBackgroundCropperDrawer} >
                {
                    albumBackgroundSelected ? <div className="drawer-detail">
                        <div className="drawer-content" style={{ overflow: "scroll", background: "#f2f3f7" }}>
                            <Cropper
                                src={albumBackgroundSelected}
                                crop={crop}
                                onCropped={(file) => component.setState({ albumBackgroundCropped: file })}
                            />
                        </div>
                        <div className="footer-drawer">
                            <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
                            <div>
                                <Button onClick={() => component.setState({ openAlbumBackgroundCropperDrawer: false, isReviewMode: false })}>Huỷ</Button>
                                <Button onClick={() => component.setState({ openAlbumBackgroundCropperDrawer: false, isReviewMode: true, albumBackgroundToUpload: albumBackgroundCropped })}>Chế độ xem trước</Button>
                                <Button onClick={() => component.setState({ albumBackgroundToUpload: albumBackgroundCropped }, () => component.updateAlbumBackground())}>Đăng bài</Button>
                            </div>
                        </div>

                    </div> : ""
                }

            </Drawer >
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </div>
    )
}

const renderUpdateAvatarReviewDrawer = (component) => {
    let {
        openUploadAvatarReview,
        postContent,
        isReviewMode,
        avatarToUpload,
        isProccessing
    } = component.state
    let {
        profile
    } = component.props
    return (
        <div>
            < Drawer anchor="bottom" className="update-avatar-review-drawer" open={openUploadAvatarReview} >
                <div className="drawer-detail media-drawer">
                    <div className="drawer-header">
                        <div className="direction" onClick={() => isReviewMode == false ? component.setState({ openUploadAvatarReview: false }) : component.setState({ openAvatarCropperDrawer: true, isReviewMode: false })}>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                            <label>{
                                isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"
                            }
                            </label>
                        </div>
                        <Button onClick={() => component.updateAvatar()}>Đăng</Button>
                    </div>
                    <div className="filter">
                    </div>
                    <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
                        <div className="post-content">
                            <MultiInput
                                style={{ padding: "15px 0px", border: "none" }}
                                onChange={value => component.setState({ postContent: value.text })}
                                topDown={true}
                                placeholder={"Nhập nội dung"}
                            />
                        </div>
                        <div className="profile-page" >
                            <div className="cover-img" style={{ background: profile ? ("url(" + profile.avatar + ")") : "#ededed" }}>
                            </div>
                            <div className="user-avatar" style={{ background: "url(" + (avatarToUpload && avatarToUpload.file ? URL.createObjectURL(avatarToUpload.file) : (profile ? profile.avatar : "")) + ")" }}>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer >
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </div>
    )
}

const renderAvatarCropperDrawer = (component) => {
    let {
        openAvatarCropperDrawer,
        crop,
        avatarCroped,
        avatarSelected,
        isProccessing
    } = component.state
    return (
        <div>
            <Drawer anchor="bottom" className="cropper-drawer" open={openAvatarCropperDrawer} >
                {
                    avatarSelected ? <div className="drawer-detail">
                        <div className="drawer-content" style={{ overflow: "scroll", background: "#f2f3f7" }}>
                            <Cropper
                                src={avatarSelected}
                                crop={crop}
                                onCropped={(file) => component.setState({ avatarCroped: file })}
                            />
                        </div>
                        <div className="footer-drawer">
                            <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
                            <div>
                                <Button onClick={() => component.setState({ openAvatarCropperDrawer: false, isReviewMode: false })}>Huỷ</Button>
                                <Button onClick={() => component.setState({ openAvatarCropperDrawer: false, isReviewMode: true, avatarToUpload: avatarCroped })}>Chế độ xem trước</Button>
                                <Button onClick={() => component.setState({ avatarToUpload: avatarCroped }, () => component.updateAvatar())}>Đăng bài</Button>
                            </div>
                        </div>

                    </div> : ""
                }

            </Drawer >
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </div>
    )
}

const renderUpdateBackgroundReviewDrawer = (component) => {
    let {
        openUploadBackgroundReview,
        postContent,
        isReviewMode,
        backgroundToUpload,
        isProccessing
    } = component.state
    let {
        profile
    } = component.props
    return (
        <div>
            <Drawer anchor="bottom" className="update-avatar-review-drawer" open={openUploadBackgroundReview} >
                <div className="drawer-detail media-drawer">
                    <div className="drawer-header">
                        <div className="direction" onClick={() => isReviewMode == false ? component.setState({ openUploadBackgroundReview: false }) : component.setState({ openBackgroundCropperDrawer: true, isReviewMode: false })}>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                            <label>{
                                isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"
                            }
                            </label>
                        </div>
                        <Button onClick={() => component.updateBackground()}>Đăng</Button>
                    </div>
                    <div className="filter">
                    </div>
                    <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
                        <div className="post-content">
                            <MultiInput
                                style={{ padding: "15px 0px", border: "none" }}
                                onChange={value => component.setState({ postContent: value.text })}
                                topDown={true}
                                placeholder={"Nhập nội dung"}
                            />

                        </div>
                        <div className="profile-page" >
                            <div className="cover-img" style={{ background: "url(" + (backgroundToUpload && backgroundToUpload.file ? URL.createObjectURL(backgroundToUpload.file) : (profile ? profile.background : "")) + ")" }}>
                            </div>
                            <div className="user-avatar" style={{ background: profile ? ("url(" + profile.avatar + ")") : "#ededed" }}>
                            </div>
                        </div>
                    </div>
                </div>

            </Drawer>
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </div>
    )
}

const renderBackgroundCropperDrawer = (component) => {
    let {
        openBackgroundCropperDrawer,
        crop,
        backgroundSrc,
        backgroundCroppedImage,
        isProccessing
    } = component.state
    return (
        <div>
            <Drawer anchor="bottom" className="cropper-drawer" open={openBackgroundCropperDrawer} >
                {
                    backgroundSrc ? <div className="drawer-detail">
                        <div className="drawer-content" style={{ overflow: "scroll", background: "#f2f3f7" }}>
                            <Cropper
                                src={backgroundSrc}
                                crop={crop}
                                onCropped={(file) => component.setState({ backgroundCroppedImage: file })}
                            />
                        </div>
                        <div className="footer-drawer">
                            <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
                            <div>
                                <Button onClick={() => component.setState({ openBackgroundCropperDrawer: false, isReviewMode: false })}>Huỷ</Button>
                                <Button onClick={() => component.setState({ openBackgroundCropperDrawer: false, isReviewMode: true, backgroundToUpload: backgroundCroppedImage })}>Chế độ xem trước</Button>
                                <Button onClick={() => component.setState({ backgroundToUpload: backgroundCroppedImage }, () => component.updateBackground())}>Đăng bài</Button>
                            </div>
                        </div>

                    </div> : ""
                }
            </Drawer >

            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </div>
    )
}