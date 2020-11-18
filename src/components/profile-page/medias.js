import React from 'react';
import {
    Drawer,
    IconButton,
    AppBar,
    Tabs,
    Tab,
    Button,
    Radio
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    Add as AddIcon
} from '@material-ui/icons'
import {
    setMediaToViewer,
    toggleMediaViewerDrawer,
    toggleCreateAlbumDrawer,
    toggleAlbumDetailDrawer,
    setCurrentAlbum
} from '../../actions/app'
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import Cropper from '../common/cropper'
import MultiInput from '../common/multi-input'
import SwipeableViews from 'react-swipeable-views';
import { Loader } from '../common/loader'
import { get, post, postFormData } from '../../api';
import { SOCIAL_NET_WORK_API, CurrentDate } from '../../constants/appSettings';
import moment from 'moment'
import { objToArray, objToQuery, showNotification, srcToFile } from '../../utils/common';
import $ from 'jquery'
import { connect } from 'react-redux'
import { Privacies } from '../../constants/constants';

const defaultImage = "https://dapp.dblog.org/img/default.jpg"

export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mediaTabIndex: 0,
            postedImages: [],
            isEndOfPostedImage: false,
            postedImagesCurrentPage: 0,
            avatarImages: [],
            isEndOfAvatarImages: false,
            avatarImagesCurrentPage: 0,
            coverImages: [],
            isEndOfCoverImages: false,
            coverImagesCurrentPage: 0,
            albums: [],
            isEndOfAlbums: false,
            albumsCurrentPage: 0,
            crop: {
                unit: '%',
                width: 100,
                height: 100
            },
        };
    }


    getPostedImage(currentpage, userId) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            type: "Image",
            skin: "Post",
            albumid: 0,
            userid: userId
        }
        let {
            postedImages
        } = this.state
        this.setState({
            isPostedLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    postedImages: postedImages.concat(result.content.medias),
                    isPostedLoading: false
                })
                if (result.content.medias.length == 0) {
                    this.setState({
                        isEndOfPostedImage: true
                    })
                }
            }
        })
    }

    getAvatarImage(currentpage, userId) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            type: "Image",
            skin: "Avatar",
            albumid: 0,
            userid: userId
        }
        let {
            avatarImages
        } = this.state
        this.setState({
            isAvatarLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    avatarImages: avatarImages.concat(result.content.medias),
                    isAvatarLoading: false
                })
                if (result.content.medias.length == 0) {
                    this.setState({
                        isEndOfAvatarImages: true
                    })
                }
            }
        })
    }

    getCorverImage(currentpage, userId) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            type: "Image",
            skin: "Background",
            albumid: 0,
            userid: userId
        }
        let {
            coverImages
        } = this.state
        this.setState({
            isCoverImageLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    coverImages: coverImages.concat(result.content.medias),
                    isCoverImageLoading: false
                })
                if (result.content.medias.length == 0) {
                    this.setState({
                        isEndOfCoverImages: true
                    })
                }
            }
        })
    }

    getAlbum(currentpage, userId) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            userid: userId
        }
        let {
            albums
        } = this.state
        this.setState({
            isLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/GetListAlbum" + objToQuery(param), result => {


            if (result && result.result == 1) {
                this.setState({
                    albums: albums.concat(result.content.albums),
                    isLoading: false
                })
                if (result.content.medias.length == 0) {
                    this.setState({
                        isEndOfAlbums: true
                    })
                }
            }
        })
    }


    handleReset(callBack) {
        this.setState({
            postedImages: [],
            postedImagesCurrentPage: 0,
            isEndOfPostedImage: false,
            coverImages: [],
            coverImagesCurrentPage: 0,
            isEndOfCoverImages: false,
            albums: [],
            albumsCurrentPage: 0,
            isEndOfAlbums: false
        })
        if (callBack) callBack()
    }

    onScroll(index) {
        let element = $("#media-content")
        let {
            userDetail
        } = this.props
        if (userDetail && userDetail.userid) {
            userDetail.id = userDetail.userid
        }

        let {
            isLoading,
            isEndOfPostedImage,
            postedImagesCurrentPage,
            isEndOfAvatarImages,
            avatarImagesCurrentPage,
            isEndOfCoverImages,
            coverImagesCurrentPage,
            isPostedLoading,
            isAvatarLoading,
            isCoverImageLoading
        } = this.state

        if (element && index >= 0)
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
                if (index == 0) {
                    if (isPostedLoading == false && isEndOfPostedImage == false) {
                        this.setState({
                            postedImagesCurrentPage: postedImagesCurrentPage + 1,
                            isPostedLoading: true
                        }, () => {
                            this.getPostedImage(postedImagesCurrentPage + 1, userDetail.id)
                        })
                    }
                }
                if (index == 1) {
                    if (isAvatarLoading == false && isEndOfAvatarImages == false) {
                        this.setState({
                            avatarImagesCurrentPage: avatarImagesCurrentPage + 1,
                            isAvatarLoading: true
                        }, () => {
                            this.getAvatarImage(avatarImagesCurrentPage + 1, userDetail.id)
                        })
                    }
                }
                if (index == 2) {
                    if (isCoverImageLoading == false && isEndOfCoverImages == false) {
                        this.setState({
                            coverImagesCurrentPage: coverImagesCurrentPage + 1,
                            isCoverImageLoading: true
                        }, () => {
                            this.getCorverImage(coverImagesCurrentPage + 1, userDetail.id)
                        })
                    }
                }
            }
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
                    this.getPostedImage(0, this.props.userDetail.id)
                    this.props.setMediaToViewer(imageInAlbum)
                }
            })
        }
    }

    deleteImage(currentImage, key) {
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
                if (key == "postedImages") {
                    this.setState({
                        postedImages: imageInAlbum
                    })
                }
                if (key == "avatarImages") {
                    this.setState({
                        avatarImages: imageInAlbum
                    })
                }
                if (key == "coverImages") {
                    this.setState({
                        coverImages: imageInAlbum
                    })
                }
                this.props.setMediaToViewer(imageInAlbum)
            }
        })
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

                formData.append("content", postContent ? postContent : "")
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

    componentWillReceiveProps(nextProps) {
        let {
            userDetail
        } = nextProps
        if (userDetail && userDetail.userid) {
            userDetail.id = userDetail.userid
        }
        let {
            mediaTabIndex,
            postedImages,
            avatarImages,
            coverImages,
            postedImagesCurrentPage,
            avatarImagesCurrentPage,
            coverImagesCurrentPage,
            albums
        } = this.state
        if (nextProps.open == true) {
            if (postedImages.length == 0) this.getPostedImage(postedImagesCurrentPage, userDetail.id)
            if (avatarImages.length == 0) this.getAvatarImage(avatarImagesCurrentPage, userDetail.id)
            if (coverImages.length == 0) this.getCorverImage(coverImagesCurrentPage, userDetail.id)
            if (albums.length == 0) this.getAlbum(coverImagesCurrentPage, userDetail.id)
        }
    }

    render() {

        let {
            open,
            onClose,
            userDetail,
            profile
        } = this.props
        let {
            isLoading,
            mediaTabIndex,
            postedImages,
            avatarImages,
            coverImages,
            albums,
            isPostedLoading,
            isAvatarLoading,
            isCoverImageLoading
        } = this.state

        return (
            <div className="media-drawer">
                <Drawer anchor="bottom" open={open} >
                    {
                        userDetail ? <div className="drawer-detail media-drawer">
                            <div className="drawer-header">
                                <div className="direction" onClick={() => this.handleReset(() => onClose ? onClose() : "")}>
                                    <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                                    </IconButton>
                                    <label>Album của {userDetail.fullname}</label>
                                </div>
                            </div>
                            <div className="filter">
                                <AppBar position="static" color="default" className="custom-tab-1">
                                    <Tabs
                                        value={mediaTabIndex}
                                        onChange={(e, value) => this.setState({ mediaTabIndex: value })}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                        className="tab-header"
                                    >
                                        <Tab label="Bài đăng" {...a11yProps(0)} className="tab-item" />
                                        <Tab label="Ảnh đại diện" {...a11yProps(1)} className="tab-item" />
                                        <Tab label="Ảnh bìa" {...a11yProps(2)} className="tab-item" />
                                        <Tab label="Album" {...a11yProps(3)} className="tab-item" />
                                    </Tabs>
                                </AppBar>
                            </div>
                            <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} id="media-content" onScroll={() => this.onScroll(mediaTabIndex)}>
                                <SwipeableViews
                                    index={mediaTabIndex}
                                    onChangeIndex={(value) => this.setState({ mediaTabIndex: value })}
                                    className="tab-content"
                                >
                                    <TabPanel value={mediaTabIndex} index={0} className="content-box">
                                        <div className="image-posted image-box">
                                            <ul className="image-list">
                                                {
                                                    postedImages.map((item, index) => <li onClick={() => {
                                                        this.props.setMediaToViewer(postedImages)
                                                        this.props.toggleMediaViewerDrawer(true, {
                                                            actions: mediaRootActions(this),
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }}>
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isPostedLoading == true && mediaTabIndex == 0 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={1} className="content-box">
                                        <div className="avatar-image image-box">
                                            <ul className="image-list">
                                                {
                                                    avatarImages.map((item, index) => <li onClick={() => {
                                                        this.props.setMediaToViewer(avatarImages)
                                                        this.props.toggleMediaViewerDrawer(true, {
                                                            actions: mediaRootActions(this),
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }} >
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isAvatarLoading == true && mediaTabIndex == 1 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={2} className="content-box">
                                        <div className="cover-image image-box">
                                            <ul className="image-list">
                                                {
                                                    coverImages.map((item, index) => <li onClick={() => {
                                                        this.props.setMediaToViewer(coverImages)
                                                        this.props.toggleMediaViewerDrawer(true, {
                                                            actions: mediaRootActions(this),
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }}>
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isCoverImageLoading == true && mediaTabIndex == 2 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={3} className="content-box">
                                        <div className="album image-box">
                                            <ul>
                                                <li className="add-bt" onClick={() => this.props.toggleCreateAlbumDrawer(true, () => {
                                                    this.setState({
                                                        albums: [],
                                                        albumsCurrentPage: 0,
                                                        isEndOfAlbums: false
                                                    }, () => this.getAlbum(0, userDetail.id))
                                                })}>
                                                    <div className="demo-bg" >
                                                        <AddIcon />
                                                    </div>
                                                    <span className="name">Tạo album</span>
                                                </li>
                                                {
                                                    albums.map((album, index) => <li key={index} onClick={() => {
                                                        this.props.setCurrentAlbum(album)
                                                        this.props.toggleAlbumDetailDrawer(true, () => {
                                                            this.setState({
                                                                albums: []
                                                            }, () => this.getAlbum(0, userDetail.id))
                                                        })
                                                    }}>
                                                        <div style={{ background: "url(" + (defaultImage) + ")" }}>
                                                            <div className="demo-bg" style={{ background: "url(" + (album.topimgname) + ")" }} />
                                                        </div>
                                                        <span className="name">{album.albumname}</span>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isLoading == true && mediaTabIndex == 2 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                            }
                                        </div>
                                    </TabPanel>
                                </SwipeableViews>
                            </div>
                        </div> : ""
                    }
                </Drawer>
                {
                    renderUpdatePrivacyImageDrawer(this)
                }
                {
                    renderConfirmDrawer(this)
                }

                {
                    renderUpdateBackgroundReviewDrawer(this)
                }
                {
                    renderBackgroundCropperDrawer(this)
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
            </div>
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         ...state.app,
//         ...state.user
//     }
// };

const mapDispatchToProps = dispatch => ({
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
    toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
    toggleCreateAlbumDrawer: (isShow, callback) => dispatch(toggleCreateAlbumDrawer(isShow, callback)),
    toggleAlbumDetailDrawer: (isShow, callback) => dispatch(toggleAlbumDetailDrawer(isShow, callback)),
    setCurrentAlbum: (album) => dispatch(setCurrentAlbum(album)),
    setUserProfile: (user) => dispatch(setUserProfile(user)),
    getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
    getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage)),
});

export default connect(
    null,
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
    onSetToAvatar: (value) => component.getProfile(),
    onSetToBackground: (value) => component.getProfile(),
    onUpdatePrivacy: (value) => component.getPostedImage(0, value.userid),
    onDelete: (value) => null,
    onSetToAlbumBackground: (value) => component.getDetail(value.albumid)
})

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