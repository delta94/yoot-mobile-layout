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
  toggleSeachFriends,
  setCurrentFriendId
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
import Loader from '../common/loader'
import 'react-image-crop/lib/ReactCrop.scss';
import Cropper from '../common/cropper'
import { postFormData, get, post } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { showNotification, objToQuery, jsonFromUrlParams } from "../../utils/common";
import { signIn } from '../../auth'
import $ from 'jquery'

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
      isProccessing: false,
      historyPointCurrentPage: 0,
      oldPassForChange: "",
      newPassForChange: "",
      confirmPassForChange: "",
      numOfFriend: 0,
      isEndOfList: false,
      historyPoints: [],
      crop: {
        unit: '%',
        width: 100,
        height: 100
        // aspect: 16 / 16,
      },
      friends: [],
      rejectFriends: [],
      rejectFriendsCurrentPage: 0,
      isEndOfRejectFriends: false,
      isLoadMore: false,
      friendsCurrentPage: 0,
      isEndOfFriends: false,
      searchKey: ""
    };
  }

  getRejectFriends(userId, currentpage) {
    let {
      rejectFriends
    } = this.state
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      limit: 20,
      status: "Reject",
      forFriendId: userId,
      groupid: 0
    }
    this.setState({
      isLoadMore: true
    })
    get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
      if (result.result == 1) {
        this.setState({
          rejectFriends: rejectFriends.concat(result.content.userInvites),
          isLoadMore: false
        })
        if (result.content.userInvites.length == 0) {
          this.setState({
            isEndOfRejectFriends: true
          })
        }
      }
    })
  }

  addFriend(friendId) {
    let {
      suggestFriends,
      waitings,
      allUsers
    } = this.state
    let param = {
      friendid: friendId
    }
    get(SOCIAL_NET_WORK_API, "Friends/AddOrDeleteInviateFriends" + objToQuery(param), (result) => {
      if (result && result.result == 1) {
        allUsers.map((user) => {
          if (user.friendid == friendId) {
            user.status = user.status == 1 ? 0 : 1
          }
        })
        this.setState({
          suggestFriends: suggestFriends.filter(friend => friend.friendid != friendId),
          waitings: waitings.filter(friend => friend.friendid != friendId),
          allUsers: allUsers
        })
      }
    })
  }
  removeSuggest(friendId) {
    let {
      suggestFriends
    } = this.state
    this.setState({
      suggestFriends: suggestFriends.filter(friend => friend.friendid != friendId)
    })
  }

  acceptFriend(friend) {
    let {
      queues,
      friends
    } = this.state
    let param = {
      friendid: friend.friendid
    }
    if (!friend) return
    get(SOCIAL_NET_WORK_API, "Friends/AcceptFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          queues: queues.filter(friend => friend.friendid != friend.friendid),
          friends: [friend].concat(friends)
        })
      }
    })
  }

  removeFriend(friendid) {
    let {
      friends,
      allUsers
    } = this.state
    let param = {
      friendid: friendid
    }
    if (!friendid) return
    get(SOCIAL_NET_WORK_API, "Friends/RemoveFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          friends: friends.filter(friend => friend.friendid != friendid),
          allUsers: allUsers.filter(friend => friend.friendid != friendid),
          showFriendActionsDrawer: false
        })
      }
    })
  }

  bandFriend(friendid) {
    let {
      friends,
      allUsers,
    } = this.state
    let param = {
      friendid: friendid
    }
    if (!friendid) return
    get(SOCIAL_NET_WORK_API, "Friends/BandFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          friends: friends.filter(friend => friend.friendid != friendid),
          showFriendActionsDrawer: false,
          rejectFriends: [],
          isEndOfRejectFriends: false,
          rejectFriendsCurrentPage: 0
        })
        this.getRejectFriends(0, 0)
      }
    })
  }

  unBandFriend(friendid) {
    let {
      rejectFriends
    } = this.state
    let param = {
      friendid: friendid
    }
    if (!friendid) return
    get(SOCIAL_NET_WORK_API, "Friends/RemoveBandFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          rejectFriends: rejectFriends.filter(friend => friend.friendid != friendid),
          showFriendActionsDrawer: false
        })
      }
    })
  }

  unFolowFriend(friendid) {
    let {
      friends,
      allUsers
    } = this.state
    let param = {
      friendid: friendid
    }
    if (!friendid) return
    get(SOCIAL_NET_WORK_API, "Friends/UnFollowFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        friends.map(friend => {
          if (friend.friendid == friendid) friend.ismefollow = 0
        })
        this.setState({
          friends: friends,
          allUsers: allUsers,
          showFriendActionsDrawer: false
        })
      }
    })
  }

  folowFriend(friendid) {
    let {
      friends,
      allUsers
    } = this.state
    let param = {
      friendid: friendid
    }
    if (!friendid) return
    get(SOCIAL_NET_WORK_API, "Friends/FollowFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        friends.map(friend => {
          if (friend.friendid == friendid) friend.ismefollow = 1
        })
        this.setState({
          friends: friends,
          allUsers: allUsers,
          showFriendActionsDrawer: false
        })
      }
    })
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

  getHistoryPoint(historyPointCurrentPage) {
    let {
      historyPoints
    } = this.state
    let param = {
      currentpage: historyPointCurrentPage,
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      limit: 20
    }
    this.setState({
      isLoadHistory: true
    })
    get(SOCIAL_NET_WORK_API, "User/GetHistoryPoint" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          historyPoints: historyPoints.concat(result.content.histories),
        })
        if (result.content.histories.length == 0) {
          this.setState({
            isEndOfList: true
          })
        }
      }
      this.setState({
        isLoadHistory: false,
      })
    })
  }

  onScroll() {
    let element = $("#history-list")
    let {
      isEndOfList,
      historyPointCurrentPage,
      isLoadHistory
    } = this.state
    if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
      if (isLoadHistory == false && isEndOfList == false) {
        this.setState({
          historyPointCurrentPage: historyPointCurrentPage + 1,
          isLoadMoreGroup: true
        }, () => {
          this.getHistoryPoint(historyPointCurrentPage + 1)
        })
      }
    }
  }

  getFriends(currentpage) {
    let {
      friends,
      searchKey
    } = this.state
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      limit: 20,
      status: "Friends",
      forFriendId: 0,
      groupid: 0,
      findstring: searchKey
    }
    this.setState({
      isLoadMore: true
    })
    get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
      if (result.result == 1) {
        this.setState({
          friends: friends.concat(result.content.userInvites),
          isLoadMore: false
        })
        if (result.content.userInvites.length == 0) {
          this.setState({
            isEndOfFriends: true
          })
        }
      }
    })
  }

  getNumOfFriend() {
    let param = {
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      status: "Friends",
      forFriendId: 0,
    }
    get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + objToQuery(param), result => {
      if (result.result == 1) {
        this.setState({
          numOfFriend: result.content.count
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

  getTotalPoint(history) {
    let output = 0
    history.groupProjectPoints.map(groupProjectPoint => {
      groupProjectPoint.groupMemberPoints.map(groupMemberPoint => {
        groupMemberPoint.actionGroupPoints.map(actionGroupPoint => {
          actionGroupPoint.memberPoints.map(point => {
            output += point.point
          })
        })
      })
    })
    return output
  }

  onBlockedScroll() {
    let element = $("#friend-blocked")
    let {
      rejectFriendsCurrentPage,
      isEndOfRejectFriends,
      isLoadMore
    } = this.state
    if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
      if (isLoadMore == false && isEndOfRejectFriends == false) {
        this.setState({
          rejectFriendsCurrentPage: rejectFriendsCurrentPage + 1,
          isLoadMoreGroup: true
        }, () => {
          this.getRejectFriends(0, rejectFriendsCurrentPage + 1)
        })
      }
    }
  }

  onAllFriendScrool() {
    let element = $("#all-friend-for-block")
    let {
      friendsCurrentPage,
      isEndOfFriends,
      isLoadMore
    } = this.state
    if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
      if (isLoadMore == false && isEndOfFriends == false) {
        this.setState({
          friendsCurrentPage: friendsCurrentPage + 1,
          isLoadMoreGroup: true
        }, () => {
          this.getFriends(friendsCurrentPage + 1)
        })
      }
    }
  }

  componentWillMount() {
    this.getFriends(0)
    this.getNumOfFriend()
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(false)
    this.props.toggleFooter(true)
    this.getRejectFriends(0, 0)
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
      croppedImageUrl,
      numOfFriend,
      friends
    } = this.state
    let {
      profile
    } = this.props
    return (
      profile ? <div className="profile-page" >
        <div className="cover-img" style={{ background: "url(" + profile.background + ")" }}>
          <div className="overlay" onClick={() => {
            this.props.setMediaToViewer(profile.listBackground)
            this.props.toggleMediaViewerDrawer(true, { canDownload: true, showInfo: true })
          }}></div>
          <Dropzone onDrop={acceptedFiles => this.onSelectBackgroundFile(acceptedFiles)}>
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

        <div className="user-avatar" >
          <div className="overlay" onClick={() => {
            this.props.setMediaToViewer(profile.listAvatar)
            this.props.toggleMediaViewerDrawer(true, { canDownload: true, showInfo: true })
          }} style={{ background: "url(" + profile.avatar + ")" }}></div>
          <Dropzone onDrop={acceptedFiles => this.onSelectAvatarFile(acceptedFiles)}>
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
          <span>{numOfFriend} người bạn</span>
          {
            friends && friends.length > 0 ? <div className="friend-list">
              {
                friends.slice(0, 6).map((item, index) => <div key={index} className="friend-item" onClick={() => {
                  this.props.setCurrenUserDetail(item)
                  this.props.toggleUserPageDrawer(true)
                }}>
                  <div className="avatar">
                    <div className="image" style={{ background: "url(" + item.friendavatar + ")" }}></div>
                  </div>
                  <span className="name">{item.friendname}</span>
                  <span className="mutual-friend-count">{item.numfriendwith} bạn chung</span>
                </div>)
              }
            </div> : ""
          }
          <div className="search-friend" onClick={() => {
            this.props.setCurrenUserDetail(profile)
            this.props.toggleFriendDrawer(true)
          }}>
            <img src={search}></img>
            <span>Tìm bạn bè</span>
          </div>
          <Button className="bt-submit mt20" onClick={() => this.setState({ showAllFriendsDrawer: true })}>Xem tất cả bạn bè</Button>
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
        {
          renderUpdateBackgroundReviewDrawer(this)
        }
        {
          renderBackgroundCropperDrawer(this)
        }
        {
          renderAllFriendsDrawer(this)
        }

        {
          renderConfirmDrawer(this)
        }
        {
          renderFriendActionsDrawer(this)
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
  toggleSeachFriends: (isShow) => dispatch(toggleSeachFriends(isShow)),
  setCurrentFriendId: (friendId) => dispatch(setCurrentFriendId(friendId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);










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
          <li>
            <img src={profileBw}></img>
            <span style={{ color: "#f54746" }}>Cá nhân</span>
          </li>
          <li onClick={() => component.props.history.replace('/setting')}>
            <img src={settingBw}></img>
            <span>Cài đặt</span>
          </li>
        </ul>
      </div>
  )
}

const renderUserMenuDrawer = (component) => {
  let {
    showUserMenu,
    isLoadHistory
  } = component.state
  return (
    <Drawer anchor="right" className="user-menu full" open={showUserMenu} onClose={() => component.setState({ showUserMenu: false })}>
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
            component.getHistoryPoint(0)
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
  let {
    historyPoints,
    isLoadHistory
  } = component.state

  console.log("historyPoints", historyPoints)
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
          <div style={{ overflow: "scroll", width: "100vw" }} id="history-list" onScroll={() => component.onScroll()}>
            {

              historyPoints && historyPoints.length > 0 ? <ul className="user-history">

                {
                  historyPoints.map((history, index) => <li key={index}>
                    <div className="date"><span>{renderVNDays(moment(history.datetype))}, {moment(moment(history.datetype)).format("DD-MM-YYYY")}</span></div>
                    {
                      history.groupProjectPoints.map((groupProjectPoint, index) => <div className="list" key={index}>
                        <label><PlayArrowIcon />{groupProjectPoint.title}</label>
                        <ul>
                          {
                            groupProjectPoint.groupMemberPoints
                            && groupProjectPoint.groupMemberPoints.length > 0
                            && groupProjectPoint.groupMemberPoints.map((groupMemberPoint, index) => <span key={index}>
                              {
                                groupMemberPoint.title != "" ? <span className="project">{groupMemberPoint.title}</span> : ""
                              }
                              {
                                groupMemberPoint.actionGroupPoints
                                && groupMemberPoint.actionGroupPoints.length > 0
                                && groupMemberPoint.actionGroupPoints.map((actionGroupPoint, index) => <span key={index}>
                                  {
                                    actionGroupPoint.title != "" ? <span className="member">{actionGroupPoint.title}</span> : ""
                                  }
                                  {
                                    actionGroupPoint.memberPoints
                                    && actionGroupPoint.memberPoints.length > 0
                                    && actionGroupPoint.memberPoints.map((memberPoint, index) => <span key={index} className="point">
                                      <span>{memberPoint.pointpolicyname}</span>
                                      <span>+{memberPoint.point}</span>
                                    </span>)
                                  }
                                </span>)
                              }
                            </span>)
                          }
                        </ul>
                      </div>)
                    }
                    <div className="total">
                      <span>Tổng điểm/ngày</span>
                      <span>{component.getTotalPoint(history)}</span>
                    </div>
                  </li>)
                }
                {
                  isLoadHistory ? <div style={{ height: "50px" }}><Loader type="small" /></div> : ""
                }
              </ul> : ""
            }
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
  let {
    rejectFriends
  } = component.state
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
        <div className="filter">
          <p>Bạn và người bị chặn sẽ không thể nhìn thấy nhau. Nếu bạn bỏ chặn người này có thể xem dòng thời gian của bạn hoặc liên hệ với bạn.</p>
          <div className="add-bt" onClick={() => component.props.toggleFriendsForBlockForm(true)}>
            <AddCircleOutlineIcon />
            <span>Thêm vào danh sách chặn</span>
          </div>
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} id="friend-blocked" onScroll={() => component.onBlockedScroll()}>
          <div className="friend-list" >
            {
              rejectFriends && rejectFriends.length > 0 ? <ul>
                {
                  rejectFriends.map((item, index) => <li key={index} className="friend-layout" >
                    <div onClick={() => {
                      this.props.setCurrenUserDetail(item)
                      this.props.toggleUserPageDrawer(true)
                    }}>
                      <Avatar aria-label="recipe" className="avatar">
                        <img src={item.friendavatar} style={{ width: "100%" }} />
                      </Avatar>
                      <label onClick={() => {
                        this.props.setCurrenUserDetail(item)
                        this.props.toggleUserPageDrawer(true)
                      }}>{item.friendname}</label>
                    </div>
                    <div className="action">
                      <Button className="bt-cancel" onClick={() => component.unBandFriend(item.friendid)}>Bỏ chặn</Button>
                    </div>
                  </li>)
                }
              </ul> : ""
            }
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderFriendsForBlockDrawer = (component) => {
  let {
    searchKey,
    friends,
    friendsCurrentPage
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
        <div className="filter" >
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
            onChange={e => component.setState({
              searchKey: e.target.value,
              friends: [],
              isEndOfFriends: false,
              friendsCurrentPage: 0
            }, () => component.getFriends(friendsCurrentPage))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} style={{ width: "20px" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} id="all-friend-for-block" onScroll={() => component.onAllFriendScrool()}>
          <div className="friend-list" >
            {
              friends && friends.length > 0 ? <ul>
                {
                  friends.map((item, index) => <li key={index} className="friend-layout" >
                    <div onClick={() => {
                      this.props.setCurrenUserDetail(item)
                      this.props.toggleUserPageDrawer(true)
                    }}>
                      <Avatar aria-label="recipe" className="avatar">
                        <img src={item.friendavatar} style={{ width: "100%" }} />
                      </Avatar>
                      <label onClick={() => {
                        this.props.setCurrenUserDetail(item)
                        this.props.toggleUserPageDrawer(true)
                      }}>{item.friendname}</label>
                    </div>
                    <div className="action">
                      <Button className="bt-submit"
                        onClick={() => component.setState({
                          okCallback: () => component.bandFriend(item.friendid),
                          confirmTitle: "",
                          confirmMessage: "Bạn có chắc chắn muốn chặn người này không? Bạn và người bị chặn sẽ không thể nhìn thấy nhau, đồng thời nếu đang là bạn bè, việc chặn này cũng sẽ huỷ kết bạn của nhau.",
                          showConfim: true
                        })}>Chặn</Button>
                    </div>
                  </li>)
                }
              </ul> : ""
            }
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderAllFriendsDrawer = (component) => {
  let {
    friends,
    showAllFriendsDrawer
  } = component.state
  let {
    profile
  } = component.props
  return (
    <Drawer anchor="bottom" className="find-friends" open={showAllFriendsDrawer} >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction"
            onClick={() =>
              component.setState({ showAllFriendsDrawer: false })
            }>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tìm bạn bè</label>
          </div>
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
            onClick={() => {
              component.props.toggleSeachFriends(true)
              component.props.setCurrentFriendId(profile.id)
            }}
          />
        </div>
        <div style={{ overflow: "scroll", width: "100vw" }} id="all-user-list" onScroll={() => component.onAllUserScroll()}>
          <div className="friend-list" >
            <ul>
              {
                friends.map((item, index) => <li key={index} className="friend-layout">
                  <div className="friend-info" >
                    <Avatar aria-label="recipe" className="avatar">
                      <img src={item.friendavatar} style={{ width: "100%" }} />
                    </Avatar>
                    <label>
                      <span className="name">{item.friendname}</span>
                      <span className="with-friend">{item.numfriendwith} bạn chung</span>
                    </label>
                  </div>
                  <div className="action">

                    {
                      item.status == 0 ? <Button className="bt-submit" onClick={() => component.addFriend(item.friendid)}>Kết bạn</Button> : ""
                    }
                    {
                      item.status == 1 ? <Button className="bt-cancel" onClick={() => component.setState({
                        okCallback: () => component.addFriend(item.friendid),
                        confirmTitle: "",
                        confirmMessage: "Bạn có chắc chắn muốn huỷ yêu cầu kết bạn này không?",
                        showConfim: true
                      })}>Huỷ</Button> : ""
                    }
                    {
                      item.status == 10 ? <IconButton onClick={() => component.setState({
                        showFriendActionsDrawer: true,
                        currentFriend: item
                      })}><MoreHorizIcon /></IconButton> : ""
                    }
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

const renderFriendActionsDrawer = (component) => {
  let {
    currentFriend,
    showFriendActionsDrawer
  } = component.state
  return (
    <Drawer anchor="bottom" className="friend-actions-drawer" open={showFriendActionsDrawer} onClose={() => component.setState({ showFriendActionsDrawer: false })}>
      {
        currentFriend ? <div className="drawer-content">
          <ul>
            {
              currentFriend.ismefollow == 1 ? <li onClick={() => component.setState({
                okCallback: () => component.unFolowFriend(currentFriend.friendid),
                confirmTitle: "",
                confirmMessage: "Bạn có chắc muốn bỏ theo dõi người này không?",
                showConfim: true
              })}>
                <label>Bỏ theo dõi ( {currentFriend.friendname} )</label>
                <span>Không nhìn thấy các hoạt động của nhau nữa nhưng vẫn là bạn bè.</span>
              </li> : <li onClick={() => component.folowFriend(currentFriend.friendid)}>
                  <label>Theo dõi ( {currentFriend.friendname} )</label>
                  <span>Nhìn thấy các hoạt động của nhau.</span>
                </li>
            }
            <li onClick={() => component.setState({
              okCallback: () => component.bandFriend(currentFriend.friendid),
              confirmTitle: "",
              confirmMessage: "Bạn có chắc chắn muốn chặn người này không? Bạn và người bị chặn sẽ không thể nhìn thấy nhau, đồng thời nếu đang là bạn bè, việc chặn này cũng sẽ huỷ kết bạn của nhau.",
              showConfim: true
            })}>
              <label>Chặn ( {currentFriend.friendname} )</label>
              <span>Bạn và người này sẽ không nhìn thấy nhau.</span>
            </li>
          </ul>
          <Button className="bt-submit" onClick={() => component.setState({
            okCallback: () => component.removeFriend(currentFriend.friendid),
            confirmTitle: "",
            confirmMessage: "Bạn có chắc chắn muốn xoá người này khỏi danh sách bạn bè không?",
            showConfim: true
          })}>Huỷ kết bạn</Button>
        </div> : ''
      }
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
              useHashtags={false}
              useMentions={false}
              placeholder="Nhập nội dung"
              onChange={(value) => console.log(value)}
              userOptions={[
                { fullname: 'User 1' },
                { fullname: 'User 2' },
                { fullname: 'User 3' }
              ]} />
          </div>
          <div className="profile-page" >
            <div className="cover-img" style={{ background: "url(" + profile.avatar + ")" }}>
            </div>
            <div className="user-avatar" style={{ background: "url(" + (avatarToUpload && avatarToUpload.file ? URL.createObjectURL(avatarToUpload.file) : profile.avatar) + ")" }}>
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
    isProccessing
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
              placeholder="Nhập nội dung"
              onChange={(value) => console.log(value)}
              useHashtags={false}
              useMentions={false}
              userOptions={[
                { fullname: 'User 1' },
                { fullname: 'User 2' },
                { fullname: 'User 3' }
              ]}
            />

          </div>
          <div className="profile-page" >
            <div className="cover-img" style={{ background: "url(" + (backgroundToUpload && backgroundToUpload.file ? URL.createObjectURL(backgroundToUpload.file) : profile.background) + ")" }}>
            </div>
            <div className="user-avatar" style={{ background: "url(" + profile.avatar + ")" }}>
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

const renderBackgroundCropperDrawer = (component) => {
  let {
    openBackgroundCropperDrawer,
    crop,
    backgroundSrc,
    backgroundCroppedImage,
    isProccessing
  } = component.state
  return (
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
      {
        isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
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