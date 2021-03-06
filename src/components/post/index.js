import React from "react";
import "./style.scss";
import {
  Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Avatar, GridList, GridListTile,
  Menu, MenuItem, Collapse, Button, Drawer, TextField, InputAdornment, Radio,
} from "@material-ui/core";

import {
  Favorite as FavoriteIcon, Share as ShareIcon, MoreHoriz as MoreHorizIcon, FiberManualRecord as FiberManualRecordIcon,
  ChevronLeft as ChevronLeftIcon, MusicOff as MusicOffIcon, MusicNote as MusicNoteIcon, FullscreenExit as FullscreenExitIcon,
  Fullscreen as FullscreenIcon, PlayArrow as PlayArrowIcon, Pause as PauseIcon, Forward10 as Forward10Icon,
  Replay10 as Replay10Icon, Close as CloseIcon, Done as DoneIcon, AssignmentReturn,
} from "@material-ui/icons";
import moment from "moment";
import ScrollTrigger from "react-scroll-trigger";
import { Player, ControlBar, BigPlayButton } from "video-react";
import { connect } from "react-redux";
import $ from "jquery";

import {
  Privacies, ReactSelectorIcon, backgroundList, GroupPrivacies,
} from "../../constants/constants";
import {
  togglePostDrawer, toggleMediaViewerDrawer, setMediaToViewer, toggleUserDetail, toggleUserPageDrawer, setProccessDuration,
  toggleCommentDrawer, toggleCommentImageDrawer, toggleReportComment, setActivePostIndex, setCurrentAlbum, toggleSharePost
} from "../../actions/app";
import { setCurrenUserDetail } from "../../actions/user";
import {
  updatePosted, likePosted, dislikePosted, likeImage, dislikeImage, setCurrentPosted, deletePostSuccess, createPostSuccess
} from "../../actions/posted";

import { setCurrentGroup } from '../../actions/group'
import { toggleGroupDetailDrawer, toggleAlbumDetailDrawer } from '../../actions/app'
import { fromNow, objToQuery, showNotification, } from "../../utils/common";
import FacebookSelector from "../common/facebook-selector";
import Comment from "./comment-item";
import { objToArray, copyToClipboard } from "../../utils/common";
import Loader from "../common/loader";
import { get, post, postFormData } from "../../api";
import { SOCIAL_NET_WORK_API, PostLinkToCoppy, CurrentDate } from "../../constants/appSettings";

import { isMobile, showInfo } from "../../utils/app";
import MultiInput from "../common/multi-input";
import CustomMenu from "../common/custom-menu";
import { APP_SETTING } from "../../constants/localStorageKeys";
import PostContent from './post-content'
import LikeReward from './like-reward'


