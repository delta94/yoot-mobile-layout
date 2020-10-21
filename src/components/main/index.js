import React, { useRef } from "react";
import { Route, Switch } from "react-router";
import Home from "../home";
import YootNoti from '../yoot-noti'
import Profile from '../profile-page'
import Setting from '../setting'
import Poster from '../poster'
import UserPage from '../user-page'
import Community from '../community'
import Videos from '../videos'
import Groups from '../groups'
import CommunityNoti from '../community-noti'
import Skills from '../skills'
import SourceItem from '../skills/source-item'
import SourceNoti from '../skill-noti'
import Exercise from '../skills/exercise'
import Assess from '../skills/assess'
import CareerGuidance from '../career-guidance'
import Album from './album'
import "./style.scss";
import { connect } from 'react-redux'
import {
  Avatar,
  Drawer,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Button,
  TextField,
  Radio,
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon
} from '@material-ui/icons'
import {
  toggleUserDetail,
  toggleFindFriendDrawer,
  toggleFriendDrawer,
  togglePostDrawer,
  toggleMediaViewerDrawer,
  toggleUserPageDrawer,
  toggleGroupDrawer,
  toggleCreateGroupDrawer,
  toggleGroupInviteDrawer,
  toggleCreateAlbumDrawer,
  setProccessDuration
} from '../../actions/app'
import {
  setUserProfile,
  getFolowedMe,
  getMeFolowing
} from '../../actions/user'
import {
  setUnreadNotiCount
} from '../../actions/noti'
import {
  GroupPrivacies,
  Privacies
} from '../../constants/constants'
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment'
import Slider from "react-slick";

import { objToArray, showNotification, fromNow } from "../../utils/common";
import { get, post } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import Friends from './friend'
import SearchFriends from './search-friend'
import Loader from '../common/loader'
import Realtime from '../realtime'
import Player from '../common/player'
import LoadingBar from 'react-top-loading-bar'
import GroupDetail from '../groups/detail'
import MediaViewr from './viewer'

const coin = require('../../assets/icon/Coins_Y.png')
const search = require('../../assets/icon/Find@1x.png')
const like1 = require('../../assets/icon/like1@1x.png')
const likeActive = require('../../assets/icon/like@1x.png')
const comment = require('../../assets/icon/comment1@1x.png')
const share = require('../../assets/icon/share1@1x.png')

const NewGr = require('../../assets/icon/NewGr@1x.png')





