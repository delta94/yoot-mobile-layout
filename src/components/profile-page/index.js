import React from "react";
import "./style.scss";
import {
  addHeaderContent, addFooterContent, toggleHeader, toggleUserDetail, toggleUserHistory, toggleChangePasswordForm,
  toggleBlockFriendForm, toggleFriendsForBlockForm, toggleFriendDrawer, togglePostDrawer, toggleFooter, setMediaToViewer,
  toggleMediaViewerDrawer, toggleUserPageDrawer, toggleSeachFriends, setCurrentFriendId,
} from "../../actions/app";
import { setMePosted, likePosted, setUserPosted } from "../../actions/posted";
import { setUserProfile, getFolowedMe, getMeFolowing, unFollowFriend, followFriend } from "../../actions/user";
import { setCurrenUserDetail } from "../../actions/user";
import {
  PhotoCamera as PhotoCameraIcon, ChevronLeft as ChevronLeftIcon, MoreHoriz as MoreHorizIcon, PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, AddCircleOutline as AddCircleOutlineIcon,
  NavigateNext as NavigateNextIcon, Check as CheckIcon,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { IconButton, Drawer, Button, Avatar, TextField, InputAdornment, AppBar, Tabs, Tab, Badge, } from "@material-ui/core";
import Switch from "react-ios-switch";
import moment from "moment";
import { signOut } from "../../auth";
import { renderVNDays } from "../../utils/app";
import UserInfo from "./user-info";
import Experiendces from "./experiences";
import Educaction from "./education";
import Hoppies from "./hoppies";
import SwipeableViews from "react-swipeable-views";
import Dropzone from "react-dropzone";
import MultiInput from "../common/multi-input";
import Loader from "../common/loader";
import "react-image-crop/lib/ReactCrop.scss";
import Cropper from "../common/cropper";
import { postFormData, get, post } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import { showNotification, objToQuery, jsonFromUrlParams, formatCurrency, } from "../../utils/common";
import { signIn } from "../../auth";
import $ from "jquery";
import Medias from "./medias";
import Videos from "./videos";
import Post from "../post";
import { result, stubFalse } from "lodash";
import ClickTooltip from "../common/click-tooltip";
import { APP_SETTING } from "../../constants/localStorageKeys";
import FolowReward from './following'

const noti = require("../../assets/icon/NotiBw@1x.png");
const profileBw = require("../../assets/icon/Profile.png");
const settingBw = require("../../assets/icon/seting1@1x.png");
const home = require("../../assets/icon/home1@1x.png");
const coin = require("../../assets/icon/Coins_Y.png");
const like = require("../../assets/icon/like@1x.png");
const follower = require("../../assets/icon/Follower@1x.png");
const birthday = require("../../assets/icon/Birthday.png");
const sex = require("../../assets/icon/Sex.png");
const education = require("../../assets/icon/Education.png");
const job = require("../../assets/icon/job@1x.png");
const donePractice = require("../../assets/icon/DonePractive@1x.png");
const search = require("../../assets/icon/Find@1x.png");
const uploadImage = require("../../assets/icon/upload_image.png");
const uploadVideo = require("../../assets/icon/upload_video.png");
const defaultImage = "https://dapp.dblog.org/img/default.jpg";
const Lesson = require("../../assets/icon/Lesson.png");
const Video = require("../../assets/icon/Video.png");
const Group1 = require("../../assets/icon/Group1@1x.png");
const NotiBw = require("../../assets/icon/NotiBw@1x.png");
const Profile = require("../../assets/icon/Profile.png");

const CurrentDateForLoad = moment(new Date()).format(CurrentDate)

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
      mediaTabIndex: 0,
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
        unit: "%",
        width: 100,
        height: 100,
        // aspect: 16 / 16,
      },
      friends: [],
      rejectFriends: [],
      rejectFriendsCurrentPage: 0,
      isEndOfRejectFriends: false,
      isLoadMore: false,
      friendsCurrentPage: 0,
      isEndOfFriends: false,
      searchKey: "",
      isEndOfPosteds: false,
      postedsCurrentPage: 0,
      postIndexActive: 1,
      userDetailFolowTabIndex: 0,
      showUserDetail: false,
      allUsers: [],
      isChangeCrop: false,
      backgroundToUpload: "",
    };
  }

  getRejectFriends(userId, currentpage) {
    let { rejectFriends } = this.state;
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      status: "Reject",
      forFriendId: userId,
      groupid: 0,
    };
    this.setState({
      isLoadMore: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetListFriends" + objToQuery(param),
      (result) => {
        if (result.result == 1) {
          this.setState({
            rejectFriends: rejectFriends.concat(result.content.userInvites),
            isLoadMore: false,
          });
          if (result.content.userInvites.length == 0) {
            this.setState({
              isEndOfRejectFriends: true,
            });
          }
        }
      }
    );
  }

  addFriend(friendId) {
    let { suggestFriends, waitings, allUsers } = this.state;
    let param = {
      friendid: friendId,
    };
    get(
      SOCIAL_NET_WORK_API,
      "Friends/AddOrDeleteInviateFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          allUsers.map((user) => {
            if (user.friendid == friendId) {
              user.status = user.status == 1 ? 0 : 1;
            }
          });
          this.setState({
            suggestFriends: suggestFriends.filter(
              (friend) => friend.friendid != friendId
            ),
            waitings: waitings.filter((friend) => friend.friendid != friendId),
            allUsers: allUsers,
          });
        }
      }
    );
  }

  removeSuggest(friendId) {
    let { suggestFriends } = this.state;
    this.setState({
      suggestFriends: suggestFriends.filter(
        (friend) => friend.friendid != friendId
      ),
    });
  }

  acceptFriend(friend) {
    let { queues, friends } = this.state;
    let param = {
      friendid: friend.friendid,
    };
    if (!friend) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/AcceptFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            queues: queues.filter(
              (friend) => friend.friendid != friend.friendid
            ),
            friends: [friend].concat(friends),
          });
        }
      }
    );
  }

  removeFriend(friendid) {
    let { friends, allUsers } = this.state;
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/RemoveFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          let newFriends = friends.filter(
            (friend) => friend.friendid != friendid
          );
          let newAllUsers = allUsers.filter(
            (friend) => friend.friendid != friendid
          );

          this.setState({
            friends: newFriends ? newFriends : friends,
            allUsers: newAllUsers ? newAllUsers : allUsers,
            showFriendActionsDrawer: false,
          });
        }
      }
    );
  }

  bandFriend(friendid) {
    let { friends, allUsers } = this.state;
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/BandFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            friends: friends.filter((friend) => friend.friendid != friendid),
            showFriendActionsDrawer: false,
            rejectFriends: [],
            isEndOfRejectFriends: false,
            rejectFriendsCurrentPage: 0,
          });
          this.getRejectFriends(0, 0);
        }
      }
    );
  }

  unBandFriend(friendid) {
    let { rejectFriends } = this.state;
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/RemoveBandFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            rejectFriends: rejectFriends.filter(
              (friend) => friend.friendid != friendid
            ),
            showFriendActionsDrawer: false,
          });
        }
      }
    );
  }

  unFolowFriend(friendid) {
    let { friends, allUsers } = this.state;
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/UnFollowFriends" + objToQuery(param),
      (result) => {
        if (result && result.result === 1) {
          this.props.unFollowFriend(friendid)
          this.setState({
            friends: friends,
            allUsers: allUsers,
            showFriendActionsDrawer: false,
          });
        }
      }
    );
  }

  folowFriend(friendid) {
    let { friends, allUsers } = this.state;
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/FollowFriends" + objToQuery(param),
      (result) => {
        if (result && result.result === 1) {
          this.props.followFriend(friendid)
          this.setState({
            friends: friends,
            allUsers: allUsers,
            showFriendActionsDrawer: false,
          });
        }
      }
    );
  }

  onSelectAvatarFile = (files) => {
    this.setState({
      rootAvatarToUpload: files[0],
    });
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({
          src: reader.result,
          openUploadAvatarReview: true,
          openCropperDrawer: true,
        })
      );
      reader.readAsDataURL(files[0]);
    }
  };

  updateAvatar() {
    let { avatarToUpload, rootAvatarToUpload, isProccessing, postContent, } = this.state;
    var fr = new FileReader();
    let that = this;
    if (isProccessing == true) return;
    this.setState({
      isProccessing: true,
    });
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        const formData = new FormData();
        if (avatarToUpload) {
          let avatarFileToUpload = new File(
            [avatarToUpload.file],
            avatarToUpload.file.name,
            {
              type: avatarToUpload.file.type,
              lastModified: new Date(),
              part: avatarToUpload.file.name,
            }
          );
          formData.append(
            "avatarcut_1_" + avatarToUpload.width + "_" + avatarToUpload.height,
            avatarFileToUpload
          );
        } else {
          formData.append(
            "avatarcut_1_" + img.width + "_" + img.height,
            rootAvatarToUpload
          );
        }

        formData.append("content", postContent ? postContent : "");
        formData.append("avatarroot_0_" + img.width + "_" + img.height, rootAvatarToUpload);

        postFormData(SOCIAL_NET_WORK_API, "User/UpdateAvatar", formData, (result) => {

          console.log(result)
          if (result && result.result === 1) {
            console.log('res', result)
            // that.props.updateAvatarProfile(result.content.avatar, result.content.avatarroot)
            that.getProfile();
          }

          that.setState({
            openCropperDrawer: false,
            openUploadAvatarReview: false,
            isReviewMode: false,
            isProccessing: false,
          });
        }
        );
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(rootAvatarToUpload);
  }

  updateBackground() {
    let { backgroundToUpload, rootBackgroundToUpload, isProccessing, postContent, } = this.state;

    var fr = new FileReader();
    let that = this;
    if (isProccessing == true) return;
    this.setState({
      isProccessing: true,
    });
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        const formData = new FormData();
        if (backgroundToUpload) {
          console.log('backgroundToUpload', backgroundToUpload)
          let backgroundFileToUpload = new File([backgroundToUpload.file], backgroundToUpload.file.name,
            {
              type: backgroundToUpload.file.type,
              lastModified: new Date(),
              part: backgroundToUpload.file.name,
            }
          );
          formData.append(
            "avatarcut_1_" + backgroundToUpload.width + "_" + backgroundToUpload.height, backgroundFileToUpload
          );
        } else {
          console.log('UPDATE ROOT BACKGROUND', rootBackgroundToUpload)
          formData.append("avatarcut_1_" + img.width + "_" + img.height, rootBackgroundToUpload);
        }
        formData.append("content", postContent ? postContent : "");
        formData.append("avatarroot_0_" + img.width + "_" + img.height, rootBackgroundToUpload);

        postFormData(SOCIAL_NET_WORK_API, "User/UpdateBackground", formData, (result) => {
          if (result && result.result === 1) {
            // that.props.updateBackGroundProfile(result.content.background, result.content.backgroundroot)
            that.getProfile();
          }
          that.setState({
            openBackgroundCropperDrawer: false,
            openUploadBackgroundReview: false,
            isReviewMode: false,
            isProccessing: false,
          });
        }
        );
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(rootBackgroundToUpload);
  }

  onSelectBackgroundFile = (files) => {
    this.setState({
      rootBackgroundToUpload: files[0],
    });
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({
          backgroundSrc: reader.result,
          openUploadBackgroundReview: true,
          openBackgroundCropperDrawer: true,
        })
      );
      reader.readAsDataURL(files[0]);
    }
  };



  getProfile() {
    get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", (result) => {
      if (result.result == 1) {
        this.props.setUserProfile(result.content.user);
        this.props.getFolowedMe(0);
        this.props.getMeFolowing(0);
      } else {
        showNotification(
          "",
          <span className="app-noti-message">{result.message}</span>,
          null
        );
      }
    });
  }

  getHistoryPoint(historyPointCurrentPage) {
    let { historyPoints } = this.state;
    let param = {
      currentpage: historyPointCurrentPage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
    };
    this.setState({
      isLoadHistory: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "User/GetHistoryPoint" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            historyPoints: historyPoints.concat(result.content.histories),
          });
          if (result.content.histories.length == 0) {
            this.setState({
              isEndOfList: true,
            });
          }
        }
        this.setState({
          isLoadHistory: false,
        });
      }
    );
  }

  onScroll() {
    let element = $("#history-list");
    let { isEndOfList, historyPointCurrentPage, isLoadHistory } = this.state;
    if (
      element.scrollTop() + element.innerHeight() >=
      element[0].scrollHeight
    ) {
      if (isLoadHistory == false && isEndOfList == false) {
        this.setState(
          {
            historyPointCurrentPage: historyPointCurrentPage + 1,
            isLoadMoreGroup: true,
          },
          () => {
            this.getHistoryPoint(historyPointCurrentPage + 1);
          }
        );
      }
    }
  }

  getAllFriendCount() {
    let param = {
      currentdate: moment(new Date()).format(CurrentDate),
      status: "Friends",
      forFriendId: 0,
    };

    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetCountListFriends" + objToQuery(param),
      (result) => {
        if (result.result == 1) {
          this.setState({
            friendsCount: result.content.count,
          });
        }
      }
    );
  }

  getFriends(currentpage) {
    let { friends, searchKey } = this.state;
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      status: "Friends",
      forFriendId: 0,
      groupid: 0,
      findstring: searchKey,
    };
    this.setState({
      isLoadMore: true,
    });

    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetListFriends" + objToQuery(param),
      (result) => {
        if (result.result == 1) {
          this.setState({
            friends: friends.concat(result.content.userInvites),
            isLoadMore: false,
          });
          if (result.content.userInvites.length == 0) {
            this.setState({
              isEndOfFriends: true,
            });
          }
        }
      }
    );
  }

  getNumOfFriend() {
    let param = {
      currentdate: moment(new Date()).format(CurrentDate),
      status: "Friends",
      forFriendId: 0,
    };
    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetCountListFriends" + objToQuery(param),
      (result) => {
        if (result.result == 1) {
          this.setState({
            numOfFriend: result.content.count,
          });
        }
      }
    );
  }

  changePassword() {
    let { oldPassForChange, newPassForChange, confirmPassForChange, } = this.state;
    if (!oldPassForChange || oldPassForChange == "") {
      showNotification(
        "",
        <span className="app-noti-message">
          Vui lòng nhập mật khẩu hiện tại.
        </span>,
        null
      );
      return;
    }
    if (
      (oldPassForChange && oldPassForChange.length < 6) ||
      (oldPassForChange && oldPassForChange.length > 25)
    ) {
      showNotification(
        "",
        <span className="app-noti-message">
          Vui lòng nhập mật khẩu có độ dài từ 6 đến 25 ký tự.
        </span>,
        null
      );
      return;
    }
    if (!newPassForChange || newPassForChange == "") {
      showNotification(
        "",
        <span className="app-noti-message">Vui lòng nhập mật khẩu mới.</span>,
        null
      );
      return;
    }
    if (
      (newPassForChange && newPassForChange.length < 6) ||
      (newPassForChange && newPassForChange.length > 25)
    ) {
      showNotification(
        "",
        <span className="app-noti-message">
          Vui lòng nhập mật khẩu có độ dài từ 6 đến 25 ký tự.
        </span>,
        null
      );
      return;
    }
    if (confirmPassForChange != newPassForChange) {
      showNotification(
        "",
        <span className="app-noti-message">
          Mật khẩu xác nhận không trùng khớp.
        </span>,
        null
      );
      return;
    }
    let param = {
      oldpassword: oldPassForChange,
      newpassword: newPassForChange,
      // socialtoken: string
    };
    this.setState({
      isProccessing: true,
    });
    post(SOCIAL_NET_WORK_API, "User/ChangePasswordUser", param, (result) => {
      if (result.result == 1) {
        let { profile } = this.props;
        let loginParam = {
          phone: profile.phone,
          password: newPassForChange,
        };
        post(SOCIAL_NET_WORK_API, "Login/Index", loginParam, (result) => {
          if (result.result == 1) {
            signIn({
              comunityAccessToken: result.content.myToken,
              skillAccessToken: result.content.myTokenTraining,
              careerGuidanceAccessToken: result.content.myTokenBuildYS,
              socketToken: result.content.myTokenNotifi,
            });
            this.props.toggleChangePasswordForm(false);

            this.setState({
              isProccessing: false,
              oldPassForChange: "",
              newPassForChange: "",
              confirmPassForChange: "",
            });
          }
        });
      } else {
        showNotification(
          "",
          <span className="app-noti-message">{result.message}</span>,
          null
        );
        this.setState({
          isProccessing: false,
        });
      }
    });
  }

  getTotalPoint(history) {
    let output = 0;
    history.groupProjectPoints.map((groupProjectPoint) => {
      groupProjectPoint.groupMemberPoints.map((groupMemberPoint) => {
        groupMemberPoint.actionGroupPoints.map((actionGroupPoint) => {
          actionGroupPoint.memberPoints.map((point) => {
            output += point.point;
          });
        });
      });
    });
    return output;
  }

  onBlockedScroll() {
    let element = $("#friend-blocked");
    let {
      rejectFriendsCurrentPage,
      isEndOfRejectFriends,
      isLoadMore,
    } = this.state;
    if (
      element.scrollTop() + element.innerHeight() >=
      element[0].scrollHeight
    ) {
      if (isLoadMore == false && isEndOfRejectFriends == false) {
        this.setState(
          {
            rejectFriendsCurrentPage: rejectFriendsCurrentPage + 1,
            isLoadMoreGroup: true,
          },
          () => {
            this.getRejectFriends(0, rejectFriendsCurrentPage + 1);
          }
        );
      }
    }
  }

  onAllFriendScrool() {
    let element = $("#all-friend-for-block");
    let { friendsCurrentPage, isEndOfFriends, isLoadMore } = this.state;
    if (
      element.scrollTop() + element.innerHeight() >=
      element[0].scrollHeight
    ) {
      if (isLoadMore == false && isEndOfFriends == false) {
        this.setState(
          {
            friendsCurrentPage: friendsCurrentPage + 1,
            isLoadMoreGroup: true,
          },
          () => {
            this.getFriends(friendsCurrentPage + 1);
          }
        );
      }
    }
  }

  getImages() {
    this.getPostedImage();
  }

  getPosted(currentpage, userId) {
    let { userPosteds } = this.props;

    let myPosteds = [];

    if (userId && userPosteds && userPosteds[userId]) {
      myPosteds = myPosteds.concat(userPosteds[userId]);
    }

    let param = {
      currentpage: currentpage,
      currentdate: CurrentDateForLoad,
      limit: 20,
      groupid: 0,
      isVideo: 0,
      suggestGroup: 0,
      forFriendId: userId,
      albumid: 0,
    };
    this.setState({
      isLoadMore: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/GetAllNewsFeed" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            isLoadMore: false,
          });
          this.props.setUserPosted(
            myPosteds.concat(result.content.newsFeeds),
            userId
          );
          if (result.content.newsFeeds.length == 0) {
            this.setState({
              isEndOfPosteds: true,
              isLoadMore: false,
            });
          }
        }
      }
    );
  }

  componentDidMount() {
    let { isUser } = this.props.match.params;
    this.getFriends(0);
    this.getNumOfFriend();
    this.props.addFooterContent(renderFooter(this));
    this.props.toggleHeader(isUser);
    this.props.toggleFooter(!isUser);
    this.getRejectFriends(0, 0);
    let { profile } = this.props;
    if (profile) this.getPosted(0, profile.id);
    document.addEventListener("scroll", () => {
      let element = $("html");
      let { postedsCurrentPage, isEndOfPosteds, isLoadMore } = this.state;
      let { userPosteds, profile } = this.props;
      let myPosteds = [];
      if (profile && userPosteds) {
        myPosteds = userPosteds[profile.id];
      }
      if (!myPosteds || myPosteds.length == 0) return;
      if (element.scrollTop() + window.innerHeight >= element[0].scrollHeight) {
        if (isLoadMore == false && isEndOfPosteds == false) {
          this.setState(
            {
              postedsCurrentPage: postedsCurrentPage + 1,
              isLoadMore: true,
            },
            () => {
              this.getPosted(postedsCurrentPage + 1, this.props.profile.id);
            }
          );
        }
      }
      if (window.innerWidth > 400) {
        this.setState({ isDestop: true })
      }
    });

    let searchParam = jsonFromUrlParams(window.location.search);
    if (searchParam && searchParam.setting == "true") {
      this.setState({
        showUserMenu: true,
      });
    }

    if (localStorage.getItem(APP_SETTING) === null) {
      localStorage.setItem(
        APP_SETTING,
        JSON.stringify({
          autoPlayRole: "all",
          isMuteInNewfeed: false,
        })
      );
    }
    let localSetting = localStorage.getItem(APP_SETTING);

    let appSettings = JSON.parse(localSetting);
    if (appSettings && appSettings.autoPlayRole) {
      this.setState({
        autoPlayRole: appSettings.autoPlayRole,
        isMuteInNewfeed: appSettings.isMuteInNewfeed
      });
    }
    this.setState({ isChangeCrop: false })
  }

  componentWillReceiveProps(nextProps) {
    if (
      Object.entries(this.props.profile ? this.props.profile : {}).toString() !=
      Object.entries(nextProps.profile ? nextProps.profile : {}).toString()
    ) {
      this.getPosted(0, nextProps.profile.id);
    }
    if (
      nextProps.woldNotiUnreadCount != this.props.woldNotiUnreadCount ||
      nextProps.skillNotiUnreadCount != this.props.skillNotiUnreadCount
    )
      this.props.addFooterContent(renderFooter(this));
  }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log('prev',prevState)
  //   if (prevState.crop !== this.state.crop) {
  //     console.log('change')
  //     console.log(prevState.crop)
  //     console.log(this.state.crop)
  //   }
  // }
  render() {
    let {
      showUserMenu, croppedImageUrl, numOfFriend, friends, openMediaDrawer, isLoadMore, postIndexActive,
      isDestop, openVideoDrawer
    } = this.state;
    let { profile, userPosteds } = this.props;
    let myPosteds = [];
    if (profile && userPosteds) {
      myPosteds = userPosteds[profile.id];
    }
    if (isDestop) {
      friends = this.state.friends.slice(0, 8)
    } else {
      friends = this.state.friends.slice(0, 6)
    }
    return profile && (
      <div className="profile-page">
        <div
          className="cover-img"
          style={{ background: "url(" + profile.background + ")" }}
        >
          <div
            className="overlay"
            onClick={() => {
              this.props.setMediaToViewer(profile.listBackground);
              this.props.toggleMediaViewerDrawer(true, {
                actions: mediaRootActions(this),
                showInfo: true,
                activeIndex: 0,
              });
            }}
          ></div>
          <Dropzone
            onDrop={(acceptedFiles) =>
              this.onSelectBackgroundFile(acceptedFiles)
            }
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" multiple={false} />
                <IconButton
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    padding: "8px",
                  }}
                >
                  <PhotoCameraIcon
                    style={{ color: "#ff5a59", width: "20px", height: "20px" }}
                  />
                </IconButton>
              </div>
            )}
          </Dropzone>
        </div>

        <div className="user-avatar">
          <div
            className="overlay"
            onClick={() => {
              this.props.setMediaToViewer(profile.listAvatar);
              this.props.toggleMediaViewerDrawer(true, {
                actions: mediaRootActions(this),
                showInfo: true,
                activeIndex: 0,
              });
            }}
            style={{ background: "url(" + profile.avatarroot + ")" }}
          ></div>
          <Dropzone
            onDrop={(acceptedFiles) => this.onSelectAvatarFile(acceptedFiles)}
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                <IconButton
                  style={{
                    background: "rgba(240,240,240,0.9)",
                    padding: "8px",
                  }}
                >
                  <PhotoCameraIcon
                    style={{ color: "#ff5a59", width: "20px", height: "20px" }}
                  />
                </IconButton>
              </div>
            )}
          </Dropzone>
        </div>

        <div className="user-info">
          <span className="user-name">{profile.fullname}</span>
          <span className="point">
            <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
          </span>
          <IconButton
            style={{ background: "rgba(0,0,0,0.07)" }}
            onClick={() => this.setState({ showUserMenu: true })}
          >
            <MoreHorizIcon />
          </IconButton>
        </div>

        <div className="react-reward">
          <ul>
            <li>
              <ClickTooltip
                className="item like-count"
                title="Số lượt thích"
                placement="top-start"
              >
                <span><img src={like}></img></span>
                <span>{profile.numlike}</span>
              </ClickTooltip>
            </li>
            <li>
              <ClickTooltip
                className="item follow-count"
                title="Số người theo dõi"
                placement="top"
              >
                <span><img src={follower}></img></span>
                <span>{profile.numfollow}</span>
              </ClickTooltip>
            </li>
            <li>
              <ClickTooltip
                className="item post-count"
                title="Số bài đăng"
                placement="top-end"
              >
                <span><img src={donePractice}></img></span>
                <span>{profile.numpost}</span>
              </ClickTooltip>
            </li>
          </ul>
        </div>

        <div className="user-profile">
          <ul>
            {profile.userExperience && profile.userExperience.length > 0 ? (
              <li>
                <img src={job} />
                <span className="title">
                  Từng làm <b>{profile.userExperience[0].title}</b> tại{" "}
                  <b>{profile.userExperience[0].companyname}</b>
                </span>
              </li>
            ) : (
                ""
              )}
            {profile.userStudyGraduation &&
              profile.userStudyGraduation.length > 0 ? (
                <li>
                  <img src={education} />
                  <span className="title">
                    Từng học <b>{profile.userStudyGraduation[0].specialized}</b>{" "}
                  tại <b>{profile.userStudyGraduation[0].schoolname}</b>
                  </span>
                </li>
              ) : (
                ""
              )}
            {profile.birthday ? (
              <li>
                <img src={birthday} />
                <span className="title">
                  Ngày sinh{" "}
                  <b>{moment(profile.birthday).format("DD/MM/YYYY")}</b>
                </span>
              </li>
            ) : (
                ""
              )}
            {profile.gendertext ? (
              <li>
                <img src={sex} />
                <span className="title">
                  Giới tính <b>{profile.gendertext}</b>
                </span>
              </li>
            ) : (
                ""
              )}
          </ul>
          <span
            className="view-detail-link"
            onClick={() => this.setState({ showUserDetail: true })}
          >
            {">>> Xem thêm thông tin của"} {profile.fullname}
          </span>
        </div>

        <Button
          className="update-button"
          style={{ background: "#f44645" }}
          onClick={() => this.setState({ showUpdateProfile: true })}
        >
          Cập nhật thông tin cá nhân
        </Button>

        <div className="friend-reward">
          <label>Bạn bè</label>
          <span>{numOfFriend} người bạn</span>
          {friends && friends.length > 0 ? (
            <div className="friend-list">
              {friends.map((item, index) => (
                <div
                  key={index}
                  className="friend-item"
                  onClick={() => {
                    this.props.setCurrenUserDetail(item);
                    this.props.toggleUserPageDrawer(true);
                  }}
                >
                  <div className="avatar">
                    <div
                      className="image"
                      style={{ background: "url(" + item.friendavatar + ")" }}
                    ></div>
                  </div>
                  <span className="name">{item.friendname}</span>
                  {/* <span className="mutual-friend-count">{item.numfriendwith} bạn chung</span> */}
                </div>
              ))}
            </div>
          ) : (
              ""
            )}
          <div
            className="search-friend"
            onClick={() => {
              this.props.setCurrenUserDetail(profile);
              this.props.toggleFriendDrawer(true);
            }}
          >
            <img src={search}></img>
            <span>Tìm bạn bè</span>
          </div>
          <Button
            className="bt-submit mt20"
            onClick={() => this.setState({ showAllFriendsDrawer: true })}
          >
            Xem tất cả bạn bè
          </Button>
        </div>

        <div
          className="post-bt"
          onClick={() => this.props.togglePostDrawer(true)}
        >
          <Avatar aria-label="recipe" className="avatar">
            <div
              className="img"
              style={{ background: `url("${profile.avatar}")` }}
            />
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

        <div className="posted">
          {myPosteds && myPosteds.length > 0 ? (
            <ul>
              {myPosteds.map((post, index) => (
                <li key={index}>
                  {post.isPendding ? (
                    ""
                  ) : (
                      <Post
                        data={post}
                        history={this.props.history}
                        userId={profile.id}
                      />
                    )}
                </li>
              ))}
            </ul>
          ) : (
              ""
            )}
        </div>

        {renderUserMenuDrawer(this)}
        {renderUpdateProfileDrawer(this)}
        {renderUserHistoryDrawer(this)}
        {renderChangePasswordDrawer(this)}
        {renderBlockFriendDrawer(this)}
        {renderFriendsForBlockDrawer(this)}
        <Medias
          open={openMediaDrawer}
          onClose={() => this.setState({ openMediaDrawer: false })}
          userDetail={profile}
        />
        <Videos
          open={openVideoDrawer}
          onClose={() => this.setState({ openVideoDrawer: false })}
          userDetail={profile}
        />
        {renderUpdateAvatarReviewDrawer(this)}
        {renderCropperDrawer(this)}
        {renderUpdateBackgroundReviewDrawer(this)}
        {renderBackgroundCropperDrawer(this)}
        {renderAllFriendsDrawer(this)}
        {renderConfirmDrawer(this)}
        {renderFriendActionsDrawer(this)}
        {renderUserDetailDrawer(this)}
        {renderAutoPlaySettingDrawer(this)}
        {renderSettingDrawer(this)}
        {renderFolowRewardDrawer(this)}
        <div style={{ height: "50px", background: "#f0f0f0", zIndex: 0 }}>
          {isLoadMore ? (
            <Loader
              type="small"
              style={{ background: "#f0f0f0" }}
              width={30}
              height={30}
            />
          ) : (
              ""
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // const myPosteds = state.posted.myPosteds
  return {
    ...state.app,
    ...state.user,
    ...state.posted,
    ...state.noti,
  };
};

const mapDispatchToProps = (dispatch) => ({
  unFollowFriend: (friendId) => dispatch(unFollowFriend(friendId)),
  followFriend: (friendId) => dispatch(followFriend(friendId)),
  addHeaderContent: (headerContent) =>
    dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) =>
    dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleUserHistory: (isShow) => dispatch(toggleUserHistory(isShow)),
  toggleChangePasswordForm: (isShow) =>
    dispatch(toggleChangePasswordForm(isShow)),
  toggleBlockFriendForm: (isShow) => dispatch(toggleBlockFriendForm(isShow)),
  toggleFriendsForBlockForm: (isShow) =>
    dispatch(toggleFriendsForBlockForm(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) =>
    dispatch(toggleMediaViewerDrawer(isShow, feature)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
  getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage)),
  toggleSeachFriends: (isShow) => dispatch(toggleSeachFriends(isShow)),
  setCurrentFriendId: (friendId) => dispatch(setCurrentFriendId(friendId)),
  setMePosted: (posteds) => dispatch(setMePosted(posteds)),
  setUserPosted: (userId, currentpage) =>
    dispatch(setUserPosted(userId, currentpage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const mediaRootActions = (component) => ({
  // onSaveImage: (value) => component.downloadImage(value.name),
  onUpdateInfo: (value) => null,
  onSetToAvatar: (value) => component.getProfile(),
  onSetToBackground: (value) => component.getProfile(),
  onUpdatePrivacy: (value) => null,
  onDelete: (value) => null,
  onSetToAlbumBackground: (value) => null,
});

const renderFooter = (component) => {
  let pathName = window.location.pathname;
  let { woldNotiUnreadCount, notiIsChecked } = component.props;
  return pathName == "/communiti-profile" ? (
    <div className="app-footer">
      <ul>
        <li onClick={() => component.props.history.replace("/community")}>
          <img src={Lesson}></img>
          <span>Bản tin</span>
        </li>
        <li onClick={() => component.props.history.replace("/videos")}>
          <img src={Video}></img>
          <span>Video</span>
        </li>
        <li onClick={() => component.props.history.replace("/groups")}>
          <img src={Group1}></img>
          <span>Nhóm</span>
        </li>
        <li onClick={() => component.props.history.replace("/community-noti")}>
          {woldNotiUnreadCount > 0 && !notiIsChecked ? (
            <Badge
              badgeContent={woldNotiUnreadCount}
              max={99}
              className={"custom-badge"}
            >
              <img src={NotiBw}></img>
            </Badge>
          ) : (
              <img src={NotiBw}></img>
            )}
          <span>Thông báo</span>
        </li>
        <li
          onClick={() => component.props.history.replace("/communiti-profile")}
        >
          <img src={Profile}></img>
          <span style={{ color: "#f54746" }}>Cá nhân</span>
        </li>
      </ul>
    </div>
  ) : (
      <div className="app-footer">
        <ul>
          <li onClick={() => component.props.history.replace("/")}>
            <img src={home}></img>
            <span>Trang chủ</span>
          </li>
          {/* <li onClick={() => component.props.history.replace('/yoot-noti')}>
            <img src={noti}></img>
            <span >Thông báo</span>
          </li> */}
          <li>
            <img src={profileBw}></img>
            <span style={{ color: "#f54746" }}>Cá nhân</span>
          </li>
          <li onClick={() => component.props.history.replace("/setting")}>
            <img src={settingBw}></img>
            <span>Cài đặt</span>
          </li>
        </ul>
      </div>
    );
};

const renderUserMenuDrawer = (component) => {
  let { showUserMenu, isLoadHistory } = component.state;
  let { profile } = component.props;
  return (
    <Drawer
      anchor="bottom"
      className="user-menu full fit-popup"
      open={showUserMenu}
      onClose={() => component.setState({ showUserMenu: false })}
    >
      <div className="menu-header" style={{ justifyContent: "flex-start" }}>
        <IconButton
          style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
          onClick={() => component.setState({ showUserMenu: false })}
        >
          <ChevronLeftIcon
            style={{ color: "#ff5a59", width: "25px", height: "25px" }}
          />
        </IconButton>
        <label className="pl50">Quản lý tài khoản</label>
      </div>
      <ul className="menu-list">
        <li>
          <Button
            onClick={() => component.setState({ showUpdateProfile: true })}
          >
            Cập nhật thông tin cá nhân
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              component.props.setCurrenUserDetail(profile);
              component.props.toggleUserHistory(true);
              component.getHistoryPoint(0);
            }}
          >
            Lịch sử tích điểm
          </Button>
        </li>
        <li>
          <Button
            onClick={() => component.setState({ showSettingDrawer: true })}
          >
            Cài đặt video
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              component.props.toggleChangePasswordForm(true);
            }}
          >
            Đổi mật khẩu
          </Button>
        </li>
        <li>
          <Button onClick={() => component.props.toggleBlockFriendForm(true)}>
            Danh sách chặn
          </Button>
        </li>
        <li className="sign-out">
          <Button style={{ background: "#ff5a59" }} onClick={() => signOut()}>
            Đăng xuất tài khoản
          </Button>
        </li>
      </ul>
    </Drawer>
  );
};

