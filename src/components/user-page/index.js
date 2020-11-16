import React from "react";
import "./style.scss";
import {
  toggleUserDetail,
  toggleUserHistory,
  toggleChangePasswordForm,
  toggleBlockFriendForm,
  toggleFriendDrawer,
  togglePostDrawer,
  setMediaToViewer,
  toggleMediaViewerDrawer,
  toggleUserPageDrawer,
} from "../../actions/app";
import {
  setCurrenUserDetail,
  updateChangeFolowed,
  updateChangeFolowing,
} from "../../actions/user";
import { setUserPosted } from "../../actions/posted";
import {
  PhotoCamera as PhotoCameraIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
} from "@material-ui/icons";
import { connect } from "react-redux";
import {
  IconButton,
  Drawer,
  Button,
  AppBar,
  Tabs,
  Tab,
  Avatar,
} from "@material-ui/core";
import moment from "moment";
import SwipeableViews from "react-swipeable-views";
import { get, post } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import ContentLoader from "react-content-loader";
import Loader from "../common/loader";
import { objToQuery } from "../../utils/common";
import Friends from "./friend";
import Medias from "./medias";
import Videos from "./videos";
import Post from "../post";
import $ from "jquery";
import ClickTooltip from "../common/click-tooltip";
import FolowReward from './following'