class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userDetailFolowTabIndex: 0,
      searchKey: "",
      friendTabIndex: 0,
      groupTabIndex: 0,
      groupPrivacy: GroupPrivacies.Public,
      postPrivacy: Privacies.Public,
      albumName: '',
      description: ''
    }
  }

  getUnreadNoti() {
    get(SOCIAL_NET_WORK_API, "Notification/CountNotificationNoRead?typeproject=1", result => {
      if (result && result.result == 1) {
        this.props.setUnreadNotiCount(result.content.noUnRead)
      }
    })
  }

  getProfile() {
    get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
      if (result && result.result == 1) {
        this.props.setUserProfile(result.content.user)
        this.props.getFolowedMe(0)
        this.props.getMeFolowing(0)
      } else {
        showNotification("", <span className="app-noti-message">{result && result.message}</span>, null)
      }

    })
  }

  createAlbum() {
    let {
      albumName,
      description,
      postPrivacy
    } = this.state
    let param = {
      name: albumName,
      description: description,
      albumfor: postPrivacy.code
    }
    let {
      createAlbumSuccessCallback
    } = this.props
    this.setState({
      isCreateAlbum: true
    })
    post(SOCIAL_NET_WORK_API, "Media/CreateAlbum", param, result => {
      if (result && result.result == 1) {
        setTimeout(() => {
          if (createAlbumSuccessCallback) createAlbumSuccessCallback()
        }, 1000);
        setTimeout(() => {
          this.setState({
            isChange: false,
            albumName: '',
            description: '',
            postPrivacy: Privacies.Public
          })
          this.props.toggleCreateAlbumDrawer(false)
          this.setState({
            isCreateAlbum: false
          })
        }, 2000);
      }
    })
  }

  handleCloseCreateDrawer() {
    let {
      isChange
    } = this.state
    if (isChange == true) {
      this.setState({
        showConfim: true,
        okCallback: () => this.setState({
          albumName: '',
          description: '',
          postPrivacy: Privacies.Public
        }, () => this.props.toggleCreateAlbumDrawer(false)),
        confirmTitle: "Bạn muốn rời khỏi trang này?",
        confirmMessage: "Những thông tin vừa thay đổi vẫn chưa được lưu."
      })
    } else {
      this.props.toggleCreateAlbumDrawer(false)
    }
  }

  componentWillMount() {
    this.getProfile()
    this.getUnreadNoti()
  }

  componentWillReceiveProps(nextProps) {
    if (Object.entries(this.props.mediaViewerFeature ? this.props.mediaViewerFeature : {}).toString() != Object.entries(nextProps.mediaViewerFeature ? nextProps.mediaViewerFeature : {}).toString()) {
      if (this.slider) {

        // this.slider.current.slickGoTo(10)
      }
    }
  }

  render() {
    let {
      userDetailFolowTabIndex
    } = this.state
    let {
      showHeader,
      showFooter,
      profile,
      headerContent,
      footerContent,
      progressDuration
    } = this.props


    return (
      <div className="wrapper">
        <Realtime />
        <div id="proccess-bar" className={progressDuration > 0 ? "active" : ""}>
          <LoadingBar
            color='#3ea2e0'
            height={5}
            background="#ededed"
            progress={progressDuration}
            onLoaderFinished={() => this.props.setProccessDuration(-100)}
            loaderSpeed={1000}
          />
        </div>
        <div className={"fix-header " + (showHeader ? "showed" : "hided") + (window.location.pathname == '/videos' ? " dask-mode" : "")} >
          <div className="direction">
            {headerContent}
          </div>
          {
            profile && window.location.pathname != "/setting" ? <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div> : ""
          }
        </div>

        <main className="content-main" style={{ marginTop: (showHeader ? "60px" : "0px"), marginBottom: showFooter ? "70px" : "0px" }}>
          <Switch >
            <Route exact path="/" component={Home} />
            <Route exact path="/yoot-noti" component={YootNoti} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/community" component={Community} />
            <Route exact path="/videos" component={Videos} />
            <Route exact path="/groups" component={Groups} />
            <Route exact path="/communiti-profile" component={Profile} />
            <Route exact path="/community-noti" component={CommunityNoti} />
            <Route exact path="/skills/:sourceId/exercise" component={Exercise} />
            <Route exact path="/skills/:sourceId/assess" component={Assess} />
            <Route exact path="/skills/:sourceId" component={SourceItem} />
            <Route exact path="/skills" component={Skills} />
            <Route exact path="/skills-noti" component={SourceNoti} />
            <Route exact path="/career-guidance" component={CareerGuidance} />

          </Switch>
        </main>
        <div className={"fix-footer " + (showFooter ? "showed" : "hided")} >
          {footerContent}
        </div>



        <Poster history={this.props.history} />
        {
          renderUserPageDrawer(this)
        }
        <Friends />
        <SearchFriends />
        <MediaViewr />
        {/* {
          renderMediaViewer(this)
        } */}
        {
          renderMediaViewerMenu(this)
        }
        {
          renderGroupPrivacyMenuDrawer(this)
        }
        {
          renderCreateAlbumDrawer(this)
        }
        {
          renderAlbumPrivacyMenuDrawer(this)
        }
        {
          renderConfirmDrawer(this)
        }
        {
          renderGroupDetailDrawer(this)
        }
        <Album history={this.props.history} />
      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.user,
    ...state.group
  }
};

