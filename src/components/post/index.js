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
  InputAdornment
} from '@material-ui/core'

import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MoreHoriz as MoreHorizIcon,
  FiberManualRecord as FiberManualRecordIcon,
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import moment from 'moment'
import { Privacies } from '../../constants/constants'
import { connect } from 'react-redux'
import {
  togglePostDrawer,
  toggleReportDrawer,
  toggleMediaViewerDrawer,
  setMediaToViewer
} from '../../actions/app'
import { confirmSubmit } from "../../utils/common";
import FacebookSelector from "../common/facebook-selector";
import $ from 'jquery'
import Comment from './comment'
import { objToArray } from '../../utils/common';

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
      case 1:
        return maxCols
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
      case 1:
        return 300
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
      daskMode
    } = this.props

    return (
      <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
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
        <CardContent className="card-content">
          <div className="media-grid">
            {
              daskMode ? "" : <GridList cols={maxCols}>
                {photos.map((photo, index) => (
                  <GridListTile className="image" style={{ height: this.handleCellHeightCal(index, photos.length) }} key={photo.url} cols={this.handleColumnCal(index, photos.length)}>
                    <img src={photo.url} alt={photo.title} onClick={() => {
                      this.props.setMediaToViewer({
                        medias: photos,
                        userName: "Tester 001202",
                        likeCount: 10,
                        commentCount: 30,
                        content: "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code."
                      })
                      this.props.toggleMediaViewerDrawer(true, { showInfo: true })
                    }} />
                  </GridListTile>
                ))}
              </GridList>
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
          <div className="react-reward">
            <span className="like">
              <img src={like1} />
              <span>1</span>
            </span>
            <span className="comment">
              2 bình luận
            </span>
          </div>
        </CardContent>
        <CardActions disableSpacing className="post-actions">
          <FacebookSelector open={openReactions} onClose={() => this.setState({ openReactions: false })} onReaction={(reaction) => console.log("reaction", reaction)} />
          <Button onClick={() => this.setState({ showCommentDrawer: true })}><img src={daskMode ? comment1 : comment} />Bình luận</Button>
          <Button onClick={() => this.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
        </CardActions>
        {
          daskMode ? "" : <Collapse in={true} timeout="auto" unmountOnExit className={"comment-container"}>
            <CardContent className={"card-container"}>
              <ul className="comment-list" onClick={() => this.setState({ showCommentDrawer: true })}>
                {
                  comments.map((comment, index) => <Comment key={index} comment={comment} hideReactions={true} />)
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
          </Collapse>
        }
        <Menu
          className="custom-menu"
          anchorEl={anchor}
          keepMounted
          open={showLocalMenu}
          onClose={() => this.setState({ showLocalMenu: false })}
        >
          <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.props.togglePostDrawer(true))}>Chỉnh sửa bài đăng</MenuItem>
          <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.handleDeletePost())}>Xoá bài đăng</MenuItem>
          <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Sao chép liên kết</MenuItem>
          <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem>
          <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.props.toggleReportDrawer(true))}>Báo cáo vi phạm</MenuItem>
        </Menu>
        {
          renderCommentDrawer(this)
        }
        {
          renderShareDrawer(this)
        }
        {
          renderSharePrivacyMenuDrawer(this)
        }
      </Card>
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
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);








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