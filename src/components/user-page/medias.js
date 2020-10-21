import React from 'react';
import {
    Drawer,
    IconButton,
    AppBar,
    Tabs,
    Tab
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
import SwipeableViews from 'react-swipeable-views';
import { Loader } from '../common/loader'
import { get } from '../../api';
import { SOCIAL_NET_WORK_API, CurrentDate } from '../../constants/appSettings';
import moment from 'moment'
import { objToQuery } from '../../utils/common';
import $ from 'jquery'
import { connect } from 'react-redux'

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
            albumsCurrentPage: 0
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
            isLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    postedImages: postedImages.concat(result.content.medias),
                    isLoading: false
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
            isLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    avatarImages: avatarImages.concat(result.content.medias),
                    isLoading: false
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
            isLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    coverImages: coverImages.concat(result.content.medias),
                    isLoading: false
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
            isEndOfPostedImage: false
        })
        if (callBack) callBack()
    }

    onScroll(index) {
        let element = $("#media-content")
        let {
            currentUser
        } = this.props
        if (currentUser && currentUser.userid) {
            currentUser.id = currentUser.userid
        }

        let {
            isLoading,
            isEndOfPostedImage,
            postedImagesCurrentPage,
            isEndOfAvatarImages,
            avatarImagesCurrentPage,
            isEndOfCoverImages,
            coverImagesCurrentPage
        } = this.state

        if (element && index >= 0)
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
                if (index == 0) {
                    if (isLoading == false && isEndOfPostedImage == false) {
                        this.setState({
                            postedImagesCurrentPage: postedImagesCurrentPage + 1,
                            isLoading: true
                        }, () => {
                            this.getPostedImage(postedImagesCurrentPage + 1, currentUser.id)
                        })
                    }
                }
                if (index == 1) {
                    if (isLoading == false && isEndOfAvatarImages == false) {
                        this.setState({
                            avatarImagesCurrentPage: avatarImagesCurrentPage + 1,
                            isLoading: true
                        }, () => {
                            this.getAvatarImage(avatarImagesCurrentPage + 1, currentUser.id)
                        })
                    }
                }
                if (index == 2) {
                    if (isLoading == false && isEndOfCoverImages == false) {
                        this.setState({
                            coverImagesCurrentPage: coverImagesCurrentPage + 1,
                            isLoading: true
                        }, () => {
                            this.getCorverImage(coverImagesCurrentPage + 1, currentUser.id)
                        })
                    }
                }
            }
    }

    componentWillReceiveProps(nextProps) {
        let {
            currentUser
        } = nextProps
        if (currentUser && currentUser.userid) {
            currentUser.id = currentUser.userid
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
            if (postedImages.length == 0) this.getPostedImage(postedImagesCurrentPage, currentUser.id)
            if (avatarImages.length == 0) this.getAvatarImage(avatarImagesCurrentPage, currentUser.id)
            if (coverImages.length == 0) this.getCorverImage(coverImagesCurrentPage, currentUser.id)
            if (albums.length == 0) this.getAlbum(coverImagesCurrentPage, currentUser.id)
        }
    }

    render() {

        let {
            open,
            onClose,
            currentUser,
            profile
        } = this.props
        let {
            isLoading,
            mediaTabIndex,
            postedImages,
            avatarImages,
            coverImages,
            albums
        } = this.state


        return (
            <div className="media-drawer">
                <Drawer anchor="bottom" open={open} >
                    {
                        currentUser ? <div className="drawer-detail media-drawer">
                            <div className="drawer-header">
                                <div className="direction" onClick={() => this.handleReset(() => onClose ? onClose() : "")}>
                                    <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                                    </IconButton>
                                    <label>Album của {currentUser.fullname}</label>
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
                                                            actions: mediaGuestActions(this),
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }}>
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isLoading == true && mediaTabIndex == 0 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
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
                                                            actions: mediaGuestActions(this),
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }} >
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isLoading == true && mediaTabIndex == 1 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
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
                                                            actions: mediaGuestActions(this),
                                                            showInfo: true,
                                                            activeIndex: index
                                                        })
                                                    }}>
                                                        <div style={{ background: "url(" + item.name + ")" }} key={index}></div>
                                                    </li>)
                                                }
                                            </ul>
                                            {
                                                isLoading == true && mediaTabIndex == 2 ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={3} className="content-box">
                                        <div className="album image-box">
                                            <ul>
                                                {
                                                    currentUser.id == profile.id ? <li className="add-bt" onClick={() => this.props.toggleCreateAlbumDrawer(true, () => {
                                                        this.setState({
                                                            albums: []
                                                        }, () => this.getAlbum(0, currentUser.id))
                                                    })}>
                                                        <div className="demo-bg" >
                                                            <AddIcon />
                                                        </div>
                                                        <span className="name">Tạo album</span>
                                                    </li> : ""
                                                }
                                                {
                                                    albums.map((album, index) => <li key={index} onClick={() => {
                                                        this.props.setCurrentAlbum(album)
                                                        this.props.toggleAlbumDetailDrawer(true)
                                                    }}>
                                                        <div style={{ background: "url(" + (defaultImage) + ")" }}>
                                                            <div className="demo-bg" style={{ background: "url(" + (album.topimgname) + ")" }} />
                                                        </div>
                                                        <span className="name">{album.albumname}</span>
                                                    </li>)
                                                }
                                            </ul>
                                        </div>
                                    </TabPanel>
                                </SwipeableViews>
                            </div>
                        </div> : ""
                    }
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.user
    }
};

const mapDispatchToProps = dispatch => ({
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
    toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
    toggleCreateAlbumDrawer: (isShow, callback) => dispatch(toggleCreateAlbumDrawer(isShow, callback)),
    toggleAlbumDetailDrawer: (isShow) => dispatch(toggleAlbumDetailDrawer(isShow)),
    setCurrentAlbum: (album) => dispatch(setCurrentAlbum(album))
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