const renderUpdateProfileDrawer = (component) => {
  let { showUpdateProfile } = component.state;
  let { profile } = component.props;
  return (
    <Drawer
      className="fit-popup"
      anchor="bottom"
      className="update-profile-form fit-popup"
      open={showUpdateProfile}
      onClose={() => component.setState({ showUpdateProfile: false })}
    >
      <div className="form-header">
        <IconButton
          style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
          onClick={() => component.setState({ showUpdateProfile: false })}
        >
          <ChevronLeftIcon
            style={{ color: "#ff5a59", width: "25px", height: "25px" }}
          />
        </IconButton>
        <label>Cập nhật thông tin cá nhân</label>
      </div>
      <div className="content-form">
        <UserInfo data={profile} />
        <Experiendces data={profile} />
        <Educaction data={profile} />
        <Hoppies data={profile} />
      </div>
    </Drawer>
  );
};

const renderUserHistoryDrawer = (component) => {
  let { showUserHistory, userDetail, profile } = component.props;
  let { historyPoints, isLoadHistory } = component.state;


  return (
    <Drawer
      className="fit-popup"
      anchor="bottom"
      open={showUserHistory}
      onClose={() => component.props.toggleUserHistory(false)}
      style={{ height: "100%", position: "fixed" }}
    >
      {profile ? (
        <div className="drawer-detail">
          <div className="drawer-header">
            <div
              className="direction"
              onClick={() => component.props.toggleUserHistory(false)}
            >
              <IconButton
                style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
              >
                <ChevronLeftIcon
                  style={{ color: "#ff5a59", width: "25px", height: "25px" }}
                />
              </IconButton>
              <label>Lịch sử tích điểm</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div
                  className="img"
                  style={{ background: `url("${profile.avatar}")` }}
                />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div
            style={{ width: "100%" }}
            id="history-list"
            onScroll={() => component.onScroll()}
          >
            {historyPoints && historyPoints.length > 0 ? (
              <ul className="user-history">
                {historyPoints.map((history, index) => (
                  <li key={index}>
                    <div className="date">
                      <span>
                        {renderVNDays(moment(history.datetype))},{" "}
                        {moment(moment(history.datetype)).format("DD-MM-YYYY")}
                      </span>
                    </div>
                    {history.groupProjectPoints.map(
                      (groupProjectPoint, index) => (
                        <div className="list" key={index}>
                          <label>
                            <PlayArrowIcon />
                            {groupProjectPoint.title}
                          </label>
                          <ul>
                            {groupProjectPoint.groupMemberPoints &&
                              groupProjectPoint.groupMemberPoints.length > 0 &&
                              groupProjectPoint.groupMemberPoints.map(
                                (groupMemberPoint, index) => (
                                  <span key={index}>
                                    {groupMemberPoint.title != "" ? (
                                      <span className="project">
                                        {groupMemberPoint.title}
                                      </span>
                                    ) : (
                                        ""
                                      )}
                                    {groupMemberPoint.actionGroupPoints &&
                                      groupMemberPoint.actionGroupPoints
                                        .length > 0 &&
                                      groupMemberPoint.actionGroupPoints.map(
                                        (actionGroupPoint, index) => (
                                          <span key={index}>
                                            {actionGroupPoint.title != "" ? (
                                              <span className="member">
                                                {actionGroupPoint.title}
                                              </span>
                                            ) : (
                                                ""
                                              )}
                                            {actionGroupPoint.memberPoints &&
                                              actionGroupPoint.memberPoints
                                                .length > 0 &&
                                              actionGroupPoint.memberPoints.map(
                                                (memberPoint, index) => (
                                                  <span
                                                    key={index}
                                                    className="point"
                                                  >
                                                    <span>
                                                      {
                                                        memberPoint.pointpolicyname
                                                      }
                                                    </span>
                                                    <span>
                                                      +{memberPoint.point}
                                                    </span>
                                                  </span>
                                                )
                                              )}
                                          </span>
                                        )
                                      )}
                                  </span>
                                )
                              )}
                          </ul>
                        </div>
                      )
                    )}
                    <div className="total">
                      <span>Tổng điểm/ngày</span>
                      <span>{component.getTotalPoint(history)}</span>
                    </div>
                  </li>
                ))}
                {isLoadHistory ? (
                  <div style={{ height: "50px" }}>
                    <Loader type="small" />
                  </div>
                ) : (
                    ""
                  )}
              </ul>
            ) : (
                ""
              )}
          </div>
        </div>
      ) : (
          ""
        )}
    </Drawer>
  );
};

