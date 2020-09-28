import React from 'react';
import "./style.scss"
import {
    togglePostDrawer,
    toggleMediaViewerDrawer,
    setMediaToViewer,
} from '../../actions/app'
import { connect } from 'react-redux'
import {
    Drawer,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Avatar
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    Close as CloseIcon,
    Add as AddIcon,
    PlayCircleOutline as PlayCircleOutlineIcon,
    Done as DoneIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import { Privacies, GroupPrivacies } from '../../constants/constants';
import { objToArray } from '../../utils/common';
import Dropzone from 'react-dropzone'
import $ from 'jquery'

const uploadImage = require('../../assets/icon/upload_image.png')
const uploadVideo = require('../../assets/icon/upload_video.png')
const album = require('../../assets/icon/album@1x.png')
const tag = require('../../assets/icon/tag@1x.png')
const color = require('../../assets/icon/color@1x.png')
const defaultImage = "https://dapp.dblog.org/img/default.jpg"
const search = require('../../assets/icon/Find@1x.png')

const bg01 = require('../../assets/background/bg01.png')
const bg02 = require('../../assets/background/bg02.png')
const bg03 = require('../../assets/background/bg03.png')
const bg04 = require('../../assets/background/bg04.png')
const bg05 = require('../../assets/background/bg05.png')
const bg06 = require('../../assets/background/bg06.png')
const bg07 = require('../../assets/background/bg07.png')
const bg08 = require('../../assets/background/bg08.png')
const bg09 = require('../../assets/background/bg09.png')
const bg10 = require('../../assets/background/bg10.png')
const bg11 = require('../../assets/background/bg11.png')

const backgroundList = [
    {
        id: 0,
        background: null
    },
    {
        id: 1,
        background: bg01
    },
    {
        id: 2,
        background: bg02
    },
    {
        id: 3,
        background: bg03
    },
    {
        id: 4,
        background: bg04
    },
    {
        id: 5,
        background: bg05
    },
    {
        id: 6,
        background: bg06
    },
    {
        id: 7,
        background: bg07
    },
    {
        id: 8,
        background: bg08
    },
    {
        id: 9,
        background: bg09
    },
    {
        id: 10,
        background: bg10
    },
    {
        id: 11,
        background: bg11
    }
]


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            privacy: Privacies.Public,
            postPrivacy: Privacies.Friend,
            showPostPrivacySelectOption: false,
            imageSelected: [],
            videoSelected: [],
            showAlbumSelectDrawer: false,
            albumSelected: null,
            tagedFrieds: [],
            showGroupForPostDrawer: false
        };
        this.imageDrop = React.createRef()
    }

    handleReset() {
        this.setState({
            privacy: Privacies.Public
        })
    }

    handleCloseDrawer() {
        this.props.togglePostDrawer(false)
        this.handleReset()
    }
    handleTakePhotoAnimationDone(dataUri) {
        this.setState({
            dataUri: dataUri
        })
    }
    handleDeleteImage(image) {
        let {
            imageSelected
        } = this.state
        imageSelected = imageSelected.filter(item => item != image)
        this.setState({
            imageSelected
        })
    }
    handleDeleteVideo(video) {
        let {
            videoSelected
        } = this.state
        videoSelected = videoSelected.filter(item => item != video)
        this.setState({
            videoSelected
        })
    }
    handleTagFriend(friend) {
        let {
            tagedFrieds
        } = this.state
        let existFriend = tagedFrieds.find(item => item.id == friend.id)
        if (existFriend) {
            tagedFrieds = tagedFrieds.filter(item => item.id != friend.id)
        } else {
            tagedFrieds.push(friend)
        }
        this.setState({
            tagedFrieds
        })
    }
    handleSelectBackground(background) {
        this.setState({
            backgroundSelected: background,

        })
    }
    handleInputChange(value) {

        let inputValue = value.target.value

        inputValue.replace("@", <span style={{ color: "red" }}>@</span>)

        this.setState({
            postContent: inputValue
        })

        if (inputValue) {
            if (inputValue.match(/\n/g)) {
                if (inputValue.match(/\n/g).length > 4) {
                    this.setState({
                        backgroundSelected: backgroundList[0]
                    })
                }
            }
            if (inputValue.length > 150) {
                this.setState({
                    backgroundSelected: backgroundList[0]
                })
            }
        }
    }


    render() {
        return (
            <div className="poster-content">

                {
                    renderPostDrawer(this)
                }
                {
                    renderPostPrivacyMenuDrawer(this)
                }

                {
                    renderAlbumSelectDrawer(this)
                }
                {
                    renderTagFriendDrawer(this)
                }
                {
                    renderGroupForPostDrawer(this)
                }
            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        ...state.app,
        ...state.user
    }
};

