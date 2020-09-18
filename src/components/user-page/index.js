import React from "react";
import './style.scss'
import {
  toggleUserDetail,
  toggleUserHistory,
  toggleChangePasswordForm,
  toggleBlockFriendForm,
  toggleFriendDrawer,
  togglePostDrawer,
  setMediaToViewer,
  toggleMediaViewerDrawer,
  toggleUserPageDrawer
} from '../../actions/app'
import {
  setCurrenUserDetail
} from '../../actions/user'
import {
  PhotoCamera as PhotoCameraIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon
} from '@material-ui/icons'
import { connect } from 'react-redux'
import {
  IconButton,
  Drawer,
  Button,
  AppBar,
  Tabs,
  Tab,
  Avatar
} from "@material-ui/core";
import moment from 'moment'
import SwipeableViews from 'react-swipeable-views';
import { get } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";

const coin = require('../../assets/icon/Coins_Y.png')
const like = require('../../assets/icon/like@1x.png')
const follower = require('../../assets/icon/Follower@1x.png')
const birthday = require('../../assets/icon/Birthday.png')
const sex = require('../../assets/icon/Sex.png')
const education = require('../../assets/icon/Education.png')
const job = require('../../assets/icon/job@1x.png')
const donePractice = require('../../assets/icon/DonePractive@1x.png')
const uploadImage = require('../../assets/icon/upload_image.png')
const uploadVideo = require('../../assets/icon/upload_video.png')
const defaultImage = "https://dapp.dblog.org/img/default.jpg"


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserMenu: false,
      showUpdateProfile: false,
      isShowOldPass: false,
      isShowNewPass: false,
      isShowConfirmPass: false,
      openMediaDrawer: false,
      mediaTabIndex: 1,
      userDetail: null
    };
  }
  getProfile(id) {
    get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=" + id, result => {
      if (result.result == 1) {
        this.setState({
          userDetail: result.content.user
        })
      }
    })
  }

  componentWillMount() {
    this.getProfile(0)
  }
  render() {
    let {
      showUserMenu,
      userDetail
    } = this.state
    return (
      userDetail ? <div className="profile-page user-page" >
        <div className="cover-img" style={{ background: "url(" + userDetail.coverImage + ")" }}></div>

        <div className="user-avatar" style={{ background: "url(" + userDetail.avatar + ")" }}></div>

        <div className="user-info">
          <span className="user-name">{userDetail.fullName}</span>
        </div>

        <div className="react-reward">
          <ul>
            <li>
              <span><img src={like}></img></span>
              <span>{userDetail.liked}</span>
            </li>
            <li>
              <span><img src={follower}></img></span>
              <span>{userDetail.folow}</span>
            </li>
            <li>
              <span><img src={donePractice}></img></span>
              <span>{userDetail.posted}</span>
            </li>
          </ul>
        </div>

        <div className="friend-actions">
          <Button className="bt-submit">Kết bạn</Button>
          <Button className="bt-cancel">Theo dõi</Button>
          <IconButton className="bt-more" style={{ background: "rgba(0,0,0,0.07)" }} onClick={() => this.setState({ showUserMenu: true })}>
            <MoreHorizIcon />
          </IconButton>
        </div>

        <div className="user-profile">
          <ul>
            <li>
              <img src={job} />
              <span className="title" >Từng làm <b>{userDetail.jobs[0].position}</b> tại <b>{userDetail.jobs[0].company}</b></span>
            </li>
            <li>
              <img src={education} />
              <span className="title" >Từng học <b>{userDetail.studies[0].majors}</b> tại <b>{userDetail.studies[0].school}</b></span>
            </li>
            <li>
              <img src={birthday} />
              <span className="title" >Ngày sinh <b>{moment(userDetail.birthday).format("DD/MM/YYYY")}</b></span>
            </li>
            <li>
              <img src={sex} />
              <span className="title">Giới tính <b>{userDetail.gender}</b></span>
            </li>
          </ul>
          <span className="view-detail-link" onClick={() => {
            this.props.setCurrenUserDetail(userDetail)
            this.props.toggleUserDetail(true)
          }}>{">>> Xem thêm thông tin của"} {userDetail.fullName}</span>
        </div>

        <div className="friend-reward">
          <label>Bạn bè</label>
          <span>{userDetail.friends.length} người bạn</span>
          <div className="friend-list">
            {
              userDetail.friends.map((item, index) => <div key={index} className="friend-item" onClick={() => {
                this.setState({
                  showUserPage: true,
                  userDetail: item
                })
              }}>
                <div className="avatar" style={{ background: "url(" + item.avatar + ")" }}></div>
                <span className="name">{item.fullName}</span>
                <span className='mutual-friend-count'>{item.mutualFriendCount} bạn chung</span>
              </div>)
            }
          </div>
          <Button className="bt-submit" style={{ marginTop: "10px" }}>Xem tất cả bạn bè</Button>
        </div>

        <div className="quit-post-bt">
          <ul>
            <li onClick={() => this.setState({ openMediaDrawer: true })}>
              <img src={uploadImage}></img>
              <span>Ảnh</span>
            </li>
            <li onClick={() => this.setState({ openVideoDrawer: true })}>
              <img src={uploadVideo}></img>
              <span>Video</span>
            </li>
          </ul>
        </div>


        {
          renderUserMenuDrawer(this)
        }
        {
          renderMediaDrawer(this)
        }
        {
          renderVideoDrawer(this)
        }
        {
          renderUserPageDrawer(this)
        }
      </div> : ""
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
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleUserHistory: (isShow) => dispatch(toggleUserHistory(isShow)),
  toggleChangePasswordForm: (isShow) => dispatch(toggleChangePasswordForm(isShow)),
  toggleBlockFriendForm: (isShow) => dispatch(toggleBlockFriendForm(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);












































const renderUserMenuDrawer = (component) => {
  let {
    showUserMenu
  } = component.state
  let {
    userDetail
  } = component.props
  return (
    <Drawer anchor="bottom" className="user-menu" open={showUserMenu} onClose={() => component.setState({ showUserMenu: false })}>
      <div className="menu-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showUserMenu: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Tuỳ chọn</label>
      </div>
      <ul className="menu-list">
        <li>
          <Button onClick={() => component.setState({ showUpdateProfile: true })}>
            <span>
              <span>Chặn ( {userDetail.fullName} )</span>
              <span>Bạn và người này sẽ không thể nhìn thấy nhau</span>
            </span>
          </Button>
        </li>
      </ul>
    </Drawer>
  )
}



const renderMediaDrawer = (component) => {
  let {
    openMediaDrawer,
    mediaTabIndex
  } = component.state
  let {
    userDetail
  } = component.props
  const postedImage = [
    "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
    "https://photofolio.co.uk/wp-content/uploads/2015/01/stock-images-636x476.jpg",
    "https://www.robertwalters.com.hk/content/dam/robert-walters/global/images/article-images/digital-neon.jpg",
    "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg"
  ]
  const albums = [
    {
      name: "abc",
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
      items: [
      ]
    }
  ]
  return (
    <Drawer anchor="bottom" open={openMediaDrawer} onClose={() => component.setState({ openMediaDrawer: false })}>
      {
        userDetail ? <div className="drawer-detail media-drawer">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.setState({ openMediaDrawer: false })}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Album của {userDetail.fullName}</label>
            </div>
          </div>
          <div className="filter">
            <AppBar position="static" color="default" className="custom-tab-1">
              <Tabs
                value={mediaTabIndex}
                onChange={(e, value) => component.setState({ mediaTabIndex: value })}
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
          <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
            <SwipeableViews
              index={mediaTabIndex}
              onChangeIndex={(value) => component.setState({ mediaTabIndex: value })}
              className="tab-content"
            >
              <TabPanel value={mediaTabIndex} index={0} className="content-box">
                <div className="image-posted image-box">
                  <ul className="image-list">
                    {
                      postedImage.map((item, index) => <li style={{ background: "url(" + item + ")" }} key={index} onClick={() => {
                        component.props.setMediaToViewer({
                          commentCount: 30,
                          likeCount: 10,
                          content: "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code.",
                          userName: "Tester 001202",
                          date: new Date,
                          medias: [
                            {
                              type: "image",
                              url: item
                            }
                          ]
                        })
                        component.props.toggleMediaViewerDrawer(true, { canDownload: true, showInfo: true })
                      }}>

                      </li>)
                    }
                  </ul>
                </div>
              </TabPanel>
              <TabPanel value={mediaTabIndex} index={1} className="content-box">
                <div className="avatar-image image-box">
                  <ul className="image-list">
                    {
                      postedImage.map((item, index) => <li style={{ background: "url(" + item + ")" }} key={index}>

                      </li>)
                    }
                  </ul>
                </div>
              </TabPanel>
              <TabPanel value={mediaTabIndex} index={2} className="content-box">
                <div className="cover-image image-box">
                  <ul className="image-list">
                    {
                      postedImage.map((item, index) => <li style={{ background: "url(" + item + ")" }} key={index}>

                      </li>)
                    }
                  </ul>
                </div>
              </TabPanel>
              <TabPanel value={mediaTabIndex} index={3} className="content-box">
                <div className="album image-box">
                  <ul>
                    <li className="add-bt">
                      <div className="demo-bg" >
                        <AddIcon />
                      </div>
                      <span className="name">Tạo album</span>
                    </li>
                    {
                      albums.map((album, index) => <li key={index}>
                        <div>
                          <div className="demo-bg" style={{ background: "url(" + (album.items.length > 0 ? album.items[0] : defaultImage) + ")" }} />
                        </div>
                        <span className="name">{album.name}</span>
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
  )
}

const renderVideoDrawer = (component) => {
  let {
    openVideoDrawer
  } = component.state
  let {
    userDetail
  } = component.props
  return (
    <Drawer anchor="bottom" open={openVideoDrawer} onClose={() => component.setState({ openVideoDrawer: false })}>
      {
        userDetail ? <div className="drawer-detail media-drawer">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.setState({ openVideoDrawer: false })}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Video của {userDetail.fullName}</label>
            </div>
          </div>
          <div className="filter">
          </div>
          <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>

          </div>
        </div> : ""
      }
    </Drawer>
  )
}





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

const renderUserPageDrawer = (component) => {
  let {
    showUserPage,
    userDetail
  } = component.state
  return (
    <Drawer anchor="bottom" className="user-page-drawer" open={showUserPage} onClose={() => component.setState({ showUserPage: false })}>
      {
        userDetail ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.setState({ showUserPage: false })}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Trang cá nhân</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{userDetail.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {userDetail.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={userDetail.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div style={{ overflow: "scroll" }}>
            <Index {...component.props} userDetail={userDetail} />
          </div>

        </div> : ""
      }
    </Drawer>
  )
}