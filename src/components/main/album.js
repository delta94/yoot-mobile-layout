import React from "react";
import './style.scss'
import {
    toggleAlbumDetailDrawer,
    toggleMediaViewerDrawer,
    setMediaToViewer,
    togglePostDrawer,
    selectAlbumToPost
} from '../../actions/app'
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import {
    Drawer,
    IconButton,
    Button,
    Avatar,
    AppBar,
    Tabs,
    Tab,
    TextField,
    Radio
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    MoreHoriz as MoreHorizIcon
} from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';
import MultiInput from '../common/multi-input'
import Cropper from '../common/cropper'
import { connect } from 'react-redux'
import moment from 'moment'
import Loader from '../common/loader'
import SwipeableViews from 'react-swipeable-views';
import {
    Privacies
} from '../../constants/constants'
import { objToArray, objToQuery, showNotification, srcToFile } from "../../utils/common";
import { get, post, postFormData } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import $ from 'jquery'
import { saveAs } from 'file-saver';
import Post from '../post';
import PostContent from '../post/post-content'


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            isLoading: false,
            showUpdateAlbumDrawer: false,
            postPrivacy: Privacies.Friend,
            albumDetail: null,
            isChange: false,
            posted: [],
            imageInAlbum: [],
            croppedImage: null,
            crop: {
                unit: '%',
                width: 100,
                height: 100
            },
        };
    }

    handleSetDefault(currentAlbum) {
        this.setState({
            albumName: currentAlbum.albumname,
            description: currentAlbum.albumdescription,
            postPrivacy: objToArray(Privacies).find(item => item.code == currentAlbum.albumfor)
        })
    }

    getDetail(albumId) {
        let param = {
            albumid: albumId
        }
        this.setState({
            isLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/GetOneAlbum" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    albumDetail: result.content.albums,
                    isLoading: false,
                    showUpdateAlbumDrawer: false,
                    imageInAlbum: [],
                    posted: [],
                    isEndOfImageInAlbum: false,
                    imageInAlbumCurrentNumber: 0
                }, () => {
                    this.getPosted(0, result.content.albums.userid, result.content.albums.albumid)
                    this.getImageInAlbum(0, result.content.albums.userid, result.content.albums.albumid)
                    this.handleSetDefault(result.content.albums)
                })
            }
        })
    }

    getPosted(currentpage, userId, albumId) {
        let {
            posted
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            groupid: 0,
            isVideo: 0,
            suggestGroup: 0,
            forFriendId: 0,
            albumid: albumId
        }
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetAllNewsFeed" + objToQuery(param), result => {
            result.content.newsFeeds.map(newsFeed => {
                newsFeed.mediaPlays.map(media => {
                    media.createdate = newsFeed.createdate
                })
            })
            if (result && result.result == 1) {
                this.setState({
                    posted: posted.concat(result.content.newsFeeds)
                })
            }
        })
    }

    getImageInAlbum(currentpage, userId, albumId) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            type: "Image",
            skin: "Post",
            albumid: albumId,
            userid: userId
        }
        let {
            imageInAlbum
        } = this.state
        this.setState({
            isLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    imageInAlbum: imageInAlbum.concat(result.content.medias),
                    isLoading: false
                })
                if (result.content.medias.length == 0) {
                    this.setState({
                        isEndOfImageInAlbum: true
                    })
                }
            }
        })
    }

    onScroll(index) {
        let element = $("#album-content")
        let {
            userDetail
        } = this.props
        if (userDetail && userDetail.userid) {
            userDetail.id = userDetail.userid
        }

        let {
            albumDetail,
            isLoading,
            isEndOfImageInAlbum,
            imageInAlbumCurrentNumber,
        } = this.state

        if (element && index >= 0)
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
                if (index == 0) {
                    if (isLoading == false && isEndOfImageInAlbum == false) {
                        this.setState({
                            imageInAlbumCurrentNumber: imageInAlbumCurrentNumber + 1,
                            isLoading: false
                        }, () => {
                            this.getImageInAlbum(imageInAlbumCurrentNumber + 1, albumDetail.userid, albumDetail.albumid)
                        })
                    }
                }
            }
    }

    hanldeUpdate() {
        let {
            albumDetail,
            albumName,
            description,
            postPrivacy
        } = this.state
        let param = {
            id: albumDetail.albumid,
            name: albumName,
            description: description,
            albumfor: postPrivacy.code
        }
        this.setState({
            isProccesing: true
        })
        post(SOCIAL_NET_WORK_API, "Media/UpdateAlbum", param, result => {
            if (result && result.result == 1) {
                this.getDetail(this.props.currentAlbum.albumid)
                this.setState({
                    isProccesing: false,
                    isChange: false
                })
            }
        })
    }

    deleteAlbum(albumDetail) {
        let param = { albumid: albumDetail.albumid }
        let {
            updateAlbumSuccessCallback
        } = this.props
        this.setState({
            isProccesing: true
        })
        post(SOCIAL_NET_WORK_API, "Media/DeleteAlbum" + objToQuery(param), null, result => {
            if (result && result.result == 1) {
                if (updateAlbumSuccessCallback) updateAlbumSuccessCallback()
                setTimeout(() => {
                    this.setState({ showUpdateAlbumDrawer: false })
                    this.props.toggleAlbumDetailDrawer(false)
                    this.setState({
                        isProccesing: false
                    })
                }, 1000);
            }
        })
    }

    handleCloseUpdateDrawer() {
        let {
            isChange
        } = this.state
        if (isChange == true) {
            this.setState({
                showConfim: true,
                okCallback: () => this.setState({ showUpdateAlbumDrawer: false, isChange: false }, () => this.handleSetDefault(this.props.currentAlbum)),
                confirmTitle: "Bạn muốn rời khỏi trang này?",
                confirmMessage: "Những thông tin vừa thay đổi vẫn chưa được lưu."
            })
        } else {
            this.setState({ showUpdateAlbumDrawer: false })
        }
    }

    downloadImage(url) {
        saveAs(url, url.split("/").slice(-1).pop())
    }

    setImageToAlbumBackground(value) {
        let that = this
        srcToFile(
            value.name,
            value.nameimage,
            'image/' + value.nameimage.split(".")[1]
        ).then(function (file) {

            const reader = new FileReader();
            reader.addEventListener('load', () =>
                that.setState({
                    albumBackgroundSelected: reader.result,
                    rootAlbumBackgroundToUpload: file,
                    openUploadAlbumBackgroundReview: true,
                    openAlbumBackgroundCropperDrawer: true
                })
            );
            reader.readAsDataURL(file);

        })
    }

    updateAlbumBackground() {
        let {
            rootAlbumBackgroundToUpload,
            albumBackgroundToUpload,
            isProccessing,
            albumDetail
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

                formData.append("albumid", albumDetail.albumid)
                formData.append("avatarroot_0_" + img.width + "_" + img.height, rootAlbumBackgroundToUpload)


                postFormData(SOCIAL_NET_WORK_API, "Media/UpdateBackground", formData, result => {
                    that.getDetail(that.props.currentAlbum.albumid)
                    that.setState({
                        openAlbumBackgroundCropperDrawer: false,
                        openUploadAlbumBackgroundReview: false,
                        isReviewMode: false,
                        isProccessing: false
                    })
                })
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(rootAlbumBackgroundToUpload);
    }

    setImageToAvatar(value) {
        let that = this
        srcToFile(
            value.name,
            value.nameimage,
            'image/' + value.nameimage.split(".")[1]
        ).then(function (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                that.setState({
                    avatarSelected: reader.result,
                    rootAvatarToUpload: file,
                    openUploadAvatarReview: true,
                    openAvatarCropperDrawer: true
                })
            );
            reader.readAsDataURL(file);

        })

    }

    updateAvatar() {
        let {
            avatarToUpload,
            rootAvatarToUpload,
            isProccessing,
            postContent
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

                formData.append("content", postContent)
                formData.append("avatarroot_0_" + img.width + "_" + img.height, rootAvatarToUpload)

                postFormData(SOCIAL_NET_WORK_API, "User/UpdateAvatar", formData, result => {
                    that.setState({
                        openAvatarCropperDrawer: false,
                        openUploadAvatarReview: false,
                        isReviewMode: false,
                        isProccessing: false
                    })
                    that.getProfile()
                })
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(rootAvatarToUpload);
    }

    setImageToBackground(value) {
        let that = this
        srcToFile(
            value.name,
            value.nameimage,
            'image/' + value.nameimage.split(".")[1]
        ).then(function (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                that.setState({
                    backgroundSrc: reader.result,
                    rootBackgroundToUpload: file,
                    openUploadBackgroundReview: true,
                    openBackgroundCropperDrawer: true
                })
            );
            reader.readAsDataURL(file);

        })

    }

    updateBackground() {
        let {
            backgroundToUpload,
            rootBackgroundToUpload,
            isProccessing
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

                formData.append("content", "")
                formData.append("avatarroot_0_" + img.width + "_" + img.height, rootBackgroundToUpload)


                postFormData(SOCIAL_NET_WORK_API, "User/UpdateBackground", formData, result => {
                    that.getProfile()
                    that.setState({
                        openBackgroundCropperDrawer: false,
                        openUploadBackgroundReview: false,
                        isReviewMode: false,
                        isProccessing: false
                    })
                })
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(rootBackgroundToUpload);
    }

    updateImagePrivacy() {
        let {
            currentImage,
            privacySelected,
            imageInAlbum
        } = this.state
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
                    imageInAlbum.map(item => {
                        if (item.idmedia == currentImage.idmedia) {
                            item.postfor = privacySelected
                        }
                    })
                    this.getDetail(this.props.currentAlbum.albumid)
                    this.props.setMediaToViewer(imageInAlbum)
                }
            })
        }
    }

    deleteImage(currentImage) {
        let {
            imageInAlbum
        } = this.state
        let param = {
            postid: currentImage.postid
        }
        this.setState({
            isProccesing: true
        })
        post(SOCIAL_NET_WORK_API, "PostNewsFeed/DeleteNewsFeed" + objToQuery(param), null, result => {
            if (result && result.result == 1) {
                this.setState({
                    isProccesing: false,
                })
                imageInAlbum = imageInAlbum.filter(item => item.postid != currentImage.postid)
                this.setState({
                    imageInAlbum: imageInAlbum
                })
                this.props.setMediaToViewer(imageInAlbum)
            }
        })
    }

    getProfile() {
        get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
            if (result.result == 1) {
                this.props.setUserProfile(result.content.user)
                this.props.getFolowedMe(0)
                this.props.getMeFolowing(0)
            } else {
                showNotification("", <span className="app-noti-message">{result.message}</span>, null)
            }

        })
    }

    postImage(albumDetail) {
        this.props.togglePostDrawer(true, false, () => {
            // setTimeout(() => {
            //     $("#bt-select-image").click()
            // }, 300);
            this.props.selectAlbumToPost(albumDetail)
        })
    }

    componentWillReceiveProps(nextProps) {
        if (Object.entries(this.props.currentAlbum ? this.props.currentAlbum : {}).toString() != Object.entries(nextProps.currentAlbum ? nextProps.currentAlbum : {}).toString()) {
            this.getDetail(nextProps.currentAlbum.albumid)
        }
    }


    render() {
        let {
            showAlbumDetailDrawer,
            currentAlbum,
            profile
        } = this.props
        let {
            tabIndex,
            isLoading,
            albumDetail,
            albumName,
            posted,
            imageInAlbum,
            isProccesing,
            currentImage
        } = this.state

        return (
            <div>
                <Drawer anchor="bottom" className="album-detail-drawer" open={showAlbumDetailDrawer} onClose={() => this.props.toggleAlbumDetailDrawer(false)}>
                    <div className="drawer-detail">
                        <div className="drawer-header">
                            <div className="direction" onClick={() => this.props.toggleAlbumDetailDrawer(false)}>
                                <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                    <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                                </IconButton>
                                <label>Album</label>
                            </div>
                            <IconButton className="color-gray" onClick={() => this.setState({ showUpdateAlbumDrawer: true })}>
                                <MoreHorizIcon />
                            </IconButton>
                        </div>
                        <div className="filter"></div>
                        {
                            albumDetail ? <div className="drawer-content" id="album-content" style={{ overflow: "scroll", width: "100vw" }} onScroll={() => this.onScroll(tabIndex)}>
                                <div className="album-background">
                                    <div style={{ background: "url(" + albumDetail.topimgname + ")" }}></div>
                                </div>
                                <div className="title-album">
                                    <label>{albumDetail.albumname}</label>
                                    <pre style={{ display: "inherit", width: "fit-content", margin: "0px auto" }}>{albumDetail.albumdescription}</pre>
                                    <p>{albumDetail.albumfortext}</p>
                                </div>
                                {
                                    albumDetail.userid == profile.id ? <div className="add-to-album" onClick={() => this.postImage(albumDetail)}>
                                        <Avatar aria-label="recipe" className="avatar">
                                            <div className="img" style={{ background: `url("${profile.avatar}")` }} />
                                        </Avatar>
                                        <span>Thêm vào album này...</span>
                                    </div> : ""
                                }
                                <div className="detail">
                                    <AppBar position="static" color="default" className="custom-tab-1">
                                        <Tabs
                                            value={tabIndex}
                                            onChange={(e, value) => this.setState({ tabIndex: value })}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="fullWidth"
                                            aria-label="full width tabs example"
                                            className="tab-header"
                                        >
                                            <Tab label={<i className="fas fa-th-large"></i>} {...a11yProps(0)} className="tab-item" />
                                            <Tab label={<i className="fas fa-stream"></i>} {...a11yProps(1)} className="tab-item" />
                                        </Tabs>
                                    </AppBar>
                                    <SwipeableViews
                                        index={tabIndex}
                                        onChangeIndex={(value) => this.setState({ tabIndex: value })}
                                        className="tab-content"
                                    >
                                        <TabPanel value={tabIndex} index={0} className="content-box">
                                            <div className="image-posted image-box">
                                                <ul className="image-list">
                                                    {
                                                        imageInAlbum.map((item, index) => <li onClick={() => {
                                                            this.props.setMediaToViewer(imageInAlbum)
                                                            this.props.toggleMediaViewerDrawer(true, {
                                                                actions: profile && albumDetail && albumDetail.userid == profile.id ? mediaRootActions(this) : mediaGuestActions(this),
                                                                showInfo: true,
                                                                activeIndex: index
                                                            })
                                                        }} >
                                                            <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                        </li>)
                                                    }
                                                </ul>
                                                {
                                                    isLoading == true && tabIndex == 0 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                                }
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={tabIndex} index={1} className="content-box">
                                            <div className="album-posted">
                                                {
                                                    posted && posted.length > 0 ? <ul>
                                                        {
                                                            posted.map((post, index) => <li key={index}>
                                                                <Post data={{ ...post, albumid: albumDetail.albumid }} history={this.props.history} />
                                                            </li>)
                                                        }
                                                    </ul> : ""
                                                }
                                                {
                                                    isLoading == true && tabIndex == 1 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                                }
                                            </div>
                                        </TabPanel>
                                    </SwipeableViews>
                                </div>
                            </div> : ""
                        }
                    </div>

                </Drawer>
                {
                    renderUpdateAlbumDrawer(this)
                }
                {
                    renderAlbumPrivacyMenuDrawer(this)
                }
                {
                    renderConfirmDrawer(this)
                }
                {
                    renderUpdatePrivacyImageDrawer(this)
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
            </div>
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
    toggleAlbumDetailDrawer: (isShow) => dispatch(toggleAlbumDetailDrawer(isShow)),
    toggleMediaViewerDrawer: (isShow, features) => dispatch(toggleMediaViewerDrawer(isShow, features)),
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
    setUserProfile: (user) => dispatch(setUserProfile(user)),
    getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
    getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage)),
    togglePostDrawer: (isShow, isPostToGroup, successCallback) => dispatch(togglePostDrawer(isShow, isPostToGroup, successCallback)),
    selectAlbumToPost: (album) => dispatch(selectAlbumToPost(album))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);