const renderChangePasswordDrawer = (component) => {
  let { showChangePasswordForm } = component.props;
  let {
    isShowOldPass,
    isShowNewPass,
    isShowConfirmPass,
    oldPassForChange,
    newPassForChange,
    confirmPassForChange,
    isProccessing,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      open={showChangePasswordForm}
      onClose={() => component.props.toggleChangePasswordForm(false)}
    >
      <div className="drawer-detail change-pass-form">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.props.toggleChangePasswordForm(false)}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Đổi mật khẩu</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="content-form"
          style={{
            height: "calc(100vh - 60px)",
            maxWidth: "600px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <TextField
              className="custom-input"
              variant="outlined"
              placeholder="Mật khẩu hiện tại"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              type={isShowOldPass ? "text" : "password"}
              value={oldPassForChange}
              onChange={(e) =>
                component.setState({ oldPassForChange: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        component.setState({ isShowOldPass: !isShowOldPass })
                      }
                    >
                      {isShowOldPass ? (
                        <VisibilityIcon style={{ color: "#ff5a5a" }} />
                      ) : (
                          <VisibilityOffIcon />
                        )}
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
                marginBottom: "10px",
              }}
              type={isShowNewPass ? "text" : "password"}
              value={newPassForChange}
              onChange={(e) =>
                component.setState({ newPassForChange: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        component.setState({ isShowNewPass: !isShowNewPass })
                      }
                    >
                      {isShowNewPass ? (
                        <VisibilityIcon style={{ color: "#ff5a5a" }} />
                      ) : (
                          <VisibilityOffIcon />
                        )}
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
                marginBottom: "10px",
              }}
              type={isShowConfirmPass ? "text" : "password"}
              value={confirmPassForChange}
              onChange={(e) =>
                component.setState({ confirmPassForChange: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        component.setState({
                          isShowConfirmPass: !isShowConfirmPass,
                        })
                      }
                    >
                      {isShowConfirmPass ? (
                        <VisibilityIcon style={{ color: "#ff5a5a" }} />
                      ) : (
                          <VisibilityOffIcon />
                        )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              className={"bt-submit"}
              onClick={() => component.changePassword()}
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="contained"
              className={"bt-cancel"}
              onClick={() =>
                component.setState(
                  {
                    oldPassForChange: "",
                    newPassForChange: "",
                    confirmPassForChange: "",
                  },
                  () => component.props.toggleChangePasswordForm(false)
                )
              }
            >
              Huỷ
            </Button>
          </div>
        </div>
      </div>
      {isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""}
    </Drawer>
  );
};

const renderBlockFriendDrawer = (component) => {
  let { showBlockFriendForm } = component.props;
  let { rejectFriends } = component.state;
  return (
    <Drawer
      anchor="bottom"
      open={showBlockFriendForm}
      onClose={() => component.props.toggleBlockFriendForm(false)}
    >
      <div className="drawer-detail block-friend-form">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.props.toggleBlockFriendForm(false)}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Danh sách chặn</label>
          </div>
        </div>
        <div className="filter">
          <p>
            Bạn và người bị chặn sẽ không thể nhìn thấy nhau. Nếu bạn bỏ chặn
            người này có thể xem dòng thời gian của bạn hoặc liên hệ với bạn.
          </p>
          <div
            className="add-bt"
            onClick={() => component.props.toggleFriendsForBlockForm(true)}
          >
            <AddCircleOutlineIcon />
            <span>Thêm vào danh sách chặn</span>
          </div>
        </div>
        <div
          className="content-form"
          style={{ overflowY: "auto", overflowX: "hidden", maxWidth: "600px" }}
          id="friend-blocked"
          onScroll={() => component.onBlockedScroll()}
        >
          <div className="friend-list">
            {rejectFriends && rejectFriends.length > 0 ? (
              <ul>
                {rejectFriends.map((item, index) => (
                  <li key={index} className="friend-layout">
                    <div
                      onClick={() => {
                        this.props.setCurrenUserDetail(item);
                        this.props.toggleUserPageDrawer(true);
                      }}
                    >
                      <Avatar aria-label="recipe" className="avatar">
                        <div
                          className="img"
                          style={{ background: `url("${item.friendavatar}")` }}
                        />
                      </Avatar>
                      <label
                        onClick={() => {
                          this.props.setCurrenUserDetail(item);
                          this.props.toggleUserPageDrawer(true);
                        }}
                      >
                        {item.friendname}
                      </label>
                    </div>
                    <div className="action">
                      <Button
                        className="bt-cancel"
                        onClick={() => component.unBandFriend(item.friendid)}
                      >
                        Bỏ chặn
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                ""
              )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderFriendsForBlockDrawer = (component) => {
  let { searchKey, friends, friendsCurrentPage } = component.state;
  let { showFriendsForBlockForm } = component.props;
  return (
    <Drawer
      className="fit-popup"
      anchor="bottom"
      open={showFriendsForBlockForm}
      onClose={() => component.props.toggleFriendsForBlockForm(false)}
    >
      <div className="drawer-detail friends-for-block-form">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.props.toggleFriendsForBlockForm(false)}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Tìm kiếm bạn bè</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            className="custom-input"
            variant="outlined"
            placeholder="Nhập tên bạn bè để tìm..."
            className="search-box"
            style={{
              width: "100%",
              margin: "10px 0px",
            }}
            value={searchKey}
            onChange={(e) =>
              component.setState(
                {
                  searchKey: e.target.value,
                  friends: [],
                  isEndOfFriends: false,
                  friendsCurrentPage: 0,
                },
                () => component.getFriends(friendsCurrentPage)
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} style={{ width: "20px" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div
          className="content-form"
          id="all-friend-for-block"
          onScroll={() => component.onAllFriendScrool()}
        >
          <div className="friend-list">
            {friends && friends.length > 0 ? (
              <ul>
                {friends.map((item, index) => (
                  <li key={index} className="friend-layout">
                    <div
                      onClick={() => {
                        this.props.setCurrenUserDetail(item);
                        this.props.toggleUserPageDrawer(true);
                      }}
                    >
                      <Avatar aria-label="recipe" className="avatar">
                        <div className="img" style={{ background: `url("${item.friendavatar}")` }} />
                      </Avatar>
                      <label
                        onClick={() => {
                          this.props.setCurrenUserDetail(item);
                          this.props.toggleUserPageDrawer(true);
                        }}
                      >
                        {item.friendname}
                      </label>
                    </div>
                    <div className="action">
                      <Button
                        className="bt-submit"
                        onClick={() =>
                          component.setState({
                            okCallback: () =>
                              component.bandFriend(item.friendid),
                            confirmTitle: "",
                            confirmMessage:
                              "Bạn có chắc chắn muốn chặn người này không? Bạn và người bị chặn sẽ không thể nhìn thấy nhau, đồng thời nếu đang là bạn bè, việc chặn này cũng sẽ huỷ kết bạn của nhau.",
                            showConfim: true,
                          })
                        }
                      >
                        Chặn
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                ""
              )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderAllFriendsDrawer = (component) => {
  let { friends, showAllFriendsDrawer, numOfFriend } = component.state;
  let { profile } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="find-friends fit-popup"
      open={showAllFriendsDrawer}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({ showAllFriendsDrawer: false })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Bạn bè</label>
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
              component.props.toggleSeachFriends(true);
              component.props.setCurrentFriendId(profile.id);
            }}
          />
        </div>
        <div
          style={{ overflow: "auto" }}
          id="all-user-list"
          onScroll={() => component.onAllUserScroll()}
        >
          <div className="friend-count">
            <span>Số lượng</span>
            <span className="red">{numOfFriend}</span>
          </div>
          <div className="friend-list">
            <ul>
              {friends.map((item, index) => (
                <li key={index} className="friend-layout">
                  <div className="friend-info">
                    <Avatar aria-label="recipe" className="avatar">
                      <div
                        className="img"
                        style={{ background: `url("${item.friendavatar}")` }}
                      />
                    </Avatar>
                    <label>
                      <span className="name">{item.friendname}</span>
                      {item.numfriendwith > 0 ? (
                        <span className="with-friend">
                          {item.numfriendwith} bạn chung
                        </span>
                      ) : (
                          ""
                        )}
                    </label>
                  </div>
                  <div className="action">
                    {item.status == 0 ? (
                      <Button
                        className="bt-submit"
                        onClick={() => component.addFriend(item.friendid)}
                      >
                        Kết bạn
                      </Button>
                    ) : (
                        ""
                      )}
                    {item.status == 1 ? (
                      <Button
                        className="bt-cancel"
                        onClick={() =>
                          component.setState({
                            okCallback: () =>
                              component.addFriend(item.friendid),
                            confirmTitle: "",
                            confirmMessage:
                              "Bạn có chắc chắn muốn huỷ yêu cầu kết bạn này không?",
                            showConfim: true,
                          })
                        }
                      >
                        Huỷ
                      </Button>
                    ) : (
                        ""
                      )}
                    {item.status == 10 ? (
                      <IconButton
                        onClick={() =>
                          component.setState({
                            showFriendActionsDrawer: true,
                            currentFriend: item,
                          })
                        }
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    ) : (
                        ""
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderConfirmDrawer = (component) => {
  let {
    showConfim,
    okCallback,
    confirmTitle,
    confirmMessage,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="confirm-drawer"
      open={showConfim}
      onClose={() => component.setState({ showConfim: false })}
    >
      <div className="jon-group-confirm">
        <label>{confirmTitle}</label>
        <p>{confirmMessage}</p>
        <div className="mt20">
          <Button
            className="bt-confirm"
            onClick={() =>
              component.setState({ showConfim: false }, () =>
                okCallback ? okCallback() : null
              )
            }
          >
            Đồng ý
          </Button>
          <Button
            className="bt-submit"
            onClick={() => component.setState({ showConfim: false })}
          >
            Đóng
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

const renderFriendActionsDrawer = (component) => {
  let { currentFriend, showFriendActionsDrawer } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="friend-actions-drawer fit-popup-1"
      open={showFriendActionsDrawer}
      onClose={() => component.setState({ showFriendActionsDrawer: false })}
    >
      <div className="wrapper-action">
        <div className="title-more-action">Tác vụ</div>
        {currentFriend ? (
          <div className="drawer-content">
            <ul>
              {currentFriend.ismefollow == 1 ? (
                <li
                  onClick={() =>
                    component.setState({
                      okCallback: () =>
                        component.unFolowFriend(currentFriend.friendid),
                      confirmTitle: "",
                      confirmMessage:
                        "Bạn có chắc muốn bỏ theo dõi người này không?",
                      showConfim: true,
                    })
                  }
                >
                  <label>Bỏ theo dõi ( {currentFriend.friendname} )</label>
                  <span>
                    Không nhìn thấy các hoạt động của nhau nữa nhưng vẫn là bạn
                    bè.
                </span>
                </li>
              ) : (
                  <li onClick={() => component.folowFriend(currentFriend.friendid)}>
                    <label>Theo dõi ( {currentFriend.friendname} )</label>
                    <span>Nhìn thấy các hoạt động của nhau.</span>
                  </li>
                )}
              <li
                onClick={() =>
                  component.setState({
                    okCallback: () =>
                      component.bandFriend(currentFriend.friendid),
                    confirmTitle: "",
                    confirmMessage:
                      "Bạn có chắc chắn muốn chặn người này không? Bạn và người bị chặn sẽ không thể nhìn thấy nhau, đồng thời nếu đang là bạn bè, việc chặn này cũng sẽ huỷ kết bạn của nhau.",
                    showConfim: true,
                  })
                }
              >
                <label>Chặn ( {currentFriend.friendname} )</label>
                <span>Bạn và người này sẽ không nhìn thấy nhau.</span>
              </li>
            </ul>
            <div className="destroy-action">
              <Button
                className="btn-destroy"
                onClick={() =>
                  component.setState({
                    showFriendActionsDrawer: false,
                    okCallback: () =>
                      component.removeFriend(currentFriend.friendid),
                    confirmTitle: "",
                    confirmMessage: "Bạn có chắc muốn hủy kết bạn không?",
                    showConfim: true,
                  })
                }
              >
                Huỷ kết bạn
            </Button>
            </div>
          </div>
        ) : (
            ""
          )}
      </div>
    </Drawer>
  );
};

const renderUpdateAvatarReviewDrawer = (component) => {
  let { openUploadAvatarReview, isReviewMode, avatarToUpload, isProccessing, } = component.state;
  let { profile } = component.props;
  return (
    <Drawer
      anchor="bottom"
      className="update-avatar-review-drawer"
      open={openUploadAvatarReview}
      onClose={() => component.setState({ openUploadAvatarReview: false })}
    >
      <div className="drawer-detail media-drawer">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              isReviewMode == false
                ? component.setState({ openUploadAvatarReview: false })
                : component.setState({
                  openCropperDrawer: true,
                  isReviewMode: false,
                })
            }
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>
              {isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"}
            </label>
          </div>
          <Button onClick={() => component.updateAvatar()}>Đăng</Button>
        </div>
        <div className="filter"></div>
        <div
          className="content-form"
          style={{ overflow: "auto" }}
        >
          <div className="post-content">
            <MultiInput
              style={{ padding: "15px 0px", border: "none" }}
              onChange={(value) =>
                component.setState({ postContent: value.text })
              }
              topDown={true}
              placeholder={"Nhập nội dung"}
            />
          </div>
          <div className="profile-page">
            <div
              className="cover-img"
              style={{ background: "url(" + profile.background + ")" }}
            ></div>
            <div
              className="user-avatar"
              style={{
                background:
                  "url(" +
                  (avatarToUpload && avatarToUpload.file
                    ? URL.createObjectURL(avatarToUpload.file)
                    : profile.avatar) +
                  ")",
              }}
            ></div>
          </div>
        </div>
      </div>
      {isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""}
    </Drawer>
  );
};

const renderCropperDrawer = (component) => {
  let { openCropperDrawer, crop, src, croppedImage, isProccessing, } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="cropper-drawer"
      open={openCropperDrawer}
      onClose={() => component.setState({ openCropperDrawer: false })}
    >
      {src ? (
        <div className="drawer-detail">
          <div className="drawer-content" style={{ background: "#f2f3f7" }}>
            <Cropper
              component={component}
              src={src}
              crop={crop}
              onCropped={(file) => component.setState({ croppedImage: file })}
            />
          </div>
          <div className="footer-drawer">
            <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
            <div>
              <Button
                onClick={() =>
                  component.setState({
                    openCropperDrawer: false,
                    isReviewMode: false,
                    openUploadAvatarReview: false
                  })
                }
              >
                Huỷ
              </Button>
              <Button
                onClick={() =>
                  component.setState({
                    openCropperDrawer: false,
                    isReviewMode: true,
                    avatarToUpload: croppedImage,
                  })
                }
              >
                Chế độ xem trước
              </Button>
              <Button
                onClick={() =>
                  component.setState({ avatarToUpload: croppedImage }, () =>
                    component.updateAvatar()
                  )
                }
              >
                Đăng bài
              </Button>
            </div>
          </div>
        </div>
      ) : (
          ""
        )}
      {isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""}
    </Drawer>
  );
};

const renderUpdateBackgroundReviewDrawer = (component) => {
  let { openUploadBackgroundReview, postContent, backgroundSrc, isReviewMode, isProccessing, backgroundToUpload } = component.state;
  let { profile } = component.props;
  console.log(component.state)
  return (
    <Drawer
      anchor="bottom"
      className="update-avatar-review-drawer"
      open={openUploadBackgroundReview}
    >
      <div className="drawer-detail media-drawer">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              isReviewMode === false
                ? component.setState({ openUploadBackgroundReview: false })
                : component.setState({
                  openBackgroundCropperDrawer: true,
                  isReviewMode: false,

                })
            }
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>
              {isReviewMode ? "Quay lại chỉnh sửa" : "Cập nhật ảnh đại diện"}
            </label>
          </div>
          <Button onClick={() => {
            component.updateBackground()
          }}
          >Đăng</Button>
        </div>
        <div className="filter"></div>
        <div
          className="content-form"
          style={{ overflow: "auto", width: "100%" }}
        >
          <div className="post-content">
            <MultiInput
              style={{ padding: "15px 0px", border: "none" }}
              onChange={(value) =>
                component.setState({ postContent: value.text })
              }
              topDown={true}
              placeholder={"Nhập nội dung"}
            />
          </div>
          <div className="profile-page">
            <div
              className="cover-img"
              style={{
                background: "url(" + (backgroundToUpload && backgroundToUpload.file
                  ? URL.createObjectURL(backgroundToUpload.file)
                  : backgroundSrc) + ")",
              }}
            ></div>
            <div
              className="user-avatar"
              style={{ background: "url(" + profile.avatar + ")" }}
            ></div>
          </div>
        </div>
      </div>
      {isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""}
    </Drawer>
  );
};

const renderBackgroundCropperDrawer = (component) => {
  let {
    openBackgroundCropperDrawer, crop, isChangeCrop, backgroundSrc, backgroundToUpload, rootBackgroundToUpload,
    backgroundCroppedImage, isProccessing,
  } = component.state;
  // component.setState({isChangeCrop:false})
  // console.log(crop.x !== 0 || crop.y !== 0||clone_crop.width !== crop.width || clone_crop.height!== crop.height)
  return (
    <Drawer
      anchor="bottom"
      className="cropper-drawer"
      open={openBackgroundCropperDrawer}
      onClose={() => component.setState({ openBackgroundCropperDrawer: false })}
    >
      {backgroundSrc ? (
        <div className="drawer-detail">
          <div
            className="drawer-content"
            style={{ overflow: "auto", background: "#f2f3f7" }}
          >
            <Cropper
              component={component}
              src={backgroundSrc}
              crop={crop}
              onCropped={(file) =>
                component.setState({
                  backgroundCroppedImage: file
                })}
            />
          </div>
          <div className="footer-drawer">
            <label>Kéo hình của bạn muốn hiển thị theo khung ảnh</label>
            <div>
              <Button
                onClick={() => component.setState({
                  openBackgroundCropperDrawer: false,
                  isReviewMode: false,
                  openUploadBackgroundReview: false
                })
                }
              >
                Huỷ
              </Button>
              <Button
                onClick={() =>
                  component.setState({
                    openBackgroundCropperDrawer: false,
                    isReviewMode: true,
                    backgroundToUpload: isChangeCrop && backgroundCroppedImage,
                  })
                }
              >
                Chế độ xem trước
              </Button>
              <Button
                onClick={() =>
                  component.setState(
                    { backgroundToUpload: isChangeCrop && backgroundCroppedImage },
                    () => component.updateBackground()
                  )
                }
              >
                Đăng bài
              </Button>
            </div>
          </div>
        </div>
      ) : (
          ""
        )}
      {isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""}
    </Drawer>
  );
};

const renderUserDetailDrawer = (component) => {
  let { userDetailFolowTabIndex, showUserDetail } = component.state;
  let { profile } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="drawer-detail fit-popup"
      open={showUserDetail}
      onClose={() => component.setState({ showUserDetail: false })}
    >
      {profile ? (
        <div className="drawer-detail">
          <div className="drawer-header">
            <div
              className="direction"
              onClick={() => component.setState({ showUserDetail: false })}
            >
              <IconButton
                style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
              >
                <ChevronLeftIcon
                  style={{ color: "#ff5a59", width: "25px", height: "25px" }}
                />
              </IconButton>
              <label>Thông tin</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div
                  className="img"
                  style={{ background: `url("${profile.avatar}")` }}
                />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div style={{ height: "100%" }}>
            <AppBar position="static" color="default" className={"custom-tab"}>
              <Tabs
                value={userDetailFolowTabIndex}
                onChange={(e, value) =>
                  component.setState({ userDetailFolowTabIndex: value })
                }
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                className="tab-header"
              >
                <Tab
                  label={
                    "Người theo dõi"
                  }
                  {...a11yProps(0)}
                  className="tab-item"
                  onClick={() => userDetailFolowTabIndex == 0 ? component.setState({ showFolowRewardDrawer: true }) : ""}
                />
                <Tab
                  label={
                    "Đang theo dõi"
                  }
                  {...a11yProps(1)}
                  className="tab-item"
                  onClick={() => userDetailFolowTabIndex == 1 ? component.setState({ showFolowRewardDrawer: true }) : ""}
                />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={userDetailFolowTabIndex}
              onChangeIndex={(value) =>
                component.setState({ userDetailFolowTabIndex: value })
              }
              className="tab-content"
            >
              <TabPanel
                value={userDetailFolowTabIndex}
                index={0}
                className="content-box"
              >
                <div className="folowed-list">
                  <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <span>Số lượng</span>
                    <span className="red">{profile.folowedCount ? profile.folowedCount : 0}</span>
                  </div>
                  {profile.foloweds && profile.foloweds.length > 0 ? (
                    <ul>
                      {profile.foloweds.map((item, index) => (
                        <li className="small-user-layout" key={index}>
                          <Avatar
                            aria-label="recipe"
                            className="avatar"
                            onClick={() => {
                              component.props.setCurrenUserDetail(item);
                              component.props.toggleUserPageDrawer(true);
                            }}
                          >
                            <img
                              src={item.friendavatar}
                              style={{ width: "100%" }}
                            />
                          </Avatar>
                          <div className="friend-title">
                            <b
                              className="user-name"
                              onClick={() => {
                                component.props.setCurrenUserDetail(item);
                                component.props.toggleUserPageDrawer(true);
                              }}
                            >
                              {item.friendname}
                            </b>
                            <p>{item.numfriendwith} bạn chung</p>
                          </div>

                          {item.ismefollow === 0 ? (
                            <Button
                              onClick={() =>
                                component.folowFriend(item.friendid)
                              }
                              style={{ background: "#f44645", color: "#fff" }}
                            >
                              Theo dõi
                            </Button>
                          ) : (
                              <Button
                                onClick={() =>
                                  component.unFolowFriend(item.friendid)
                                }
                                style={{ background: "rgba(0,0,0,0.05)" }}
                              >
                                Đang Theo dõi
                              </Button>
                            )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                      <span className="list-empty-message">
                        Chưa có ai theo dõi
                      </span>
                    )}
                </div>
              </TabPanel>
              <TabPanel value={userDetailFolowTabIndex} index={1}>
                <div className="folowing-list">
                  <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <span>Số lượng</span>
                    <span className="red">{profile.folowingCount ? profile.folowingCount : 0}</span>
                  </div>
                  {profile.folowings && profile.folowings.length > 0 ? (
                    <ul>
                      {profile.folowings.map((item, index) => (
                        <li className="small-user-layout" key={index}>
                          <Avatar
                            aria-label="recipe"
                            className="avatar"
                            onClick={() => {
                              component.props.setCurrenUserDetail(item);
                              component.props.toggleUserPageDrawer(true);
                            }}
                          >
                            <img
                              src={item.friendavatar}
                              style={{ width: "100%" }}
                            />
                          </Avatar>
                          <div className="friend-title">
                            <b
                              className="user-name"
                              onClick={() => {
                                component.props.setCurrenUserDetail(item);
                                component.props.toggleUserPageDrawer(true);
                              }}
                            >
                              {item.friendname}
                            </b>
                            <p>{item.numfriendwith} bạn chung</p>
                          </div>

                          {item.ismefollow === 0 ? (
                            <Button
                              onClick={() =>
                                component.folowFriend(item.friendid)
                              }
                              style={{ background: "#f44645", color: "#fff" }}
                            >
                              Theo dõi
                            </Button>
                          ) : (
                              <Button
                                onClick={() =>
                                  component.unFolowFriend(item.friendid)
                                }
                                style={{ background: "rgba(0,0,0,0.05)" }}
                              >
                                Đang Theo dõi
                              </Button>
                            )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                      <span className="list-empty-message">
                        Chưa theo dõi bất kì ai
                      </span>
                    )}
                </div>
              </TabPanel>
            </SwipeableViews>
            <div className="job-reward info-box">
              <label>Công việc</label>
              {profile.userExperience[0] ? (
                <span>
                  Từng làm <b>{profile.userExperience[0].title}</b> tại{" "}
                  <b>{profile.userExperience[0].companyname}</b>
                </span>
              ) : (
                  "-/-"
                )}
              {profile.userExperience[0] ? (
                <p>{profile.userExperience[0].description}</p>
              ) : (
                  "-/-"
                )}
            </div>
            <div className="job-reward info-box">
              <label>Học vấn</label>
              {profile.userStudyGraduation[0] ? (
                <span>
                  Từng học <b>{profile.userStudyGraduation[0].specialized}</b>{" "}
                  tại <b>{profile.userStudyGraduation[0].schoolname}</b>
                </span>
              ) : (
                  ""
                )}
              {profile.userStudyGraduation[0] ? (
                <span>
                  <b>Trình độ: </b>
                  {profile.userStudyGraduation[0].qualificationname}
                </span>
              ) : (
                  ""
                )}
              {profile.userStudyGraduation[0] ? (
                <span>
                  <b>Mã hớp: </b>
                  {profile.userStudyGraduation[0].codeclass}
                </span>
              ) : (
                  ""
                )}
              {profile.userStudyGraduation[0] ? (
                <span>
                  <b>Loại tốt nghiệp: </b>
                  {profile.userStudyGraduation[0].graduationname}
                </span>
              ) : (
                  ""
                )}
            </div>
            <div className="job-reward info-box">
              <label>Sống tại</label>
              <span>{profile.address}</span>
            </div>
            <div className="job-reward info-box">
              <label>Thông tin liên hệ</label>
              <span className="email">{profile.email}</span>
            </div>
            <div className="job-reward info-box">
              <label>Thông tin cơ bản</label>
              <ul>
                <li>
                  <label>{profile.gendertext}</label>
                  <span>Giới tính</span>
                </li>
                <li>
                  <label>
                    {moment(profile.birthday).format("D [tháng] M, YYYY")}
                  </label>
                  <span>Ngày sinh</span>
                </li>
              </ul>
            </div>
            <div className="job-reward info-box">
              <label>Kỹ năng & sở trường</label>
              <ul>
                <li>
                  <label>Kỹ năng</label>
                  {profile.userSkill && profile.userSkill.length > 0 ? (
                    <ul className="skill-list">
                      {profile.userSkill.map((item, index) => (
                        <li key={index}>
                          <span>{item.skill_name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                      ""
                    )}
                </li>
                {/* <li>
                  <label>Sở trường</label>
                  <span>-/-</span>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      ) : (
          ""
        )}
    </Drawer>
  );
};

const renderFolowRewardDrawer = (component) => {
  let {
    profile
  } = component.props
  let {
    showFolowRewardDrawer
  } = component.state
  return (
    <Drawer
      anchor="bottom"
      className="drawer-detail"
      open={showFolowRewardDrawer}
      onClose={() => component.setState({ showFolowRewardDrawer: false })}
    >
      {profile ? (
        <FolowReward userId={profile.id} onClose={() => component.setState({ showFolowRewardDrawer: false })} />
      ) : (
          ""
        )}
    </Drawer>
  );
}


const renderSettingDrawer = (component) => {
  let {
    isMuteInNewfeed,
    isMuteInNewfeed_clone,
    showSettingDrawer,
    autoPlayRole,
    autoPlayRole_clone,
    isSettingChange,
  } = component.state;
  // BINH: change setting when click back button
  return (
    <Drawer anchor="bottom" className="fit-popup" open={showSettingDrawer}>
      <div className="drawer-detail setting-drawer">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => {
              if (isSettingChange) {
                component.setState({
                  showSettingDrawer: false,
                  isSettingChange: false,
                  isMuteInNewfeed: isMuteInNewfeed_clone,
                  autoPlayRole: autoPlayRole_clone
                });
              } else {
                component.setState({
                  showSettingDrawer: false,
                  isSettingChange: false,
                });
              }
            }}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Cài đặt video</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form">
          <div>
            <span>Tắt tiếng video trên bản tin</span>
            <Switch
              checked={isMuteInNewfeed}
              handleColor="#fff"
              offColor="#666"
              onChange={() => {
                component.setState({ isMuteInNewfeed_clone: isMuteInNewfeed })
                component.setState({
                  isMuteInNewfeed: !isMuteInNewfeed,
                  isSettingChange: true,
                });
              }}
              onColor="#ff5a5a"
              className="custom-switch"
            />
          </div>
          <div>
            <span>Tự động phát video</span>
            <span
              onClick={() => {
                component.setState({ autoPlayRole_clone: autoPlayRole })
                component.setState({
                  showAutoPlaySetting: true,
                  autoPlayOptionSelected: autoPlayRole,
                })
              }
              }
            >
              {autoPlayRole === "all" && <span>Wifi/3G/4G</span>}
              {autoPlayRole === "wifi" && <span>Chỉ Wifi</span>}
              {autoPlayRole === "disable" && <span>Không</span>}
              <NavigateNextIcon />
            </span>
          </div>
          {isSettingChange && (
            <Button
              className="bt-submit"
              onClick={() => {
                localStorage.setItem(
                  APP_SETTING,
                  JSON.stringify({
                    autoPlayRole: autoPlayRole,
                    isMuteInNewfeed: isMuteInNewfeed,
                  })
                );
                component.setState({
                  isSettingChange: false,
                });
              }}
            >
              Lưu thay đổi
            </Button>
          )}
          {renderAutoPlaySettingDrawer(component)}
        </div>
      </div>
    </Drawer>
  );
};

const renderAutoPlaySettingDrawer = (component) => {
  let {
    showAutoPlaySetting,
    autoPlayOptionSelected,
    isSettingChange,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="auto-play-setting fit-popup"
      open={showAutoPlaySetting}
      onClose={() => component.setState({ showAutoPlaySetting: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({ showAutoPlaySetting: false })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Tự động phát</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="detail-content"
          style={{ overflow: "auto" }}
        >
          <ul className="auto-option">
            <li
              onClick={() =>
                component.setState({
                  autoPlayOptionSelected: "all",
                  isSettingChange: true,
                })
              }
            >
              <span>Khi dùng Wifi và dữ liệu di động</span>
              {autoPlayOptionSelected === "all" ? <CheckIcon /> : ""}
            </li>
            <li
              onClick={() =>
                component.setState({
                  autoPlayOptionSelected: "wifi",
                  isSettingChange: true,
                })
              }
            >
              <span>Chỉ khi có kết nối Wifi</span>
              {autoPlayOptionSelected === "wifi" ? <CheckIcon /> : ""}
            </li>
            <li
              onClick={() =>
                component.setState({
                  autoPlayOptionSelected: "disable",
                  isSettingChange: true,
                })
              }
            >
              <span>Không bao giờ tự động phát video</span>
              {autoPlayOptionSelected === "disable" ? <CheckIcon /> : ""}
            </li>
          </ul>
          {isSettingChange && (
            <Button
              className="bt-submit"
              onClick={() => {
                component.setState({
                  autoPlayRole: autoPlayOptionSelected,
                  showAutoPlaySetting: false,
                  isSettingChange: false
                })
                const settings = JSON.parse(localStorage.getItem(APP_SETTING))
                localStorage.setItem(
                  APP_SETTING,
                  JSON.stringify({
                    ...settings,
                    autoPlayRole: autoPlayOptionSelected,
                  })
                );
              }
              }
            >
              Lưu thay đổi
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
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
      {value === index && <div>{children}</div>}
    </div>
  );
}