const maxCols = 6;
const like1 = require("../../assets/icon/like1@1x.png");
const comment = require("../../assets/icon/comment@1x.png");
const comment1 = require("../../assets/icon/comment1@1x.png");
const share = require("../../assets/icon/share@1x.png");
const share1 = require("../../assets/icon/share1@1x.png");
const Group = require("../../assets/icon/Group@1x.png");
const Picture = require("../../assets/icon/Picture@1x.png");
const Send = require("../../assets/icon/Send.png");
const report = require("../../assets/icon/report@1x.png");
const block = require("../../assets/icon/block@1x.png");
const unfollow = require("../../assets/icon/unfollow@1x.png");
const unfriend = require("../../assets/icon/unfriend@1x.png");
const tag = require("../../assets/icon/tag@1x.png");
const Newfeed = require("../../assets/icon/Newfeed@1x.png");
const search = require("../../assets/icon/Find@1x.png");
const mute = require("../../assets/icon/mute.png");
const unmute = require("../../assets/icon/unmute.png");
const thank = require("../../assets/icon/thank.png");


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privacy: Privacies.Public,
      isMuted: true,
      postContent: "",
      reasonSelected: null,
      postReportReason: [],
      orderReasonText: "",
      willBlock: false,
      willUnfriend: false,
      willUnfollow: false,
      friends: [],
      tagedFrieds: [],
      searchKey: "",
      groupForShare: [],
      groupReportReason: [],
    };
    this.player = React.createRef();
    this.thumbnail = React.createRef();
  }

  handleTagFriend(friend) {
    let { tagedFrieds } = this.state;
    let existFriend = tagedFrieds.find((item) => item.friendid === friend.friendid);
    if (existFriend) {
      tagedFrieds = tagedFrieds.filter(
        (item) => item.friendid !== friend.friendid
      );
    } else {
      tagedFrieds.push(friend);
    }
    this.setState({
      tagedFrieds: tagedFrieds,
      isChange: true,
    });
  }

  handleColumnCal(index, length) {
    switch (length) {
      case 2:
        return maxCols / 2;
      case 3:
        if (index == 0) return maxCols;
        else return maxCols / 2;
      case 4:
        if (index == 0) return maxCols;
        else return maxCols / 3;
      case 5:
        if (index < 2) return maxCols / 2;
        else return maxCols / 3;
    }
  }

  handleCellHeightCal(index, length) {
    switch (length) {
      case 2:
        return 300;
      case 3:
        return 150;
      case 4:
        if (index == 0) return 180;
        else return 120;
      case 5:
        if (index < 2) return 180;
        else return 120;
    }
  }

  handleDeletePost() {
    let { data, profile } = this.props;
    post(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/DeleteNewsFeed?postid=" + data.nfid,
      null,
      (result) => {
        if (result && result.result == 1) {
          this.props.deletePostSuccess(data.nfid, profile.id);
          // showInfo("Xoá bài đăng thành công.");
        }
      }
    );
  }

  updateImagePrivacy() {
    let { currentImage, privacySelected } = this.state;
    let { data, profile } = this.props;
    if (currentImage && privacySelected) {
      let param = {
        postid: data.nfid,
        postfor: privacySelected,
      };
      this.setState({
        isProccesing: true,
      });
      post(
        SOCIAL_NET_WORK_API,
        "PostNewsFeed/ChangePostFor" + objToQuery(param),
        null,
        (result) => {
          if (result && result.result == 1) {
            this.setState({
              isProccesing: false,
              showUpdatePrivacyDrawer: false,
            });
            let privacy = objToArray(Privacies).find(
              (item) => item.code == privacySelected
            );
            this.props.updatePosted(
              { ...data, postforid: privacy.code, postforwho: privacy.label },
              profile.id
            );
          }
        }
      );
    }
  }

  likePosted(reaction) {
    let { data, userId } = this.props;
    let {
      sharedPost
    } = this.state
    if (sharedPost) data = sharedPost
    if (!data) return;
    let param = {
      postid: data.nfid,
      icon: reaction.code,
    };
    this.props.likePosted(data, reaction.code, "myPosteds", userId);
    if (data.mediaPlays.length == 1) {
      let image = data.mediaPlays[0];
      this.props.likeImage(data, image.detailimageid, reaction.code, userId);
    }
    this.setState({ isProccesing: false });
    post(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
      null,
      (result) => { }
    );
  }

  dislikePosted() {
    let { data, userId } = this.props;
    let {
      sharedPost
    } = this.state
    if (sharedPost) data = sharedPost
    if (!data) return;
    let param = {
      postid: data.nfid,
      icon: -1,
    };
    this.setState({ isProccesing: false });
    this.props.dislikePosted(data, "myPosteds", userId);
    if (data.mediaPlays.length == 1) {
      let image = data.mediaPlays[0];
      this.props.dislikeImage(data, image.detailimageid, userId);
    }
    post(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
      null,
      (result) => { }
    );
  }

  likeImage(reaction, image) {
    let { data, userId } = this.props;
    let {
      sharedPost
    } = this.state
    if (sharedPost) data = sharedPost
    if (!data) return;
    let param = {
      postid: data.nfid,
      icon: reaction.code,
      nameimage: image.nameimage,
    };
    this.props.likeImage(data, image.detailimageid, reaction.code, userId);
    this.setState({ isProccesing: false });
    post(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
      null,
      (result) => { }
    );
  }

  dislikeImage(image) {
    let { data, userId } = this.props;
    let {
      sharedPost
    } = this.state
    if (sharedPost) data = sharedPost
    if (!data) return;
    let param = {
      postid: data.nfid,
      icon: -1,
      nameimage: image.nameimage,
    };
    this.props.dislikeImage(data, image.detailimageid, userId);
    this.setState({ isProccesing: false });

    post(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/LikeNewsFeed" + objToQuery(param),
      null,
      (result) => { }
    );
  }

  handlePlayVideo() {
    let { data } = this.props;
    let video = this.player.current;
    let thumbnail = this.thumbnail.current;
    this.props.setActivePostIndex(this.props.index ? this.props.index : 0)

    if (video) {
      this.handleSetMuted(true);
      video.play();
      video.subscribeToStateChange((state, prevState) => {
        if (state.ended == true) {
          // this.setState({
          //   isPlaying: false,
          // });
        }
      });
      if (thumbnail) {
        $(thumbnail).fadeOut(1000);
      }
      // this.setState({
      //   isPlaying: true,
      // });

    }
  }

  handlePauseVideo() {
    let video = this.player.current;
    if (video) {
      video.pause();
      let thumbnail = this.thumbnail.current;
      $(thumbnail).fadeIn(1000);
      this.setState({
        isPlaying: false,
      });
    }
  }

  handleSetMuted(isMuted) {
    let video = this.player.current;
    if (video) {
      video.muted = isMuted;
      this.setState({
        isMuted: isMuted,
      });
    }
  }

  handleFullScreen() {
    let { isFullScreen } = this.state;
    let video = this.player.current;
    if (video) {
      video.toggleFullscreen();
      this.setState(
        {
          isFullScreen: !isFullScreen,
        },
        () => {
          this.handleSetMuted(isFullScreen);
        }
      );
    }
  }

  handleChangeCurrentTime(seconds) {
    let video = this.player.current;
    if (video) {
      const { player } = video.getState();
      video.seek(player.currentTime + seconds);
    }
  }

  handleClosePostForm() {
    this.setState({ showUpdateInfoOfProfilePost: false });
  }

  handleOpenReportDrawer() {
    let { data } = this.props;
    if (data.groupidpost == 0) {
      this.setState(
        {
          showLocalMenu: false,
          showReportPostDrawer: true,
        },
        () => this.handleGetReportReasonForPost()
      );
    } else {
      this.setState(
        {
          showLocalMenu: false,
          showReportGroupDrawer: true,
        },
        () => this.handleGetReportReasonForGroup()
      );
    }
  }

  handleGetReportReasonForPost() {
    get(
      SOCIAL_NET_WORK_API,
      "Data/GetListReportIssues?typeissue=PostInGroup",
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            postReportReason: result.content.issues,
          });
        }
      }
    );
  }

  handleGetReportReasonForGroup() {
    get(
      SOCIAL_NET_WORK_API,
      "Data/GetListReportIssues?typeissue=Group",
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            groupReportReason: result.content.issues,
          });
        }
      }
    );
  }

  handleSelectReason(reason) {
    this.setState({
      reasonSelected: reason,
      orderReasonText: "",
    });
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
        if (result && result.result == 1) {
          friends.map((friend) => {
            if (friend.friendid == friendid) friend.ismefollow = 0;
          });
          this.setState({
            friends: friends,
            allUsers: allUsers,
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

  handleReportPost() {
    let {
      reasonSelected,
      orderReasonText,
      willBlock,
      willUnfriend,
      willUnfollow,
    } = this.state;
    if (reasonSelected || orderReasonText != "") {
      let { data } = this.props;
      let param = {
        postid: data.nfid,
        content: orderReasonText,
        issues: [
          {
            issueid: reasonSelected ? reasonSelected.issueid : 0,
          },
        ],
      };
      post(
        SOCIAL_NET_WORK_API,
        "PostNewsFeed/ReportNewsFeed",
        param,
        (result) => {
          if (result && result.result == 1) {
            this.setState({
              showReportSuccessAlert: true,
            });
            if (willBlock == true) {
              this.bandFriend(data.iduserpost);
            }
            if (willUnfollow == true) {
              this.unFolowFriend(data.iduserpost);
            }
            if (willUnfriend == true) {
              this.removeFriend(data.iduserpost);
            }
          }
        }
      );
    } else {
      showNotification(
        "",
        <span className="app-noti-message">Vui lòng chọn tiêu chí.</span>
      );
    }
  }

  handleReportGroup() {
    let { reasonSelected, orderReasonText, willBlock, willUnfriend, willUnfollow } = this.state;
    if (reasonSelected || orderReasonText != "") {
      let { data } = this.props;
      let param = {
        groupuserid: data.groupidpost,
        content: orderReasonText,
        issues: [
          {
            issueid: reasonSelected ? reasonSelected.issueid : 0,
          },
        ],
      };
      post(
        SOCIAL_NET_WORK_API,
        "GroupUser/ReportGroupUser",
        param,
        (result) => {
          if (result && result.result == 1) {
            this.setState({
              showReportSuccessAlert: true,
            });
            if (willBlock == true) {
              this.bandFriend(data.iduserpost);
            }
          }
        }
      );
    } else {
      showNotification(
        "",
        <span className="app-noti-message">Vui lòng chọn tiêu chí.</span>
      );
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
        if (result && result.result == 1) {
          this.setState({
            friends: currentpage === 0 ? result.content.userInvites : friends.concat(result.content.userInvites),
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

  getGroup(currentpage) {
    let { groupSearchKey } = this.state;
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      skin: "Join",
      findstring: groupSearchKey ? groupSearchKey : "",
    };

    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetListGroupUser" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            groupForShare: result.content.groupUsers,
          });
        }
      }
    );
  }

  handleCloseDrawer() {
    this.setState({
      showShareDrawer: false,
      postContent: "",
      tagedFrieds: [],
      privacy: Privacies.Public,
    });
  }

  handleShare(groupId) {
    let {
      postContent,
      mentionSelected,
      hashtagSelected,
      privacy,
      isPosting,
      backgroundSelected,
      tagedFrieds,
      imageSelected,
      videoSelected,
      nfid,
      postedImage,
      postedVideo,
      groupSelected,
    } = this.state;
    let { albumSelected, profile, data } = this.props;
    if (isPosting == true) return;

    this.setState({
      isPosting: true,
    });

    let formData = new FormData();

    formData.append("content", postContent);
    formData.append("postfor", privacy.code.toString());
    formData.append("postshareid", data.nfid.toString());
    if (groupId && groupId > 0) {
      formData.append("groupid", groupId.toString());
    }
    if (groupSelected) {
      formData.append("groupid", groupSelected.groupid.toString());
    }
    if (
      /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?./gm.test(postContent)
    ) {
      data.append("isvideo", "1");
    } else {
      formData.append("isvideo", "0");
    }
    let currentIndex = 0;
    if (nfid > 0) {
      formData.append("id", nfid.toString());
      let nameMediaPlays = [];
      postedVideo.map((video) =>
        nameMediaPlays.push(video.name.split("/").slice(-1).pop())
      );
      postedImage.map((image) =>
        nameMediaPlays.push(image.name.split("/").slice(-1).pop())
      );

      formData.append("nameMediaPlays", JSON.stringify(nameMediaPlays));
      currentIndex = nameMediaPlays.length;
    } else {
      formData.append("nameimage", "");
    }
    if (mentionSelected && mentionSelected.length > 0) {
      let ids = [];
      mentionSelected.map((item) => ids.push(item.id));
      formData.append("labeltags", JSON.stringify(ids));
    }

    if (tagedFrieds && tagedFrieds.length > 0) {
      let ids = [];
      tagedFrieds.map((item) => ids.push(item.friendid));
      formData.append("tags", JSON.stringify(ids));
    }

    if (hashtagSelected && hashtagSelected.length > 0)
      formData.append("hashtags", JSON.stringify(hashtagSelected));

    if (backgroundSelected && backgroundSelected.id != 0) {
      formData.append("background", backgroundSelected.id.toString());
    } else {
      formData.append("background", "0");
    }

    if (albumSelected != null || albumSelected != undefined) {
      formData.append("albumid", albumSelected.albumid.toString());
    }

    this.props.setProccessDuration(80);
    postFormData(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/CreateNewsFeed",
      formData,
      (result) => {
        if (result.result == 1) {
          this.setState({
            isPosting: false,
          });
          this.props.createPostSuccess(result.content.newsFeeds, profile.id);
          this.handleCloseDrawer(true);
          this.props.setProccessDuration(20);
        }
      }
    );
  }

  handleUpdateInfoOfProfilePost() {
    let { data, profile } = this.props;
    let { postContent } = this.state;

    let param = {
      postid: data.nfid,
      nameImage: data.nameMediaPlays[0],
      content: postContent,
      isclear: 0,
    };

    this.setState({
      isPosting: false,
    });

    this.setState({ showUpdateInfoOfProfilePost: false });
    this.props.setProccessDuration(80);

    post(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/AddContentImageNewsFeed",
      param,
      (result) => {
        if (result && result.result == 1) {
          if (data.nfid > 0) {
            this.props.updatePosted(
              { ...data, nfcontent: postContent },
              profile.id
            );
            showInfo("Cập nhật bài đăng thành công.");
          }
          this.props.setProccessDuration(20);
        }
      }
    );
  }



  componentWillReceiveProps(nextProps) {
    if (nextProps.autoPlay != this.props.autoPlay) {
      if (nextProps.autoPlay == true) {
        this.handlePlayVideo();
      } else {
        this.handlePauseVideo();
      }
    }
  }


  handleActiveVideo() {
    let { currentNetwork } = this.props;
    let localSetting = window.localStorage.getItem(APP_SETTING);
    let appSettings = JSON.parse(localSetting ? localSetting : null);
    // if (appSettings && appSettings.isMuteInNewfeed) {
    //   this.handleSetMuted(appSettings.isMuteInNewfeed == false ? appSettings.isMuteInNewfeed : true)
    // }
    if (currentNetwork == "all") {
      this.handlePlayVideo();
      return;
    }

    if (currentNetwork != "none") {
      if (appSettings && appSettings.autoPlayRole) {
        if (
          currentNetwork == appSettings.autoPlayRole ||
          appSettings.autoPlayRole == "all"
        ) {
          this.handlePlayVideo();
        }
      } else {
        this.handlePlayVideo();
      }
    }
  }
  handleLeaveVideo() {
    this.handlePauseVideo();
  }

  handleGetGroupDetail(groupid) {
    if (!groupid) return
    get(SOCIAL_NET_WORK_API, "GroupUser/GetOneGroupUser?groupid=" + groupid, result => {
      if (result && result.result === 1) {
        this.props.setCurrentGroup(result.content.groupUser)
      }
    })
  }

  handlePostAuth(newsFeedShareRoot, profile) {
      const { statuspost, postforid, iduserpost } = newsFeedShareRoot
      const { foloweds, id } = profile
      if (iduserpost === id) {
        return true
      }
      else if (statuspost === 3) {
        return false
      }
      else if (postforid === 4) {
        return false
      }
      else if (postforid === 3 && (foloweds &&foloweds.length <= 0)) {
        return false
      }
      else if (postforid === 3 && (foloweds && foloweds.some(item => item.status !== 10))) {
        return false
      } else return true
  }



  render() {
    let { anchor, showLocalMenu, openReactions, visible, isMuted, isFullScreen, isPlaying, } = this.state;
    let { profile, daskMode, data, containerRef, activePostIndex, index } = this.props;
    let PrivacyOptions = objToArray(Privacies);
    let GroupPrivacyOptions = objToArray(GroupPrivacies);

    if (data && data.mediaPlays) {
      data.mediaPlays.map((item) => {
        if (!item.postid) item.postid = data.nfid;
        if (!item.postfor) item.postfor = data.postforid;
      });
    }

    if (data.iconlike == -1) data.iconlike = 0
    if (data.postforid == 1) data.postforid = 2


    if (data.newsFeedShareRoot) {
      data.newsFeedShareRoot.mediaPlays.map(item => {
        item.postid = data.newsFeedShareRoot.nfid
      })
    }
    let canPlay = index <= (activePostIndex + 3) && index >= (activePostIndex - 2)
    if (!isMobile()) canPlay = true
    // let contentWidth = $(".post-box-content").innerWidth()
    // console.log("dk",$(".post-box-content").innerWidth())
    return data && (!data.isPedding || data.isPedding === false) ? (
      <div className="post-box-content">
        <ScrollTrigger
          containerRef={containerRef}
          onEnter={() => this.handleActiveVideo()}
          onExit={() => this.handleLeaveVideo()}
        >
          <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
            {data.kindpost === 4 ? (
              <div className="album-name">
                <span onClick={() => {
                  this.props.setCurrentAlbum({ albumid: data.albumid })
                  this.props.toggleAlbumDetailDrawer(true)
                }}
                >
                  Album <b>{data.albumname}</b>
                </span>
              </div>
            ) : (
                ""
              )}
            <CardHeader
              className="card-header"
              avatar={
                <Avatar aria-label="recipe" className="avatar">
                  <div
                    className="img"
                    style={{ background: `url("${data.avataruserpost}")` }}
                  />
                </Avatar>
              }
              action={
                <CustomMenu placement="bottom-end">
                  {data.iduserpost === profile.id && data.kindpost !== 2 && data.kindpost !== 3 ?
                    (
                      <MenuItem
                        onClick={() =>
                          this.setState({ showLocalMenu: false }, () => {
                            this.props.togglePostDrawer(true);
                            this.props.setCurrentPosted(data);
                          })
                        }
                      >
                        Chỉnh sửa bài đăng
                      </MenuItem>
                    ) : (
                      ""
                    )}
                  {data.iduserpost == profile.id && (data.kindpost == 2 || data.kindpost == 3) ?
                    (
                      <MenuItem
                        onClick={() =>
                          this.setState({
                            showLocalMenu: false,
                            showUpdateInfoOfProfilePost: true,
                            postContent: data.nfcontent,
                          })
                        }
                      >
                        Chỉnh sửa nội dung
                      </MenuItem>
                    ) : (
                      ""
                    )}
                  {(data.iduserpost == profile.id && (data.kindpost != 2 && data.kindpost != 3)) ? (
                    <MenuItem
                      onClick={() =>
                        this.setState({ showLocalMenu: false }, () =>
                          this.setState({
                            showConfim: true,
                            okCallback: () => this.handleDeletePost(),
                            confirmTitle: "Xoá bài đăng",
                            confirmMessage:
                              "Bạn có thật sự muốn xoá bài đăng này?",
                          })
                        )
                      }
                    >
                      Xoá bài đăng
                    </MenuItem>
                  ) : (
                      ""
                    )}
                  <MenuItem
                    onClick={() =>
                      this.setState({ showLocalMenu: false }, () =>
                        copyToClipboard(PostLinkToCoppy + data.nfid)
                      )
                    }
                  >
                    Sao chép liên kết
                  </MenuItem>
                  {/* {
                  data.iduserpost != profile.id ? <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem> : ""
                } */}
                  {data.iduserpost != profile.id ? (
                    <MenuItem onClick={() => this.props.toggleReportComment(true, data)}>
                      Báo cáo vi phạm
                    </MenuItem>
                  ) : (
                      ""
                    )}
                </CustomMenu>
              }
              title={
                <span className="poster-name">
                  <span
                    className="name"
                    onClick={() => {
                      if (data.iduserpost == profile.id) {
                        this.props.history.push("/profile");
                      } else {
                        this.props.setCurrenUserDetail({
                          ...data,
                          friendid: data.iduserpost,
                        });
                        this.props.toggleUserPageDrawer(true);
                      }
                    }}
                  >
                    {data.nameuserpost}{" "}
                  </span>
                  {data.kindpost == 4 ? (
                    <span className="mesage">
                      {data.titlepost
                        .replace("{usernamesend}", " ")
                        .replace("{namealbum}", data.albumname)}
                    </span>
                  ) : (
                      ""
                    )}
                  {data.kindpost == 3 ? (
                    <span className="mesage">
                      {data.titlepost.replace("{username}", " ")}
                    </span>
                  ) : (
                      ""
                    )}
                  {data.kindpost == 2 ? (
                    <span className="mesage">
                      {data.titlepost.replace("{username}", " ")}
                    </span>
                  ) : (
                      ""
                    )}
                  {data.usersTag.length > 0 ? (
                    <span className="mesage">
                      <span>
                        cùng với {" "}
                        <b id="name-friend"
                          onClick={() => {
                            this.props.setCurrenUserDetail({
                              ...data.usersTag[0],
                              friendid: data.usersTag[0].id,
                            });
                            this.props.toggleUserPageDrawer(true);
                          }}
                        >
                          {data.usersTag[0].fullname}
                        </b>
                      </span>
                      {data.usersTag.length == 2 ? (
                        <span>
                          {" "}
                          và{" "}
                          <b id="name-friend"
                            onClick={() => {
                              this.props.setCurrenUserDetail({
                                ...data.usersTag[1],
                                friendid: data.usersTag[1].id,
                              });
                              this.props.toggleUserPageDrawer(true);
                            }}
                          >
                            {data.usersTag[1].fullname}
                          </b>
                        </span>
                      ) : (
                          ""
                        )}
                      {data.usersTag.length > 2 ? (
                        <span>
                          {" "}
                          và{" "}
                          <b
                            onClick={() =>
                              this.setState({ showTagsFriendDrawer: true })
                            }
                          >
                            {data.usersTag.length - 1} người khác
                          </b>
                        </span>
                      ) : (
                          ""
                        )}
                    </span>
                  ) : (
                      ""
                    )}
                  {data.kindpost == 1 && data.newsFeedShareRoot ? (
                    <span className="mesage"> đã chia sẻ một bài viết</span>
                  ) : (
                      ""
                    )}
                </span>
              }
              subheader={
                <div className="poster-subtitle">
                  <div>
                    {data.groupidpost > 0 ? (
                      <img
                        src={
                          GroupPrivacyOptions.find(
                            (privacy) => privacy.code == data.typegroup
                          ).icon
                        }
                      />
                    ) : (
                        <img
                          src={
                            PrivacyOptions.find(
                              (privacy) => privacy.code == data.postforid
                            ).icon1
                          }
                        />
                      )}
                    <FiberManualRecordIcon />
                    {fromNow(moment(data.createdate), moment(new Date()))}
                  </div>
                  {data.groupidpost > 0 ? (
                    <div>
                      <img src={Group} />
                      <FiberManualRecordIcon
                        style={{ width: "6px", height: "6px" }}
                      />
                      <span>
                        <u onClick={() => this.setState({ showGroupForPostDrawer: false }, () => {
                          this.handleGetGroupDetail(data.groupidpost)
                          this.props.toggleGroupDetailDrawer(true)
                        })}>{data.groupnamepost}</u>
                      </span>
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              }
            />
            {data.nfcontent != "" ? (
              <div
                className={
                  "post-content" +
                  (data.backgroundid > 0 ? " have-background" : "")
                }
                style={{
                  background:
                    "url(" +
                    backgroundList.filter(
                      (item) => item.id == data.backgroundid
                    )[0].background +
                    ")",
                }}
              >
                <PostContent content={data} />
              </div>
            ) : (
                ""
              )}

            <CardContent className="card-content">
              <div className="media-grid">
                {data.mediaPlays.length > 1 ? (
                  <GridList cols={maxCols}>
                    {data.mediaPlays.slice(0, 5).map((media, index) => (
                      <GridListTile
                        className={media.typeobject == 2 ? "video" : "image"}
                        style={{
                          height: this.handleCellHeightCal(
                            index,
                            data.mediaPlays.slice(0, 5).length
                          ),
                        }}
                        key={media.name}
                        cols={this.handleColumnCal(
                          index,
                          data.mediaPlays.slice(0, 5).length
                        )}
                      >
                        {media.typeobject == 2 ? (
                          <div className="video-box-content">
                            <div
                              onClick={() => {
                                this.setState({ showPostedDetail: true })
                                this.handlePauseVideo()
                              }
                              }
                            >
                              {canPlay ? <Player
                                ref={index == 0 ? this.player : null}
                                poster={media.thumbnailname}
                                src={media.name}
                                videoWidth={media.width}
                                videoHeight={media.height}
                                playsInline={true}
                                preload="metadata"
                              >
                                <ControlBar
                                  disableDefaultControls={true}
                                  autoHide={false}
                                  className={"video-control"}
                                ></ControlBar>
                              </Player> : ""}
                            </div>
                            {index == 0 ? (
                              <IconButton
                                onClick={() => this.handleSetMuted(!isMuted)}
                                className="bt-mute"
                              >
                                {isMuted == true ? (
                                  <img
                                    style={{ width: 24, height: 24 }}
                                    src={mute}
                                  />
                                ) : (
                                    <img
                                      style={{ width: 24, height: 24 }}
                                      src={unmute}
                                    />
                                  )}
                              </IconButton>
                            ) : (
                                <IconButton
                                  onClick={() => this.handleSetMuted(!isMuted)}
                                  className="bt-play"
                                >
                                  <PlayArrowIcon />
                                </IconButton>
                              )}
                            <div
                              className="thumb"
                              ref={index == 0 ? this.thumbnail : null}
                              style={{
                                background: "url(" + media.thumbnailname + ")",
                                // width: contentWidth,
                                // height: (media.height / media.width) * contentWidth
                              }}
                              onClick={() => {
                                this.setState({ showPostedDetail: true })
                                this.handlePauseVideo()
                              }
                              }
                            />
                          </div>
                        ) : (
                            <img
                              src={media.name}
                              alt={media.name}
                              onClick={() =>
                                this.setState({ showPostedDetail: true })
                              }
                            />
                          )}
                        {data.mediaPlays.length > 4 && index == 4 ? (
                          <div
                            className="grid-overlay"
                            onClick={() => {
                              this.setState({ showPostedDetail: true })
                              this.handlePauseVideo()
                            }

                            }
                          >
                            <span>{data.mediaPlays.length - 4}+</span>
                          </div>
                        ) : (
                            ""
                          )}
                      </GridListTile>
                    ))}
                  </GridList>
                ) : (
                    <GridList cols={1}>
                      {data.mediaPlays.map((media, index) => (
                        <GridListTile
                          className={media.typeobject == 2 ? "video" : "image"}
                          style={{ height: "auto" }}
                          key={media.name}
                          cols={1}
                        >
                          {media.typeobject == 2 ? (
                            <div className="video-box-content">
                              <div
                                onClick={() => {
                                  this.props.setMediaToViewer([media]);
                                  this.props.toggleMediaViewerDrawer(true, {
                                    actions: mediaGuestActions(this),
                                    showInfo: true,
                                    activeIndex: index,
                                    isvideo: true,
                                  });
                                  this.handlePauseVideo();
                                }}
                              >
                                {canPlay ? <Player
                                  ref={this.player}
                                  poster={media.thumbnailname}
                                  src={media.name}
                                  videoWidth={media.width}
                                  videoHeight={media.height}
                                  playsInline={true}
                                  preload="metadata"
                                >
                                  <ControlBar
                                    disableDefaultControls={true}
                                    autoHide={false}
                                    className={"video-control"}
                                  ></ControlBar>
                                </Player> : ""}
                              </div>
                              <IconButton
                                onClick={() => this.handleSetMuted(!isMuted)}
                                className="bt-mute"
                              >
                                {isMuted == true ? (
                                  <img
                                    style={{ width: 24, height: 24 }}
                                    src={mute}
                                  />
                                ) : (
                                    <img
                                      style={{ width: 24, height: 24 }}
                                      src={unmute}
                                    />
                                  )}
                              </IconButton>
                              <div
                                className="thumb"
                                ref={index == 0 ? this.thumbnail : null}
                                style={{
                                  background: "url(" + media.thumbnailname + ")",
                                  //   width: contentWidth,
                                  // height: (media.height / media.width) * contentWidth
                                }}
                                onClick={() => {
                                  this.props.setMediaToViewer([media]);
                                  this.props.toggleMediaViewerDrawer(true, {
                                    actions: mediaGuestActions(this),
                                    showInfo: true,
                                    activeIndex: index,
                                    isvideo: true,
                                  });
                                  this.handlePauseVideo();
                                }}
                              />
                            </div>
                          ) : (
                              <img
                                src={media.name}
                                alt={media.name}
                                style={{ width: "100%", height: "auto" }}
                                onClick={() => {
                                  this.props.setMediaToViewer(data.mediaPlays);
                                  this.props.toggleMediaViewerDrawer(true, {
                                    actions:
                                      data.iduserpost == profile.id
                                        ? mediaRootActions(this)
                                        : mediaGuestActions(this),
                                    showInfo: true,
                                    activeIndex: index,
                                  });
                                }}
                              />
                            )}
                        </GridListTile>
                      ))}
                    </GridList>
                  )}
                {data.newsFeedShareRoot ? (
                  <div className="post-shared">
                    <div>
                      {data.newsFeedShareRoot && (
                        <Card
                          className={
                            "post-item " + (daskMode ? "dask-mode" : "")
                          }
                        >
                          {/* {data.newsFeedShareRoot.kindpost == 4 ? (
                            <div className="album-name">
                              <span>
                                Album{" "}
                                <span>{data.newsFeedShareRoot.albumname}</span>
                              </span>
                            </div>
                          ) : (
                              ""
                            )} */}
                          {profile && this.handlePostAuth(data.newsFeedShareRoot, profile)
                            ? <CardHeader
                              className="card-header"
                              avatar={
                                <Avatar aria-label="recipe" className="avatar">
                                  <div
                                    className="img"
                                    style={{
                                      background: `url("${data.newsFeedShareRoot.avataruserpost}")`,
                                    }}
                                  />
                                </Avatar>
                              }
                              title={
                                <span className="poster-name">
                                  <span className="name"
                                    onClick={() => {
                                      if (data.newsFeedShareRoot.iduserpost == profile.id) {
                                        this.props.history.push("/profile");
                                      } else {
                                        this.props.setCurrenUserDetail({
                                          ...data,
                                          friendid: data.newsFeedShareRoot.iduserpost,
                                        });
                                        this.props.toggleUserPageDrawer(true);
                                      }
                                    }}>
                                    {data.newsFeedShareRoot.nameuserpost}
                                  </span>
                                  {data.newsFeedShareRoot.kindpost == 4 ? (
                                    // <span>
                                    //   {data.newsFeedShareRoot.titlepost
                                    //     .replace("{usernamesend}", " ")
                                    //     .replace("{namealbum}", data.albumname)}
                                    // </span>
                                    ""
                                  ) : (
                                      ""
                                    )}
                                  {data.newsFeedShareRoot.kindpost == 3 ? (
                                    <span>
                                      {data.newsFeedShareRoot.titlepost.replace(
                                        "{username}",
                                        " "
                                      )}
                                    </span>
                                  ) : (
                                      ""
                                    )}
                                  {data.newsFeedShareRoot.kindpost == 2 ? (
                                    <span>
                                      {data.newsFeedShareRoot.titlepost.replace(
                                        "{username}",
                                        " "
                                      )}
                                    </span>
                                  ) : (
                                      ""
                                    )}
                                </span>
                              }
                              subheader={
                                <div className="poster-subtitle">
                                  <div>
                                    {
                                      PrivacyOptions.find(
                                        (privacy) =>
                                          privacy.code ==
                                          data.newsFeedShareRoot.postforid
                                      ) ? <img
                                          src={
                                            PrivacyOptions.find(
                                              (privacy) =>
                                                privacy.code ==
                                                data.newsFeedShareRoot.postforid
                                            ).icon1
                                          }
                                        /> : ""
                                    }
                                    <FiberManualRecordIcon />
                                    {fromNow(
                                      moment(data.newsFeedShareRoot.createdate),
                                      moment(new Date())
                                    )}
                                  </div>
                                  {data.newsFeedShareRoot.groupidpost > 0 && (
                                    <div>
                                      <img src={Group} />
                                      <FiberManualRecordIcon
                                        style={{ width: "6px", height: "6px" }}
                                      />
                                      <span>
                                        <u onClick={() => this.setState({ showGroupForPostDrawer: false }, () => {
                                          // this.props.setCurrentGroup({ groupid: data.groupidpost })
                                          this.handleGetGroupDetail(data.newsFeedShareRoot.groupidpost)
                                          this.props.toggleGroupDetailDrawer(true)

                                        })}>{data.newsFeedShareRoot.groupnamepost}</u>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              }
                            />
                            : <CardHeader
                              className="card-header-auth"
                              avatar={<div className="avatar-auth">x</div>}
                              title={<b>Nội dung này đã được chủ sở hữu bài đăng thay đổi quyền được xem hoặc đã xóa nội dung.</b>}
                            />
                          }

                          {(profile && this.handlePostAuth(data.newsFeedShareRoot, profile)) && data.newsFeedShareRoot.nfcontent !== "" && (
                            <div
                              className={
                                "post-content" +
                                (data.backgroundid > 0
                                  ? " have-background"
                                  : "")
                              }
                              style={{
                                background:
                                  "url(" +
                                  backgroundList.filter(
                                    (item) => item.id == data.backgroundid
                                  )[0].background +
                                  ")",
                              }}
                            >
                              <PostContent content={data.newsFeedShareRoot} />
                            </div>
                          )}
                          {(profile && this.handlePostAuth(data.newsFeedShareRoot, profile)) && <CardContent className="card-content">
                            <div className="media-grid">
                              {data.newsFeedShareRoot.mediaPlays.length > 1 ? (
                                <GridList cols={maxCols}>
                                  {data.newsFeedShareRoot.mediaPlays.slice(0, 5).map((media, index) => (
                                    <GridListTile
                                      className={media.typeobject == 2 ? "video" : "image"}
                                      style={{
                                        height: this.handleCellHeightCal(
                                          index,
                                          data.newsFeedShareRoot.mediaPlays.slice(0, 5).length
                                        ),
                                      }}
                                      key={media.name}
                                      cols={this.handleColumnCal(
                                        index,
                                        data.newsFeedShareRoot.mediaPlays.slice(0, 5).length
                                      )}
                                    >
                                      {media.typeobject == 2 ? (
                                        <div>
                                          <div
                                            onClick={() => {
                                              this.setState({
                                                showPostedDetail: true,
                                                sharedPost: data.newsFeedShareRoot
                                              })
                                              this.handlePauseVideo()
                                            }
                                            }
                                          >
                                            <Player
                                              ref={index == 0 ? this.player : null}
                                              poster={media.thumbnailname}
                                              src={media.name}
                                              videoWidth={media.width}
                                              videoHeight={media.height}
                                              playsInline={true}
                                            >
                                              <ControlBar
                                                disableDefaultControls={true}
                                                autoHide={false}
                                                className={"video-control"}
                                              ></ControlBar>
                                            </Player>
                                          </div>
                                          {index == 0 ? (
                                            <IconButton
                                              onClick={() =>
                                                this.handleSetMuted(!isMuted)
                                              }
                                              className="bt-mute"
                                            >
                                              {isMuted == true ? (
                                                <img
                                                  style={{
                                                    width: 24,
                                                    height: 24,
                                                  }}
                                                  src={mute}
                                                />
                                              ) : (
                                                  <img
                                                    style={{
                                                      width: 24,
                                                      height: 24,
                                                    }}
                                                    src={unmute}
                                                  />
                                                )}
                                            </IconButton>
                                          ) : (
                                              <IconButton
                                                onClick={() =>
                                                  this.handleSetMuted(!isMuted)
                                                }
                                                className="bt-play"
                                              >
                                                <PlayArrowIcon />
                                              </IconButton>
                                            )}
                                          <div
                                            className="thumb"
                                            ref={
                                              index == 0
                                                ? this.thumbnail
                                                : null
                                            }
                                            style={{
                                              background:
                                                "url(" +
                                                media.thumbnailname +
                                                ")",
                                            }}
                                            onClick={() => {
                                              this.setState({
                                                showPostedDetail: true,
                                                sharedPost: data.newsFeedShareRoot
                                              })
                                              this.handlePauseVideo()
                                            }

                                            }
                                          />
                                        </div>
                                      ) : (
                                          <img
                                            src={media.name}
                                            alt={media.name}
                                            onClick={() => {
                                              this.setState({
                                                showPostedDetail: true,
                                                sharedPost: data.newsFeedShareRoot
                                              })
                                              this.handlePauseVideo()
                                            }

                                            }
                                          />
                                        )}
                                      {data.newsFeedShareRoot.mediaPlays.length >
                                        4 && index == 4 ? (
                                          <div
                                            className="grid-overlay"
                                            onClick={() => {
                                              this.setState({
                                                showPostedDetail: true,
                                                sharedPost: data.newsFeedShareRoot
                                              })
                                              this.handlePauseVideo()
                                            }

                                            }
                                          >
                                            <span>
                                              {data.newsFeedShareRoot.mediaPlays
                                                .length - 4}+
                                              </span>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                    </GridListTile>
                                  ))}
                                </GridList>
                              ) : (
                                  <GridList cols={1}>
                                    {data.newsFeedShareRoot.mediaPlays.map(
                                      (media, index) => (
                                        <GridListTile
                                          className={
                                            media.typeobject == 2
                                              ? "video"
                                              : "image"
                                          }
                                          style={{ height: "auto" }}
                                          key={media.name}
                                          cols={1}
                                        >
                                          {media.typeobject == 2 ? (
                                            <div className="video-box-content">
                                              <div
                                                onClick={() => {
                                                  this.props.setMediaToViewer([
                                                    media,
                                                  ]);
                                                  this.props.toggleMediaViewerDrawer(
                                                    true,
                                                    {
                                                      actions: mediaGuestActions(this),
                                                      showInfo: true,
                                                      activeIndex: index,
                                                      isvideo: true,
                                                    }
                                                  );
                                                  this.handlePauseVideo();
                                                }}
                                              >
                                                {canPlay ? <Player
                                                  ref={this.player}
                                                  poster={media.thumbnailname}
                                                  src={media.name}
                                                  videoWidth={media.width}
                                                  videoHeight={media.height}
                                                  playsInline={true}
                                                  preload="metadata"
                                                >
                                                  <ControlBar
                                                    disableDefaultControls={true}
                                                    autoHide={false}
                                                    className={"video-control"}
                                                  ></ControlBar>
                                                </Player> : ""}
                                              </div>
                                              <IconButton
                                                onClick={() =>
                                                  this.handleSetMuted(!isMuted)
                                                }
                                                className="bt-mute"
                                              >
                                                {isMuted == true ? (
                                                  <img
                                                    style={{
                                                      width: 24,
                                                      height: 24,
                                                    }}
                                                    src={mute}
                                                  />
                                                ) : (
                                                    <img
                                                      style={{
                                                        width: 24,
                                                        height: 24,
                                                      }}
                                                      src={unmute}
                                                    />
                                                  )}
                                              </IconButton>
                                              <div
                                                className="thumb"
                                                ref={
                                                  index == 0
                                                    ? this.thumbnail
                                                    : null
                                                }
                                                style={{
                                                  background:
                                                    "url(" +
                                                    media.thumbnailname +
                                                    ")",
                                                  //                     width: contentWidth,
                                                  // height: (media.height / media.width) * contentWidth
                                                }}
                                                onClick={() => {
                                                  this.props.setMediaToViewer([
                                                    media,
                                                  ]);
                                                  this.props.toggleMediaViewerDrawer(
                                                    true,
                                                    {
                                                      actions: mediaGuestActions(this),
                                                      showInfo: true,
                                                      activeIndex: index,
                                                      isvideo: true,
                                                    }
                                                  );
                                                  this.handlePauseVideo();
                                                }}
                                              />
                                            </div>
                                          ) : (
                                              <img
                                                src={media.name}
                                                alt={media.name}
                                                style={{
                                                  width: "100%",
                                                  height: "auto",
                                                }}
                                                onClick={() => {
                                                  this.props.setMediaToViewer(
                                                    data.newsFeedShareRoot.mediaPlays
                                                  );
                                                  this.props.toggleMediaViewerDrawer(
                                                    true,
                                                    {
                                                      actions:
                                                        data.newsFeedShareRoot
                                                          .iduserpost == profile.id
                                                          ? mediaRootActions(this)
                                                          : mediaGuestActions(this),
                                                      showInfo: true,
                                                      activeIndex: index,
                                                    }
                                                  );
                                                }}
                                              />
                                            )}
                                        </GridListTile>
                                      )
                                    )}
                                  </GridList>
                                )}
                            </div>
                            {
                              // data.newsFeedShareRoot.numlike > 0 ||
                              //   data.newsFeedShareRoot.numcomment > 0 ||
                              data.newsFeedShareRoot.nummedia > 0 && data.newsFeedShareRoot.mediaPlays[0].numview > 0 ? (
                                <div className="react-reward">
                                  <span>{data.newsFeedShareRoot.mediaPlays[0].numview}{" "}lượt xem</span>
                                </div>
                              ) : (
                                  ""
                                )}
                          </CardContent>
                          }</Card>
                      )}
                    </div>
                  </div>
                ) : (
                    ""
                  )}
              </div>
              {data.numlike > 0 ||
                data.numcomment > 0 ||
                (data.mediaPlays[0] && data.mediaPlays[0].numview > 0) ||
                data.numshare > 0
                ? (
                  <div className="react-reward">
                    {data.numlike > 0 ? (
                      <span className="like" onClick={() => this.setState({ showLikeRewardDrawer: true })}>
                        {data.iconNumbers
                          .filter((item) => item.icon != data.iconlike)
                          .map(
                            (item, index) =>
                              item.icon > 0 &&
                              item.num > 0 && (
                                <img
                                  key={index}
                                  src={ReactSelectorIcon[item.icon].icon}
                                ></img>
                              )
                          )}
                        {data.islike == 1 && data.iconlike > 0 && (
                          <img src={ReactSelectorIcon[data.iconlike].icon} />
                        )}
                        <span>{data.numlike}</span>
                      </span>
                    ) : (
                        <span className="like"></span>
                      )}
                    {
                      (data.numcomment > 0 ||
                        (data.mediaPlays[0] && data.mediaPlays[0].numview > 0) ||
                        data.numshare > 0) && (
                        <span
                          onClick={() =>
                            this.props.toggleCommentDrawer(true, data)
                          }
                          className="comment"
                        >
                          {data.numcomment > 0 && <span>{data.numcomment} bình luận&nbsp;&nbsp;&nbsp;</span>}

                          {(data.mediaPlays[0] && data.mediaPlays[0].numview > 0)
                            && <span>{data.mediaPlays[0].numview} lượt xem&nbsp;&nbsp;&nbsp;</span>
                          }
                          {
                            data.numshare > 0 && <span>{data.numshare} chia sẻ&nbsp;&nbsp;&nbsp;</span>
                          }
                        </span>
                      )}
                  </div>
                ) : (
                  ""
                )}
            </CardContent>
            <CardActions disableSpacing className="post-actions">
              <FacebookSelector
                open={openReactions}
                active={data.iconlike}
                onClose={() => this.setState({ openReactions: false })}
                onReaction={(reaction) => this.likePosted(reaction)}
                onShortPress={(reaction) =>
                  data.islike == 1
                    ? this.dislikePosted(reaction)
                    : this.likePosted(reaction)
                }
              />
              <Button
                onClick={() =>
                  this.props.toggleCommentDrawer(true, data)
                }
              >
                <img src={daskMode ? comment1 : comment} />
                Bình luận
              </Button>
              {(data.postforid !== 4 && data.typegroup !== 2) && (
                <>
                  <Button
                    onClick={() =>
                      // this.setState(
                      //   { showShareDrawer: true, groupSelected: null },
                      //   () => {
                      //     this.getFriends(0);
                      //     this.getGroup(0);
                      //   }
                      // )
                      this.props.toggleSharePost(true, data)
                    }
                  >
                    <img src={daskMode ? share1 : share} />
                  Chia sẻ
                </Button>
                </>
              )}
            </CardActions>
            {data.numcomment > 0 && !daskMode ? (
              <Collapse
                in={true}
                timeout="auto"
                unmountOnExit
                className={"comment-container"}
              >
                <CardContent className={"card-container"}>
                  <ul
                    className="comment-list"
                    onClick={() =>
                      this.props.toggleCommentDrawer(true, data)
                    }
                  >
                    {data.comments.map((comment, index) => (
                      <Comment
                        post={data}
                        key={index}
                        comment={comment}
                        hideReactions={true}
                      />
                    ))}
                    {profile ? (
                      <li>
                        <div className="comment-input">
                          <Avatar className="avatar">
                            <img src={profile.avatar} />
                          </Avatar>
                          <div className="input">
                            <span>Viết bình luận...</span>
                          </div>
                        </div>
                      </li>
                    ) : (
                        ""
                      )}
                  </ul>
                </CardContent>
              </Collapse>
            ) : (
                ""
              )}
            {renderShareDrawer(this)}
            {renderSharePrivacyMenuDrawer(this)}
            {renderUpdatePrivacyImageDrawer(this)}
            {renderDetailPosted(this)}
            {renderTagsFriendDrawer(this)}
            {renderConfirmDrawer(this)}
            {renderUpdateInfoOfProfilePostDrawer(this)}
            {renderReportPostDrawer(this)}
            {renderReportSuccessAlert(this)}
            {renderTagFriendForShareDrawer(this)}
            {renderGroupForShareDrawer(this)}
            {renderReportGroupDrawer(this)}
            {renderLikeRewardDrawer(this)}
          </Card>
        </ScrollTrigger>
      </div >
    ) : (
        ""
      );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.user,
    ...state.posted,
    ...state.app,
  };
};
const mapDispatchToProps = (dispatch) => ({
  toggleSharePost: (isShow, data) => dispatch(toggleSharePost(isShow, data)),
  setCurrentAlbum: (album) => dispatch(setCurrentAlbum(album)),
  toggleAlbumDetailDrawer: (isShow) => dispatch(toggleAlbumDetailDrawer(isShow)),
  toggleReportComment: (isShow, data) => dispatch(toggleReportComment(isShow, data)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, features) =>
    dispatch(toggleMediaViewerDrawer(isShow, features)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  updatePosted: (posted, userId) => dispatch(updatePosted(posted, userId)),
  likePosted: (post, likeIcon, targetKey, userId) =>
    dispatch(likePosted(post, likeIcon, targetKey, userId)),
  dislikePosted: (post, targetKey, userId) =>
    dispatch(dislikePosted(post, targetKey, userId)),
  likeImage: (postId, imageId, iconCode, userId) =>
    dispatch(likeImage(postId, imageId, iconCode, userId)),
  dislikeImage: (postId, imageId, userId) =>
    dispatch(dislikeImage(postId, imageId, userId)),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  setCurrentPosted: (post) => dispatch(setCurrentPosted(post)),
  deletePostSuccess: (postId, userId) =>
    dispatch(deletePostSuccess(postId, userId)),
  setProccessDuration: (percent) => dispatch(setProccessDuration(percent)),
  createPostSuccess: (post, userId) =>
    dispatch(createPostSuccess(post, userId)),
  toggleGroupDetailDrawer: (isShow) => dispatch(toggleGroupDetailDrawer(isShow)),
  setCurrentGroup: (group) => dispatch(setCurrentGroup(group)),
  toggleCommentDrawer: (isShow, currentPostForComment) => dispatch(toggleCommentDrawer(isShow, currentPostForComment)),
  toggleCommentImageDrawer: (isShow, currentImageForComment, currentPostForComment) => dispatch(toggleCommentImageDrawer(isShow, currentImageForComment, currentPostForComment)),
  setActivePostIndex: (index) => dispatch(setActivePostIndex(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const mediaRootActions = (component) => ({
  // onSaveImage: (value) => component.downloadImage(value.name),
  onUpdateInfo: (value) => null,
  onSetToAvatar: (value) => null,
  onSetToBackground: (value) => null,
  onUpdatePrivacy: (value) => null,
  onDelete: (value) => {
    component.props.toggleMediaViewerDrawer(false);
    setTimeout(() => {
      component.setState({
        showPostedDetail: false,
      });
    }, 500);
    setTimeout(() => {
      component.props.deletePostSuccess(
        value.postid,
        component.props.profile.id
      );
    }, 1000);
  },
  onSetToAlbumBackground: (value) => null,
});

const mediaGuestActions = (component) => ({
  onSharePost: () => {
    component.setState(
      { showShareDrawer: true, groupSelected: null },
      () => {
        component.getFriends(0);
        component.getGroup(0);
      }
    )
  },
})
// const mediaGuestActions = (component) => null;

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



const renderShareDrawer = (component) => {
  let { showShareDrawer, privacy, postContent, tagedFrieds, isPosting, groupForShare, groupSelected, } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="share-drawer poster-drawer fit-popup"
      open={showShareDrawer}
      onClose={() => component.setState({ showShareDrawer: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.handleCloseDrawer()}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Chia sẻ</label>
          </div>
          {groupSelected ? (
            <Button
              className="bt-submit"
              onClick={() => component.handleShare()}
            >
              Đăng
            </Button>
          ) : (
              ""
            )}
        </div>
        <div className="filter"></div>
        <div className="drawer-content" >
          <ul>
            <li
              onClick={() => component.setState({ showTagFriendDrawer: true })}
            >
              <img src={tag} />
              <span>Gắn thẻ</span>
            </li>
          </ul>
          {tagedFrieds && tagedFrieds.length > 0 && (
            <div className="taged-friend">
              <span><img src={tag} /></span>
              <b className="tag-item">Bạn</b> đã gắn thẻ&nbsp;
              <span>
                <b className="tag-item">
                  <span>{tagedFrieds[0].friendname}</span>
                </b>
                {tagedFrieds.length >= 2 && (
                  <>
                    <span> và </span>{" "}
                    <b className="tag-item">
                      <span>{tagedFrieds.length - 1} người khác</span>
                    </b>
                  </>
                )}
              </span>
            </div>
          )}
          <MultiInput
            style={{
              minHeight: "280px",
              padding: "15px",
            }}
            onChange={(value) =>
              component.setState({
                postContent: value.text,
              })
            }
            topDown={true}
            placeholder={"Bạn viết gì đi..."}
            enableHashtag={false}
            enableMention={false}
            centerMode={false}
            value={postContent}
          />

          <div className="post-role">
            <span
              className="bt-sumbit"
              onClick={() =>
                component.setState({ showSharePrivacySelectOption: true })
              }
            >
              <img src={privacy.icon} />
              <span>{privacy.label}</span>
            </span>
          </div>
          {groupSelected ? (
            <div className="group-selected">
              <label>{groupSelected.groupname}</label>
            </div>
          ) : (
              ""
            )}
          <div className="share-to-time-line">
            <div>
              <div className="icon">
                <img src={Newfeed} />
              </div>
              <label>Bảng tin</label>
            </div>
            <Button
              className="bt-submit"
              onClick={() => component.handleShare()}
            >
              Chia sẻ
            </Button>
          </div>
          <div className="share-to-time-line">
            <div>
              <div className="icon">
                <img src={Group} />
              </div>
              <label>Chia sẻ lên nhóm</label>
            </div>
            <Button
              className="bt-submit no-bg"
              onClick={() =>
                component.setState({ showFindGroupToShareDrawer: true })
              }
            >
              Xem tất cả
            </Button>
          </div>
          {isPosting ? (
            <div style={{ height: "50px", margin: "20px 0px" }}>
              <Loader type="small" width={30} height={30} />
            </div>
          ) : (
              ""
            )}
          <div className="group-list">
            {groupForShare && groupForShare.length > 0 ? (
              <ul>
                {groupForShare.map((group, index) => (
                  <li>
                    <div className="group-item">
                      <Avatar className="avatar">
                        <div
                          className="img"
                          style={{ background: "url(" + group.thumbnail + ")" }}
                        />
                      </Avatar>
                      <div className="group-info">
                        <label className="name">{group.groupname}</label>
                        <span className="privacy">
                          {GroupPrivacies[group.typegroupname].label}
                        </span>
                        <span className="member-count">
                          {group.nummember} thành viên
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        className="bt-submit"
                        onClick={() => component.handleShare(group.groupid)}
                      >
                        Chia sẻ
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

const renderGroupForShareDrawer = (component) => {
  let {
    showFindGroupToShareDrawer,
    groupForShare,
    groupSearchKey,
  } = component.state;

  return (
    <Drawer
      anchor="bottom"
      className="tag-friend-drawer"
      open={showFindGroupToShareDrawer}
    >
      <div className="drawer-detail fit-desktop" style={{ overflow: "auto" }}>
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              component.setState(
                { showFindGroupToShareDrawer: false, groupSearchKey: "" },
                () => component.getGroup(0)
              )
            }
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Tìm nhóm</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            className="custom-input"
            variant="outlined"
            placeholder="Nhập tên nhóm để tìm"
            className="search-box"
            style={{
              width: "calc(100% - 20px)",
              margin: "0px 0px 10px 10px",
            }}
            value={groupSearchKey}
            onChange={(e) =>
              component.setState(
                {
                  groupSearchKey: e.target.value,
                },
                () => component.getGroup(0)
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div
          className="drawer-content"
          style={{ overflow: "auto", padding: "0px 10px" }}
        >
          <div className="group-list">
            {groupForShare && groupForShare.length > 0 ? (
              <ul>
                {groupForShare.map((group, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      component.setState(
                        {
                          groupSelected: group,
                          showFindGroupToShareDrawer: false,
                          groupSearchKey: "",
                        },
                        () => component.getGroup(0)
                      )
                    }
                  >
                    <div className="group-item">
                      <Avatar className="avatar">
                        <div
                          className="img"
                          style={{ background: "url(" + group.thumbnail + ")" }}
                        />
                      </Avatar>
                      <div className="group-info">
                        <label className="name">{group.groupname}</label>
                        <span className="privacy">
                          {GroupPrivacies[group.typegroupname].label}
                        </span>
                        <span className="member-count">
                          {group.nummember} thành viên
                        </span>
                      </div>
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

const renderSharePrivacyMenuDrawer = (component) => {
  let { showSharePrivacySelectOption, privacy } = component.state;
  let privacyOptions = objToArray(Privacies);
  return (
    <Drawer
      anchor="bottom"
      className="img-select-option fit-popup-1"
      open={showSharePrivacySelectOption}
      onClose={() =>
        component.setState({ showSharePrivacySelectOption: false })
      }
    >
      <div className="option-header">
        <IconButton
          style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
          onClick={() =>
            component.setState({ showSharePrivacySelectOption: false })
          }
        >
          <ChevronLeftIcon
            style={{ color: "#ff5a59", width: "25px", height: "25px" }}
          />
        </IconButton>
        <label>Tác vụ</label>
      </div>
      <ul className="option-list">
        {privacyOptions.map((item, index) => (
          <li key={index}>
            <Button
              onClick={() =>
                component.setState({
                  privacy: item,
                  showSharePrivacySelectOption: false,
                })
              }
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </Drawer>
  );
};

const renderUpdatePrivacyImageDrawer = (component) => {
  let {
    showUpdatePrivacyDrawer,
    isProccesing,
    privacySelected,
  } = component.state;

  let PrivacyOptions = objToArray(Privacies);

  return (
    <Drawer
      anchor="bottom"
      className="update-privacy-image-drawer"
      open={showUpdatePrivacyDrawer}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              component.setState({ showUpdatePrivacyDrawer: false })
            }
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Chỉnh sửa quyền riêng tư</label>
          </div>
          <Button
            className="bt-default"
            onClick={() => component.updateImagePrivacy()}
          >
            Lưu
          </Button>
        </div>
        <div className="filter"></div>
        <div className="drawer-content">
          <ul>
            {PrivacyOptions.map((privacy, index) => (
              <li
                key={index}
                onClick={() =>
                  component.setState({ privacySelected: privacy.code })
                }
              >
                <Button>
                  <Radio
                    className={
                      "custom-radio " +
                      (privacySelected == privacy.code ? "active" : "")
                    }
                    checked={privacySelected == privacy.code}
                    onChange={() =>
                      component.setState({ privacySelected: privacy.code })
                    }
                  />
                  <img src={privacy.icon1} />
                  <span>
                    <label>{privacy.label}</label>
                    <span>{privacy.description}</span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isProccesing == true ? (
        <Loader type="dask-mode" isFullScreen={true} />
      ) : (
          ""
        )}
    </Drawer>
  );
};

const renderDetailPosted = (component) => {
  let { showPostedDetail, sharedPost } = component.state;
  let { data, profile, daskMode, openReactions, anchor, showLocalMenu, } = component.props;

  if (sharedPost) data = sharedPost;

  let PrivacyOptions = objToArray(Privacies);
  return (
    <Drawer
      anchor="bottom"
      className="posted-detail-drawer"
      open={showPostedDetail}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              component.setState({ showPostedDetail: false, sharedPost: null })
            }
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="drawer-content"
          style={{ overflow: "auto", background: "#f2f3f7", padding: "10px" }}
        >
          {data && (
            <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
              {data.kindpost == 4 ? (
                <div className="album-name">
                  <span>
                    Album <span>{data.albumname}</span>
                  </span>
                </div>
              ) : (
                  ""
                )}
              <CardHeader
                className="card-header"
                avatar={
                  <Avatar aria-label="recipe" className="avatar">
                    <div
                      className="img"
                      style={{ background: `url("${data.avataruserpost}")` }}
                    />
                  </Avatar>
                }
                action={
                  <CustomMenu>
                    {data.iduserpost === profile.id &&
                      <MenuItem
                        onClick={() =>
                          component.setState({ showLocalMenu: false }, () =>
                            component.props.togglePostDrawer(true)
                          )
                        }
                      >
                        Chỉnh sửa bài đăng a
                    </MenuItem>
                    }
                    {data.iduserpost === profile.id && data.kindpost !== 2 && data.kindpost !== 3 ? (
                      <MenuItem
                        onClick={() =>
                          component.setState({ showLocalMenu: false }, () =>
                            component.handleDeletePost()
                          )
                        }
                      >
                        Xoá bài đăng
                      </MenuItem>
                    ) : (
                        ""
                      )}
                    <MenuItem
                      onClick={() =>
                        component.setState({ showLocalMenu: false }, () =>
                          copyToClipboard(PostLinkToCoppy + data.nfid)
                        )
                      }
                    >
                      Sao chép liên kết
                    </MenuItem>
                    {data.iduserpost === profile.id && (
                      <MenuItem
                        onClick={() =>
                          component.setState({ showLocalMenu: false })
                        }
                      >
                        Ẩn bài đăng
                      </MenuItem>
                    )}
                    {data.iduserpost != profile.id ? (
                      <MenuItem
                        onClick={() =>
                          component.setState({ showLocalMenu: false }, () =>
                            component.props.toggleReportComment(true, data)
                          )
                        }
                      >
                        Báo cáo vi phạm
                      </MenuItem>
                    ) : (
                        ""
                      )}
                  </CustomMenu>
                }
                title={
                  <span className="poster-name">
                    <span className="name">{data.nameuserpost}</span>
                    {data.kindpost == 4 ? (
                      <span>
                        {data.titlepost
                          .replace("{usernamesend}", " ")
                          .replace("{namealbum}", data.albumname)}
                      </span>
                    ) : (
                        ""
                      )}
                    {data.kindpost == 3 ? (
                      <span>{data.titlepost.replace("{username}", " ")}</span>
                    ) : (
                        ""
                      )}
                    {data.kindpost == 2 ? (
                      <span>{data.titlepost.replace("{username}", " ")}</span>
                    ) : (
                        ""
                      )}
                  </span>
                }
                subheader={
                  <div className="poster-subtitle">
                    <div>
                      <img
                        src={
                          PrivacyOptions.find(
                            (privacy) => privacy.code == data.postforid
                          ).icon1
                        }
                      />
                      <FiberManualRecordIcon />
                      {fromNow(moment(data.createdate), moment(new Date()))}
                    </div>
                    {data.groupidpost > 0 ? (
                      <div>
                        <img src={Group} />
                        <FiberManualRecordIcon
                          style={{ width: "6px", height: "6px" }}
                        />
                        <span>
                          <u>{data.groupnamepost}</u>
                        </span>
                      </div>
                    ) : (
                        ""
                      )}
                  </div>
                }
              />
              {data.nfcontent != "" ? (
                <div
                  className={
                    "post-content" +
                    (data.backgroundid > 0 ? " have-background" : "")
                  }
                  style={{
                    background:
                      "url(" +
                      backgroundList.filter(
                        (item) => item.id == data.backgroundid
                      )[0].background +
                      ")",
                  }}
                >
                  <PostContent content={data} />
                </div>
              ) : (
                  ""
                )}

              <CardContent className="card-content">
                {data.numlike > 0 || data.numcomment > 0 ? (
                  <div className="react-reward">
                    {data.numlike > 0 ? (
                      <span className="like" onClick={() => component.setState({ showLikeRewardDrawer: true })}>
                        {data.iconNumbers
                          .filter((item) => item.icon != data.iconlike)
                          .map(
                            (item, index) =>
                              item.icon > 0 &&
                              item.num > 0 && (
                                <img
                                  key={index}
                                  src={ReactSelectorIcon[item.icon].icon}
                                ></img>
                              )
                          )}
                        {data.islike == 1 && data.iconlike > 0 ? (
                          <img
                            src={ReactSelectorIcon[data.iconlike].icon}
                          ></img>
                        ) : (
                            ""
                          )}
                        <span>{data.numlike}</span>
                      </span>
                    ) : (
                        <span className="like"></span>
                      )}
                    {data.numcomment > 0 ? (
                      <span className="comment">
                        {data.numcomment} bình luận{" "}
                      </span>
                    ) : (
                        ""
                      )}
                  </div>
                ) : (
                    ""
                  )}
              </CardContent>
              <CardActions disableSpacing className="post-actions">
                <FacebookSelector
                  open={openReactions}
                  active={data.iconlike}
                  onClose={() => component.setState({ openReactions: false })}
                  onReaction={(reaction) => component.likePosted(reaction)}
                  onShortPress={(reaction) =>
                    data.islike == 1
                      ? component.dislikePosted(reaction)
                      : component.likePosted(reaction)
                  }
                />

                <Button
                  onClick={() => {
                    component.props.toggleCommentDrawer(true, data)
                  }
                  }
                >
                  <img src={daskMode ? comment1 : comment} />
                  Bình luận
                </Button>
                {data.postforid != 4 ? (
                  <Button
                    onClick={() => this.props.toggleSharePost(true, data)}
                  // onClick={() =>
                  //   component.setState(
                  //     { showShareDrawer: true, groupSelected: null },
                  //     () => {
                  //       component.getFriends(0);
                  //       component.getGroup(0);
                  //     }
                  //   )
                  // }
                  >
                    <img src={daskMode ? share1 : share} />
                    Chia sẻ
                  </Button>
                ) : (
                    ""
                  )}
              </CardActions>
            </Card>
          )}
          <div className="list-image">
            <ul>
              {data.mediaPlays.map((media, index) => (
                <li key={index}>
                  <Card
                    className={"post-item " + (daskMode ? "dask-mode" : "")}
                  >
                    <CardContent className="card-content">
                      {media.typeobject == 2 ? (
                        <div>
                          <div
                            onClick={() => {
                              component.props.setMediaToViewer([media]);
                              component.props.toggleMediaViewerDrawer(true, {
                                actions: mediaGuestActions(component),
                                showInfo: true,
                                isvideo: true,
                                activeIndex: 0
                              });
                            }}
                          >
                            <IconButton className="bt-play">
                              <PlayArrowIcon />
                            </IconButton>
                            <img
                              src={media.thumbnailname}
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>
                      ) : (
                          <img
                            src={media.name}
                            className="image"
                            onClick={() => {
                              component.props.setMediaToViewer(data.mediaPlays);
                              component.props.toggleMediaViewerDrawer(true, {
                                actions:
                                  data.iduserpost == profile.id
                                    ? mediaRootActions(component)
                                    : mediaGuestActions(component),
                                showInfo: true,
                                activeIndex: index,
                              });
                            }}
                          />
                        )}

                      {media.numlike > 0 || media.numcomment > 0 ? (
                        <div className="react-reward">
                          {media.numlike > 0 ? (
                            <span className="like" onClick={() => component.setState({ showLikeRewardDrawer: true, currentImage: media })}>
                              {media.iconNumbers
                                .filter((item) => item.icon != media.iconlike)
                                .map(
                                  (item, index) =>
                                    item.icon > 0 &&
                                    item.num > 0 && (
                                      <img
                                        key={index}
                                        src={ReactSelectorIcon[item.icon].icon}
                                      ></img>
                                    )
                                )}
                              {media.islike == 1 && media.iconlike > 0 ? (
                                <img
                                  src={ReactSelectorIcon[media.iconlike].icon}
                                ></img>
                              ) : (
                                  ""
                                )}
                              <span>{media.numlike}</span>
                            </span>
                          ) : (
                              <span className="like"></span>
                            )}
                          {media.numcomment > 0 ? (
                            <span className="comment">
                              {media.numcomment} bình luận
                            </span>
                          ) : (
                              ""
                            )}
                        </div>
                      ) : (
                          ""
                        )}
                    </CardContent>
                    <CardActions disableSpacing className="post-actions">
                      <FacebookSelector
                        open={openReactions}
                        active={media.iconlike > 0 ? media.iconlike : 0}
                        onClose={() =>
                          component.setState({ openReactions: false })
                        }
                        onReaction={(reaction) =>
                          component.likeImage(reaction, media)
                        }
                        onShortPress={(reaction) =>
                          media.islike == 1
                            ? component.dislikeImage(media)
                            : component.likeImage(reaction, media)
                        }
                      />
                      <Button
                        onClick={() =>
                          // component.setState({
                          //   showCommentImageDrawer: true,
                          //   currentImage: media,
                          //   currentPost: data,
                          // })
                          component.props.toggleCommentImageDrawer(true, media, data)
                        }
                      >
                        <img src={daskMode ? comment1 : comment} />
                        Bình luận
                      </Button>
                      {data.postforid != 4 ? (
                        <Button
                          onClick={() => this.props.toggleSharePost(true, data)}
                        // onClick={() =>
                        //   component.setState(
                        //     {
                        //       showShareDrawer: true,
                        //       currentImage: media,
                        //       groupSelected: null,
                        //     },
                        //     () => {
                        //       component.getFriends(0);
                        //       component.getGroup(0);
                        //     }
                        //   )
                        // }
                        >
                          <img src={daskMode ? share1 : share} />
                          Chia sẻ
                        </Button>
                      ) : (
                          ""
                        )}
                    </CardActions>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* {
        isProccesing == true ? <Loader type="dask-mode" isFullScreen={true} /> : ""
      } */}
    </Drawer>
  );
};

const renderTagsFriendDrawer = (component) => {
  let { showTagsFriendDrawer } = component.state;
  let { data } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="tags-friend-drawer"
      open={showTagsFriendDrawer}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({ showTagsFriendDrawer: false })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Bạn bè được tag</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="drawer-content"
          style={{ overflow: "auto", padding: "10px" }}
        >
          {data ? (
            <div className="tag-friend-list">
              {data.usersTag && data.usersTag.length > 0 ? (
                <ul>
                  {data.usersTag.map((friend, index) => (
                    <li key={index}>
                      <Button
                        onClick={() => {
                          component.props.setCurrenUserDetail({
                            ...friend,
                            friendid: friend.id,
                          });
                          component.props.toggleUserPageDrawer(true);
                        }}
                      >
                        <CardHeader
                          className="cart-header"
                          avatar={
                            <Avatar className="avatar">
                              <img src={friend.thumbnail_avatar}></img>
                            </Avatar>
                          }
                          title={
                            <span className="name">{friend.fullname}</span>
                          }
                          subheader={
                            <span className="name">
                              {friend.statusfriend == 10 ? "Bạn bè" : ""}
                            </span>
                          }
                        />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                  ""
                )}
            </div>
          ) : (
              ""
            )}
        </div>
      </div>
    </Drawer>
  );
};

const renderUpdateInfoOfProfilePostDrawer = (component) => {
  let { showUpdateInfoOfProfilePost, postContent } = component.state;

  return (
    <Drawer
      anchor="bottom"
      className="update-info-profile-post-drawer"
      open={showUpdateInfoOfProfilePost}
    >
      <div className="drawer-detail fit-desktop">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.handleClosePostForm()}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Chỉnh sửa nội dung</label>
          </div>
          <Button
            className="bt-submit"
            onClick={() => component.handleUpdateInfoOfProfilePost()}
          >
            Đăng
          </Button>
        </div>
        <div className="filter"></div>
        <div
          className="drawer-content"
          style={{ overflow: "auto", padding: "10px" }}
        >
          <MultiInput
            style={{
              minHeight: "220px",
              padding: "15px",
              background: "#ededed",
              border: "none",
            }}
            onChange={(value) =>
              component.setState({
                postContent: value.text,
              })
            }
            topDown={true}
            placeholder={"Nhập nội dung mô tả"}
            enableHashtag={false}
            enableMention={false}
            centerMode={false}
            value={postContent}
          />
        </div>
      </div>
    </Drawer>
  );
};

const renderReportPostDrawer = (component) => {
  let {
    reasonSelected,
    showReportPostDrawer,
    postReportReason,
    orderReasonText,
    willBlock,
    willUnfollow,
    willUnfriend,
  } = component.state;

  let { data } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="report-drawer"
      open={showReportPostDrawer}
      onClose={() => component.setState({ showReportPostDrawer: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              component.setState({
                showReportPostDrawer: false,
                reasonSelected: null,
                orderReasonText: "",
                willBlock: false,
                willUnfollow: false,
                willUnfriend: false,
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
            <label>Báo cáo bài đăng</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="content-form"
          style={{ overflow: "auto" }}
        >
          <div>
            <img src={report} />
            <label>Bạn thấy bài đăng này có dấu hiệu nào dưới đây?</label>
            <div className="reason-box">
              <ul>
                {postReportReason.map((reason, index) => (
                  <li
                    key={index}
                    className={
                      reasonSelected && reasonSelected.issueid == reason.issueid
                        ? "active"
                        : ""
                    }
                    onClick={() => component.handleSelectReason(reason)}
                  >
                    <Button>{reason.issuename}</Button>
                  </li>
                ))}
              </ul>
              <div>
                <MultiInput
                  style={{
                    minHeight: "120px",
                    padding: "15px",
                    background: "#ededed",
                    border: "none",
                    margin: "15px 0px 20px",
                  }}
                  onChange={(value) =>
                    component.setState({
                      orderReasonText: value.text,
                      reasonSelected: null,
                    })
                  }
                  topDown={true}
                  placeholder={"Khác (Ghi tối đa 20 chữ)"}
                  enableHashtag={false}
                  enableMention={false}
                  centerMode={false}
                  value={orderReasonText}
                  maxLength={20}
                  unit="Word"
                />
              </div>
            </div>
          </div>
          <div className="re-action">
            <label>Bạn có muốn?</label>
            <ul>
              <li onClick={() => component.setState({ willBlock: !willBlock })}>
                <img src={block} />
                <div>
                  <label>Chặn {data.nameuserpost}</label>
                  <span>
                    Bạn và người này sẽ không nhìn thấy bài đăng và liên hệ với
                    nhau.
                  </span>
                </div>
                <Radio checked={willBlock} />
              </li>
              <li
                onClick={() =>
                  component.setState({ willUnfollow: !willUnfollow })
                }
              >
                <img src={unfollow} />
                <div>
                  <label>Bỏ theo dõi {data.nameuserpost}</label>
                  <span>
                    Bạn sẽ không nhìn thấy những bài đăng từ người này nhưng vẫn
                    là bạn bè của nhau.
                  </span>
                </div>
                <Radio checked={willUnfollow} />
              </li>
              <li
                onClick={() =>
                  component.setState({ willUnfriend: !willUnfriend })
                }
              >
                <img src={unfriend} />
                <div>
                  <label>Huỷ kết bạn {data.nameuserpost}</label>
                  <span>
                    Hai bạn không còn trong danh sách bạn bè của nhau trên YOOT.
                  </span>
                </div>
                <Radio checked={willUnfriend} />
              </li>
            </ul>
            <Button
              className="bt-submit"
              onClick={() => component.handleReportPost()}
            >
              Báo cáo
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderReportGroupDrawer = (component) => {
  let {
    reasonSelected,
    showReportGroupDrawer,
    groupReportReason,
    orderReasonText,
    willBlock,
    willUnfollow,
    willUnfriend,
  } = component.state;
  let { data } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="report-drawer"
      open={showReportGroupDrawer}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              component.setState({
                showReportGroupDrawer: false,
                reasonSelected: null,
                orderReasonText: "",
                willBlock: false,
                willUnfollow: false,
                willUnfriend: false,
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
            <label>Báo cáo bài trong nhóm</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="content-form"
          style={{ overflow: "auto" }}
        >
          <div>
            <img src={report} />
            <p>{data.groupnamepost}</p>
            <label>Bạn thấy bài đăng này có dấu hiệu nào dưới đây?</label>
            <div className="reason-box">
              <ul>
                {groupReportReason.map((reason, index) => (
                  <li
                    key={index}
                    className={
                      reasonSelected && reasonSelected.issueid == reason.issueid
                        ? "active"
                        : ""
                    }
                    onClick={() => component.handleSelectReason(reason)}
                  >
                    <Button>{reason.issuename}</Button>
                  </li>
                ))}
              </ul>
              <div>
                <MultiInput
                  style={{
                    minHeight: "120px",
                    padding: "15px",
                    background: "#ededed",
                    border: "none",
                    margin: "15px 0px 20px",
                  }}
                  onChange={(value) =>
                    component.setState({
                      orderReasonText: value.text,
                      reasonSelected: null,
                    })
                  }
                  topDown={true}
                  placeholder={"Khác (Ghi tối đa 20 chữ)"}
                  enableHashtag={false}
                  enableMention={false}
                  centerMode={false}
                  value={orderReasonText}
                  maxLength={20}
                  unit="Word"
                />
              </div>
            </div>
          </div>
          <div className="re-action">
            <label>Bạn có muốn?</label>
            <ul>
              <li onClick={() => component.setState({ willBlock: !willBlock })}>
                <img src={block} />
                <div>
                  <label>Chặn hoàng {data.nameuserpost}</label>
                  <span>
                    Bạn và người này sẽ không nhìn thấy bài đăng và liên hệ với
                    nhau.
                  </span>
                </div>
                <Radio checked={willBlock} />
              </li>
              {/* <li onClick={() => component.setState({ willUnfollow: !willUnfollow })}>
                <img src={unfollow} />
                <div>
                  <label>Bỏ theo dõi hoàng hải long</label>
                  <span>Bạn sẽ không nhìn thấy những bài đăng từ người này nhưng vẫn là bạn bè của nhau.</span>
                </div>
                <Radio
                  checked={willUnfollow}
                />
              </li>
              <li onClick={() => component.setState({ willUnfriend: !willUnfriend })}>
                <img src={unfriend} />
                <div>
                  <label>Huỷ kết bạn hoàng hải long</label>
                  <span>Hai bạn không còn trong danh sách bạn bè của nhau trên YOOT.</span>
                </div>
                <Radio
                  checked={willUnfriend}
                />
              </li> */}
            </ul>
            <Button
              className="bt-submit"
              onClick={() => component.handleReportGroup()}
            >
              Báo cáo
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderReportSuccessAlert = (component) => {
  let {
    showReportSuccessAlert,
    reasonSelected,
    orderReasonText,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="confirm-drawer report-success-alert"
      open={showReportSuccessAlert}
      onClose={() =>
        component.setState({
          showReportSuccessAlert: false,
          showReportPostDrawer: false,
          showReportGroupDrawer: false,
          orderReasonText: "",
          reasonSelected: null,
          willBlock: false,
          willUnfollow: false,
          willUnfriend: false,
        })
      }
    >
      <div
        className="jon-group-confirm"
        onClick={() => component.setState({ showReportSuccessAlert: false })}
      >
        <div>
          <img src={report} />
        </div>
        <span>Bạn đã báo cáo bài đăng này có dấu hiệu</span>
        {reasonSelected && (
          <div>
            <Button className="btn-reason" disabled>
              {reasonSelected.issuename}
            </Button>
          </div>
        )}
        {orderReasonText.length > 0 && (
          <div>
          <Button className="btn-reason" disabled>
            {orderReasonText}
          </Button>
          </div>
        )}
        <div className="warning-css">
          <div className='line-css' />
          <img src={thank} />
        </div>
        <p>Cảm ơn bạn đã báo cáo.</p>
        <p>Bài viết đã được gửi đến quản trị YOOT</p>
      </div>
    </Drawer>
  );
};

const renderTagFriendForShareDrawer = (component) => {
  let { showTagFriendDrawer, tagedFrieds, friends } = component.state;

  return (
    <Drawer
      anchor="bottom"
      className="tag-friend-drawer fit-popup"
      open={showTagFriendDrawer}
      onClose={() => component.setState({ showTagFriendDrawer: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({
              showTagFriendDrawer: false,
              tagedFrieds: []
            })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Gắn thẻ bạn bè</label>
          </div>
          <Button
            onClick={() => { component.setState({ showTagFriendDrawer: false }) }}
          >
            Xong
          </Button>
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
          />
          <div className="taged-friend">
            {tagedFrieds.length > 0 ? (
              <ul>
                {tagedFrieds.map((friend, index) => (
                  <li key={index}>
                    <span>
                      {friend.friendname}
                      {index >= 0 ? ", " : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
                <span>Gắn thẻ bạn bè tại đây</span>
              )}
            {tagedFrieds.length > 0 ? (
              <IconButton
                onClick={() => component.setState({ tagedFrieds: [] })}
              >
                <CloseIcon />
              </IconButton>
            ) : (
                ""
              )}
          </div>
        </div>
        <div
          className="drawer-content"
        >
          {friends && friends.length > 0 ? (
            <div className="friend-list">
              <ul>
                {friends.map((friend, index) => (
                  <li
                    key={index}
                    onClick={() => component.handleTagFriend(friend)}
                  >
                    <Avatar aria-label="recipe" className="avatar">
                      <div
                        className="img"
                        style={{
                          background: `url("${friend.friend_thumbnail_avatar}")`,
                        }}
                      />
                    </Avatar>
                    <label>{friend.friendname}</label>
                    <div
                      className={
                        "selected-radio " +
                        (tagedFrieds.find(
                          (item) => item.friendid == friend.friendid
                        )
                          ? "active"
                          : "")
                      }
                    >
                      <DoneIcon />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
              ""
            )}
        </div>
      </div>
    </Drawer>
  );
};

const renderLikeRewardDrawer = (component) => {
  let {
    showLikeRewardDrawer,
    currentImage
  } = component.state;
  let {
    data
  } = component.props
  return (
    <Drawer
      anchor="bottom"
      className="like-reward-drawed fit-popup"
      open={showLikeRewardDrawer}
      onClose={() => component.setState({ showLikeRewardDrawer: false })}
    >
      <LikeReward data={data} image={currentImage} history={component.props.history} onClose={() => component.setState({ showLikeRewardDrawer: false, currentImage: null })} />
    </Drawer>
  );
};