function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>{children}</div>
            )}
        </div>
    );
}

const mediaRootActions = (component) => ({
    // onSaveImage: (value) => component.downloadImage(value.name),
    onUpdateInfo: (value) => null,
    onSetToAvatar: (value) => null,
    onSetToBackground: (value) => null,
    onUpdatePrivacy: (value) => null,
    onDelete: (value) => null,
    onSetToAlbumBackground: (value) => null
})

// const mediaGuestActions = (component) => ({
//   // onSaveImage: (value) => component.downloadImage(value.name),
//   // onSetToAvatar: (value) => null,
//   // onSetToBackground: (value) => null,
//   // onSetToAlbumBackground: (value) => null
// })
const mediaGuestActions = (component) => null


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

const renderUpdateAlbumDrawer = (component) => {
    let {
        postPrivacy,
        showUpdateAlbumDrawer,
        description,
        albumName,
        isLoading,
        albumDetail,
        isProccesing
    } = component.state

    return (
        <Drawer anchor="bottom" className="create-album-drawer" open={showUpdateAlbumDrawer} onClose={() => component.handleCloseUpdateDrawer()}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.handleCloseUpdateDrawer()}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Cập nhật album</label>
                    </div>
                    <Button onClick={() => component.hanldeUpdate()}>Cập nhật</Button>
                </div>
                <div className="filter"></div>
                <div className="drawer-content" style={{ overflow: "scroll" }}>
                    <label>Tên album</label>
                    <TextField
                        className="custom-input"
                        variant="outlined"
                        placeholder="Tên album"
                        style={{
                            width: "100%",
                            marginBottom: "10px"
                        }}
                        value={albumName}
                        onChange={e => component.setState({ albumName: e.target.value, isChange: true })}
                    />
                    <TextField
                        className="custom-input"
                        variant="outlined"
                        placeholder="Mô tả album"
                        style={{
                            width: "100%",
                            marginBottom: "10px",
                        }}
                        multiline
                        className="auto-height-input"
                        value={description}
                        onChange={e => component.setState({ description: e.target.value, isChange: true })}
                    />
                    <span className="privacy-sumbit" onClick={() => component.setState({ showAlbumPrivacySelectOption: true })}>
                        <img src={postPrivacy.icon} />
                        <span>
                            <span>{postPrivacy.label}</span>
                            <span>{postPrivacy.description}</span>
                        </span>
                    </span>
                    <Button className="bt-submit mt30" onClick={() => component.setState({
                        showConfim: true,
                        okCallback: () => component.deleteAlbum(albumDetail),
                        confirmTitle: "",
                        confirmMessage: "Bạn có chắc chắn muốn xoá album này không. Ảnh trong album này cũng sẽ bị xoá."
                    })}>Xoá album</Button>
                </div>

            </div>

            {
                isProccesing == true ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </Drawer>
    )
}

