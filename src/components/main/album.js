import React from "react";
import './style.scss'
import {
    toggleAlbumDetailDrawer,
    toggleMediaViewerDrawer,
    setMediaToViewer
} from '../../actions/app'
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
import { objToArray, objToQuery, srcToFile } from "../../utils/common";
import { get, post } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import $ from 'jquery'
import { saveAs } from 'file-saver';


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
            imageInAlbum: []
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
            let images = []
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
        srcToFile(
            value.name,
            value.nameimage,
            'image/' + value.nameimage.split(".")[1]
        ).then(function (file) {
            this.setState({
                currentImage: file,
                openUploadAvatarReview: true,
                openCropperDrawer: true
            })
        })
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
            isProccesing
        } = this.state
        console.log("currentAlbum", albumDetail)

        return (
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
                                <div style={{ background: "url(" + albumDetail.background + ")" }}></div>
                            </div>
                            <div className="name">
                                <label>{albumDetail.albumname}</label>
                                <span>{albumDetail.albumfortext}</span>
                            </div>
                            {
                                albumDetail.userid == profile.id ? <div className="add-to-album">
                                    <Avatar aria-label="recipe" className="avatar">
                                        <img src={profile.avatar} style={{ width: "100%" }} />
                                    </Avatar>
                                    <span>Thêm ảnh vào album này</span>
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
                                                            actions: [
                                                                {
                                                                    label: "Lưu vào điện thoại",
                                                                    action: (value) => this.downloadImage(value.name)
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
                                                                    action: (value) => this.setState({
                                                                        currentImage: value,
                                                                        showUpdatePrivacyDrawer: true,
                                                                        privacySelected: value.postfor,
                                                                    })
                                                                },
                                                                {
                                                                    label: "Xoá ảnh",
                                                                    action: (value) => this.setState({
                                                                        showConfim: true,
                                                                        okCallback: () => this.deleteImage(value),
                                                                        confirmTitle: "",
                                                                        confirmMessage: "Khi xoá ảnh sẽ xoá luôn bài đăng, bạn vẫn muốn tiếp tục?"
                                                                    })
                                                                },
                                                                {
                                                                    label: "Đặt làm ảnh đại diện album",
                                                                    action: (value) => this.setImageToAlbumBackground(value)
                                                                }
                                                            ],
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
                                        <div className="avatar-image image-box">
                                            {/* <ul className="image-list">
                                                {
                                                    avatarImages.map((item, index) => <li onClick={() => {
                                                        this.props.setMediaToViewer(avatarImages)
                                                        this.props.toggleMediaViewerDrawer(true, {
                                                            canDownload: true,
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }} >
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul> */}
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
                    renderUpdateBackgroundReviewDrawer(this)
                }
                {
                    renderCropperDrawer(this)
                }
                {
                    renderUpdatePrivacyImageDrawer(this)
                }
            </Drawer>
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
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media))
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
                <label>Quyền riêng tư</label>
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

const renderUpdateBackgroundReviewDrawer = (component) => {
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
        <Drawer anchor="bottom" className="update-avatar-review-drawer" open={openUploadAvatarReview} onClose={() => component.setState({ openUploadAvatarReview: false })}>
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
                            useHashtags={true}
                            useMentions={true}
                            placeholder="Nhập nội dung"
                            onChange={(value) => console.log(value)}
                            userOptions={[
                                { fullname: 'User 1' },
                                { fullname: 'User 2' },
                                { fullname: 'User 3' }
                            ]} />
                    </div>
                    <div className="profile-page" >
                        <div className="user-avatar" style={{ background: "url(" + "" + ")" }}>
                        </div>
                    </div>
                </div>
            </div>
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </Drawer>
    )
}


const renderCropperDrawer = (component) => {
    let {
        openCropperDrawer,
        crop,
        src,
        croppedImage,
        isProccessing,
        currentImage
    } = component.state
    console.log("currentImage", currentImage)
    return (
        <Drawer anchor="bottom" className="cropper-drawer" open={openCropperDrawer} onClose={() => component.setState({ openCropperDrawer: false })}>
            {
                src ? <div className="drawer-detail">
                    <div className="drawer-content" style={{ overflow: "scroll", background: "#f2f3f7" }}>
                        <Cropper
                            src={currentImage}
                            crop={crop}
                            onCropped={(file) => component.setState({ croppedImage: file })}
                        />
                    </div>
                    <div className="footer-drawer">
                        <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
                        <div>
                            <Button onClick={() => component.setState({ openCropperDrawer: false })}>Huỷ</Button>
                            <Button onClick={() => component.setState({ openCropperDrawer: false, isReviewMode: true, avatarToUpload: croppedImage })}>Chế độ xem trước</Button>
                            <Button onClick={() => component.setState({ avatarToUpload: croppedImage }, () => component.updateAvatar())}>Đăng bài</Button>
                        </div>
                    </div>

                </div> : ""
            }
            {
                isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
            }
        </Drawer >
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