const mapDispatchToProps = dispatch => ({
    togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
    toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);





const renderPostDrawer = (component) => {
    let {
        showPostDrawer,
        isPostToGroup
    } = component.props
    let {
        privacy,
        imageSelected,
        videoSelected,
        albumSelected,
        groupSelected,
        isBackgroundSelect,
        backgroundSelected,
        postContent
    } = component.state

    return (
        <Drawer anchor="bottom" className="poster-drawer" open={showPostDrawer} onClose={() => component.handleCloseDrawer()}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.handleCloseDrawer()}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Tạo bài đăng</label>
                    </div>
                    <Button className="bt-submit" style={{ width: "fit-content" }}>Đăng</Button>
                </div>
                <div className="filter">
                    {
                        isPostToGroup ? <div className="group-select-options" onClick={() => component.setState({ showGroupForPostDrawer: true })}>
                            {
                                groupSelected ? <span>{groupSelected.groupName}</span> : <span>Chọn nhóm</span>
                            }
                            <ExpandMoreIcon />
                        </div> : ""
                    }
                    <ul>
                        <li>
                            <Dropzone onDrop={acceptedFiles => { component.setState({ imageSelected: imageSelected.concat(acceptedFiles), isBackgroundSelect: false }) }}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps()} id="bt-select-image">
                                        <input {...getInputProps()} accept="image/*" />
                                        <img src={uploadImage} />
                                        <span>Tải ảnh</span>
                                    </div>
                                )}
                            </Dropzone>
                        </li>
                        <li>
                            <Dropzone onDrop={acceptedFiles => component.setState({ videoSelected: acceptedFiles, isBackgroundSelect: false })}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps()} id="bt-select-video">
                                        <input {...getInputProps()} accept="video/*" />
                                        <img src={uploadVideo} />
                                        <span>Tải video</span>
                                    </div>
                                )}
                            </Dropzone>
                        </li>
                        <li onClick={() => component.setState({ showAlbumSelectDrawer: true })} id="bt-create-album">
                            <img src={album} />
                            <span>Tạo Album</span>
                        </li>
                        <li onClick={() => component.setState({ showTagFriendDrawer: true })}>
                            <img src={tag} />
                            <span>Gắn thẻ</span>
                        </li>
                        <li onClick={() => component.setState({ isBackgroundSelect: true, backgroundSelected: backgroundList[0] })}>
                            <img src={color} />
                            <span>Màu nền</span>
                        </li>
                    </ul>
                </div>
                <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
                    <TextField
                        className="custom-input"
                        variant="outlined"
                        placeholder="Bạn viết gì đi..."
                        style={{
                            width: "100%",
                            marginBottom: "10px",
                            background: "url(" + (backgroundSelected ? backgroundSelected.background : "") + ")",
                            overflow: "hidden",
                            borderRadius: "7px"
                        }}
                        value={postContent}
                        onChange={value => component.handleInputChange(value)}
                        multiline
                        className={"auto-height-input " + (backgroundSelected && backgroundSelected.id != 0 ? "have-background" : "")}
                    />
                    <div className={"post-role " + (backgroundSelected && backgroundSelected.id != 0 ? "have-background" : "")}>
                        {
                            albumSelected ? <span className="bt-sumbit" >
                                <img src={album} />
                                <span>{albumSelected.name}</span>
                                <IconButton onClick={() => component.setState({ albumSelected: null })}><CloseIcon /></IconButton>
                            </span> : ""
                        }
                        <span className="bt-sumbit" onClick={() => component.setState({ showPostPrivacySelectOption: true })}>
                            <img src={privacy.icon} />
                            <span>{privacy.label}</span>
                        </span>
                    </div>
                    <div className="media-selected">
                        {
                            imageSelected ? <div className="image-list media-list">
                                {
                                    imageSelected.map((image, index) => <div style={{ background: "url(" + URL.createObjectURL(image) + ")" }} key={index} onClick={() => {
                                        component.props.setMediaToViewer({
                                            commentCount: 30,
                                            likeCount: 10,
                                            content: "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code.",
                                            userName: "Tester 001202",
                                            date: new Date,
                                            medias: [
                                                {
                                                    type: "image",
                                                    url: URL.createObjectURL(image)
                                                }
                                            ]
                                        })
                                        component.props.toggleMediaViewerDrawer(true, { canDownload: true, showInfo: false })
                                    }}>
                                        <IconButton onClick={() => component.handleDeleteImage(image)}><CloseIcon /></IconButton>
                                    </div>)
                                }
                            </div> : ""
                        }
                        {
                            videoSelected ? <div className="video-list media-list">
                                {
                                    videoSelected.map((video, index) => <div key={index} onClick={() => {
                                        component.props.setMediaToViewer({
                                            commentCount: 30,
                                            likeCount: 10,
                                            content: "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code.",
                                            userName: "Tester 001202",
                                            date: new Date,
                                            medias: [
                                                {
                                                    type: "video",
                                                    url: URL.createObjectURL(video)
                                                }
                                            ]
                                        })
                                        component.props.toggleMediaViewerDrawer(true, { canDownload: true, showInfo: false })
                                    }}>
                                        <div className="overlay">
                                            <PlayCircleOutlineIcon />
                                        </div>
                                        <video src={URL.createObjectURL(video)} />
                                        <IconButton onClick={() => component.handleDeleteVideo(video)}><CloseIcon /></IconButton>
                                    </div>)
                                }
                            </div> : ""
                        }
                    </div>
                    {
                        isBackgroundSelect ? <div className="background-list">
                            <ul>
                                {
                                    backgroundList.map((item, index) => <li key={index} style={{ background: "url(" + (item ? item.background : "") + ")" }}>
                                        <Button onClick={() => component.handleSelectBackground(item)}>
                                            <span className={"radio " + (backgroundSelected && backgroundSelected.id == index ? "active" : "")}></span>
                                        </Button>
                                    </li>)
                                }
                            </ul>
                        </div> : ""
                    }
                </div>
            </div>
        </Drawer>
    )
}


