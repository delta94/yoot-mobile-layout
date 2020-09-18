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
  toggleUserPageDrawer
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
import UserInfo from './user-info'
import Experiendces from './experiences'
import Educaction from './education'
import Hoppies from './hoppies'
import SwipeableViews from 'react-swipeable-views';
import Dropzone from 'react-dropzone'
import MultiInput from '../common/multi-input'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import Cropper from '../common/cropper'
import { postFormData, get } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { showNotification } from "../../utils/common";

const noti = require('../../assets/icon/NotiBw@1x.png')
const profileBw = require('../../assets/icon/Profile.png')
const settingBw = require('../../assets/icon/seting1@1x.png')
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
const uploadImage = require('../../assets/icon/upload_image.png')
const uploadVideo = require('../../assets/icon/upload_video.png')
const defaultImage = "https://dapp.dblog.org/img/default.jpg"
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
      crop: {
        unit: '%',
        width: 100,
        aspect: 16 / 16,
      },
    };
  }

  onSelectFile = files => {
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
      rootAvatarToUpload
    } = this.state
    var fr = new FileReader;
    fr.onload = function () {
      var img = new Image;
      img.onload = function () {
        const formData = new FormData();

        let avatarFileToUpload = new File(
          [avatarToUpload.file],
          avatarToUpload.file.name,
          {
            type: avatarToUpload.file.type,
            lastModified: new Date
          }
        )


        console.log("rootAvatarToUpload", rootAvatarToUpload)
        console.log("avatarToUpload", avatarFileToUpload)

        formData.append("content", "")
        formData.append("imageroot_0_" + img.width + "_" + img.height, rootAvatarToUpload)
        formData.append("image_1_" + avatarToUpload.width + "_" + avatarToUpload.height, avatarToUpload.file)

        postFormData(SOCIAL_NET_WORK_API, "User/UpdateAvatar", formData, result => {
          if (result && result.result == 1) {
            this.getProfile()
          }
        })
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(rootAvatarToUpload);


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

  componentWillMount() {
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(false)
    this.props.toggleFooter(true)
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
      profile ? <div className="profile-page" >
        <div className="cover-img" style={{ background: "url(" + profile.avatar + ")" }}>
          <Dropzone onDrop={acceptedFiles => { this.setState({ imageSelected: acceptedFiles }) }}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                  <PhotoCameraIcon style={{ color: "#ff5a59", width: "20px", height: "20px" }} />
                </IconButton>
              </div>
            )}
          </Dropzone>

        </div>

        <div className="user-avatar" style={{ background: "url(" + profile.avatar + ")" }}>
          <Dropzone onDrop={acceptedFiles => this.onSelectFile(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                <IconButton style={{ background: "rgba(240,240,240,0.9)", padding: "8px" }}>
                  <PhotoCameraIcon style={{ color: "#ff5a59", width: "20px", height: "20px" }} />
                </IconButton>
              </div>
            )}
          </Dropzone>

        </div>

        <div className="user-info">
          <span className="user-name">{profile.fullname}</span>
          <span className="point">
            <span>Điểm YOOT: {profile.mempoint}</span>
            <img src={coin} />
          </span>
          <IconButton style={{ background: "rgba(0,0,0,0.07)" }} onClick={() => this.setState({ showUserMenu: true })}>
            <MoreHorizIcon />
          </IconButton>
        </div>

        <div className="react-reward">
          <ul>
            <li>
              <span><img src={like}></img></span>
              <span>{profile.numlike}</span>
            </li>
            <li>
              <span><img src={follower}></img></span>
              <span>{profile.isfollowme}</span>
            </li>
            <li>
              <span><img src={donePractice}></img></span>
              <span>{profile.numpost}</span>
            </li>
          </ul>
        </div>

        <div className="user-profile">
          <ul>
            {
              profile.userExperience && profile.userExperience.length > 0 ? <li>
                <img src={job} />
                <span className="title" >Từng làm <b>{profile.userExperience[0].title}</b> tại <b>{profile.userExperience[0].companyname}</b></span>
              </li> : ""
            }
            {
              profile.userStudyGraduation && profile.userStudyGraduation.length > 0 ? <li>
                <img src={education} />
                <span className="title" >Từng học <b>{profile.userStudyGraduation[0].specialized}</b> tại <b>{profile.userStudyGraduation[0].schoolname}</b></span>
              </li> : ""
            }
            {
              profile.birthday ? <li>
                <img src={birthday} />
                <span className="title" >Ngày sinh <b>{moment(profile.birthday).format("DD/MM/YYYY")}</b></span>
              </li> : ""
            }
            {
              profile.gendertext ? <li>
                <img src={sex} />
                <span className="title">Giới tính <b>{profile.gendertext}</b></span>
              </li> : ""
            }
          </ul>
          <span className="view-detail-link" onClick={() => {
            this.props.setCurrenUserDetail(data)
            this.props.toggleUserDetail(true)
          }}>{">>> Xem thêm thông tin của"} {profile.fullname}</span>
        </div>

        <Button className="update-button" style={{ background: "#f44645" }} onClick={() => this.setState({ showUpdateProfile: true })}>Cập nhật thông tin cá nhân</Button>

        <div className="friend-reward">
          <label>Bạn bè</label>
          <span>{data.friends.length} người bạn</span>
          <div className="friend-list">
            {
              data.friends.map((item, index) => <div key={index} className="friend-item" onClick={() => {
                this.props.setCurrenUserDetail(item)
                this.props.toggleUserPageDrawer(true)
              }}>
                <div className="avatar" style={{ background: "url(" + item.avatar + ")" }}></div>
                <span className="name">{item.fullName}</span>
              </div>)
            }
          </div>
          <div className="search-friend" onClick={() => this.props.toggleFriendDrawer(true)}>
            <img src={search}></img>
            <span>Tìm bạn bè</span>
          </div>
        </div>

        <div className="post-bt" onClick={() => this.props.togglePostDrawer(true)}>
          <Avatar aria-label="recipe" className="avatar">
            <img src={data.avatar} style={{ width: "100%" }} />
          </Avatar>
          <span>Bạn viết gì đi...</span>
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
        {
          renderMediaDrawer(this)
        }
        {
          renderVideoDrawer(this)
        }
        {
          renderUpdateAvatarReviewDrawer(this)
        }
        {
          renderCropperDrawer(this)
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
  getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);










































const renderFooter = (history) => {
  let pathName = window.location.pathname
  return (
    pathName == "/communiti-profile" ? <div className="app-footer">
      <ul>
        <li onClick={() => history.replace('/community')}>
          <img src={Lesson}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => history.replace('/videos')}>
          <img src={Video}></img>
          <span >Video</span>
        </li>
        <li onClick={() => history.replace('/groups')}>
          <img src={Group1}></img>
          <span>Nhóm</span>
        </li>
        <li onClick={() => history.replace('/community-noti')}>
          <img src={NotiBw}></img>
          <span>Thông báo</span>
        </li>
        <li onClick={() => history.replace('/communiti-profile')}>
          <img src={Profile}></img>
          <span style={{ color: "#f54746" }}>Cá nhân</span>
        </li>
      </ul>
    </div> : <div className="app-footer">
        <ul>
          <li onClick={() => history.replace('/')}>
            <img src={home}></img>
            <span >Trang chủ</span>
          </li>
          {/* <li onClick={() => history.replace('/yoot-noti')}>
            <img src={noti}></img>
            <span >Thông báo</span>
          </li> */}
          <li>
            <img src={profileBw}></img>
            <span style={{ color: "#f54746" }}>Cá nhân</span>
          </li>
          <li onClick={() => history.replace('/setting')}>
            <img src={settingBw}></img>
            <span>Cài đặt</span>
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
        {/* <Experiendces data={profile} />
        <Educaction data={profile} />
        <Hoppies data={profile} /> */}
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
    isShowConfirmPass
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
              variant="outlined"
              placeholder="Mật khẩu hiện tại"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              type={isShowOldPass ? "text" : "password"}
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
              variant="outlined"
              placeholder="Mật khẩu mới"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              type={isShowNewPass ? "text" : "password"}
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
              variant="outlined"
              placeholder="Nhập lại mật khẩu mới"
              style={{
                width: "100%",
                marginBottom: "50px"
              }}
              type={isShowConfirmPass ? "text" : "password"}
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
            <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
            <Button variant="contained" className={"bt-cancel"}>Huỷ</Button>
          </div>
        </div>
      </div>
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

const renderMediaDrawer = (component) => {
  let {
    openMediaDrawer,
    mediaTabIndex
  } = component.state
  let {
    profile
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
        profile ? <div className="drawer-detail media-drawer">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.setState({ openMediaDrawer: false })}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Album của {profile.fullName}</label>
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
    profile
  } = component.props
  return (
    <Drawer anchor="bottom" open={openVideoDrawer} onClose={() => component.setState({ openVideoDrawer: false })}>
      {
        profile ? <div className="drawer-detail media-drawer">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.setState({ openVideoDrawer: false })}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Video của {profile.fullName}</label>
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

const renderUpdateAvatarReviewDrawer = (component) => {
  let {
    openUploadAvatarReview,
    postContent,
    isReviewMode,
    avatarToUpload
  } = component.state
  let {
    profile
  } = component.props
  return (
    <Drawer anchor="bottom" className="update-avatar-review-drawer" open={openUploadAvatarReview} onClose={() => component.setState({ openUploadAvatarReview: false })}>
      <div className="drawer-detail media-drawer">
        <div className="drawer-header">
          <div className="direction" onClick={() => isReviewMode == false ? component.setState({ openUploadAvatarReview: false }) : component.setState({ openCropperDrawer: true, avatarToUpload: null, isReviewMode: false })}>
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
              placeholder="Nhập nội dung"
              onChange={(value) => component.setState({ postContent: value })} />
          </div>
          <div className="profile-page" >
            <div className="cover-img" style={{ background: "url(" + profile.avatar + ")" }}>
            </div>
            <div className="user-avatar" style={{ background: "url(" + (avatarToUpload && avatarToUpload.file ? URL.createObjectURL(avatarToUpload.file) : profile.avatar) + ")" }}>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderCropperDrawer = (component) => {
  let {
    openCropperDrawer,
    crop,
    src,
    croppedImage
  } = component.state
  return (
    <Drawer anchor="bottom" className="cropper-drawer" open={openCropperDrawer} onClose={() => component.setState({ openCropperDrawer: false })}>
      {
        src ? <div className="drawer-detail">
          <div className="drawer-content" style={{ overflow: "scroll", background: "#f2f3f7" }}>
            <Cropper
              src={src}
              crop={crop}
              onCropped={(file) => component.setState({ croppedImage: file })}
            />
          </div>
          <div className="footer-drawer">
            <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
            <div>
              <Button onClick={() => component.setState({ openCropperDrawer: false, avatarToUpload: croppedImage })}>Huỷ</Button>
              <Button onClick={() => component.setState({ openCropperDrawer: false, isReviewMode: true, avatarToUpload: croppedImage })}>Chế độ xem trước</Button>
              <Button>Đăng bài</Button>
            </div>
          </div>

        </div> : ""
      }
    </Drawer >
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