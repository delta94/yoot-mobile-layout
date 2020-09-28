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
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import moment from 'moment'
import { Privacies, ReactSelectorIcon } from '../../constants/constants'
import { connect } from 'react-redux'
import {
  togglePostDrawer,
  toggleReportDrawer,
  toggleMediaViewerDrawer,
  setMediaToViewer
} from '../../actions/app'
import {
  updatePosted,
  likePosted,
  dislikePosted,
  likeImage,
  dislikeImage
} from '../../actions/posted'
import { confirmSubmit, fromNow, objToQuery } from "../../utils/common";
import FacebookSelector from "../common/facebook-selector";
import $ from 'jquery'
import Comment from './comment'
import { objToArray, copyToClipboard } from '../../utils/common';
import Loader from '../common/loader'
import { post } from "../../api";
import { SOCIAL_NET_WORK_API, PostLinkToCoppy } from "../../constants/appSettings";

const maxCols = 6
const like1 = require('../../assets/icon/like1@1x.png')
const comment = require('../../assets/icon/comment@1x.png')
const comment1 = require('../../assets/icon/comment1@1x.png')
const share = require('../../assets/icon/share@1x.png')
const share1 = require('../../assets/icon/share1@1x.png')
const Group = require('../../assets/icon/Group@1x.png')
const Picture = require('../../assets/icon/Picture@1x.png')
const Send = require('../../assets/icon/Send.png')



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
      privacy: Privacies.Public,
    };
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
  handleDeletePost() {
    confirmSubmit("Thông báo", "Bạn có muốn xoá bài đăng này không?")
  }

  updateImagePrivacy() {
    let {
      currentImage,
      privacySelected
    } = this.state
    let {
      data
    } = this.props
    if (currentImage && privacySelected) {
      let param = {
        postid: data.nfid,
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
          let privacy = objToArray(Privacies).find(item => item.code == privacySelected)
          this.props.updatePosted({ ...data, postforid: privacy.code, postforwho: privacy.label }, "mePosteds")
        }
      })
    }
  }

  likePosted(reaction) {
    let {
      data
    } = this.props
    if (!data) return
    let param = {
      postid: data.nfid,
      icon: reaction.code
    }
    this.props.likePosted(data.nfid, reaction.code, "myPosteds")
    this.setState({ isProccesing: false })
    post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {
    })
  }

  dislikePosted() {
    let {
      data
    } = this.props
    if (!data) return
    let param = {
      postid: data.nfid,
      icon: -1
    }
    this.setState({ isProccesing: false })
    this.props.dislikePosted(data.nfid, "myPosteds")
    post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {
    })
  }

  likeImage(reaction, image) {
    let {
      data
    } = this.props
    if (!data) return
    let param = {
      postid: data.nfid,
      icon: reaction.code,
      nameimage: image.nameimage
    }
    this.props.likeImage(data.nfid, image.detailimageid, reaction.code, "myPosteds")
    this.setState({ isProccesing: false })
    post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {

    })
  }

  dislikeImage(image) {
    let {
      data
    } = this.props
    if (!data) return
    let param = {
      postid: data.nfid,
      icon: -1,
      nameimage: image.nameimage
    }
    this.props.dislikeImage(data.nfid, image.detailimageid, "myPosteds")
    this.setState({ isProccesing: false })

    post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {
    })
  }

  componentWillMount() {
    var pressTimer;
    $("#like_touch").mouseup(function () {
      clearTimeout(pressTimer);
      // Clear timeout
      return false;
    }).mousedown(function () {
      // Set timeout
      pressTimer = window.setTimeout(function () {
        alert()
      }, 1000);
      return false;
    });
  }

  render() {
    let {
      anchor,
      showLocalMenu,
      openReactions,
    } = this.state
    let {
      profile,
      daskMode,
      data
    } = this.props

    let PrivacyOptions = objToArray(Privacies)

    return (
      data ? <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
        {
          data.kindpost == 4 ? <div className="album-name">
            <span>Album <span>{data.albumname}</span></span>
          </div> : ""
        }
        <CardHeader
          className="card-header"
          avatar={
            <Avatar aria-label="recipe" className="avatar">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU" />
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={(e) => this.setState({ showLocalMenu: true, anchor: e.target })}>
              <MoreHorizIcon />
            </IconButton>
          }
          title={<span className="poster-name">
            <span className="name">Hoang Hai Long</span>
            {
              data.kindpost == 4 ? <span>{data.titlepost.replace("{usernamesend}", " ").replace("{namealbum}", data.albumname)}</span> : ""
            }
            {
              data.kindpost == 3 ? <span>{data.titlepost.replace("{username}", " ")}</span> : ""
            }
            {
              data.kindpost == 2 ? <span>{data.titlepost.replace("{username}", " ")}</span> : ""
            }
          </span>}
          subheader={<div className="poster-subtitle">
            <div>
              <img src={PrivacyOptions.find(privacy => privacy.code == data.postforid).icon1} />
              <FiberManualRecordIcon />
              <span>{moment(data.createdate).format("DD/MM/YYYY HH:mm")}</span>
              <FiberManualRecordIcon />
              <span>{fromNow(moment(data.createdate), moment(new Date))}</span>
            </div>
            {/* <div>
              <img src={Group} />
              <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
              <span><u>Thông điệp thức tỉnh con người</u></span>
            </div> */}
          </div>}
        />
        {
          data.nfcontent != "" ? <div className={"post-content"}>
            <span>{data.nfcontent}</span>
          </div> : ""
        }
        <CardContent className="card-content">
          <div className="media-grid">
            {
              daskMode ? "" : (
                data.mediaPlays.length > 1
                  ? <GridList cols={maxCols} onClick={() => this.setState({ showPostedDetail: true })}>
                    {data.mediaPlays.map((photo, index) => (
                      <GridListTile
                        className="image"
                        style={{
                          height: this.handleCellHeightCal(index, data.mediaPlays.length),
                        }}
                        key={photo.name}
                        cols={this.handleColumnCal(index, data.mediaPlays.length)}
                      >
                        <img src={photo.name} alt={photo.name} />
                      </GridListTile>
                    ))}
                  </GridList>
                  : <GridList cols={1}>
                    {data.mediaPlays.map((photo, index) => (
                      <GridListTile className="image" style={{ height: "auto" }} key={photo.name} cols={1} onClick={() => {
                        this.props.setMediaToViewer(data.mediaPlays)
                        this.props.toggleMediaViewerDrawer(true, {
                          actions: data.iduserpost == profile.id ? mediaRootActions(this) : mediaGuestActions(this),
                          showInfo: true,
                          activeIndex: index
                        })
                      }}>
                        <img src={photo.name} alt={photo.name} style={{ width: "100%", height: "100%" }} />
                      </GridListTile>
                    ))}
                  </GridList>
              )
            }
            {
              daskMode ? <GridList cols={maxCols}>
                {videos.map((video, index) => (
                  <GridListTile className="video" style={{ height: this.handleCellHeightCal(index, videos.length) }} key={video.url} cols={this.handleColumnCal(index, videos.length)}>
                    <video autoPlay controls>
                      <source src={video.url} type="video/mp4" />
                    </video>
                  </GridListTile>
                ))}
              </GridList> : ""
            }
          </div>
          {
            data.numlike > 0 || data.numcomment > 0 ? <div className="react-reward">
              {
                data.numlike > 0 ? <span className="like">
                  {
                    data.iconNumbers.filter(item => item.icon != data.iconlike).map((icon, index) => index > 0 && <img key={index} src={ReactSelectorIcon[icon.icon].icon}></img>)
                  }
                  {
                    data.islike == 1 ? <img src={ReactSelectorIcon[data.iconlike].icon}></img> : ""
                  }
                  <span>{data.numlike}</span>
                </span> : <span className="like">
                  </span>
              }
              {
                data.numcomment > 0 ? <span className="comment">
                  {data.numcomment} bình luận
                </span> : ""
              }
            </div> : ""
          }
        </CardContent>
        <CardActions disableSpacing className="post-actions">
          <FacebookSelector
            open={openReactions}
            active={data.iconlike}
            onClose={() => this.setState({ openReactions: false })}
            onReaction={(reaction) => this.likePosted(reaction)}
            onShortPress={(reaction) => data.islike == 1 ? this.dislikePosted(reaction) : this.likePosted(reaction)}
          />
          <Button onClick={() => this.setState({ showCommentDrawer: true })}><img src={daskMode ? comment1 : comment} />Bình luận</Button>
          <Button onClick={() => this.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
        </CardActions>
        {
          daskMode ? "" : (data.numcomment > 0 ? <Collapse in={true} timeout="auto" unmountOnExit className={"comment-container"}>
            <CardContent className={"card-container"}>
              <ul className="comment-list" onClick={() => this.setState({ showCommentDrawer: true })}>
                {
                  data.comments.map((comment, index) => <Comment key={index} comment={comment} hideReactions={true} />)
                }
                {
                  profile ? <li >
                    <div className="comment-input">
                      <Avatar className="avatar">
                        <img src={profile.avatar} />
                      </Avatar>
                      <div className="input">
                        <span>Viết bình luận...</span>
                      </div>
                    </div>
                  </li> : ""
                }
              </ul>
            </CardContent>
          </Collapse> : "")
        }
        {
          showLocalMenu ? <Menu
            className="custom-menu"
            anchorEl={anchor}
            keepMounted
            open={showLocalMenu}
            onClose={() => this.setState({ showLocalMenu: false })}
          >
            <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.props.togglePostDrawer(true))}>Chỉnh sửa bài đăng</MenuItem>
            {
              data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.handleDeletePost())}>Xoá bài đăng</MenuItem> : ""
            }
            <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => copyToClipboard(PostLinkToCoppy + data.nfid))}>Sao chép liên kết</MenuItem>
            {
              data.iduserpost != profile.id ? <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem> : ""
            }
            {
              data.iduserpost != profile.id ? <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.props.toggleReportDrawer(true))}>Báo cáo vi phạm</MenuItem> : ""
            }
          </Menu> : ""
        }
        {
          renderCommentDrawer(this)
        }
        {
          renderShareDrawer(this)
        }
        {
          renderSharePrivacyMenuDrawer(this)
        }
        {
          renderUpdatePrivacyImageDrawer(this)
        }
        {
          rednerDetailPosted(this)
        }
      </Card> : ""
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.user
  }
};
const mapDispatchToProps = dispatch => ({
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleReportDrawer: (isShow) => dispatch(toggleReportDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, features) => dispatch(toggleMediaViewerDrawer(isShow, features)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  updatePosted: (posted, targetKey) => dispatch(updatePosted(posted, targetKey)),
  likePosted: (postedId, likeIcon, targetKey) => dispatch(likePosted(postedId, likeIcon, targetKey)),
  dislikePosted: (postedId, targetKey) => dispatch(dislikePosted(postedId, targetKey)),
  likeImage: (postId, imageId, iconCode, targetKey) => dispatch(likeImage(postId, imageId, iconCode, targetKey)),
  dislikeImage: (postId, imageId, targetKey) => dispatch(dislikeImage(postId, imageId, targetKey))
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

const mediaGuestActions = [
  {
    label: "Lưu vào điện thoại",
    action: (value) => this.downloadImage(value.name)
  }
]








const renderCommentDrawer = (component) => {
  let {
    showCommentDrawer,
    anchor,
    showLocalMenu,
    openReactions
  } = component.state
  return (
    <Drawer anchor="bottom" className="comment-drawer" open={showCommentDrawer} onClose={() => component.setState({ showCommentDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showCommentDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
          </div>
          <div className="post-item">
            <CardHeader
              className="card-header"
              avatar={
                <Avatar aria-label="recipe" className="avatar">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU" />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" onClick={(e) => component.setState({ showLocalMenu: true, anchor: e.target })}>
                  <MoreHorizIcon />
                </IconButton>
              }
              title={<span className="poster-name">Hoang Hai Long</span>}
              subheader={<div className="poster-subtitle">
                <div>
                  <img src={Privacies.Public.icon1} />
                  <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                  <span>{moment(new Date).format("DD/MM/YYYY")}</span>
                </div>
                <div>
                  <img src={Group} />
                  <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                  <span><u>Thông điệp thức tỉnh con người</u></span>
                </div>
              </div>}
            />
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll" }}>
          <div className="post-item" style={{ marginTop: "20px", minHeight: "2000px" }}>
            <CardContent className="card-content">
              <div className="media-grid">
                <GridList cols={maxCols}>
                  {photos.map((photo, index) => (
                    <GridListTile className="image" style={{ height: component.handleCellHeightCal(index, photos.length) }} key={photo.url} cols={component.handleColumnCal(index, photos.length)}>
                      <img src={photo.url} alt={photo.title} onClick={() => {
                        component.props.setMediaToViewer(
                          {
                            medias: photos,
                            userName: "Tester 001202",
                            likeCount: 10,
                            commentCount: 30,
                            content: "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code."
                          }
                        )
                        component.props.toggleMediaViewerDrawer(true, { showInfo: true })
                      }} />
                    </GridListTile>
                  ))}
                </GridList>
                {/* <GridList cols={maxCols}>
              {videos.map((video, index) => (
                <GridListTile className="video" style={{ height: component.handleCellHeightCal(index, videos.length) }} key={video.url} cols={component.handleColumnCal(index, videos.length)}>
                  <video autoPlay controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                </GridListTile>
              ))}
            </GridList> */}
              </div>
              <div className="react-reward">
                <span className="like">
                  1
            </span>
                <span className="comment">
                  2 bình luận
            </span>
              </div>
            </CardContent>
            <CardActions disableSpacing className="post-actions">
              <FacebookSelector open={openReactions} onClose={() => component.setState({ openReactions: false })} onReaction={(reaction) => console.log("reaction", reaction)} />
              <Button onClick={() => component.setState({ showShareDrawer: true })}><img src={share} />Chia sẻ</Button>
            </CardActions>
            <Collapse in={true} timeout="auto" unmountOnExit className={"comment-container"}>
              <CardContent className={"card-container"}>
                <ul className="comment-list">
                  {
                    comments.map((comment, index) => <Comment comment={comment} key={index} />)
                  }
                </ul>

              </CardContent>
            </Collapse>


            <Menu
              className="custom-menu"
              anchorEl={anchor}
              keepMounted
              open={showLocalMenu}
              onClose={() => component.setState({ showLocalMenu: false })}
            >
              <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.props.togglePostDrawer(true))}>Chỉnh sửa bài đăng</MenuItem>
              <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.handleDeletePost())}>Xoá bài đăng</MenuItem>
              <MenuItem onClick={() => component.setState({ showLocalMenu: false })}>Sao chép liên kết</MenuItem>
              <MenuItem onClick={() => component.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem>
              <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.props.toggleReportDrawer(true))}>Báo cáo vi phạm</MenuItem>
            </Menu>
          </div>
        </div>
        <TextField
          className="custom-input"
          className="comment-input"
          variant="outlined"
          placeholder="Viết bình luận"
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          multiline
          autoFocus={true}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Button><img src={Picture} /></Button>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button><img src={Send} /></Button>
              </InputAdornment>
            )
          }}
        />
      </div>
    </Drawer>
  )
}

