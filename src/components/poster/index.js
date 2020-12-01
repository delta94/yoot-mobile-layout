import React from "react";
import "./style.scss";
import {
  togglePostDrawer,
  toggleMediaViewerDrawer,
  setMediaToViewer,
  toggleCreateAlbumDrawer,
  selectAlbumToPost,
  setProccessDuration,
} from "../../actions/app";
import {
  setCurrentPosted,
  createPostSuccess,
  updatePosted,
} from "../../actions/posted";
import { setJoinedGroup, setCurrentGroup } from "../../actions/group";
import { connect } from "react-redux";
import {
  Drawer,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  CardHeader,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
  Add as AddIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Done as DoneIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import {
  Privacies,
  GroupPrivacies,
  backgroundList,
} from "../../constants/constants";
import { objToArray, objToQuery, srcToFile } from "../../utils/common";
import Dropzone from "react-dropzone";
import MultiInput from "../common/multi-input";
import { MentionsInput, Mention } from "react-mentions";
import $ from "jquery";
import { postFormData, get } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import { showInfo } from "../../utils/app";
import Loader from "../common/loader";
import Post from "../post";
import moment from "moment";
import ShowMoreText from "react-show-more-text";

const uploadImage = require("../../assets/icon/upload_image.png");
const uploadVideo = require("../../assets/icon/upload_video.png");
const album = require("../../assets/icon/album@1x.png");
const tag = require("../../assets/icon/tag@1x.png");
const color = require("../../assets/icon/color@1x.png");
const defaultImage = "https://dapp.dblog.org/img/default.jpg";
const search = require("../../assets/icon/Find@1x.png");
const noImageGroup = require("../../assets/images/group_members_icon.png");


export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privacySelected: Privacies.Public,
      postPrivacy: Privacies.Public,
      showPostPrivacySelectOption: false,
      imageSelected: [],
      postedImage: [],
      videoSelected: [],
      postedVideo: [],
      showAlbumSelectDrawer: false,
      albumSelected: null,
      tagedFrieds: [],
      showGroupForPostDrawer: false,
      postContent: "",
      mentionSelected: [],
      hashtagSelected: [],
      searchKey: "",
      friends: [],
      isChange: false,
      albums: [],
      searchKey: "",
    };
    this.imageDrop = React.createRef();
  }

  handleReset() {
    this.setState({
      privacySelected: Privacies.Public,
      postPrivacy: Privacies.Public,
      showPostPrivacySelectOption: false,
      imageSelected: [],
      videoSelected: [],
      showAlbumSelectDrawer: false,
      tagedFrieds: [],
      showGroupForPostDrawer: false,
      postContent: "",
      mentionSelected: [],
      hashtagSelected: [],
      searchKey: "",
      isChange: false,
      nfid: null,
      postedVideo: [],
      postedImage: [],
    });
  }

  handleCloseDrawer(isForce) {
    if (isForce == true) {
      this.handleReset();
      this.props.togglePostDrawer(false);
    } else {
      if (this.state.isChange == true) {
        this.setState({
          showConfim: true,
          okCallback: () => {
            this.props.togglePostDrawer(false);
            this.handleReset();
            this.props.setCurrentPosted(null);
          },
          confirmTitle: "Huỷ chỉnh sửa bài đăng?",
          confirmMessage:
            "Nếu bạn huỷ bây giờ, bài chỉnh sửa của bạn sẽ bị bỏ đi.",
        });
      } else {
        this.handleReset();
        this.props.setCurrentPosted(null);
        this.props.togglePostDrawer(false);
      }
    }
  }

  selectImage(acceptedFiles) {
    let { imageSelected } = this.state;
    let that = this;

    if (acceptedFiles && acceptedFiles.length > 0) {
      this.setState({
        videoSelected: [],
        postedVideo: [],
      });
      acceptedFiles.map((image) => {
        var fr = new FileReader();
        fr.onload = function () {
          var img = new Image();
          img.onload = function () {
            imageSelected = imageSelected.concat({
              file: image,
              width: img.width,
              height: img.height,
            });
            that.setState({
              imageSelected: imageSelected,
              isBackgroundSelect: false,
              isChange: true,
              backgroundSelected: null,
            });
          };
          img.src = fr.result;
        };
        fr.readAsDataURL(image);
      });
    }
  }

  selectVideo(acceptedFiles) {
    let { videoSelected } = this.state;
    let that = this;

    if (acceptedFiles && acceptedFiles.length > 0) {
      this.setState({
        imageSelected: [],
        postedImage: [],
      });
      acceptedFiles.map((video, index) => {
        var videoId = "videoMain-" + index;
        var $videoEl = $('<video id="' + videoId + '"></video>');
        $("body").append($videoEl);
        $videoEl.attr("src", URL.createObjectURL(video));
        var videoTagRef = $videoEl[0];
        videoTagRef.onloadedmetadata = function () {
          videoSelected = videoSelected.concat({
            file: video,
            width: $(this)[0].clientWidth,
            height: $(this)[0].clientHeight,
          });
          that.setState({
            videoSelected: videoSelected,
            isBackgroundSelect: false,
            isChange: true,
            backgroundSelected: null,
          });
        };
      });
    }
  }

  handleDeleteImage(image) {
    let { imageSelected } = this.state;
    imageSelected = imageSelected.filter((item) => item.file != image.file);
    this.setState({
      imageSelected: imageSelected,
      isChange: true,
    });
  }

  handleDeletePostedImage(image) {
    let { postedImage } = this.state;
    postedImage = postedImage.filter(
      (e) => e.detailimageid != image.detailimageid
    );
    this.setState({
      postedImage: postedImage,
    });
  }

  handleDeletePostedVideo(video) {
    let { postedVideo } = this.state;
    postedVideo = postedVideo.filter(
      (e) => e.detailimageid != video.detailimageid
    );
    this.setState({
      postedVideo: postedVideo,
    });
  }

  handleDeleteVideo(video) {
    let { videoSelected } = this.state;
    videoSelected = videoSelected.filter((item) => item != video);
    this.setState({
      videoSelected: videoSelected,
      isChange: true,
    });
  }

  handleTagFriend(friend) {
    let { tagedFrieds } = this.state;
    let existFriend = tagedFrieds.find(
      (item) => item.friendid == friend.friendid
    );
    if (existFriend) {
      tagedFrieds = tagedFrieds.filter(
        (item) => item.friendid != friend.friendid
      );
    } else {
      tagedFrieds.push(friend);
    }
    this.setState({
      tagedFrieds: tagedFrieds,
      isChange: true,
    });
  }

  handleSelectBackground(background) {
    this.setState({
      backgroundSelected: background,
      isChange: true,
    });
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

  getAlbum(currentpage, userId) {
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      userid: userId,
    };
    let { albums } = this.state;
    this.setState({
      isLoading: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "Media/GetListAlbum" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            albums: albums.concat(result.content.albums),
            isLoading: false,
          });
          if (result.content.medias.length == 0) {
            this.setState({
              isEndOfAlbums: true,
            });
          }
        }
      }
    );
  }

  getJoinedGroup(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 200,
      skin: "Join",
      findstring: this.state.searchKey,
    };
    let { joinedGroups } = this.props;
    this.setState({
      isLoadMoreGroup: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetListGroupUser" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          joinedGroups = result.content.groupUsers;
          this.props.setJoinedGroup(joinedGroups, result.content.numGroupJoin);

          if (result.content.groupUsers.length == 0) {
            this.setState({ isEndOfJoinedGroup: true });
          }
        }
        this.setState({
          isLoadMoreGroup: false,
        });
      }
    );
  }

  handlePost() {
    let {
      postContent, mentionSelected, hashtagSelected, privacySelected, isPosting, backgroundSelected,
      tagedFrieds, imageSelected, videoSelected, nfid, postedImage, postedVideo,
    } = this.state;
    let { albumSelected, profile, currentGroup } = this.props;
    if (isPosting == true) return;
    this.setState({
      isPosting: true,
    });

    let data = new FormData();

    data.append("content", postContent);
    if (currentGroup) {
      data.append(
        "postfor",
        GroupPrivacies[currentGroup.typegroupname].code.toString()
      );
      data.append("groupid", currentGroup.groupid.toString());
    } else data.append("postfor", privacySelected.code.toString());
    data.append("postshareid", "0");
    if (
      /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?./gm.test(postContent)
    ) {
      data.append("isvideo", "1");
    } else {
      data.append("isvideo", "0");
    }
    let currentIndex = 0;
    if (nfid > 0) {
      data.append("id", nfid.toString());
      let nameMediaPlays = [];
      // debugger

      postedVideo.map((video) =>
        nameMediaPlays.push(video.name.split("/").slice(-1).pop())
      );
      postedImage.map((image) =>
        nameMediaPlays.push(image.name.split("/").slice(-1).pop())
      );

      data.append("nameMediaPlays", JSON.stringify(nameMediaPlays));
      currentIndex = nameMediaPlays.length;
    } else {
      data.append("nameimage", "");
    }
    if (mentionSelected.length > 0) {
      let ids = [];
      mentionSelected.map((item) => ids.push(item.id));
      data.append("labeltags", JSON.stringify(ids));
    }

    if (tagedFrieds.length > 0) {
      let ids = [];
      tagedFrieds.map((item) => ids.push(item.friendid));
      data.append("tags", JSON.stringify(ids));
    }

    if (hashtagSelected.length > 0)
      data.append("hashtags", JSON.stringify(hashtagSelected));

    if (backgroundSelected && backgroundSelected.id != 0) {
      data.append("background", backgroundSelected.id.toString());
      data.set("nameMediaPlays", JSON.stringify([]));
    } else {
      data.append("background", "0");
    }

    if (imageSelected.length > 0) {
      imageSelected.map((image, index) => {
        data.append("image_" + (index + currentIndex) + "_" + image.width + "_" + image.height, image.file);
      });
    }

    data.append(
      "numimage",
      (imageSelected.length + postedImage.length).toString()
    );

    if (videoSelected.length > 0) {
      videoSelected.map((video, index) => {
        data.append(
          "video_" +
          (index + currentIndex) +
          "_" +
          video.width +
          "_" +
          video.height,
          video.file
        );
      });
    }

    data.append(
      "numvideo",
      (videoSelected.length + postedVideo.length).toString()
    );

    if (albumSelected != null || albumSelected != undefined) {
      data.append("albumid", albumSelected.albumid.toString());
    }
    this.setState({
      isPosting: false,
    });
    this.handleCloseDrawer(true);
    this.props.setProccessDuration(80);
    let endPoint = "PostNewsFeed/CreateNewsFeed";
    if (nfid) {
      endPoint = "PostNewsFeed/EditNewsFeed";
    }
    postFormData(SOCIAL_NET_WORK_API, endPoint, data, (result) => {
      if (result && result.result === 1) {
        console.log(result)
        if (nfid > 0) {
          this.props.updatePosted(
            { ...result.content.newsFeeds, isPendding: true },
            profile.id
          );
        } else {
          this.props.createPostSuccess(
            { ...result.content.newsFeeds, isPendding: true },
            profile.id
          );
        }
        this.props.setProccessDuration(20);
      }
    });
  }

  setImageUrlToFile(value) {
    let that = this;
    srcToFile(
      value.name,
      value.nameimage,
      "image/" + value.nameimage.split(".")[1]
    ).then(function (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        let { imageSelected } = that.state;
        imageSelected.push({
          file: file,
          width: value.width,
          height: value.height,
        });
        that.setState({
          imageSelected: imageSelected,
        });
      });
      reader.readAsDataURL(file);
    });
  }
  setVideoUrlToFile(value) {
    let that = this;
    srcToFile(
      value.name,
      value.nameimage,
      "image/" + value.nameimage.split(".")[1]
    ).then(function (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        let { videoSelected } = that.state;
        videoSelected.push({
          file: file,
          width: value.width,
          height: value.height,
        });
        that.setState({
          videoSelected: videoSelected,
        });
      });
      reader.readAsDataURL(file);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.showPostDrawer == true &&
      nextProps.showPostDrawer != this.props.showPostDrawer
    ) {
      let currentPost = nextProps.currentPost;
      if (!currentPost) return;
      let { albums, tagedFrieds, postedImage, postedVideo } = this.state;
      let privacyOptions = objToArray(Privacies);
      let privacySelected = privacyOptions.find(
        (privacy) => privacy.code == currentPost.postforid
      );
      let albumSelected = albums.find(
        (album) => album.albumid == currentPost.albumid
      );

      if (currentPost.mediaPlays.length > 0) {
        currentPost.mediaPlays.map((media) => {
          if (media.typeobject == 1) {
            postedImage.push(media);
          } else {
            postedVideo.push(media);
          }
        });
      }

      this.props.selectAlbumToPost(albumSelected);

      if (currentPost.usersTag && currentPost.usersTag.length > 0) {
        currentPost.usersTag.map((item) => {
          let friend = {
            friendname: item.fullname,
            friendid: item.id,
          };
          tagedFrieds.push(friend);
        });
      }

      this.setState({
        nfid: currentPost.nfid,
        postContent: currentPost.nfcontent,
        backgroundSelected:
          currentPost.backgroundid > 0
            ? backgroundList[currentPost.backgroundid]
            : null,
        isBackgroundSelect: currentPost.backgroundid > 0 ? true : false,
        privacySelected: privacySelected ? privacySelected : Privacies.Public,
        tagedFrieds: tagedFrieds,
      });
      setTimeout(() => {
        this.setState({
          mentionSelected: currentPost.usersLabelTag,
        });
      }, 1000);
    }
  }

  componentDidMount() {
    this.getFriends(0);
    this.getAlbum(0, 0);
  }

  render() {
    return (
      <div className="poster-content">
        {renderPostDrawer(this)}
        {renderPostPrivacyMenuDrawer(this)}
        {renderAlbumSelectDrawer(this)}
        {renderTagFriendDrawer(this)}
        {renderGroupForPostDrawer(this)}
        {renderConfirmDrawer(this)}
        {editShare(this)}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.user,
    ...state.posted,
    ...state.group,
  };
};