const coin = require("../../assets/icon/Coins_Y.png");
const address = require("../../assets/icon/address@1x.png");
const like = require("../../assets/icon/like@1x.png");
const follower = require("../../assets/icon/Follower@1x.png");
const birthday = require("../../assets/icon/Birthday.png");
const sex = require("../../assets/icon/Sex.png");
const education = require("../../assets/icon/Education.png");
const job = require("../../assets/icon/job@1x.png");
const donePractice = require("../../assets/icon/DonePractive@1x.png");
const uploadImage = require("../../assets/icon/upload_image.png");
const uploadVideo = require("../../assets/icon/upload_video.png");
const defaultImage = "https://dapp.dblog.org/img/default.jpg";

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
      userDetail: null,
      isLoadMore: false,
      friends: [],
      isEndOfFriends: false,
      friendsCurrentPage: 0,
      followeds: [],
      followings: [],
      userDetailFolowTabIndex: 0,
      postedsCurrentPage: 0,
      isEndOfPosteds: false,
      isLoading: false,
      numOfFollowed: 0,
      numOfFollowing: 0,
      numOfFriend: 0,
    };
    this.getFollowed = this.getFollowed.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
  }
  getProfile(id) {
    let { friendsCurrentPage } = this.state;
    get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=" + id, (result) => {
      if (result && result.result == 1) {
        //BINH: change phân quyền thông tin cá nhân
        const { authorizeUsers, statusfriend } = result.content.user;
        let resultState = result.content.user;
        let authorShowInfo = [];
        const { userExperience } = result.content.user;
        let userExperienceAuth = [];

        if (statusfriend && statusfriend === 10) {
          authorShowInfo =
            authorizeUsers &&
            authorizeUsers.filter((item) => item.levelid === 4);
          userExperienceAuth = userExperience.filter(
            (item) => item.levelauthorizeid !== 4
          );
          resultState.userExperience = resultState.userExperience.filter(
            (item) => item.levelauthorizeid !== 4
          );
          resultState.userStudyGraduation = resultState.userStudyGraduation.filter(
            (item) => item.levelauthorizeid !== 4
          );
        } else {
          authorShowInfo =
            authorizeUsers &&
            authorizeUsers.filter(
              (item) => item.levelid === 4 || item.levelid === 3
            );
          resultState.userExperience = resultState.userExperience.filter(
            (item) => item.levelauthorizeid !== 4 && item.levelauthorizeid !== 3
          );
          resultState.userStudyGraduation = resultState.userStudyGraduation.filter(
            (item) => item.levelauthorizeid !== 4 && item.levelauthorizeid !== 3
          );
        }
        if (
          authorShowInfo.some((item) => item.authorizeinfoid === 2) &&
          authorShowInfo.some((item) => item.authorizeinfoid === 3)
        ) {
          resultState.birthday = "";
        } else if (authorShowInfo.some((item) => item.authorizeinfoid === 2)) {
          resultState.birthday = moment(resultState.birthday).format("YYYY");
        } else if (authorShowInfo.some((item) => item.authorizeinfoid === 3)) {
          resultState.birthday = moment(resultState.birthday).format(
            "D [tháng] M"
          );
        } else {
          resultState.birthday = moment(resultState.birthday).format(
            "D [tháng] M, YYYY"
          );
        }

        for (let i = 0; i < authorShowInfo.length; i++) {
          if (authorShowInfo[i].authorizeinfoid === 1) {
            resultState.address = "";
          } else if (authorShowInfo[i].authorizeinfoid === 4) {
            resultState.gendertext = "";
          } else if (authorShowInfo[i].authorizeinfoid === 5) {
            resultState.userStudy = [];
          } else if (authorShowInfo[i].authorizeinfoid === 6) {
            resultState.email = "";
          } else if (authorShowInfo[i].authorizeinfoid === 7) {
            resultState.phone = "";
          }
        }

        this.setState({
          userDetail: resultState,
        });
        this.getFriends(id, friendsCurrentPage);
        this.getFollowed(0, id);
        this.getFollowing(0, id);
        this.getFollowedCount(id);
        this.getFollowingCount(id);
      }
    });
  }

  getFollowedCount(userId) {
    let param = {
      currentdate: moment(new Date()).format(CurrentDate),
      status: "Followed",
      forFriendId: userId,
    };
    let queryParam = objToQuery(param);
    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetCountListFriends" + queryParam,
      (result) => {
        if (result.result == 1) {
          this.setState({
            numOfFollowed: result.content.count,
          });
        }
      }
    );
  }

  getFollowingCount(userId) {
    let param = {
      currentdate: moment(new Date()).format(CurrentDate),
      status: "Following",
      forFriendId: userId,
    };
    let queryParam = objToQuery(param);
    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetCountListFriends" + queryParam,
      (result) => {
        if (result.result == 1) {
          this.setState({
            numOfFollowing: result.content.count,
          });
        }
      }
    );
  }

  getFollowed(currentPage, userId) {
    let param = {
      currentpage: currentPage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      status: "Followed",
      forFriendId: userId,
      groupid: 0,
    };
    let queryParam = objToQuery(param);
    this.setState({ pageFollowed: currentPage });
    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetListFriends" + queryParam,
      (result) => {
        if (result.result == 1) {
          let { followeds } = this.state;
          followeds = followeds.concat(result.content.userInvites);
          this.setState({
            followeds: followeds,
          });
        }
      }
    );
  }

  getFollowing(currentPage, userId) {
    let param = {
      currentpage: currentPage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      status: "Following",
      forFriendId: userId,
      groupid: 0,
    };
    let queryParam = objToQuery(param);
    this.setState({ pageFollowing: currentPage });
    get(
      SOCIAL_NET_WORK_API,
      "Friends/GetListFriends" + queryParam,
      (result) => {
        if (result.result == 1) {
          let { followings } = this.state;
          followings = followings.concat(result.content.userInvites);
          this.setState({
            followings: followings,
          });
        }
      }
    );
  }

  getFriends(userId, currentpage) {
    let { friends } = this.state;
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      status: "Friends",
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
        if (result && result.result == 1) {
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

  getPosted(userId, currentpage) {
    let { userPosteds, userDetail } = this.props;
    let posteds = [];
    if (userDetail && userPosteds[userDetail.id]) {
      posteds = posteds.concat(userPosteds[userDetail.id]);
    }

    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
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
          result.content.newsFeeds.map((item) => {
            if (item.iconlike < 0) item.iconlike = 0;
          });
          this.props.setUserPosted(
            posteds.concat(result.content.newsFeeds),
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

  onScroll() {
    // let {
    //   userDetail
    // } = this.props
    // if (!userDetail) return
    // userDetail.id = userDetail.userid
    // let element = $("#user-page-" + userDetail.id)
    // let {
    //   isLoading,
    //   isEndOfPosteds,
    //   postedsCurrentPage,
    // } = this.state
    // if (element)
    //   if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
    //     if (isLoading == false && isEndOfPosteds == false) {
    //       this.setState({
    //         postedsCurrentPage: postedsCurrentPage + 1,
    //         isLoading: false
    //       }, () => {
    //         this.getPosted(userDetail.id, postedsCurrentPage)
    //       })
    //     }
    //   }
  }

  addFriend(friendId) {
    let param = {
      friendid: friendId,
    };
    get(
      SOCIAL_NET_WORK_API,
      "Friends/AddOrDeleteInviateFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.getProfile(friendId);
        }
      }
    );
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
          this.setState({
            friends: friends.filter((friend) => friend.friendid != friendid),
            allUsers: allUsers.filter((friend) => friend.friendid != friendid),
            showFriendActionsDrawer: false,
          });
        }
      }
    );
  }

  bandFriend(friendid) {
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/BandFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.props.toggleUserPageDrawer(false);
          this.setState({
            showUserMenu: false,
          });
        }
      }
    );
  }

  unFolowFriend(friendid) {
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/UnFollowFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", (result) => {
            if (result && result.result == 1) {
              this.props.updateChangeFolowed();
              this.props.updateChangeFolowing();
            }
          });
          this.setState({
            showUserMenu: false,
            followeds: this.state.followeds.map((item) =>
              item.friendid === friendid ? { ...item, ismefollow: 0 } : item
            ),
            followings: this.state.followings.map((item) =>
              item.friendid === friendid ? { ...item, ismefollow: 0 } : item
            ),
          });
        }
      }
    );
  }

  folowFriend(friendid) {
    let param = {
      friendid: friendid,
    };
    if (!friendid) return;
    get(
      SOCIAL_NET_WORK_API,
      "Friends/FollowFriends" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", (result) => {
            if (result && result.result == 1) {
              this.props.updateChangeFolowed();
              this.props.updateChangeFolowing();
            }
          });
          this.setState({
            showUserMenu: false,
            followeds: this.state.followeds.map((item) =>
              item.friendid === friendid ? { ...item, ismefollow: 1 } : item
            ),
            followings: this.state.followings.map((item) =>
              item.friendid === friendid ? { ...item, ismefollow: 1 } : item
            ),
          });
        }
      }
    );
  }
  getNumOfFriend(friendid) {
    let param = {
      currentdate: moment(new Date()).format(CurrentDate),
      status: "Friends",
      forFriendId: friendid,
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

  componentDidMount() {
    let { userDetail } = this.props;
    if (userDetail) {
      this.getProfile(userDetail.friendid);
      this.getPosted(userDetail.friendid, 0);
      this.getNumOfFriend(userDetail.friendid);
    }
  }
  render() {
    let {
      openVideoDrawer,
      userDetail,
      friends,
      showFriendDrawer,
      openMediaDrawer,
      numOfFriend,
    } = this.state;

    let { onClose, userPosteds } = this.props;

    let posteds = [];
    if (userDetail) {
      posteds = userPosteds[userDetail.id];
    }
    return (
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              onClose ? onClose() : this.props.toggleUserPageDrawer(false)
            }
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Trang cá nhân</label>
          </div>
          {userDetail ? (
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{userDetail.fullname}</span>
                <span className="point">
                  <span>
                    Điểm YOOT:{" "}
                    {new Intl.NumberFormat("de-DE").format(userDetail.mempoint)}
                  </span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div
                  className="img"
                  style={{ background: `url("${userDetail.avatar}")` }}
                />
              </Avatar>
            </div>
          ) : (
              <ContentLoader
                speed={2}
                width={200}
                height={42}
                viewBox="0 0 200 42"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                style={{ height: "100%" }}
              >
                <rect x="7" y="6" rx="4" ry="4" width="140" height="8" />
                <rect x="47" y="21" rx="8" ry="8" width="100" height="16" />
                <rect x="160" y="0" rx="100" ry="100" width="40" height="40" />
              </ContentLoader>
            )}
        </div>
        <div className="filter"></div>
        <div
          style={{ overflow: "scroll" }}
          onScroll={() => this.onScroll()}
          id={"user-page-scrolling"}
        >
          {userDetail ? (
            <div className="profile-page user-page">
              <div className="none-bg">
                <div
                  className="cover-img"
                  style={{ background: "url(" + userDetail.background + ")" }}
                ></div>
                {userDetail.statusfriend == 10 ? (
                  <IconButton
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    onClick={() => this.setState({ showUserMenu: true })}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                ) : (
                    ""
                  )}
              </div>
              <div className="user-avatar">
                <div
                  className="img"
                  style={{ background: "url(" + userDetail.avatar + ")" }}
                ></div>
              </div>

              <div className="user-info">
                <span className="user-name">{userDetail.fullname}</span>
              </div>

              <div className="react-reward">
                <ul>
                  <li>
                    <ClickTooltip
                      className="item like-count"
                      title="Số lượt thích"
                      placement="top-start"
                    >
                      <span>
                        <img src={like}></img>
                      </span>
                      <span>{userDetail.numlike}</span>
                    </ClickTooltip>
                  </li>
                  <li>
                    <ClickTooltip
                      className="item follow-count"
                      title="Số người theo dõi"
                      placement="top"
                    >
                      <span>
                        <img src={follower}></img>
                      </span>
                      <span>{userDetail.numfollow}</span>
                    </ClickTooltip>
                  </li>
                  <li>
                    <ClickTooltip
                      className="item post-count"
                      title="Số bài đăng"
                      placement="top-end"
                    >
                      <span>
                        <img src={donePractice}></img>
                      </span>
                      <span>{userDetail.numpost}</span>
                    </ClickTooltip>
                  </li>
                </ul>
              </div>

              {userDetail.statusfriend != 10 ? (
                <div className="friend-actions">
                  {userDetail.statusfriend == 0 ||
                    userDetail.statusfriend == 5 ? (
                      <Button
                        className="bt-submit"
                        onClick={() => this.addFriend(userDetail.id)}
                      >
                        Kết bạn
                      </Button>
                    ) : (
                      ""
                    )}
                  {userDetail.statusfriend == 1 ? (
                    <Button
                      className="bt-submit"
                      onClick={() => this.addFriend(userDetail.id)}
                    >
                      Huỷ
                    </Button>
                  ) : (
                      ""
                    )}
                  {userDetail.ismefollow == 0 ? (
                    <Button
                      className="bt-cancel"
                      onClick={() => this.folowFriend(userDetail.id)}
                    >
                      Theo dõi
                    </Button>
                  ) : (
                      ""
                    )}
                  {userDetail.ismefollow == 1 ? (
                    <Button
                      className="bt-cancel"
                      onClick={() =>
                        this.setState({
                          okCallback: () => this.unFolowFriend(userDetail.id),
                          confirmTitle: "",
                          confirmMessage:
                            "Bạn có chắc chắn muốn bỏ theo dõi người này không?",
                          showConfim: true,
                        })
                      }
                    >
                      Bỏ theo dõi
                    </Button>
                  ) : (
                      ""
                    )}
                  <IconButton
                    className="bt-more"
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    onClick={() => this.setState({ showUserMenu: true })}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </div>
              ) : (
                  ""
                )}

              <div className="user-profile">
                <ul>
                  {userDetail.userExperience &&
                    userDetail.userExperience.length > 0 ? (
                      <li>
                        <img src={job} />
                        <span className="title">
                          Từng làm <b>{userDetail.userExperience[0].title}</b> tại{" "}
                          <b>{userDetail.userExperience[0].companyname}</b>
                        </span>
                      </li>
                    ) : (
                      ""
                    )}
                  {userDetail.userStudyGraduation &&
                    userDetail.userStudyGraduation.length > 0 ? (
                      <li>
                        <img src={education} />
                        <span className="title">
                          Từng học{" "}
                          <b>{userDetail.userStudyGraduation[0].specialized}</b>{" "}
                        tại{" "}
                          <b>{userDetail.userStudyGraduation[0].schoolname}</b>
                        </span>
                      </li>
                    ) : (
                      ""
                    )}
                  {/* BINH: add info address */}
                  {userDetail && userDetail.address && (
                    <li>
                      <img src={address} />
                      <span className="title">
                        Sống tại <b>{userDetail.address}</b>
                      </span>
                    </li>
                  )}
                  {userDetail.birthday ? (
                    <li>
                      <img src={birthday} />
                      <span className="title">
                        Ngày sinh <b>{userDetail.birthday}</b>
                      </span>
                    </li>
                  ) : (
                      ""
                    )}
                  {userDetail.gendertext ? (
                    <li>
                      <img src={sex} />
                      <span className="title">
                        Giới tính <b>{userDetail.gendertext}</b>
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
                  {">>> Xem thêm thông tin của"} {userDetail.fullname}
                </span>
              </div>

              <div className="friend-reward">
                <label>Bạn bè</label>
                <span>{numOfFriend} người bạn</span>

                <div className="friend-list">
                  {friends.length > 0 &&
                    friends.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        className="friend-item"
                        onClick={() => {
                          this.setState({
                            showUserPage: true,
                            currentUserDetail: item,
                          });
                        }}
                      >
                        <div className="avatar">
                          <div
                            className="image"
                            style={{
                              background: "url(" + item.friendavatar + ")",
                            }}
                          ></div>
                        </div>
                        <span className="name">{item.friendname}</span>
                        {item.numfriendwith > 0 ? (
                          <span className="mutual-friend-count">
                            {item.numfriendwith} bạn chung
                          </span>
                        ) : (
                            ""
                          )}
                      </div>
                    ))}
                </div>
                <Button
                  className="bt-submit"
                  style={{ marginTop: "10px" }}
                  onClick={() => this.setState({ showFriendDrawer: true })}
                >
                  Xem tất cả bạn bè
                </Button>
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
                {posteds && posteds.length > 0 ? (
                  <ul>
                    {posteds.map((post, index) => (
                      <li key={index}>
                        <Post
                          data={post}
                          history={this.props.history}
                          userId={userDetail.id}
                          containerRef={document.getElementById(
                            "user-page-scrolling"
                          )}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                    ""
                  )}
              </div>

              <Friends
                open={showFriendDrawer}
                userDetail={userDetail}
                onClose={() => this.setState({ showFriendDrawer: false })}
              />
              {renderUserMenuDrawer(this)}
              {renderMediaDrawer(this)}
              {renderUserPageDrawer(this)}
              {renderConfirmDrawer(this)}
              {renderUserDetailDrawer(this)}
              {renderFolowRewardDrawer(this)}
              <Medias
                open={openMediaDrawer}
                onClose={() => this.setState({ openMediaDrawer: false })}
                currentUser={userDetail}
              />
              <Videos
                open={openVideoDrawer}
                onClose={() => this.setState({ openVideoDrawer: false })}
                currentUser={userDetail}
              />
            </div>
          ) : (
              <Loader type={"small"} width={30} height={30} />
            )}
          {/* {

            posteds && posteds.length > 0 && posteds.map((post, index) =>
              <Post data={post} key={index} history={this.props.history} containerRef={document.getElementById("user-page-scrolling")} />
            )
          } */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.user,
    ...state.posted,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateChangeFolowed: () => dispatch(updateChangeFolowed()),
  updateChangeFolowing: () => dispatch(updateChangeFolowing()),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleUserHistory: (isShow) => dispatch(toggleUserHistory(isShow)),
  toggleChangePasswordForm: (isShow) =>
    dispatch(toggleChangePasswordForm(isShow)),
  toggleBlockFriendForm: (isShow) => dispatch(toggleBlockFriendForm(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) =>
    dispatch(toggleMediaViewerDrawer(isShow, feature)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  setUserPosted: (userId, currentpage) =>
    dispatch(setUserPosted(userId, currentpage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

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

const renderUserMenuDrawer = (component) => {
  let { showUserMenu } = component.state;
  let { userDetail } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="user-menu"
      open={showUserMenu}
      onClose={() => component.setState({ showUserMenu: false })}
    >
      <div className="menu-header">
        <IconButton
          style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
          onClick={() => component.setState({ showUserMenu: false })}
        >
          <ChevronLeftIcon
            style={{ color: "#ff5a59", width: "25px", height: "25px" }}
          />
        </IconButton>
        <label>Tuỳ chọn</label>
      </div>
      <ul className="menu-list">
        {userDetail.ismefollow == 1 ? (
          <li>
            <Button
              onClick={() =>
                component.setState({
                  okCallback: () => component.unFolowFriend(userDetail.id),
                  confirmTitle: "",
                  confirmMessage:
                    "Bạn có chắc muốn bỏ theo dõi người này không?",
                  showConfim: true,
                })
              }
            >
              <span>
                <span>Bỏ theo dõi ( {userDetail.fullname} )</span>
                <span>
                  Không nhìn thấy các hoạt động của nhau nữa nhưng vẫn là bạn
                  bè.
                </span>
              </span>
            </Button>
          </li>
        ) : (
            <li onClick={() => component.folowFriend(userDetail.id)}>
              <Button>
                <span>
                  <span>Theo dõi ( {userDetail.fullname} )</span>
                  <span>Nhìn thấy các hoạt động của nhau.</span>
                </span>
              </Button>
            </li>
          )}
        <li>
          <Button
            onClick={() =>
              component.setState({
                okCallback: () => component.bandFriend(userDetail.id),
                confirmTitle: "",
                confirmMessage:
                  "Bạn có chắc chắn muốn chặn người này không? Bạn và người bị chặn sẽ không thể nhìn thấy nhau, đồng thời nếu đang là bạn bè, việc chặn này cũng sẽ huỷ kết bạn của nhau.",
                showConfim: true,
              })
            }
          >
            <span>
              <span>Chặn ( {userDetail.fullname} )</span>
              <span>Bạn và người này sẽ không thể nhìn thấy nhau</span>
            </span>
          </Button>
        </li>
        {userDetail.statusfriend == 10 ? (
          <li>
            <Button className="bt-submit">Xoá bạn</Button>
          </li>
        ) : (
            ""
          )}
      </ul>
    </Drawer>
  );
};

const renderMediaDrawer = (component) => {
  let { openMediaDrawer, mediaTabIndex } = component.state;
  let { userDetail } = component.props;
  const postedImage = [
    "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
    "https://photofolio.co.uk/wp-content/uploads/2015/01/stock-images-636x476.jpg",
    "https://www.robertwalters.com.hk/content/dam/robert-walters/global/images/article-images/digital-neon.jpg",
    "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg",
  ];
  const albums = [
    {
      name: "abc",
      items: [
        "https://www.robertwalters.com.hk/content/dam/robert-walters/global/images/article-images/digital-neon.jpg",
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
        "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
        "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg",
        "https://photofolio.co.uk/wp-content/uploads/2015/01/stock-images-636x476.jpg",
      ],
    },
    {
      name: "def",
      items: [],
    },
  ];
  return (
    <Drawer
      anchor="bottom"
      open={openMediaDrawer}
      onClose={() => component.setState({ openMediaDrawer: false })}
    >
      {userDetail ? (
        <div className="drawer-detail media-drawer">
          <div className="drawer-header">
            <div
              className="direction"
              onClick={() => component.setState({ openMediaDrawer: false })}
            >
              <IconButton
                style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
              >
                <ChevronLeftIcon
                  style={{ color: "#ff5a59", width: "25px", height: "25px" }}
                />
              </IconButton>
              <label>Album của {userDetail.fullname}</label>
            </div>
          </div>
          <div className="filter">
            <AppBar position="static" color="default" className="custom-tab-1">
              <Tabs
                value={mediaTabIndex}
                onChange={(e, value) =>
                  component.setState({ mediaTabIndex: value })
                }
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                className="tab-header"
              >
                <Tab label="Bài đăng" {...a11yProps(0)} className="tab-item" />
                <Tab
                  label="Ảnh đại diện"
                  {...a11yProps(1)}
                  className="tab-item"
                />
                <Tab label="Ảnh bìa" {...a11yProps(2)} className="tab-item" />
                <Tab label="Album" {...a11yProps(3)} className="tab-item" />
              </Tabs>
            </AppBar>
          </div>
          <div
            className="content-form"
            style={{ overflow: "scroll", width: "100vw" }}
          >
            <SwipeableViews
              index={mediaTabIndex}
              onChangeIndex={(value) =>
                component.setState({ mediaTabIndex: value })
              }
              className="tab-content"
            >
              <TabPanel value={mediaTabIndex} index={0} className="content-box">
                <div className="image-posted image-box">
                  <ul className="image-list">
                    {postedImage.map((item, index) => (
                      <li
                        style={{ background: "url(" + item + ")" }}
                        key={index}
                        onClick={() => {
                          component.props.setMediaToViewer({
                            commentCount: 30,
                            likeCount: 10,
                            content:
                              "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code.",
                            userName: "Tester 001202",
                            date: new Date(),
                            medias: [
                              {
                                type: "image",
                                url: item,
                              },
                            ],
                          });
                          component.props.toggleMediaViewerDrawer(true, {
                            canDownload: true,
                            showInfo: true,
                          });
                        }}
                      ></li>
                    ))}
                  </ul>
                </div>
              </TabPanel>
              <TabPanel value={mediaTabIndex} index={1} className="content-box">
                <div className="avatar-image image-box">
                  <ul className="image-list">
                    {postedImage.map((item, index) => (
                      <li
                        style={{ background: "url(" + item + ")" }}
                        key={index}
                      ></li>
                    ))}
                  </ul>
                </div>
              </TabPanel>
              <TabPanel value={mediaTabIndex} index={2} className="content-box">
                <div className="cover-image image-box">
                  <ul className="image-list">
                    {postedImage.map((item, index) => (
                      <li
                        style={{ background: "url(" + item + ")" }}
                        key={index}
                      ></li>
                    ))}
                  </ul>
                </div>
              </TabPanel>
              <TabPanel value={mediaTabIndex} index={3} className="content-box">
                <div className="album image-box">
                  <ul>
                    <li className="add-bt">
                      <div className="demo-bg">
                        <AddIcon />
                      </div>
                      <span className="name">Tạo album</span>
                    </li>
                    {albums.map((album, index) => (
                      <li key={index}>
                        <div
                          style={{ background: "url(" + defaultImage + ")" }}
                        >
                          <div
                            className="demo-bg"
                            style={{
                              background:
                                "url(" +
                                (album.items.length > 0
                                  ? album.items[0]
                                  : defaultImage) +
                                ")",
                            }}
                          />
                        </div>
                        <span className="name">{album.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
      ) : (
          ""
        )}
    </Drawer>
  );
};

const renderUserDetailDrawer = (component) => {
  let {
    showUserDetail,
    followeds,
    followings,
    userDetail,
    userDetailFolowTabIndex,
    numOfFollowed,
    numOfFollowing,
    pageFollowed,
    pageFollowing,
  } = component.state;
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 2;
    if (bottom) {
      if (userDetailFolowTabIndex === 0 && numOfFollowed > followeds.length) {
        component.getFollowed(pageFollowed + 1, userDetail.id);
      } else if (
        userDetailFolowTabIndex === 1 &&
        numOfFollowing > followings.length
      ) {
        component.getFollowing(pageFollowing + 1, userDetail.id);
      }
    }
  };
  return (
    <Drawer
      anchor="bottom"
      className="drawer-detail"
      open={showUserDetail}
      onClose={() => component.setState({ showUserDetail: false })}
    >
      {userDetail ? (
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
                <span className="user-name">{userDetail.fullname}</span>
                <span className="point">
                  <span>
                    Điểm YOOT:{" "}
                    {new Intl.NumberFormat("de-DE").format(userDetail.mempoint)}
                  </span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div
                  className="img"
                  style={{ background: `url("${userDetail.avatar}")` }}
                />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div style={{ overflow: "scroll" }}>
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
                  label={"Người theo dõi "}
                  {...a11yProps(0)}
                  className="tab-item"
                  onClick={() => userDetailFolowTabIndex == 0 ? component.setState({ showFolowRewardDrawer: true }) : ""}
                />
                <Tab
                  label={"Đang theo dõi "}
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
                <div className="folowed-list" onScroll={handleScroll}>
                  <div className="friend-count p10 pt00 pb00">
                    <span>Số lượng</span>
                    <span className="red">{numOfFollowed}</span>
                  </div>
                  {followeds && followeds.length > 0 ? (
                    <ul>
                      {followeds.map((item, index) => (
                        <li className="small-user-layout" key={index}>
                          <Avatar
                            aria-label="recipe"
                            className="avatar"
                            onClick={() => {
                              component.setState({
                                showUserPage: true,
                                currentUserDetail: item,
                              });
                            }}
                          >
                            <img
                              src={item.friendavatar}
                              style={{ width: "100%" }}
                            />
                          </Avatar>
                          {/* BINH: add number friend */}
                          <div className="friend-title">
                            <b
                              className="user-name"
                              onClick={() => {
                                component.setState({
                                  showUserPage: true,
                                  currentUserDetail: item,
                                });
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
                <div className="folowing-list" onScroll={handleScroll}>
                  <div className="friend-count p10 pt00 pb00">
                    <span>Số lượng</span>
                    <span className="red">{numOfFollowing}</span>
                  </div>
                  {followings && followings.length > 0 ? (
                    <ul>
                      {followings.map((item, index) => (
                        <li className="small-user-layout" key={index}>
                          <Avatar
                            aria-label="recipe"
                            className="avatar"
                            onClick={() => {
                              component.setState({
                                showUserPage: true,
                                currentUserDetail: item,
                              });
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
                                component.setState({
                                  showUserPage: true,
                                  currentUserDetail: item,
                                });
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
              {userDetail.userExperience[0] && (
                <span>
                  Từng làm <b>{userDetail.userExperience[0].title}</b> tại{" "}
                  <b>{userDetail.userExperience[0].companyname}</b>
                </span>
              )}
              {userDetail.userExperience[0] && (
                <p>{userDetail.userExperience[0].description}</p>
              )}
            </div>
            <div className="job-reward info-box">
              <label>Học vấn</label>
              {userDetail.userStudyGraduation[0] ? (
                <span>
                  Từng học{" "}
                  <b>{userDetail.userStudyGraduation[0].specialized}</b> tại{" "}
                  <b>{userDetail.userStudyGraduation[0].schoolname}</b>
                </span>
              ) : (
                  ""
                )}
              {userDetail.userStudyGraduation[0] ? (
                <span>
                  <b>Trình độ: </b>
                  {userDetail.userStudyGraduation[0].qualificationname}
                </span>
              ) : (
                  ""
                )}
              {userDetail.userStudyGraduation[0] ? (
                <span>
                  <b>Mã hớp: </b>
                  {userDetail.userStudyGraduation[0].codeclass}
                </span>
              ) : (
                  ""
                )}
              {userDetail.userStudyGraduation[0] ? (
                <span>
                  <b>Loại tốt nghiệp: </b>
                  {userDetail.userStudyGraduation[0].graduationname}
                </span>
              ) : (
                  ""
                )}
            </div>

            <div className="job-reward info-box">
              <label>Sống tại</label>
              {userDetail.address && <span>{userDetail.address}</span>}
            </div>

            <div className="job-reward info-box">
              <label>Thông tin liên hệ</label>
              {userDetail.email && (
                <span className="email">{userDetail.email}</span>
              )}
            </div>

            <div className="job-reward info-box">
              <label>Thông tin cơ bản</label>
              <ul>
                {userDetail.gendertext && (
                  <li>
                    <label>{userDetail.gendertext}</label>
                    <span>Giới tính</span>
                  </li>
                )}
                {userDetail.birthday && (
                  <li>
                    <label>{userDetail.birthday}</label>
                    <span>Ngày sinh</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="job-reward info-box">
              <label>Kỹ năng & sở trường</label>
              <ul>
                <li>
                  <label>Kỹ năng</label>
                  {userDetail.userSkill && userDetail.userSkill.length > 0 ? (
                    <ul className="skill-list">
                      {userDetail.userSkill.map((item, index) => (
                        <li key={index}>
                          <span>{item.skill_name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                      ""
                    )}
                </li>
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
    userDetail
  } = component.state
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
      {userDetail ? (
        <FolowReward userId={userDetail.id} onClose={() => component.setState({ showFolowRewardDrawer: false })} />
      ) : (
          ""
        )}
    </Drawer>
  );
}

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

const renderUserPageDrawer = (component) => {
  let { showUserPage, currentUserDetail } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="user-page-drawer"
      open={showUserPage}
      onClose={() => component.setState({ showUserPage: false })}
    >
      {currentUserDetail ? (
        <Index
          {...component.props}
          userDetail={currentUserDetail}
          onClose={() => component.setState({ showUserPage: false })}
        />
      ) : (
          ""
        )}
    </Drawer>
  );
};