const renderPostPrivacyMenuDrawer = (component) => {
    let {
        showPostPrivacySelectOption
    } = component.state
    let privacyOptions = objToArray(Privacies)
    return (
        <Drawer anchor="bottom" className="img-select-option" open={showPostPrivacySelectOption} onClose={() => component.setState({ showPostPrivacySelectOption: false })}>
            <div className="option-header">
                <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showPostPrivacySelectOption: false })}>
                    <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                </IconButton>
                <label>Quyền riêng tư</label>
            </div>
            <ul className="option-list">
                {
                    privacyOptions.map((item, index) => <li key={index}>
                        <Button onClick={() => component.setState({ privacy: item, showPostPrivacySelectOption: false })}>{item.label}</Button>
                    </li>)
                }
            </ul>
        </Drawer>
    )
}




const renderAlbumSelectDrawer = (component) => {
    let {
        showAlbumSelectDrawer
    } = component.state
    const albums = [
        {
            name: "abc",
            id: 122,
            items: [
                "https://www.robertwalters.com.hk/content/dam/robert-walters/global/images/article-images/digital-neon.jpg",
                "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
                "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
                "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg",
                "https://photofolio.co.uk/wp-content/uploads/2015/01/stock-images-636x476.jpg",
            ]
        },
        {
            name: "def",
            id: 123,
            items: [
            ]
        }
    ]

    return (
        <Drawer anchor="bottom" className="select-album-drawer" open={showAlbumSelectDrawer} onClose={() => component.setState({ showAlbumSelectDrawer: false })}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.setState({ showAlbumSelectDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Chọn album</label>
                    </div>
                </div>
                <div className="filter">

                </div>
                <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
                    <div className="album image-box">
                        <ul>
                            <li className="add-bt" onClick={() => component.setState({ showCreateAlbumDrawer: true })}>
                                <div className="demo-bg" >
                                    <AddIcon />
                                </div>
                                <span className="name">Tạo album</span>
                            </li>
                            {
                                albums.map((album, index) => <li key={index} onClick={() => component.setState({ albumSelected: album, showAlbumSelectDrawer: false })}>
                                    <div>
                                        <div className="demo-bg" style={{ background: "url(" + (album.items.length > 0 ? album.items[0] : defaultImage) + ")" }} />
                                    </div>
                                    <span className="name">{album.name}</span>
                                </li>)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}



const renderTagFriendDrawer = (component) => {
    let {
        showTagFriendDrawer,
        tagedFrieds
    } = component.state

    const friends = [
        {
            id: 1,
            fullName: "Bảo Ngọc",
            avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
        },
        {
            id: 2,
            fullName: "Nguyễn Thị Lê Dân",
            avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
        },
        {
            id: 3,
            fullName: "Đặng Lê Trúc Linh",
            avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
        },
        {
            id: 4,
            fullName: "Bảo Ngọc",
            avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
        },
        {
            id: 5,
            fullName: "Nguyễn Thị Lê Dân",
            avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
        },
        {
            id: 6,
            fullName: "Đặng Lê Trúc Linh",
            avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
        },
        {
            id: 7,
            fullName: "Bảo Ngọc",
            avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
        },
        {
            id: 8,
            fullName: "Nguyễn Thị Lê Dân",
            avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
        },
        {
            id: 9,
            fullName: "Đặng Lê Trúc Linh",
            avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
        }
    ]

    return (
        <Drawer anchor="bottom" className="tag-friend-drawer" open={showTagFriendDrawer} onClose={() => component.setState({ showTagFriendDrawer: false })}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.setState({ showTagFriendDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Gắn thẻ bạn bè</label>
                    </div>
                    <Button >Xong</Button>
                </div>
                <div className="filter">
                    <TextField
                        className="custom-input"
                        variant="outlined"
                        placeholder="Nhập tên bạn bè để tìm kiếm"
                        className="search-box"
                        style={{
                            width: "calc(100% - 20px",
                            margin: "0px 0px 10px 10px",
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img src={search} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className="taged-friend">
                        {
                            tagedFrieds.length > 0 ? <ul>
                                {
                                    tagedFrieds.map((friend, index) => <li key={index}>
                                        <span>{friend.fullName}{index >= 0 ? ", " : ""}</span>
                                    </li>)
                                }

                            </ul> : <span>Gắn thẻ bạn bè tại đây</span>
                        }
                        {
                            tagedFrieds.length > 0 ? <IconButton onClick={() => component.setState({ tagedFrieds: [] })}><CloseIcon /></IconButton> : ""
                        }
                    </div>
                </div>
                <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
                    <div className="friend-list">
                        <ul>
                            {
                                friends.map((friend, index) => <li key={index} onClick={() => component.handleTagFriend(friend)}>
                                    <Avatar aria-label="recipe" className="avatar">
                                        <img src={friend.avatar} style={{ width: "100%" }} />
                                    </Avatar>
                                    <label>{friend.fullName}</label>
                                    <div className={"selected-radio " + (tagedFrieds.find(item => item.id == friend.id) ? "active" : "")}>
                                        <DoneIcon />
                                    </div>
                                </li>)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

const renderGroupForPostDrawer = (component) => {
    let {
        showGroupForPostDrawer,
    } = component.state

    return (
        <Drawer anchor="bottom" className="tag-friend-drawer" open={showGroupForPostDrawer} onClose={() => component.setState({ showGroupForPostDrawer: false })}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction" onClick={() => component.setState({ showGroupForPostDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Tìm nhóm</label>
                    </div>
                </div>
                <div className="filter">
                    <TextField
                        className="custom-input"
                        variant="outlined"
                        placeholder="Nhập tên nhóm để tìm"
                        className="search-box"
                        style={{
                            width: "calc(100% - 20px",
                            margin: "0px 0px 10px 10px",
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img src={search} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
                    <div className="my-group-list">
                        <ul>
                            {
                                groups.map((group, index) => <li key={index} onClick={() => component.setState({ groupSelected: group, showGroupForPostDrawer: false })}>
                                    <Avatar className="avatar">
                                        <img src={group.groupAvatar} />
                                    </Avatar>
                                    <div className="group-info">
                                        <label>{group.groupName}</label>
                                        <span className={"privacy " + (group.privacy == GroupPrivacies.Private.value ? "red" : "")}>{GroupPrivacies[group.privacy].label}</span>
                                        <span className="member-count">{group.members.length} thành viên</span>
                                    </div>
                                </li>)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}


const groups = [
    {
        groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
        privacy: "Public",
        posted: 373,
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            }
        ]
    },
    {
        groupName: "Mẹo vặt sinh viên",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
        posted: 373,
        privacy: "Public",
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            },
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
        ]
    },
    {
        groupName: "CHINH PHỤC NHÀ TUYỂN DỤNG",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
        posted: 373,
        privacy: "Private",
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            }
        ],
        owner: true
    },
    {
        groupName: "CƯỜI BỂ BỤNG",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
        posted: 373,
        privacy: "Public",
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            }
        ]
    },
    {
        groupName: "1001 câu hỏi",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
        posted: 373,
        privacy: "Public",
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            }
        ]
    },
    {
        groupName: "NHỮNG ĐIỀU KÌ THÚ",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
        posted: 373,
        privacy: "Public",
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            }
        ]
    },
    {
        groupName: "Ờ, phượt đi",
        groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
        coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
        posted: 373,
        privacy: "Public",
        members: [
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
            {
                avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
            },
            {
                avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
            },
        ],
        owner: true
    }
]