const mapDispatchToProps = (dispatch) => ({
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) =>
    dispatch(toggleMediaViewerDrawer(isShow, feature)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleCreateAlbumDrawer: (isShow, callback) =>
    dispatch(toggleCreateAlbumDrawer(isShow, callback)),
  selectAlbumToPost: (album) => dispatch(selectAlbumToPost(album)),
  setProccessDuration: (percent) => dispatch(setProccessDuration(percent)),
  setCurrentPosted: (post) => dispatch(setCurrentPosted(post)),
  createPostSuccess: (post, userId) =>
    dispatch(createPostSuccess(post, userId)),
  updatePosted: (post, userId) => dispatch(updatePosted(post, userId)),
  setJoinedGroup: (groups) => dispatch(setJoinedGroup(groups)),
  setCurrentGroup: (group) => dispatch(setCurrentGroup(group)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const renderPostDrawer = (component) => {
  let { showPostDrawer, isPostToGroup, albumSelected } = component.props;
  let {
    privacySelected,
    imageSelected,
    videoSelected,
    groupSelected,
    isBackgroundSelect,
    backgroundSelected,
    postContent,
    isPosting,
    mentionSelected,
    tagedFrieds,
    postedImage,
    postedVideo,
    nfid,
    isChange,
  } = component.state;

  let { currentGroup, currentPost } = component.props;
  return (
    <div>
      <Drawer anchor="bottom" className="poster-drawer" open={showPostDrawer}>
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
              <label>{nfid ? "Chỉnh sửa" : "Tạo bài đăng mới"}</label>
            </div>
            <Button
              className={isChange ? "bt-submit" : "bt-cancel"}
              style={{ width: "fit-content" }}
              onClick={() => component.handlePost()}
            >
              Đăng
            </Button>
          </div>
          <div className="filter">
            {isPostToGroup ? (
              <div
                className="group-select-options"
                onClick={() =>
                  component.setState({ showGroupForPostDrawer: true }, () =>
                    component.getJoinedGroup(0)
                  )
                }
              >
                {currentGroup ? (
                  <ShowMoreText lines={1} more="" less="">
                    <span>{currentGroup.groupname}</span>
                  </ShowMoreText>
                ) : (
                    <span>Chọn nhóm</span>
                  )}
                <ExpandMoreIcon />
              </div>
            ) : (
                ""
              )}
            {currentPost && currentPost.newsFeedShareRoot ? (
              <div className="title-edit-share">
                <Avatar aria-label="recipe" className="avatar">
                  <div
                    className="img"
                    style={{
                      background: `url("${currentPost.newsFeedShareRoot.avataruserpost}")`,
                    }}
                  />
                </Avatar>
                <div className="edit-share-info">
                  <b>{currentPost.newsFeedShareRoot.nameuserpost}</b>
                  <div
                    className="tag-edit-share"
                    onClick={() =>
                      component.setState({ showTagFriendDrawer: true })
                    }
                  >
                    <img src={tag} />
                    <span>Gắn thẻ</span>
                  </div>
                </div>
              </div>
            ) : (
                <ul>
                  <li>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        component.selectImage(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} id="bt-select-image">
                          <input {...getInputProps()} accept="image/*" />
                          <img src={uploadImage} />
                          <span>Tải ảnh</span>
                        </div>
                      )}
                    </Dropzone>
                  </li>
                  <li>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        component.selectVideo(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} id="bt-select-video">
                          <input {...getInputProps()} accept="video/*" />
                          <img src={uploadVideo} />
                          <span>Tải video</span>
                        </div>
                      )}
                    </Dropzone>
                  </li>
                  <li
                    onClick={() =>
                      component.setState(
                        { showAlbumSelectDrawer: true, albums: [] },
                        () => component.getAlbum(0, 0)
                      )
                    }
                    id="bt-create-album"
                  >
                    <img src={album} />
                    <span>Tạo Album</span>
                  </li>
                  <li
                    onClick={() =>
                      component.setState({ showTagFriendDrawer: true })
                    }
                  >
                    <img src={tag} />
                    <span>Gắn thẻ</span>
                  </li>
                  <li
                    onClick={() =>
                      component.setState({
                        isBackgroundSelect: true,
                        backgroundSelected: backgroundList[0],
                      })
                    }
                  >
                    <img src={color} />
                    <span>Màu nền</span>
                  </li>
                </ul>
              )}
          </div>
          {/* BINH: change tag friend */}
          {tagedFrieds && tagedFrieds.length > 0 && (
            <div className="taged-friend">
              <span>
                <img src={tag} />
              </span>
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
          <div
            className="drawer-content"
          >
            <MultiInput
              style={{
                minHeight: "320px",
                padding: "15px",
                background: backgroundSelected
                  ? "url(" + backgroundSelected.background + ")"
                  : "#fff",
              }}
              onChange={(value) =>
                component.setState({
                  postContent: value.text,
                  mentionSelected: value.mentionSelected,
                  hashtagSelected: value.hashtagSelected,
                  isChange: value.text != "",
                })
              }
              topDown={true}
              placeholder={"Bạn viết gì đi..."}
              enableHashtag={true}
              enableMention={true}
              centerMode={backgroundSelected && backgroundSelected.id != 0}
              value={postContent}
            />

            {currentGroup ? (
              <div
                className={
                  "post-role " +
                  (backgroundSelected && backgroundSelected.id != 0
                    ? "have-background"
                    : "")
                }
              >
                {albumSelected ? (
                  <span className="bt-sumbit">
                    <img src={album} />
                    <span>{albumSelected.albumname}</span>
                    <IconButton
                      onClick={() => component.props.selectAlbumToPost(null)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                ) : (
                    ""
                  )}
                <span className="bt-sumbit">
                  <img src={GroupPrivacies[currentGroup.typegroupname].icon} />
                  <span>
                    {GroupPrivacies[currentGroup.typegroupname].label}
                  </span>
                </span>
              </div>
            ) : (
                <div
                  className={
                    "post-role " +
                    (backgroundSelected && backgroundSelected.id != 0
                      ? "have-background"
                      : "")
                  }
                >
                  {albumSelected ? (
                    <span className="bt-sumbit">
                      <img src={album} />
                      <span>{albumSelected.albumname}</span>
                      <IconButton
                        onClick={() => component.props.selectAlbumToPost(null)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </span>
                  ) : (
                      ""
                    )}
                  <span
                    className="bt-sumbit"
                    onClick={() =>
                      component.setState({ showPostPrivacySelectOption: true })
                    }
                  >
                    <img src={privacySelected.icon} />
                    <span>{privacySelected.label}</span>
                  </span>
                </div>
              )}
            {currentPost && currentPost.newsFeedShareRoot && (
              <div
                className="edit-show-share"
                onClick={() => component.setState({ showEditShare: true })}
              >
                <p>Xem bài được chia sẻ</p>
                <ArrowForwardIosRoundedIcon style={{ color: "#ff5a5a" }} />
              </div>
            )}
            <div className="media-selected">
              {(postedImage && postedImage.length > 0) ||
                (imageSelected && imageSelected.length > 0) ? (
                  <div className="image-list media-list">
                    {postedImage &&
                      postedImage.map((image, index) => (
                        <div key={index}>
                          <div
                            style={{ background: "url(" + image.name + ")" }}
                          ></div>
                          <IconButton
                            onClick={() =>
                              component.handleDeletePostedImage(image)
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))}
                    {imageSelected &&
                      imageSelected.map((image, index) => (
                        <div key={index}>
                          <div
                            style={{
                              background:
                                "url(" + URL.createObjectURL(image.file) + ")",
                            }}
                          ></div>
                          <IconButton
                            onClick={() => component.handleDeleteImage(image)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))}
                  </div>
                ) : (
                  ""
                )}
              {(postedVideo && postedVideo.length > 0) ||
                (videoSelected && videoSelected.length > 0) ? (
                  <div className="video-list media-list">
                    {postedVideo &&
                      postedVideo.map((video, index) => (
                        <div key={index}>
                          <div className="overlay">
                            <PlayCircleOutlineIcon />
                          </div>
                          <div className="video-content">
                            <video
                              style={{
                                width:
                                  video.width > video.height ? "auto" : "100%",
                                height:
                                  video.height > video.width ? "auto" : "100%",
                              }}
                              src={video.name}
                            />
                          </div>
                          <IconButton
                            onClick={() =>
                              component.handleDeletePostedVideo(video)
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))}
                    {videoSelected &&
                      videoSelected.map((video, index) => (
                        <div key={index}>
                          <div className="overlay">
                            <PlayCircleOutlineIcon />
                          </div>
                          <div className="video-content">
                            <video
                              style={{
                                width:
                                  video.width > video.height ? "auto" : "100%",
                                height:
                                  video.height > video.width ? "auto" : "100%",
                              }}
                              src={URL.createObjectURL(video.file)}
                            />
                          </div>
                          <IconButton
                            onClick={() => component.handleDeleteVideo(video)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))}
                  </div>
                ) : (
                  ""
                )}
            </div>

            {isBackgroundSelect ? (
              <div className="background-list">
                <ul>
                  {backgroundList.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        background:
                          "url(" + (item ? item.background : "") + ")",
                      }}
                    >
                      <Button
                        onClick={() => component.handleSelectBackground(item)}
                      >
                        <span
                          className={
                            "radio " +
                            (backgroundSelected &&
                              backgroundSelected.id == index
                              ? "active"
                              : "")
                          }
                        ></span>
                      </Button>
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
      {isPosting ? <Loader type="dask-mode" isFullScreen={true} /> : ""}
    </div>
  );
};

const renderPostPrivacyMenuDrawer = (component) => {
  let { showPostPrivacySelectOption } = component.state;
  let privacyOptions = objToArray(Privacies);
  return (
    <Drawer
      anchor="bottom"
      className="img-select-option"
      open={showPostPrivacySelectOption}
      onClose={() => component.setState({ showPostPrivacySelectOption: false })}
    >
      <div className="option-header">
        <IconButton
          style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
          onClick={() =>
            component.setState({ showPostPrivacySelectOption: false })
          }
        >
          <ChevronLeftIcon
            style={{ color: "#ff5a59", width: "25px", height: "25px" }}
          />
        </IconButton>
        <label>Quyền riêng tư</label>
      </div>
      <ul className="option-list">
        {privacyOptions.map((item, index) => (
          <li key={index}>
            <Button
              onClick={() =>
                component.setState({
                  privacySelected: item,
                  showPostPrivacySelectOption: false,
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

const renderAlbumSelectDrawer = (component) => {
  let { showAlbumSelectDrawer, albums } = component.state;

  return (
    <Drawer
      anchor="bottom"
      className="select-album-drawer"
      open={showAlbumSelectDrawer}
      onClose={() => component.setState({ showAlbumSelectDrawer: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({ showAlbumSelectDrawer: false })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Chọn album</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="drawer-content"
        >
          <div className="album image-box">
            <ul>
              <li
                className="add-bt"
                onClick={() =>
                  component.props.toggleCreateAlbumDrawer(true, () => {
                    component.setState(
                      {
                        albums: [],
                        albumsCurrentPage: 0,
                        isEndOfAlbums: false,
                      },
                      () => component.getAlbum(0, 0)
                    );
                  })
                }
              >
                <div className="demo-bg">
                  <AddIcon />
                </div>
                <span className="name">Tạo album</span>
              </li>
              {albums.map((album, index) => (
                <li
                  key={index}
                  onClick={() =>
                    component.setState({ showAlbumSelectDrawer: false }, () =>
                      component.props.selectAlbumToPost(album)
                    )
                  }
                >
                  <div style={{ background: "url(" + defaultImage + ")" }}>
                    <div
                      className="demo-bg"
                      style={{ background: "url(" + album.background + ")" }}
                    />
                  </div>
                  <span className="name">{album.albumname}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderTagFriendDrawer = (component) => {
  let { showTagFriendDrawer, tagedFrieds, friends } = component.state;

  return (
    <Drawer
      anchor="bottom"
      className="tag-friend-drawer"
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
            <label>Gắn thẻ</label>
          </div>
          <Button
            onClick={() => component.setState({ showTagFriendDrawer: false })}
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
//share edit layout

const editShare = (component) => {
  const { showEditShare } = component.state;
  const { currentPost } = component.props;
  return (
    <Drawer
      className="edit-share-layout"
      anchor="bottom"
      open={showEditShare}
      onClose={() => component.setState({ showEditShare: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({ showEditShare: false })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Chi tiết</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "auto" }}>
          <ul className="p10" style={{ background: "#f2f3f7" }}>
            <li>
              {currentPost && <Post data={currentPost.newsFeedShareRoot} />}
            </li>
          </ul>
        </div>
      </div>
    </Drawer>
  );
};
//-----
const renderGroupForPostDrawer = (component) => {
  let { showGroupForPostDrawer, isLoadMoreGroup } = component.state;
  let { joinedGroups } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="tag-friend-drawer"
      open={showGroupForPostDrawer}
      onClose={() => component.setState({ showGroupForPostDrawer: false })}
    >
      <div className="drawer-detail" style={{overflow: "hidden"}}>
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() =>
              component.setState({ showGroupForPostDrawer: false })
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
            onChange={(e) =>
              component.setState(
                {
                  searchKey: e.target.value,
                },
                () => {
                  component.getJoinedGroup(0);
                }
              )
            }
          />
        </div>
        <div
          className="drawer-content"
          style={{ overflow: "auto" }}
        >
          {isLoadMoreGroup ? (
            <div style={{ height: "50px" }}>
              <Loader
                type="small"
                style={{ background: "#fff" }}
                width={30}
                height={30}
              ></Loader>
            </div>
          ) : (
              ""
            )}
          <div className="my-group-list">
            {joinedGroups && joinedGroups.length > 0 ? (
              <ul>
                {joinedGroups.map((group, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      component.setState(
                        { showGroupForPostDrawer: false },
                        () => component.props.setCurrentGroup(group)
                      )
                    }
                  >
                    <Avatar className="avatar">
                      <div
                        className="img"
                        style={{ background: group.thumbnail ? `url("${group.thumbnail}")` : `url("${noImageGroup}")` }}
                      />
                    </Avatar>
                    <div className="group-info">
                      <label>{group.groupname}</label>
                      <span
                        className={
                          "privacy " +
                          (group.typegroup == GroupPrivacies.Private.code
                            ? "red"
                            : "blued")
                        }
                      >
                        {GroupPrivacies[group.typegroupname].label}
                      </span>
                      <span className="member-count">
                        {group.nummember} thành viên
                      </span>
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
      className="confirm-drawer type-drawer"
      open={showConfim}
      onClose={() => component.setState({ showConfim: false })}
    >
      <div className="option-header">
        <IconButton
          style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
          onClick={() =>
            component.setState({ showPostPrivacySelectOption: false })
          }
        >
          <ChevronLeftIcon
            style={{ color: "#ff5a59", width: "25px", height: "25px" }}
          />
        </IconButton>
        <label>{confirmTitle}</label>
      </div>
      <div className="jon-group-confirm">
        {/* <label>{confirmTitle}</label> */}
        <p>{confirmMessage}</p>
        <div className="mt20" style={{ display: "block" }}>
          <Button
            className="bt-submit"
            style={{ maxWidth: "unset" }}
            onClick={() => component.setState({ showConfim: false })}
          >
            Tiếp tục chỉnh sửa
          </Button>
          <Button
            className="bt-confirm"
            style={{ maxWidth: "unset" }}
            onClick={() =>
              component.setState({ showConfim: false }, () =>
                okCallback ? okCallback() : null
              )
            }
          >
            Vẫn muốn huỷ
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

const groups = [
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    privacy: "Public",
    posted: 373,
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
    ],
  },
  {
    groupName: "Mẹo vặt sinh viên",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage:
      "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
    ],
  },
  {
    groupName: "CHINH PHỤC NHÀ TUYỂN DỤNG",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    privacy: "Private",
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
    ],
    owner: true,
  },
  {
    groupName: "CƯỜI BỂ BỤNG",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage:
      "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
    ],
  },
  {
    groupName: "1001 câu hỏi",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
    ],
  },
  {
    groupName: "NHỮNG ĐIỀU KÌ THÚ",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage:
      "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
    ],
  },
  {
    groupName: "Ờ, phượt đi",
    groupAvatar:
      "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
      {
        avatar:
          "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg",
      },
      {
        avatar:
          "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg",
      },
    ],
    owner: true,
  },
];
