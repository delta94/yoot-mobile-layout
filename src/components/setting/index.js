import React from "react";
import "./style.scss";
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
} from "../../actions/app";
import {
  setUserProfile,
  getFolowedMe,
  getMeFolowing,
} from "../../actions/user";
import { setCurrenUserDetail } from "../../actions/user";
import {
  PhotoCamera as PhotoCameraIcon,
  ChevronLeft as ChevronLeftIcon,
  MoreHoriz as MoreHorizIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  Check as CheckIcon,
} from "@material-ui/icons";
import { connect } from "react-redux";
import Switch from "react-ios-switch";
import {
  IconButton,
  Drawer,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  AppBar,
  Tabs,
  Tab,
  Badge,
} from "@material-ui/core";
import moment from "moment";
import { signOut } from "../../auth";
import { renderVNDays } from "../../utils/app";
import UserInfo from "../profile-page/user-info";
import Experiendces from "../profile-page/experiences";
import Educaction from "../profile-page/education";
import Hoppies from "../profile-page/hoppies";
import SwipeableViews from "react-swipeable-views";
import Dropzone from "react-dropzone";
import MultiInput from "../common/multi-input";
import Loader from "../common/loader";
import "react-image-crop/lib/ReactCrop.scss";
import Cropper from "../common/cropper";
import { postFormData, get, post } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import {
  showNotification,
  objToQuery,
  jsonFromUrlParams,
  formatCurrency,
} from "../../utils/common";
import { signIn } from "../../auth";
import $ from "jquery";
import { APP_SETTING } from "../../constants/localStorageKeys";