const renderShareDrawer = (component) => {
  let {
    showShareDrawer,
    privacy
  } = component.state
  return (
    <Drawer anchor="bottom" className="share-drawer poster-drawer" open={showShareDrawer} onClose={() => component.setState({ showShareDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showShareDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Chia sẻ</label>
          </div>
          <Button className="bt-submit">Đăng</Button>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll" }}>
          <label>Bản tin</label>
          <TextField
            className="custom-input"
            variant="outlined"
            placeholder="Bạn viết gì đi..."
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            multiline
            className="auto-height-input"
          />
          <div className="post-role">
            <span className="bt-sumbit" onClick={() => component.setState({ showSharePrivacySelectOption: true })}>
              <img src={privacy.icon} />
              <span>{privacy.label}</span>
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderSharePrivacyMenuDrawer = (component) => {
  let {
    showSharePrivacySelectOption,
    privacy
  } = component.state
  let privacyOptions = objToArray(Privacies)
  return (
    <Drawer anchor="bottom" className="img-select-option" open={showSharePrivacySelectOption} onClose={() => component.setState({ showSharePrivacySelectOption: false })}>
      <div className="option-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showSharePrivacySelectOption: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Quyền riêng tư</label>
      </div>
      <ul className="option-list">
        {
          privacyOptions.map((item, index) => <li key={index}>
            <Button onClick={() => component.setState({ privacy: item, showSharePrivacySelectOption: false })}>{item.label}</Button>
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

const rednerDetailPosted = (component) => {
  let {
    showPostedDetail,
  } = component.state
  let {
    data,
    profile,
    daskMode,
    openReactions,
    anchor,
    showLocalMenu
  } = component.props

  let PrivacyOptions = objToArray(Privacies)


  return (
    <Drawer anchor="bottom" className="posted-detail-drawer" open={showPostedDetail}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showPostedDetail: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll", background: "#ededed", padding: "10px" }}>
          {
            data && <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
              {
                data.kindpost == 4 ? <div className="album-name">
                  <span>Album <span>{data.albumname}</span></span>
                </div> : ""
              }
              <CardHeader
                className="card-header"
                avatar={
                  <Avatar aria-label="recipe" className="avatar">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU" />
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings" onClick={(e) => component.setState({ showLocalMenu: true, anchor: e.target })}>
                    <MoreHorizIcon />
                  </IconButton>
                }
                title={<span className="poster-name">
                  <span className="name">Hoang Hai Long</span>
                  {
                    data.kindpost == 4 ? <span>{data.titlepost.replace("{usernamesend}", " ").replace("{namealbum}", data.albumname)}</span> : ""
                  }
                  {
                    data.kindpost == 3 ? <span>{data.titlepost.replace("{username}", " ")}</span> : ""
                  }
                  {
                    data.kindpost == 2 ? <span>{data.titlepost.replace("{username}", " ")}</span> : ""
                  }
                </span>}
                subheader={<div className="poster-subtitle">
                  <div>
                    <img src={PrivacyOptions.find(privacy => privacy.code == data.postforid).icon1} />
                    <FiberManualRecordIcon />
                    <span>{moment(data.createdate).format("DD/MM/YYYY HH:mm")}</span>
                    <FiberManualRecordIcon />
                    <span>{fromNow(moment(data.createdate), moment(new Date))}</span>
                  </div>
                  {/* <div>
              <img src={Group} />
              <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
              <span><u>Thông điệp thức tỉnh con người</u></span>
            </div> */}
                </div>}
              />
              {
                data.nfcontent != "" ? <div className={"post-content"}>
                  <span>{data.nfcontent}</span>
                </div> : ""
              }
              <CardContent className="card-content">
                {
                  data.numlike > 0 || data.numcomment > 0 ? <div className="react-reward">
                    {
                      data.numlike > 0 ? <span className="like">
                        {
                          data.iconNumbers.filter(item => item.icon != data.iconlike).map((icon, index) => index > 0 && <img key={index} src={ReactSelectorIcon[icon.icon].icon}></img>)
                        }
                        {
                          data.islike == 1 ? <img src={ReactSelectorIcon[data.iconlike].icon}></img> : ""
                        }
                        <span>{data.numlike}</span>
                      </span> : <span className="like">
                        </span>
                    }
                    {
                      data.numcomment > 0 ? <span className="comment">
                        {data.numcomment} bình luận
                </span> : ""
                    }
                  </div> : ""
                }
              </CardContent>
              <CardActions disableSpacing className="post-actions">
                <FacebookSelector
                  open={openReactions}
                  active={data.iconlike}
                  onClose={() => component.setState({ openReactions: false })}
                  onReaction={(reaction) => component.likePosted(reaction)}
                  onShortPress={(reaction) => data.islike == 1 ? component.dislikePosted(reaction) : component.likePosted(reaction)}
                />

                <Button onClick={() => component.setState({ showCommentDrawer: true })}><img src={daskMode ? comment1 : comment} />Bình luận</Button>
                <Button onClick={() => component.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
              </CardActions>

              <Menu
                className="custom-menu"
                anchorEl={anchor}
                keepMounted
                open={showLocalMenu}
                onClose={() => component.setState({ showLocalMenu: false })}
              >
                <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.props.togglePostDrawer(true))}>Chỉnh sửa bài đăng</MenuItem>
                {
                  data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.handleDeletePost())}>Xoá bài đăng</MenuItem> : ""
                }
                <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => copyToClipboard(PostLinkToCoppy + data.nfid))}>Sao chép liên kết</MenuItem>
                {
                  data.iduserpost != profile.id ? <MenuItem onClick={() => component.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem> : ""
                }
                {
                  data.iduserpost != profile.id ? <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.props.toggleReportDrawer(true))}>Báo cáo vi phạm</MenuItem> : ""
                }
              </Menu>
            </Card>
          }
          <div className="list-image">
            <ul>
              {
                data.mediaPlays.map((media, index) => <li key={index}>
                  <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                    <CardContent className="card-content">
                      <img src={media.name} className="image" />
                      {
                        media.numlike > 0 || media.numcomment > 0 ? <div className="react-reward">
                          {
                            media.numlike > 0 ? <span className="like">
                              {
                                media.iconNumbers.filter(item => item.icon != media.iconlike).map((icon, index) => index > 0 && <img key={index} src={ReactSelectorIcon[icon.icon].icon}></img>)
                              }
                              {
                                media.islike == 1 ? <img src={ReactSelectorIcon[media.iconlike].icon}></img> : ""
                              }
                              <span>{media.numlike}</span>
                            </span> : <span className="like">
                              </span>
                          }
                          {
                            media.numcomment > 0 ? <span className="comment">
                              {media.numcomment} bình luận
                </span> : ""
                          }
                        </div> : ""
                      }
                    </CardContent>
                    <CardActions disableSpacing className="post-actions">
                      <FacebookSelector
                        open={openReactions}
                        active={media.iconlike > 0 ? media.iconlike : 0}
                        onClose={() => component.setState({ openReactions: false })}
                        onReaction={(reaction) => component.likeImage(reaction, media)}
                        onShortPress={(reaction) => media.islike == 1 ? component.dislikeImage(media) : component.likeImage(reaction, media)}
                      />
                      <Button onClick={() => component.setState({ showCommentDrawer: true })}><img src={daskMode ? comment1 : comment} />Bình luận</Button>
                      <Button onClick={() => component.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
                    </CardActions>

                  </Card>
                </li>)
              }
            </ul>
          </div>
        </div>

      </div>

      {/* {
        isProccesing == true ? <Loader type="dask-mode" isFullScreen={true} /> : ""
      } */}
    </Drawer>
  )
}