const renderAlbumPrivacyMenuDrawer = (component) => {
    let {
        showAlbumPrivacySelectOption
    } = component.state
    let privacyOptions = objToArray(Privacies)
    return (
        <Drawer anchor="bottom" className="img-select-option" open={showAlbumPrivacySelectOption} onClose={() => component.setState({ showAlbumPrivacySelectOption: false })}>
            <div className="option-header">
                <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showAlbumPrivacySelectOption: false })}>
                    <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                </IconButton>
                <label>Tác vụ</label>
            </div>
            <ul className="option-list">
                {
                    privacyOptions.map((item, index) => <li key={index}>
                        <Button onClick={() => component.setState({ postPrivacy: item, showAlbumPrivacySelectOption: false, isChange: true })}>{item.label}</Button>
                    </li>)
                }
            </ul>
        </Drawer>
    )
}

const renderUpdatePrivacyImageDrawer = (component) => {
    let {
        showUpdatePrivacyDrawer,
        isProccesing,
        privacySelected
    } = component.state

    let PrivacyOptions = objToArray(Privacies)

    return (
        <Drawer anchor="bottom" className="update-privacy-image-drawer" open={showUpdatePrivacyDrawer}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.setState({ showUpdatePrivacyDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Chỉnh sửa quyền riêng tư</label>
                    </div>
                    <Button className="bt-default" onClick={() => component.updateImagePrivacy()}>Lưu</Button>
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

const renderUpdateAlbumBackgroundReviewDrawer = (component) => {
    let {
        openUploadAlbumBackgroundReview,
        isReviewMode,
        isProccessing,
        albumBackgroundToUpload
    } = component.state
    return (
        <div>
            <Drawer anchor="bottom" className="update-avatar-review-drawer upate-background-album" open={openUploadAlbumBackgroundReview} onClose={() => component.setState({ openUploadAlbumBackgroundReview: false })}>
                <div className="drawer-detail media-drawer">
                    <div className="drawer-header">
                        <div className="direction" onClick={() => isReviewMode == false ? component.setState({ openUploadAlbumBackgroundReview: false }) : component.setState({ openCropperDrawer: true, isReviewMode: false })}>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                            <label>{
                                isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"
                            }
                            </label>
                        </div>
                        <Button className="bt-submit" onClick={() => component.updateAlbumBackground()}>Đăng</Button>
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
            <Drawer anchor="bottom" className="cropper-drawer" open={openAlbumBackgroundCropperDrawer} onClose={() => component.setState({ openAlbumBackgroundCropperDrawer: false })}>
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
                                <Button onClick={() => component.setState({ openAlbumBackgroundCropperDrawer: false })}>Huỷ</Button>
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
            < Drawer anchor="bottom" className="update-avatar-review-drawer" open={openUploadAvatarReview} onClose={() => component.setState({ openUploadAvatarReview: false })}>
                <div className="drawer-detail media-drawer">
                    <div className="drawer-header">
                        <div className="direction" onClick={() => isReviewMode == false ? component.setState({ openUploadAvatarReview: false }) : component.setState({ openCropperDrawer: true, isReviewMode: false })}>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                            <label>{
                                isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"
                            }
                            </label>
                        </div>
                        <Button className="bt-submit" onClick={() => component.updateAvatar()}>Đăng</Button>
                    </div>
                    <div className="filter">
                    </div>
                    <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
                        <div className="post-content">
                            <MultiInput
                                disabledInput={true}
                                useHashtags={true}
                                useMentions={true}
                                placeholder="Nhập nội dung"
                                onChange={(value) => console.log(value)}
                                userOptions={[
                                    { fullname: 'User 1' },
                                    { fullname: 'User 2' },
                                    { fullname: 'User 3' }
                                ]}
                                disabledInput={false}
                            />
                        </div>
                        <div className="profile-page" >
                            <div className="cover-img" style={{ background: "url(" + (profile ? profile.avatar : "") + ")" }}>
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
            <Drawer anchor="bottom" className="cropper-drawer" open={openAvatarCropperDrawer} onClose={() => component.setState({ openAvatarCropperDrawer: false })}>
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
                                <Button onClick={() => component.setState({ openAvatarCropperDrawer: false })}>Huỷ</Button>
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
            <Drawer anchor="bottom" className="update-avatar-review-drawer" open={openUploadBackgroundReview} onClose={() => component.setState({ openUploadBackgroundReview: false })}>
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
                        <Button className="bt-submit" onClick={() => component.updateBackground()}>Đăng</Button>
                    </div>
                    <div className="filter">
                    </div>
                    <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
                        <div className="post-content">
                            <MultiInput
                                placeholder="Nhập nội dung"
                                onChange={(value) => console.log(value)}
                                useHashtags={false}
                                useMentions={false}
                                userOptions={[
                                    { fullname: 'User 1' },
                                    { fullname: 'User 2' },
                                    { fullname: 'User 3' }
                                ]}
                            />
                        </div>
                        <div className="profile-page" >
                            <div className="cover-img" style={{ background: "url(" + (backgroundToUpload && backgroundToUpload.file ? URL.createObjectURL(backgroundToUpload.file) : (profile ? profile.background : "")) + ")" }}>
                            </div>
                            <div className="user-avatar" style={{ background: "url(" + (profile ? profile.avatar : "") + ")" }}>
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
            <Drawer anchor="bottom" className="cropper-drawer" open={openBackgroundCropperDrawer} onClose={() => component.setState({ openBackgroundCropperDrawer: false })}>
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
                                <Button onClick={() => component.setState({ openBackgroundCropperDrawer: false })}>Huỷ</Button>
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