const noti = require("../../assets/icon/NotiBw@1x.png");
const profileBw = require("../../assets/icon/ProfileBW.png");
const settingBw = require("../../assets/icon/seting@1x.png");
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
const Lesson = require("../../assets/icon/Lesson.png");
const Video = require("../../assets/icon/Video.png");
const Group1 = require("../../assets/icon/Group1@1x.png");
const NotiBw = require("../../assets/icon/NotiBw@1x.png");
const Profile = require("../../assets/icon/Profile.png");

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
    };
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
    let {
      avatarToUpload,
      rootAvatarToUpload,
      isProccessing,
      postContent,
    } = this.state;
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
            "image_1_" + avatarToUpload.width + "_" + avatarToUpload.height,
            avatarFileToUpload
          );
        } else {
          formData.append(
            "image_1_" + img.width + "_" + img.height,
            rootAvatarToUpload
          );
        }

        formData.append("content", postContent);
        formData.append(
          "imageroot_0_" + img.width + "_" + img.height,
          rootAvatarToUpload
        );

        postFormData(
          SOCIAL_NET_WORK_API,
          "User/UpdateAvatar",
          formData,
          (result) => {
            that.getProfile();
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

  updateBackground() {
    let {
      backgroundToUpload,
      rootBackgroundToUpload,
      isProccessing,
    } = this.state;
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
          let backgroundFileToUpload = new File(
            [backgroundToUpload.file],
            backgroundToUpload.file.name,
            {
              type: backgroundToUpload.file.type,
              lastModified: new Date(),
              part: backgroundToUpload.file.name,
            }
          );
          formData.append(
            "image_1_" +
              backgroundToUpload.width +
              "_" +
              backgroundToUpload.height,
            backgroundFileToUpload
          );
        } else {
          formData.append(
            "image_1_" + img.width + "_" + img.height,
            rootBackgroundToUpload
          );
        }

        formData.append("content", "");
        formData.append(
          "imageroot_0_" + img.width + "_" + img.height,
          rootBackgroundToUpload
        );

        postFormData(
          SOCIAL_NET_WORK_API,
          "User/UpdateBackground",
          formData,
          (result) => {
            that.getProfile();
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

  getHistoryPoint() {
    let { historyPointCurrentPage } = this.state;
    let param = {
      currentpage: historyPointCurrentPage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
    };
    get(
      SOCIAL_NET_WORK_API,
      "User/GetHistoryPoint" + objToQuery(param),
      (result) => {
        if (result.staus == 1) {
          this.setState({
            historyPoints: result.content.histories,
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

  changePassword() {
    let {
      oldPassForChange,
      newPassForChange,
      confirmPassForChange,
    } = this.state;
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

  componentWillMount() {
    this.props.addFooterContent(renderFooter(this));
    this.props.addHeaderContent(renderHeader(this));
    this.props.toggleHeader(true);
    this.props.toggleFooter(true);
    this.getRejectFriends(0, 0);
    this.getFriends(0);
  }

  componentDidMount() {
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
  }

  render() {
    let { profile } = this.props;
    return profile ? (
      <div className="setting-page">
        <div className="user-menu">
          <ul className="menu-list">
            <li>
              <Button
                onClick={() => this.setState({ showUpdateProfile: true })}
              >
                Cập nhật thông tin cá nhân
              </Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  this.props.setCurrenUserDetail(profile);
                  this.props.toggleUserHistory(true);
                  this.getHistoryPoint(0);
                }}
              >
                Lịch sử tích điểm
              </Button>
            </li>
            <li>
              <Button
                onClick={() => this.setState({ showSettingDrawer: true })}
              >
                Cài đặt video
              </Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  this.props.toggleChangePasswordForm(true);
                }}
              >
                Đổi mật khẩu
              </Button>
            </li>
            <li>
              <Button onClick={() => this.props.toggleBlockFriendForm(true)}>
                Danh sách chặn
              </Button>
            </li>
            <li className="sign-out">
              <Button
                style={{ background: "#ff5a59" }}
                onClick={() => signOut()}
              >
                Đăng xuất tài khoản
              </Button>
            </li>
          </ul>
        </div>

        {/* {
          renderUserMenuDrawer(this)
        } */}
        {renderUpdateProfileDrawer(this)}
        {renderUserHistoryDrawer(this)}
        {renderChangePasswordDrawer(this)}
        {renderBlockFriendDrawer(this)}
        {renderFriendsForBlockDrawer(this)}
        {renderConfirmDrawer(this)}
        {renderSettingDrawer(this)}
      </div>
    ) : (
      ""
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.user,
    ...state.noti,
  };
};

const mapDispatchToProps = (dispatch) => ({
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const renderHeader = () => {
  return (
    <div className="app-header">
      <IconButton
        style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
      >
        <ChevronLeftIcon
          style={{ color: "#ff5a59", width: "25px", height: "25px" }}
        />
      </IconButton>
      <label>Quản lý tài khoản</label>
    </div>
  );
};

const renderFooter = (component) => {
  let pathName = window.location.pathname;
  let { woldNotiUnreadCount } = component.props;
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
          {woldNotiUnreadCount > 0 ? (
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
        <li onClick={() => component.props.history.replace("/profile")}>
          <img src={profileBw}></img>
          <span>Cá nhân</span>
        </li>
        <li>
          <img src={settingBw}></img>
          <span style={{ color: "#f54746" }}>Cài đặt</span>
        </li>
      </ul>
    </div>
  );
};

const renderUpdateProfileDrawer = (component) => {
  let { showUpdateProfile } = component.state;
  let { profile } = component.props;
  return (
    <Drawer
      anchor="bottom"
      className="update-profile-form"
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
        <label>Cập nhật thông tin</label>
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
      anchor="right"
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
                  <span>Điểm YOOT: {formatCurrency(new Intl.NumberFormat('de-DE').format(profile.mempoint), 0)}</span>
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
            style={{ overflow: "scroll", width: "100%" }}
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
      anchor="right"
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
            width: "100vw",
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
      anchor="right"
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
          style={{ overflow: "scroll", width: "100vw" }}
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
      anchor="right"
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
            placeholder="Tìm kiếm"
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
          style={{ overflow: "scroll", width: "100vw" }}
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
    <Drawer anchor="right" open={showSettingDrawer}>
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
                  autoPlayRole:autoPlayRole_clone
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
        <div className="content-form" style={{ width: "100vw" }}>
          <div>
            <span>Tắt tiếng video trên bản tin</span>
            <Switch
              checked={isMuteInNewfeed}
              handleColor="#fff"
              offColor="#666"
              onChange={() => {
                component.setState({isMuteInNewfeed_clone:isMuteInNewfeed})
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
              onClick={() =>{
                component.setState({autoPlayRole_clone:autoPlayRole})
                component.setState({
                  showAutoPlaySetting: true,
                  autoPlayOptionSelected: autoPlayRole,
                })}
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

const renderAutoPlaySettingDrawer = (component) => {
  let {
    showAutoPlaySetting,
    autoPlayOptionSelected,
    isSettingChange,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="auto-play-setting"
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
          style={{ overflow: "scroll", width: "100vw" }}
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
              onClick={() =>{
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