const mapDispatchToProps = dispatch => ({
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleFindFriendDrawer: (isShow) => dispatch(toggleFindFriendDrawer(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
  toggleGroupDrawer: (isShow) => dispatch(toggleGroupDrawer(isShow)),
  toggleCreateGroupDrawer: (isShow) => dispatch(toggleCreateGroupDrawer(isShow)),
  toggleGroupInviteDrawer: (isShow) => dispatch(toggleGroupInviteDrawer(isShow)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
  getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage)),
  toggleCreateAlbumDrawer: (isShow) => dispatch(toggleCreateAlbumDrawer(isShow)),
  setProccessDuration: (value) => dispatch(setProccessDuration(value)),
  setUnreadNotiCount: (number) => dispatch(setUnreadNotiCount(number))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);






const renderUserPageDrawer = (component) => {
  let {
    showUserPage,
    userDetail,
  } = component.props

  return (
    <Drawer anchor="bottom" className="user-page-drawer" open={showUserPage} onClose={() => component.props.toggleUserPageDrawer(false)}>
      <UserPage userDetail={userDetail} />
    </Drawer>
  )
}

const renderMediaViewer = (component) => {
  let {
    showMediaViewerDrawer,
    mediaViewerFeature,
    mediaToView
  } = component.props
  let {
    isHideMediaHeadFoot,
    activeMeidaSlideIndex,
    activeItem
  } = component.state

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: current => component.setState({
      activeItem: mediaToView ? mediaToView[current ? current : 0] : null
    }),
    easing: "ease-in-out",
    infinite: true,
    initialSlide: mediaViewerFeature && mediaViewerFeature.activeIndex ? mediaViewerFeature && mediaViewerFeature.activeIndex : 0
  };

  if (!activeItem) {
    activeItem = mediaToView && mediaViewerFeature && mediaViewerFeature.activeIndex >= 0 ? mediaToView[mediaViewerFeature.activeIndex] : null
  }

  return (
    <Drawer anchor="bottom" className="media-viewer" open={showMediaViewerDrawer} onClose={() => component.props.toggleMediaViewerDrawer(false)}>
      <div className="viewer-content" >
        <div className={"viewer-header " + (isHideMediaHeadFoot ? "hide" : "")}>
          <IconButton onClick={() => {
            setTimeout(() => {
              component.setState({
                isHideMediaHeadFoot: false,
                activeItem: undefined
              })
            }, 1000);
            component.props.toggleMediaViewerDrawer(false)
          }}><CloseIcon /></IconButton>
          {
            mediaViewerFeature && mediaViewerFeature.actions ? <IconButton onClick={(e) => component.setState({ showMediaViewerMenu: true })}>
              <MoreVertIcon />
            </IconButton> : ""
          }
        </div>
        <div className="viewer-detail" >
          {
            mediaToView && mediaToView.length > 0 ? <Slider {...settings} >
              {
                mediaToView.map((item, index) => <div key={index}>
                  {
                    item.typeobject == 1 ? <img src={item.nameroot ? item.nameroot : item.name} /> : <div onClick={(e) => e.target != e.currentTarget ? component.setState({ isHideMediaHeadFoot: !isHideMediaHeadFoot }) : ""}>
                      <Player video={item} />
                    </div>
                  }
                </div>)
              }
            </Slider> : ""
          }
          <div className="overlay" onClick={(e) => e.target != e.currentTarget ? component.setState({ isHideMediaHeadFoot: !isHideMediaHeadFoot }) : ""}></div>
        </div>
        {
          mediaViewerFeature && mediaViewerFeature.showInfo ? <div className={"viewer-footer " + (isHideMediaHeadFoot ? "hide" : "")}>
            {
              activeItem ? <div className="footer-infor">
                <div className="user-info">
                  <span>{activeItem.userpost}</span>
                </div>
                <div className="post-content">
                  <pre>{activeItem.postcontent}</pre>
                </div>
                <div className="post-time">
                  <span>{fromNow(moment(activeItem.createdate), new Date)}</span>
                </div>
              </div> : ""
            }
            <div className="footer-reward">
              <ul>
                <li>
                  <img src={likeActive} />
                  <span>{mediaToView ? mediaToView.likeCount : 0}</span>
                </li>
                <li>
                  <span>{mediaToView ? mediaToView.commentCount : 0} bình luận</span>
                </li>
              </ul>
            </div>
            <div className="footer-action">
              <ul>
                <li>
                  <Button>
                    <img src={like1} />
                    <span>Thích</span>
                  </Button>
                </li>
                <li>
                  <Button>
                    <img src={comment} />
                    <span>Bình luận</span>
                  </Button>
                </li>
                <li>
                  <Button>
                    <img src={share} />
                    <span>Chia sẻ</span>
                  </Button>
                </li>
              </ul>
            </div>
          </div> : ""
        }
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
        {
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
        }
      </div>
    </Drawer>
  )
}

const renderGroupPrivacyMenuDrawer = (component) => {
  let {
    showGroupPrivacySelectOption
  } = component.state
  let groupPrivacyOptions = objToArray(GroupPrivacies)
  return (
    <Drawer anchor="bottom" className="img-select-option" open={showGroupPrivacySelectOption} onClose={() => component.setState({ showGroupPrivacySelectOption: false })}>
      <div className="option-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showGroupPrivacySelectOption: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Tác vụ</label>
      </div>
      <ul className="option-list">
        {
          groupPrivacyOptions.map((item, index) => <li key={index}>
            <Button onClick={() => component.setState({ groupPrivacy: item, showGroupPrivacySelectOption: false })}>{item.label}</Button>
          </li>)
        }
      </ul>
    </Drawer>
  )
}

const renderGroupInviteDrawer = (component) => {
  let {
    showGroupInviteDrawer,
  } = component.props

  return (
    <Drawer anchor="bottom" className="group-invite" open={showGroupInviteDrawer} onClose={() => component.props.toggleGroupInviteDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleGroupInviteDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Lời mời vào nhóm</label>
          </div>
        </div>
        <div className="filter"></div>
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
                    <span className="member-count">{group.members.length} thành viên</span>
                    <Button className="bt-submit">Chấp nhận</Button>
                    <Button className="bt-cancel">Từ chối</Button>
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

const renderCreateAlbumDrawer = (component) => {
  let {
    postPrivacy,
    albumName,
    description,
    isCreateAlbum
  } = component.state

  let {
    showCreateAlbumDrawer,
    profile
  } = component.props

  return (
    <Drawer anchor="bottom" className="create-album-drawer" open={showCreateAlbumDrawer} onClose={() => component.handleCloseCreateDrawer()}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.handleCloseCreateDrawer()}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>{profile ? profile.fullname : "Tạo album"}</label>
          </div>
          <Button onClick={() => component.createAlbum()}>Tạo</Button>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
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
            onChange={(e) => component.setState({ albumName: e.target.value, isChange: true })}
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
            onChange={(e) => component.setState({ description: e.target.value, isChange: true })}
          />
          <span className="privacy-sumbit" onClick={() => component.setState({ showAlbumPrivacySelectOption: true })}>
            <img src={postPrivacy.icon} />
            <span>
              <span>{postPrivacy.label}</span>
              <span>{postPrivacy.description}</span>
            </span>
          </span>
        </div>
      </div>
      {
        isCreateAlbum ? <Loader type="dask-mode" isFullScreen={true} /> : ""

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

const renderGroupDetailDrawer = (component) => {
  let {
    showGroupDetail,
    currentGroup
  } = component.props

  return (
    <Drawer anchor="bottom" className="group-detail" open={showGroupDetail}>
      {
        currentGroup ? <GroupDetail history={component.props.history} /> : ""
      }
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