import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleUserDetail,
  toggleUserHistory,
  toggleChangePasswordForm,
  toggleBlockFriendForm,
  toggleFriendsForBlockForm,
  toggleFriendDrawer,
  togglePostDrawer,
  toggleFooter,
  setMediaToViewer,
  toggleMediaViewerDrawer,
  toggleUserPageDrawer,
} from '../../actions/app'
import {
  setUserProfile,
  getFolowedMe,
  getMeFolowing
} from '../../actions/user'
import {
  setCurrenUserDetail
} from '../../actions/user'
import {
  PhotoCamera as PhotoCameraIcon,
  ChevronLeft as ChevronLeftIcon,
  MoreHoriz as MoreHorizIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Add as AddIcon
} from '@material-ui/icons'
import { connect } from 'react-redux'
import {
  IconButton,
  Drawer,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core";
import moment from 'moment'
import { signOut } from "../../auth";
import { renderVNDays } from '../../utils/app'
import UserInfo from '../profile-page/user-info'
import Experiendces from '../profile-page/experiences'
import Educaction from '../profile-page/education'
import Hoppies from '../profile-page/hoppies'
import SwipeableViews from 'react-swipeable-views';
import Dropzone from 'react-dropzone'
import MultiInput from '../common/multi-input'
import Loader from '../common/loader'
import 'react-image-crop/lib/ReactCrop.scss';
import Cropper from '../common/cropper'
import { postFormData, get, post } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { showNotification, objToQuery, jsonFromUrlParams } from "../../utils/common";
import { signIn } from '../../auth'

const noti = require('../../assets/icon/NotiBw@1x.png')
const profileBw = require('../../assets/icon/ProfileBW.png')
const settingBw = require('../../assets/icon/seting@1x.png')
const home = require('../../assets/icon/home1@1x.png')
const coin = require('../../assets/icon/Coins_Y.png')
const like = require('../../assets/icon/like@1x.png')
const follower = require('../../assets/icon/Follower@1x.png')
const birthday = require('../../assets/icon/Birthday.png')
const sex = require('../../assets/icon/Sex.png')
const education = require('../../assets/icon/Education.png')
const job = require('../../assets/icon/job@1x.png')
const donePractice = require('../../assets/icon/DonePractive@1x.png')
const search = require('../../assets/icon/Find@1x.png')
const Lesson = require('../../assets/icon/Lesson.png')
const Video = require('../../assets/icon/Video.png')
const Group1 = require('../../assets/icon/Group1@1x.png')
const NotiBw = require('../../assets/icon/NotiBw@1x.png')
const Profile = require('../../assets/icon/Profile.png')




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
      openUploadAvatarReview: false,
      openCropperDrawer: false,
      isProccessing: false,
      historyPointCurrentPage: 0,
      oldPassForChange: "",
      newPassForChange: "",
      confirmPassForChange: "",
      crop: {
        unit: '%',
        width: 100,
        height: 100
        // aspect: 16 / 16,
      },
    };
  }

  onSelectAvatarFile = files => {
    this.setState({
      rootAvatarToUpload: files[0]
    })
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({
          src: reader.result,
          openUploadAvatarReview: true,
          openCropperDrawer: true
        })
      );
      reader.readAsDataURL(files[0]);
    }
  };



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
          formData.append("image_1_" + avatarToUpload.width + "_" + avatarToUpload.height, avatarFileToUpload)
        } else {
          formData.append("image_1_" + img.width + "_" + img.height, rootAvatarToUpload)
        }

        formData.append("content", postContent)
        formData.append("imageroot_0_" + img.width + "_" + img.height, rootAvatarToUpload)


        postFormData(SOCIAL_NET_WORK_API, "User/UpdateAvatar", formData, result => {
          that.getProfile()
          that.setState({
            openCropperDrawer: false,
            openUploadAvatarReview: false,
            isReviewMode: false,
            isProccessing: false
          })
        })
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(rootAvatarToUpload);
  }

  onSelectBackgroundFile = files => {
    this.setState({
      rootBackgroundToUpload: files[0]
    })
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({
          backgroundSrc: reader.result,
          openUploadBackgroundReview: true,
          openBackgroundCropperDrawer: true
        })
      );
      reader.readAsDataURL(files[0]);
    }
  };

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
          formData.append("image_1_" + backgroundToUpload.width + "_" + backgroundToUpload.height, backgroundFileToUpload)
        } else {
          formData.append("image_1_" + img.width + "_" + img.height, rootBackgroundToUpload)
        }

        formData.append("content", "")
        formData.append("imageroot_0_" + img.width + "_" + img.height, rootBackgroundToUpload)


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
  getHistoryPoint() {
    let {
      historyPointCurrentPage
    } = this.state
    let param = {
      currentpage: historyPointCurrentPage,
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      limit: 20
    }
    get(SOCIAL_NET_WORK_API, "User/GetHistoryPoint" + objToQuery(param), result => {
      console.log("User/GetHistoryPoint", result)
      if (result.staus == 1) {
        this.setState({
          historyPoints: result.content.histories
        })
      }
    })
  }

  changePassword() {
    let {
      oldPassForChange,
      newPassForChange,
      confirmPassForChange
    } = this.state
    if (!oldPassForChange || oldPassForChange == "") {
      showNotification("", <span className="app-noti-message">Vui lòng nhập mật khẩu hiện tại.</span>, null)
      return
    }
    if (oldPassForChange && oldPassForChange.length < 6 || oldPassForChange && oldPassForChange.length > 25) {
      showNotification("", <span className="app-noti-message">Vui lòng nhập mật khẩu có độ dài từ 6 đến 25 ký tự.</span>, null)
      return
    }
    if (!newPassForChange || newPassForChange == "") {
      showNotification("", <span className="app-noti-message">Vui lòng nhập mật khẩu mới.</span>, null)
      return
    }
    if (newPassForChange && newPassForChange.length < 6 || newPassForChange && newPassForChange.length > 25) {
      showNotification("", <span className="app-noti-message">Vui lòng nhập mật khẩu có độ dài từ 6 đến 25 ký tự.</span>, null)
      return
    }
    if (confirmPassForChange != newPassForChange) {
      showNotification("", <span className="app-noti-message">Mật khẩu xác nhận không trùng khớp.</span>, null)
      return
    }
    let param = {
      oldpassword: oldPassForChange,
      newpassword: newPassForChange,
      // socialtoken: string
    }
    this.setState({
      isProccessing: true
    })
    post(SOCIAL_NET_WORK_API, "User/ChangePasswordUser", param, (result) => {
      if (result.result == 1) {
        console.log("result", result)
        let { profile } = this.props
        let loginParam = {
          phone: profile.phone,
          password: newPassForChange
        }
        post(SOCIAL_NET_WORK_API, "Login/Index", loginParam, (result) => {
          if (result.result == 1) {
            signIn({
              comunityAccessToken: result.content.myToken,
              skillAccessToken: result.content.myTokenTraining,
              careerGuidanceAccessToken: result.content.myTokenBuildYS
            });
            this.props.toggleChangePasswordForm(false)

            this.setState({
              isProccessing: false,
              oldPassForChange: "",
              newPassForChange: "",
              confirmPassForChange: ""
            })
          }
        })
      } else {
        showNotification("", <span className="app-noti-message">{result.message}</span>, null)
        this.setState({
          isProccessing: false,
        })
      }
    })
  }

  componentWillMount() {
    this.props.addFooterContent(renderFooter(this))
    this.props.addHeaderContent(renderHeader(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  componentDidMount() {

    let searchParam = jsonFromUrlParams(window.location.search)
    if (searchParam && searchParam.setting == "true") {
      this.setState({
        showUserMenu: true
      })
    }

  }
  render() {
    let {
      showUserMenu,
      croppedImageUrl
    } = this.state
    let {
      profile
    } = this.props
    return (
      profile ? <div className="setting-page" >
        <div className="user-menu">
          <ul className="menu-list">
            <li>
              <Button onClick={() => this.setState({ showUpdateProfile: true })}>Cập nhật thông tin cá nhân</Button>
            </li>
            <li>
              <Button onClick={() => {
                this.props.setCurrenUserDetail(data)
                this.props.toggleUserHistory(true)
                this.getHistoryPoint()
              }}>Lịch sử tích điểm</Button>
            </li>
            <li>
              <Button onClick={() => {
                this.props.toggleChangePasswordForm(true)
              }}>Đổi mật khẩu</Button>
            </li>
            <li>
              <Button onClick={() => this.props.toggleBlockFriendForm(true)}>Danh sách chặn</Button>
            </li>
            <li className="sign-out">
              <Button style={{ background: "#ff5a59" }} onClick={() => signOut()}>Đăng xuất tài khoản</Button>
            </li>
          </ul>
        </div>

        {
          renderUserMenuDrawer(this)
        }
        {
          renderUpdateProfileDrawer(this)
        }
        {
          renderUserHistoryDrawer(this)
        }
        {
          renderChangePasswordDrawer(this)
        }
        {
          renderBlockFriendDrawer(this)
        }
        {
          renderFriendsForBlockDrawer(this)
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
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleUserHistory: (isShow) => dispatch(toggleUserHistory(isShow)),
  toggleChangePasswordForm: (isShow) => dispatch(toggleChangePasswordForm(isShow)),
  toggleBlockFriendForm: (isShow) => dispatch(toggleBlockFriendForm(isShow)),
  toggleFriendsForBlockForm: (isShow) => dispatch(toggleFriendsForBlockForm(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
  getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);






































const renderHeader = () => {
  return (
    <div className="app-header">
      <label>Cài đặt</label>
    </div>
  )
}



const renderFooter = (component) => {
  let pathName = window.location.pathname
  return (
    pathName == "/communiti-profile" ? <div className="app-footer">
      <ul>
        <li onClick={() => component.props.history.replace('/community')}>
          <img src={Lesson}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => component.props.history.replace('/videos')}>
          <img src={Video}></img>
          <span >Video</span>
        </li>
        <li onClick={() => component.props.history.replace('/groups')}>
          <img src={Group1}></img>
          <span>Nhóm</span>
        </li>
        <li onClick={() => component.props.history.replace('/community-noti')}>
          <img src={NotiBw}></img>
          <span>Thông báo</span>
        </li>
        <li onClick={() => component.props.history.replace('/communiti-profile')}>
          <img src={Profile}></img>
          <span style={{ color: "#f54746" }}>Cá nhân</span>
        </li>
      </ul>
    </div> : <div className="app-footer">
        <ul>
          <li onClick={() => component.props.history.replace('/')}>
            <img src={home}></img>
            <span >Trang chủ</span>
          </li>
          {/* <li onClick={() => component.props.history.replace('/yoot-noti')}>
            <img src={noti}></img>
            <span >Thông báo</span>
          </li> */}
          <li onClick={() => component.props.history.replace('/profile')}>
            <img src={profileBw}></img>
            <span >Cá nhân</span>
          </li>
          <li >
            <img src={settingBw}></img>
            <span style={{ color: "#f54746" }}>Cài đặt</span>
          </li>
        </ul>
      </div>
  )
}

const renderUserMenuDrawer = (component) => {
  let {
    showUserMenu
  } = component.state
  return (
    <Drawer anchor="right" className="user-menu" open={showUserMenu} onClose={() => component.setState({ showUserMenu: false })}>
      <div className="menu-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showUserMenu: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Quản lý tài khoản</label>
      </div>
      <ul className="menu-list">
        <li>
          <Button onClick={() => component.setState({ showUpdateProfile: true })}>Cập nhật thông tin cá nhân</Button>
        </li>
        <li>
          <Button onClick={() => {
            component.props.setCurrenUserDetail(data)
            component.props.toggleUserHistory(true)
            component.getHistoryPoint()
          }}>Lịch sử tích điểm</Button>
        </li>
        <li>
          <Button onClick={() => {
            component.props.toggleChangePasswordForm(true)
          }}>Đổi mật khẩu</Button>
        </li>
        <li>
          <Button onClick={() => component.props.toggleBlockFriendForm(true)}>Danh sách chặn</Button>
        </li>
        <li className="sign-out">
          <Button style={{ background: "#ff5a59" }} onClick={() => signOut()}>Đăng xuất tài khoản</Button>
        </li>
      </ul>
    </Drawer>
  )
}


const renderUpdateProfileDrawer = (component) => {
  let {
    showUpdateProfile
  } = component.state
  let {
    profile
  } = component.props
  return (
    <Drawer anchor="bottom" className="update-profile-form" open={showUpdateProfile} onClose={() => component.setState({ showUpdateProfile: false })}>
      <div className="form-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showUpdateProfile: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Cập nhật thông tin</label>
      </div>
      <div className="content-form">
        <UserInfo data={profile} />
        <Experiendces data={profile} />
        <Educaction data={profile} />
        <Hoppies data={profile} />
      </div>
    </Drawer>
  )
}


const renderUserHistoryDrawer = (component) => {
  let {
    showUserHistory,
    userDetail
  } = component.props
  return (
    <Drawer anchor="right" open={showUserHistory} onClose={() => component.props.toggleUserHistory(false)}>
      {
        userDetail ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleUserHistory(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Lịch sử tích điểm</label>
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
          <div style={{ overflow: "scroll", width: "100vw" }}>
            <ul className="user-history">
              <li>
                <div className="date"><span>{renderVNDays(new Date)}, {moment(new Date).format("DD-MM-YYYY")}</span></div>
                <div className="list">
                  <label><PlayArrowIcon /> Cộng đồng</label>
                  <ul>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                  </ul>
                </div>
                <div className="list">
                  <label><PlayArrowIcon /> Kỹ năng</label>
                </div>
                <div className="total">
                  <span>Tổng điểm / ngày</span>
                  <span>600 <img src={coin} /></span>
                </div>
              </li>
              <li>
                <div className="date"><span>{renderVNDays(new Date)}, {moment(new Date).format("DD-MM-YYYY")}</span></div>
                <div className="list">
                  <label><PlayArrowIcon /> Cộng đồng</label>
                  <ul>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                  </ul>
                </div>
                <div className="list">
                  <label><PlayArrowIcon /> Kỹ năng</label>
                </div>
                <div className="total">
                  <span>Tổng điểm / ngày</span>
                  <span>600 <img src={coin} /></span>
                </div>
              </li>
            </ul>
          </div>
        </div> : ""
      }
    </Drawer>
  )
}

const renderChangePasswordDrawer = (component) => {
  let {
    showChangePasswordForm
  } = component.props
  let {
    isShowOldPass,
    isShowNewPass,
    isShowConfirmPass,
    oldPassForChange,
    newPassForChange,
    confirmPassForChange,
    isProccessing
  } = component.state
  return (
    <Drawer anchor="right" open={showChangePasswordForm} onClose={() => component.props.toggleChangePasswordForm(false)}>
      <div className="drawer-detail change-pass-form">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleChangePasswordForm(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Đổi mật khẩu</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
          <div>
            <TextField
              className="custom-input"
              variant="outlined"
              placeholder="Mật khẩu hiện tại"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              type={isShowOldPass ? "text" : "password"}
              value={oldPassForChange}
              onChange={e => component.setState({ oldPassForChange: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => component.setState({ isShowOldPass: !isShowOldPass })}>
                      {
                        isShowOldPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className="custom-input"
              variant="outlined"
              placeholder="Mật khẩu mới"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              type={isShowNewPass ? "text" : "password"}
              value={newPassForChange}
              onChange={e => component.setState({ newPassForChange: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => component.setState({ isShowNewPass: !isShowNewPass })}>
                      {
                        isShowNewPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className="custom-input"
              variant="outlined"
              placeholder="Nhập lại mật khẩu mới"
              style={{
                width: "100%",
                marginBottom: "50px"
              }}
              type={isShowConfirmPass ? "text" : "password"}
              value={confirmPassForChange}
              onChange={e => component.setState({ confirmPassForChange: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => component.setState({ isShowConfirmPass: !isShowConfirmPass })}>
                      {
                        isShowConfirmPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" className={"bt-submit"} onClick={() => component.changePassword()}>Lưu thông tin</Button>
            <Button variant="contained" className={"bt-cancel"} onClick={() => component.setState({
              oldPassForChange: "",
              newPassForChange: "",
              confirmPassForChange: ""
            }, () => component.props.toggleChangePasswordForm(false))}>Huỷ</Button>
          </div>
        </div>
      </div>
      {
        isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
      }
    </Drawer>
  )
}

const renderBlockFriendDrawer = (component) => {
  let {
    showBlockFriendForm
  } = component.props
  return (
    <Drawer anchor="right" open={showBlockFriendForm} onClose={() => component.props.toggleBlockFriendForm(false)}>
      <div className="drawer-detail block-friend-form">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleBlockFriendForm(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Danh sách chặn</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
          <p>Bạn và người bị chặn sẽ không thể nhìn thấy nhau. Nếu bạn bỏ chặn người này có thể xem dòng thời gian của bạn hoặc liên hệ với bạn.</p>
          <div className="add-bt" onClick={() => component.props.toggleFriendsForBlockForm(true)}>
            <AddCircleOutlineIcon />
            <span>Thêm vào danh sách chặn</span>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderFriendsForBlockDrawer = (component) => {
  let {
    searchKey
  } = component.state
  let {
    showFriendsForBlockForm
  } = component.props
  return (
    <Drawer anchor="right" open={showFriendsForBlockForm} onClose={() => component.props.toggleFriendsForBlockForm(false)}>
      <div className="drawer-detail friends-for-block-form">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleFriendsForBlockForm(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tìm kiếm bạn bè</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
          <TextField
            className="custom-input"
            variant="outlined"
            placeholder="Tìm kiếm"
            className="search-box"
            style={{
              width: "100%",
              margin: "10px 0px",
            }}
            value={searchKey}
            onChange={e => component.setState({ searchKey: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
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


const data = {
  coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
  fullName: "hoang hai long",
  point: 20,
  liked: 1231,
  folow: 221,
  posted: 2533,
  birthday: new Date(),
  gender: "Nam",
  friends: [
    {
      coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
      fullName: "Nguyễn Thị Vân Anh 1",
      point: 111,
      liked: 111,
      folow: 111,
      posted: 111,
      birthday: new Date(),
      gender: "Nam",
      friends: [
        {
          coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
          avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
          fullName: "Nguyễn Thị Vân Anh 11",
          point: 111,
          liked: 111,
          folow: 111,
          posted: 111,
          birthday: new Date(),
          gender: "Nam",
          friends: [

          ],
          folowing: [
            {
              avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
              fullName: "Apple Ánh"
            },
            {
              avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
              fullName: "Võ Gia Huy"
            },
            {
              avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
              fullName: "Quynh"
            }
          ],
          folowed: [
            {
              avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
              fullName: "Võ Gia Huy"
            },
            {
              avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
              fullName: "Apple Ánh"
            },
            {
              avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
              fullName: "Quynh"
            }
          ],
          jobs: [
            {
              position: "Nhân viên Thiết kế",
              company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
              description: "Không có mô tả",
              start: "10/20/2019",
              end: "10/20/2020"
            }
          ],
          studies: [
            {
              majors: "Nhân viên Thiết kế",
              school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
              className: "D15_MT3DH",
              graduate: "Khá",
              masv: "DH12283",
              start: "1999",
              end: "2004",
              isFinish: true
            }
          ],
          address: "33 Kinh Dương Vương, Bình Chánh, HCM",
          email: "btcvn07@gmail.com",
          skills: ["Quản lý thời gian", "Lãnh đạo"],
          hopies: "Ca hát, thể thao",
          orderSkills: "Ca hát",
          mutualFriendCount: 2

        }

      ],
      folowing: [
        {
          avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
          fullName: "Apple Ánh"
        },
        {
          avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
          fullName: "Võ Gia Huy"
        },
        {
          avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
          fullName: "Quynh"
        }
      ],
      folowed: [
        {
          avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
          fullName: "Võ Gia Huy"
        },
        {
          avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
          fullName: "Apple Ánh"
        },
        {
          avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
          fullName: "Quynh"
        }
      ],
      jobs: [
        {
          position: "Nhân viên Thiết kế",
          company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
          description: "Không có mô tả",
          start: "10/20/2019",
          end: "10/20/2020"
        }
      ],
      studies: [
        {
          majors: "Nhân viên Thiết kế",
          school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
          className: "D15_MT3DH",
          graduate: "Khá",
          masv: "DH12283",
          start: "1999",
          end: "2004",
          isFinish: true
        }
      ],
      address: "33 Kinh Dương Vương, Bình Chánh, HCM",
      email: "btcvn07@gmail.com",
      skills: ["Quản lý thời gian", "Lãnh đạo"],
      hopies: "Ca hát, thể thao",
      orderSkills: "Ca hát",
      mutualFriendCount: 2
    },
    {
      coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
      fullName: "Nguyễn Thị Vân Anh 2",
      point: 222,
      liked: 222,
      folow: 222,
      posted: 222,
      birthday: new Date(),
      gender: "Nam",
      friends: [

      ],
      folowing: [
        {
          avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
          fullName: "Apple Ánh"
        },
        {
          avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
          fullName: "Võ Gia Huy"
        },
        {
          avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
          fullName: "Quynh"
        }
      ],
      folowed: [
        {
          avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
          fullName: "Võ Gia Huy"
        },
        {
          avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
          fullName: "Apple Ánh"
        },
        {
          avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
          fullName: "Quynh"
        }
      ],
      jobs: [
        {
          position: "Nhân viên Thiết kế",
          company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
          description: "Không có mô tả",
          start: "10/20/2019",
          end: "10/20/2020"
        }
      ],
      studies: [
        {
          majors: "Nhân viên Thiết kế",
          school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
          className: "D15_MT3DH",
          graduate: "Khá",
          masv: "DH12283",
          start: "1999",
          end: "2004",
          isFinish: true
        }
      ],
      address: "33 Kinh Dương Vương, Bình Chánh, HCM",
      email: "btcvn07@gmail.com",
      skills: ["Quản lý thời gian", "Lãnh đạo"],
      hopies: "Ca hát, thể thao",
      orderSkills: "Ca hát",
      mutualFriendCount: 20
    }
  ],
  folowing: [
    {
      avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
      fullName: "Apple Ánh"
    },
    {
      avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
      fullName: "Võ Gia Huy"
    },
    {
      avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
      fullName: "Quynh"
    }
  ],
  folowed: [
    {
      avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
      fullName: "Võ Gia Huy"
    },
    {
      avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
      fullName: "Apple Ánh"
    },
    {
      avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
      fullName: "Quynh"
    }
  ],
  jobs: [
    {
      position: "Nhân viên Thiết kế",
      company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
      description: "Không có mô tả",
      start: "10/20/2019",
      end: "10/20/2020"
    }
  ],
  studies: [
    {
      majors: "Nhân viên Thiết kế",
      school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
      className: "D15_MT3DH",
      graduate: "Khá",
      masv: "DH12283",
      start: "1999",
      end: "2004",
      isFinish: true
    }
  ],
  address: "33 Kinh Dương Vương, Bình Chánh, HCM",
  email: "btcvn07@gmail.com",
  skills: ["Quản lý thời gian", "Lãnh đạo"],
  hopies: "Ca hát, thể thao",
  orderSkills: "Ca hát"
}