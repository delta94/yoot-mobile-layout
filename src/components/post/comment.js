import React from "react";
import './style.scss'
import {
   Card,
   CardHeader,
   CardMedia,
   CardContent,
   CardActions,
   IconButton,
   Avatar,
   GridList,
   GridListTile,
   Menu,
   MenuItem,
   Collapse,
   Button,
   Drawer,
   TextField,
   InputAdornment,
   Radio
} from '@material-ui/core'

import {
   Favorite as FavoriteIcon,
   Share as ShareIcon,
   MoreHoriz as MoreHorizIcon,
   FiberManualRecord as FiberManualRecordIcon,
   ChevronLeft as ChevronLeftIcon,
   MusicOff as MusicOffIcon,
   MusicNote as MusicNoteIcon,
   FullscreenExit as FullscreenExitIcon,
   Fullscreen as FullscreenIcon,
   PlayArrow as PlayArrowIcon,
   Pause as PauseIcon,
   Forward10 as Forward10Icon,
   Replay10 as Replay10Icon,
   Close as CloseIcon
} from '@material-ui/icons'
import {
   togglePostDrawer,
   toggleMediaViewerDrawer,
   setMediaToViewer,
   toggleUserDetail,
   toggleUserPageDrawer,
   toggleReportComment,
   toggleGroupDetailDrawer
} from '../../actions/app'
import {
   setCurrenUserDetail
} from '../../actions/user'
import {
   updatePosted,
   likePosted,
   dislikePosted,
   likeImage,
   dislikeImage,
   setCurrentPosted,
   deletePostSuccess,
   changeCommentCountForPost,
   updateCommentPosted
} from '../../actions/posted'
import {
   setComment,
   commentSuccess,
   replySuccess
} from '../../actions/comment'
import { Player, ControlBar, BigPlayButton } from 'video-react';
import { Privacies, ReactSelectorIcon, backgroundList } from '../../constants/constants'
import FacebookSelector from '../common/facebook-selector'
import moment from "moment"
import Comment from './comment-item'
import { fromNow, objToArray, copyToClipboard, objToQuery } from "../../utils/common";
import { connect } from 'react-redux'
import { SOCIAL_NET_WORK_API, PostLinkToCoppy, CurrentDate } from "../../constants/appSettings";
import { get, post, postFormData } from '../../api'
import MultiInput from '../common/multi-input'
import Dropzone from 'react-dropzone'
import CustomMenu from '../common/custom-menu'
import Loader from '../common/loader'
import $ from 'jquery'
import PostContent from './post-content'
import LikeReward from './like-reward'
import { checkServerIdentity } from "tls";
import { setCurrentGroup } from "../../actions/group";

const maxCols = 6
const like1 = require('../../assets/icon/like1@1x.png')
const comment = require('../../assets/icon/comment@1x.png')
const comment1 = require('../../assets/icon/comment1@1x.png')
const share = require('../../assets/icon/share@1x.png')
const share1 = require('../../assets/icon/share1@1x.png')
const Group = require('../../assets/icon/Group@1x.png')
const Picture = require('../../assets/icon/Picture@1x.png')
const Send = require('../../assets/icon/Send.png')
const report = require('../../assets/icon/report@1x.png')
const block = require('../../assets/icon/block@1x.png')
const unfollow = require('../../assets/icon/unfollow@1x.png')
const unfriend = require('../../assets/icon/unfriend@1x.png')
const mute = require('../../assets/icon/mute.png')
const unmute = require('../../assets/icon/unmute.png')


class Index extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         openReactions: false,
         anchor: null,
         showLocalMenu: false,
         openReactions: false,
         isMuted: false,
         commentContent: '',
         imageSelected: [],
         replyFor: null,
         isLoading: false
      };
      this.player = React.createRef()
      this.commentInput = React.createRef()
   }

   selectImage(acceptedFiles) {
      let {
         imageSelected
      } = this.state
      let that = this

      if (acceptedFiles && acceptedFiles.length > 0) {
         acceptedFiles.map(image => {
            var fr = new FileReader;
            fr.onload = function () {
               var img = new Image;
               img.onload = function () {
                  imageSelected = imageSelected.concat({ file: image, width: img.width, height: img.height })
                  that.setState({ imageSelected: imageSelected, isBackgroundSelect: false, isChange: true })
               };
               img.src = fr.result;
            };
            fr.readAsDataURL(image);
         })
      }
   }

   handleDeleteImage(image) {
      let {
         imageSelected
      } = this.state
      imageSelected = imageSelected.filter(item => item.file != image.file)
      this.setState({
         imageSelected: imageSelected,
         isChange: true
      })
   }

   handleColumnCal(index, length) {
      switch (length) {
         case 2:
            return maxCols / 2
         case 3:
            if (index == 0) return maxCols
            else return maxCols / 2
         case 4:
            if (index == 0) return maxCols
            else return maxCols / 3
         case 5:
            if (index < 2) return maxCols / 2
            else return maxCols / 3
      }
   }

   handleCellHeightCal(index, length) {
      switch (length) {
         case 2:
            return 300
         case 3:
            return 150
         case 4:
            if (index == 0) return 180
            else return 120
         case 5:
            if (index < 2) return 180
            else return 120
      }
   }

   handlePlayVideo() {
      let {
         data
      } = this.props
      let video = this.player.current
      let thumbnail = this.thumbnail.current
      if (video) {
         this.handleSetMuted(true)
         video.play()
         video.subscribeToStateChange((state, prevState) => {
            if (state.ended == true) {
               this.setState({
                  isPlaying: false
               })
            }
         })
         this.setState({
            isPlaying: true
         })
         if (thumbnail) {
            $(thumbnail).fadeOut(1000)
         }
      }
   }

   handlePauseVideo() {
      let video = this.player.current
      if (video) {
         video.pause()
         this.setState({
            isPlaying: false
         })
      }
   }

   handleSetMuted(isMuted) {
      let video = this.player.current
      if (video) {
         video.muted = isMuted
         this.setState({
            isMuted: isMuted
         })
      }
   }

   handleFullScreen() {
      let {
         isFullScreen
      } = this.state
      let video = this.player.current
      if (video) {
         video.toggleFullscreen()
         this.setState({
            isFullScreen: !isFullScreen
         }, () => {
            this.handleSetMuted(isFullScreen)
         })
      }
   }

   likePosted(reaction) {
      let {
         data,
         userId
      } = this.props
      if (!data) return
      let param = {
         postid: data.nfid,
         icon: reaction.code
      }
      this.props.likePosted(data, reaction.code, "myPosteds", userId)
      this.setState({ isProccesing: false })
      post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {
      })
   }

   dislikePosted() {
      let {
         data,
         userId
      } = this.props
      if (!data) return
      let param = {
         postid: data.nfid,
         icon: -1
      }
      this.setState({ isProccesing: false })
      this.props.dislikePosted(data, "myPosteds", userId)
      post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {
      })
   }

   likeImage(reaction, image) {
      let {
         data,
         userId
      } = this.props
      if (!data) return
      let param = {
         postid: data.nfid,
         icon: reaction.code,
         nameimage: image.nameimage
      }
      this.props.likeImage(data, image.detailimageid, reaction.code, userId)
      this.setState({ isProccesing: false })
      post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {

      })
   }

   dislikeImage(image) {
      let {
         data,
         userId
      } = this.props
      if (!data) return
      let param = {
         postid: data.nfid,
         icon: -1,
         nameimage: image.nameimage
      }
      this.props.dislikeImage(data, image.detailimageid, userId)
      this.setState({ isProccesing: false })

      post(SOCIAL_NET_WORK_API, "PostNewsFeed/LikeNewsFeed" + objToQuery(param), null, (result) => {
      })
   }

   handleChangeCurrentTime(seconds) {
      let video = this.player.current
      if (video) {
         const { player } = video.getState();
         video.seek(player.currentTime + seconds)
      }
   }

   getComment(currentPage, postId) {
      let {
         postComments
      } = this.props
      let commentList = postComments[postId]
      if (!commentList) commentList = []
      let param = {
         postid: postId,
         currentpage: currentPage,
         currentdate: moment(new Date).format(CurrentDate),
         limit: 20,
         currentpageRely: 0,
         limitRely: 5,
         commentIdStart: 0,
         relyIdStart: 0
      }
      this.setState({
         isLoading: true
      })
      get(SOCIAL_NET_WORK_API, "Comment/GetCommentInPost" + objToQuery(param), result => {
         if (result && result.result == 1) {
            this.props.setComment(commentList.concat(result.content.commentModels), postId)
            this.setState({
               isLoading: false
            })
         }
      })
   }

   handleComment() {
      let {
         commentContent,
         mentionSelected,
         hashtagSelected,
         imageSelected,
         replyFor
      } = this.state
      let {
         data
      } = this.props
      let formData = new FormData

      formData.append("content", commentContent)
      formData.append("postid", data.nfid)

      if (mentionSelected.length > 0) {
         let ids = []
         mentionSelected.map(item => ids.push(item.id))
         formData.append("labeltags", JSON.stringify(ids))
      }
      if (hashtagSelected.length > 0)
         formData.append("hashtags", JSON.stringify(hashtagSelected))

      if (imageSelected.length > 0) {
         imageSelected.map((image, index) => {
            formData.append("image_" + (index) + "_" + image.width + "_" + image.height, image.file)
         })
      }

      formData.append("commentid", replyFor ? replyFor.commentid : 0)

      if (replyFor && replyFor.tagIds && replyFor.tagIds.length > 0) {
         formData.append("tags", JSON.stringify(replyFor.tagIds))
      }

      this.commentInput.current.setDefaultValue("")
      this.setState({
         imageSelected: [],
         replyFor: null
      })

      setTimeout(() => {
         this.commentInput.current.editor.blur()
      }, 200);

      postFormData(SOCIAL_NET_WORK_API, "Comment/CreateComment", formData, result => {
         if (result && result.result == 1) {
            if (replyFor) {
               this.props.replySuccess(result.content.commentModel, replyFor.commentid, data.nfid)
            } else {
               this.props.commentSuccess(result.content.commentModel, data.nfid)
            }
            this.props.changeCommentCountForPost(1, data.nfid, data.iduserpost)
            this.props.updateCommentPosted(this.props.postComments[data.nfid], data.nfid)
         }
      })
   }

   handleClose() {
      let {
         onClose,
         data
      } = this.props
      if (onClose) onClose()
      if (!data) return
      this.props.setComment([], data.nfid)
   }

   componentDidMount() {
      let {
         data
      } = this.props
      if (data) {
         this.getComment(0, data.nfid)
      }
   }

   componentWillReceiveProps(nextProps) {
      if (Object.entries(nextProps.data ? nextProps.data : {}).toString() != Object.entries(this.props.data ? this.props.data : {}).toString()) {
         this.getComment(0, nextProps.data.nfid)
      }
   }
   handlePostAuth(postforid, foloweds, statuspost) {
      if (statuspost === 3) {
         return false
      }
      else if (postforid === 4) {
         return false
      }
      else if (postforid === 3 && foloweds.length <= 0) {
         return false
      }
      else if (postforid === 3 && foloweds.some(item => item.status !== 10)) {
         return false
      } else return true
   }
   handleGetGroupDetail(groupid) {
      if (!groupid) return
      get(SOCIAL_NET_WORK_API, "GroupUser/GetOneGroupUser?groupid=" + groupid, result => {
         if (result && result.result === 1) {
            this.props.setCurrentGroup(result.content.groupUser)
         }
      })
   }
   render() {
      let {
         onClose,
         data,
         profile,
         daskMode,
         postComments
      } = this.props
      let { foloweds } = this.props.profile
      let {
         anchor,
         showLocalMenu,
         openReactions,
         isMuted,
         commentContent,
         imageSelected,
         replyFor,
         isLoading
      } = this.state
      let PrivacyOptions = objToArray(Privacies)
      let comments = []
      if (data && postComments && postComments[data.nfid])
         comments = postComments[data.nfid]

      if (data && data.postforid == 1) data.postforid = 2

      return (
         <div className="drawer-detail comment-post">
            <div className="drawer-header">
               <div className="direction" onClick={() => this.handleClose()}>
                  <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                     <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                  </IconButton>
               </div>
               {
                  data ? <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                     <CardHeader
                        className="card-header"
                        avatar={
                           <Avatar aria-label="recipe" className="avatar">
                              <div className="img" style={{ background: `url("${data.avataruserpost}")` }} />
                           </Avatar>
                        }
                        action={
                           <CustomMenu>
                              {
                                 data.iduserpost == profile.id && data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => {
                                    this.props.togglePostDrawer(true)
                                    this.props.setCurrentPosted(data)
                                 })}>Chỉnh sửa bài đăng</MenuItem> : ""
                              }
                              {
                                 data.iduserpost == profile.id && (data.kindpost == 2 || data.kindpost == 3) ? <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateInfoOfProfilePost: true, postContent: data.nfcontent })}>Chỉnh sửa nội dung</MenuItem> : ""
                              }
                              {
                                 data.iduserpost == profile.id && data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => this.setState({
                                    showConfim: true,
                                    okCallback: () => this.handleDeletePost(),
                                    confirmTitle: "Xoá bài đăng",
                                    confirmMessage: "Bạn có thật sự muốn xoá bài đăng này?"
                                 }))}>Xoá bài đăng</MenuItem> : ""
                              }
                              <MenuItem onClick={() => this.setState({ showLocalMenu: false }, () => copyToClipboard(PostLinkToCoppy + data.nfid))}>Sao chép liên kết</MenuItem>
                              {/* {
                  data.iduserpost != profile.id ? <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem> : ""
                } */}
                              {
                                 data.iduserpost != profile.id ? <MenuItem onClick={() => this.props.toggleReportComment(true, data)}>Báo cáo vi phạm</MenuItem> : ""
                              }
                           </CustomMenu>
                        }
                        title={<span className="poster-name">
                           <span className="name" onClick={() => {
                              if (data.iduserpost == profile.id) {
                                 this.props.history.push("/profile")
                              } else {
                                 this.props.setCurrenUserDetail({ ...data, friendid: data.iduserpost })
                                 this.props.toggleUserPageDrawer(true)
                              }
                           }}>{data.nameuserpost} </span>
                           {
                              data.kindpost == 4 ? <span className="mesage">{data.titlepost.replace("{usernamesend}", " ").replace("{namealbum}", data.albumname)}</span> : ""
                           }
                           {
                              data.kindpost == 3 ? <span className="mesage">{data.titlepost.replace("{username}", " ")}</span> : ""
                           }
                           {
                              data.kindpost == 2 ? <span className="mesage">{data.titlepost.replace("{username}", " ")}</span> : ""
                           }
                           {
                              data.kindpost == 1 && data.newsFeedShareRoot ? <span className="mesage"> đã chia sẽ một bài viết</span> : ""
                           }
                           {
                              data.usersTag.length > 0 ? <span className="mesage">
                                 <span>cùng với <b onClick={() => {
                                    this.props.setCurrenUserDetail({ ...data.usersTag[0], friendid: data.usersTag[0].id })
                                    this.props.toggleUserPageDrawer(true)
                                 }}>{data.usersTag[0].fullname}</b></span>
                                 {
                                    data.usersTag.length == 2 ? <span> và <b onClick={() => {
                                       this.props.setCurrenUserDetail({ ...data.usersTag[1], friendid: data.usersTag[1].id })
                                       this.props.toggleUserPageDrawer(true)
                                    }}>{data.usersTag[1].fullname}</b></span> : ""
                                 }
                                 {
                                    data.usersTag.length > 2 ? <span> và <b onClick={() => this.setState({ showTagsFriendDrawer: true })}>{data.usersTag.length - 1} người khác</b></span> : ""
                                 }
                              </span> : ""
                           }
                        </span>}
                        subheader={<div className="poster-subtitle">
                           <div>
                              <img src={PrivacyOptions.find(privacy => privacy.code == data.postforid).icon1} />
                              <FiberManualRecordIcon />
                              {fromNow(moment(data.createdate), moment(new Date))}
                           </div>
                           {
                              data.groupidpost > 0 ? <div>
                                 <img src={Group} />
                                 <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                 <span><u onClick={
                                    () => {
                                       this.handleGetGroupDetail(data.groupidpost)
                                       this.props.toggleGroupDetailDrawer(true)
                                    }
                                 }
                                 >{data.groupnamepost}</u></span>
                              </div> : ""
                           }
                        </div>}
                     />
                  </Card> : ""
               }
            </div>
            <div className="filter"></div>
            <div className="drawer-content" style={{ overflow: "scroll" }}>
               {
                  data ? <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                     {
                        data.kindpost == 4 ? <div className="album-name">
                           <span>Album <span>{data.albumname}</span></span>
                        </div> : ""
                     }

                     {
                        data.nfcontent != "" ? <div
                           className={"post-content" + (data.backgroundid > 0 ? " have-background" : "")}
                           style={{ background: "url(" + backgroundList.filter(item => item.id == data.backgroundid)[0].background + ")" }} >
                           <PostContent content={data} />
                        </div> : ""
                     }

                     <CardContent className="card-content">
                        <div className="media-grid">
                           {
                              daskMode ? "" : (
                                 data.mediaPlays.length > 1
                                    ? <GridList cols={maxCols} >
                                       {data.mediaPlays.slice(0, 5).map((media, index) => (
                                          <GridListTile
                                             className={media.typeobject == 2 ? "video" : "image"}
                                             style={{
                                                height: this.handleCellHeightCal(index, data.mediaPlays.slice(0, 5).length),
                                             }}
                                             key={media.name}
                                             cols={this.handleColumnCal(index, data.mediaPlays.slice(0, 5).length)}
                                          >
                                             {
                                                media.typeobject == 2
                                                   ? <div>
                                                      <div onClick={() => this.setState({ showPostedDetail: true })}>
                                                         <Player
                                                            ref={index == 0 ? this.player : null}
                                                            poster={media.thumbnailname}
                                                            src={media.name}
                                                            videoWidth={media.width}
                                                            videoHeight={media.height}
                                                            playsInline={true}

                                                         >
                                                            <ControlBar disableDefaultControls={true} autoHide={false} className={"video-control"} >
                                                            </ControlBar>
                                                         </Player>
                                                      </div>
                                                      {
                                                         index == 0 ? <IconButton onClick={() => this.handleSetMuted(!isMuted)} className="bt-mute">
                                                            {isMuted == true ? <img style={{ width: 24, height: 24 }} src={mute} /> : <img style={{ width: 24, height: 24 }} src={unmute} />}
                                                         </IconButton> : <IconButton onClick={() => this.handleSetMuted(!isMuted)} className="bt-play">
                                                               <PlayArrowIcon />
                                                            </IconButton>
                                                      }
                                                      <div className="thumb" ref={index == 0 ? this.thumbnail : null} style={{ background: "url(" + media.thumbnailname + ")" }} onClick={() => this.setState({ showPostedDetail: true })} />
                                                   </div>
                                                   : <img src={media.name} alt={media.name} onClick={() => {
                                                      this.props.setMediaToViewer(data.mediaPlays)
                                                      this.props.toggleMediaViewerDrawer(true, {
                                                         actions: data.iduserpost == profile.id ? mediaRootActions(this) : mediaGuestActions(this),
                                                         showInfo: true,
                                                         activeIndex: index
                                                      })
                                                   }} />
                                             }
                                             {
                                                data.mediaPlays.length > 4 && index == 4 ? <div className="grid-overlay" onClick={() => this.setState({ showPostedDetail: true })}>
                                                   <span>{data.mediaPlays.length - 4}+</span>
                                                </div> : ""
                                             }
                                          </GridListTile>
                                       ))}
                                    </GridList>
                                    : <GridList cols={1}>
                                       {data.mediaPlays.map((media, index) => (
                                          <GridListTile className={media.typeobject == 2 ? "video" : "image"} style={{ height: "auto" }} key={media.name} cols={1} >
                                             {
                                                media.typeobject == 2
                                                   ? <div>
                                                      <div onClick={() => {
                                                         this.props.setMediaToViewer([media])
                                                         this.props.toggleMediaViewerDrawer(true, {
                                                            showInfo: true,
                                                            activeIndex: index,
                                                            isvideo: true
                                                         })
                                                         this.handlePauseVideo()
                                                      }}>
                                                         <Player
                                                            ref={this.player}
                                                            poster={media.thumbnailname}
                                                            src={media.name}
                                                            videoWidth={media.width}
                                                            videoHeight={media.height}
                                                            playsInline={true}
                                                         >
                                                            <ControlBar disableDefaultControls={true} autoHide={false} className={"video-control"} >
                                                            </ControlBar>
                                                         </Player>
                                                      </div>
                                                      <IconButton onClick={() => this.handleSetMuted(!isMuted)} className="bt-mute">
                                                         {isMuted == true ? <img style={{ width: 24, height: 24 }} src={mute} /> : <img style={{ width: 24, height: 24 }} src={unmute} />}
                                                      </IconButton>
                                                      <div className="thumb" ref={index == 0 ? this.thumbnail : null} style={{ background: "url(" + media.thumbnailname + ")" }} onClick={() => {
                                                         this.props.setMediaToViewer([media])
                                                         this.props.toggleMediaViewerDrawer(true, {
                                                            showInfo: true,
                                                            activeIndex: index,
                                                            isvideo: true
                                                         })
                                                         this.handlePauseVideo()
                                                      }} />
                                                   </div> :
                                                   <img src={media.name} alt={media.name} style={{ width: "100%", height: "auto" }} onClick={() => {
                                                      this.props.setMediaToViewer(data.mediaPlays)
                                                      this.props.toggleMediaViewerDrawer(true, {
                                                         actions: data.iduserpost == profile.id ? mediaRootActions(this) : mediaGuestActions(this),
                                                         showInfo: true,
                                                         activeIndex: index
                                                      })
                                                   }} />
                                             }
                                          </GridListTile>
                                       ))}
                                    </GridList>
                              )
                           }
                           {/* {
                                    daskMode ? <GridList cols={maxCols}>
                                        {videos.map((video, index) => (
                                            <GridListTile className="video" style={{ height: this.handleCellHeightCal(index, videos.length) }} key={video.url} cols={this.handleColumnCal(index, videos.length)}>
                                                <video autoPlay controls>
                                                    <source src={video.url} type="video/mp4" />
                                                </video>
                                            </GridListTile>
                                        ))}
                                    </GridList> : ""
                                } */}
                           {
                              data.newsFeedShareRoot ? <div className="post-shared" onClick={() => this.setState({ currentPost: data.newsFeedShareRoot, showCommentDrawer: true })}>
                                 <div>
                                    {
                                       data.newsFeedShareRoot && <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>

                                          {foloweds && this.handlePostAuth(data.newsFeedShareRoot.postforid, foloweds, data.newsFeedShareRoot.statuspost)
                                             ? <CardHeader
                                                className="card-header"
                                                avatar={
                                                   <Avatar aria-label="recipe" className="avatar">
                                                      <div className="img" style={{ background: `url("${data.avataruserpost}")` }} />
                                                   </Avatar>
                                                }
                                                title={<span className="poster-name">
                                                   <span className="name">{data.newsFeedShareRoot.nameuserpost}</span>
                                                   {
                                                      data.newsFeedShareRoot.kindpost == 4 ? <span>{data.newsFeedShareRoot.titlepost.replace("{usernamesend}", " ").replace("{namealbum}", data.albumname)}</span> : ""
                                                   }
                                                   {
                                                      data.newsFeedShareRoot.kindpost == 3 ? <span>{data.newsFeedShareRoot.titlepost.replace("{username}", " ")}</span> : ""
                                                   }
                                                   {
                                                      data.newsFeedShareRoot.kindpost == 2 ? <span>{data.newsFeedShareRoot.titlepost.replace("{username}", " ")}</span> : ""
                                                   }
                                                </span>}
                                                subheader={<div className="poster-subtitle">
                                                   <div>
                                                      <img src={PrivacyOptions.find(privacy => privacy.code == data.newsFeedShareRoot.postforid).icon1} />
                                                      <FiberManualRecordIcon />
                                                      <span>{fromNow(moment(data.newsFeedShareRoot.createdate), moment(new Date))}</span>
                                                   </div>
                                                   <div>
                                                      <img src={Group} />
                                                      <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                                      <span><u onClick={
                                                         () => {
                                                            this.handleGetGroupDetail(data.newsFeedShareRoot.groupidpost)
                                                            this.props.toggleGroupDetailDrawer(true)
                                                         }
                                                      }>{data.newsFeedShareRoot.groupnamepost}</u></span>
                                                   </div>
                                                </div>}
                                             />
                                             : <CardHeader
                                                className="card-header-auth"
                                                avatar={<div className="avatar-auth">x</div>}
                                                title={<b>Nội dung này đã được chủ sở hữu bài đăng thay đổi quyền được xem hoặc đã xóa nội dung.</b>}
                                             />}

                                          {
                                             (foloweds && this.handlePostAuth(data.newsFeedShareRoot.postforid, foloweds, data.newsFeedShareRoot.statuspost) && data.newsFeedShareRoot.kindpost === 4) ? <div className="album-name">
                                                <span>Album <span>{data.newsFeedShareRoot.albumname}</span></span>
                                             </div> : ""
                                          }
                                          {
                                             (foloweds && this.handlePostAuth(data.newsFeedShareRoot.postforid, foloweds, data.newsFeedShareRoot.statuspost) && data.newsFeedShareRoot.nfcontent !== "") ? <div
                                                className={"post-content" + (data.backgroundid > 0 ? " have-background" : "")}
                                                style={{ background: "url(" + backgroundList.filter(item => item.id == data.backgroundid)[0].background + ")" }} >
                                                <PostContent content={data.newsFeedShareRoot} />
                                             </div> : ""
                                          }
                                          {(foloweds && this.handlePostAuth(data.newsFeedShareRoot.postforid, foloweds, data.newsFeedShareRoot.statuspost)) &&
                                             <CardContent className="card-content">
                                                <div className="media-grid">
                                                   {
                                                      daskMode ? "" : (
                                                         data.newsFeedShareRoot.mediaPlays.length > 1
                                                            ? <GridList cols={maxCols} >
                                                               {data.newsFeedShareRoot.mediaPlays.slice(0, 5).map((media, index) => (
                                                                  <GridListTile
                                                                     className={media.typeobject == 2 ? "video" : "image"}
                                                                     style={{
                                                                        height: this.handleCellHeightCal(index, data.newsFeedShareRoot.mediaPlays.slice(0, 5).length),
                                                                     }}
                                                                     key={media.name}
                                                                     cols={this.handleColumnCal(index, data.newsFeedShareRoot.mediaPlays.slice(0, 5).length)}
                                                                  >
                                                                     {
                                                                        media.typeobject == 2
                                                                           ? <div>
                                                                              <div onClick={() => this.setState({ showPostedDetail: true })}>
                                                                                 <Player
                                                                                    ref={index == 0 ? this.player : null}
                                                                                    poster={media.thumbnailname}
                                                                                    src={media.name}
                                                                                    videoWidth={media.width}
                                                                                    videoHeight={media.height}
                                                                                    playsInline={true}

                                                                                 >
                                                                                    <ControlBar disableDefaultControls={true} autoHide={false} className={"video-control"} >
                                                                                    </ControlBar>
                                                                                 </Player>
                                                                              </div>
                                                                              {
                                                                                 index == 0 ? <IconButton onClick={() => this.handleSetMuted(!isMuted)} className="bt-mute">
                                                                                    {isMuted == true ? <img style={{ width: 24, height: 24 }} src={mute} /> : <img style={{ width: 24, height: 24 }} src={unmute} />}
                                                                                 </IconButton> : <IconButton onClick={() => this.handleSetMuted(!isMuted)} className="bt-play">
                                                                                       <PlayArrowIcon />
                                                                                    </IconButton>
                                                                              }
                                                                              <div className="thumb" ref={index == 0 ? this.thumbnail : null} style={{ background: "url(" + media.thumbnailname + ")" }} onClick={() => this.setState({ showPostedDetail: true })} />
                                                                           </div>
                                                                           : <img src={media.name} alt={media.name} onClick={() => this.setState({ showPostedDetail: true })} />
                                                                     }
                                                                     {
                                                                        data.newsFeedShareRoot.mediaPlays.length > 4 && index == 4 ? <div className="grid-overlay" onClick={() => this.setState({ showPostedDetail: true })}>
                                                                           <span>{data.newsFeedShareRoot.mediaPlays.length - 4}+</span>
                                                                        </div> : ""
                                                                     }
                                                                  </GridListTile>
                                                               ))}
                                                            </GridList>
                                                            : <GridList cols={1}>
                                                               {data.newsFeedShareRoot.mediaPlays.map((media, index) => (
                                                                  <GridListTile className={media.typeobject == 2 ? "video" : "image"} style={{ height: "auto" }} key={media.name} cols={1} >
                                                                     {
                                                                        media.typeobject == 2
                                                                           ? <div>
                                                                              <div onClick={() => {
                                                                                 this.props.setMediaToViewer([media])
                                                                                 this.props.toggleMediaViewerDrawer(true, {
                                                                                    showInfo: true,
                                                                                    activeIndex: index,
                                                                                    isvideo: true
                                                                                 })
                                                                                 this.handlePauseVideo()
                                                                              }}>
                                                                                 <Player
                                                                                    ref={this.player}
                                                                                    poster={media.thumbnailname}
                                                                                    src={media.name}
                                                                                    videoWidth={media.width}
                                                                                    videoHeight={media.height}
                                                                                    playsInline={true}
                                                                                 >
                                                                                    <ControlBar disableDefaultControls={true} autoHide={false} className={"video-control"} >
                                                                                    </ControlBar>
                                                                                 </Player>
                                                                              </div>
                                                                              <IconButton onClick={() => this.handleSetMuted(!isMuted)} className="bt-mute">
                                                                                 {isMuted == true ? <img style={{ width: 24, height: 24 }} src={mute} /> : <img style={{ width: 24, height: 24 }} src={unmute} />}
                                                                              </IconButton>
                                                                              <div className="thumb" ref={index == 0 ? this.thumbnail : null} style={{ background: "url(" + media.thumbnailname + ")" }} onClick={() => {
                                                                                 this.props.setMediaToViewer([media])
                                                                                 this.props.toggleMediaViewerDrawer(true, {
                                                                                    showInfo: true,
                                                                                    activeIndex: index,
                                                                                    isvideo: true
                                                                                 })
                                                                                 this.handlePauseVideo()
                                                                              }} />
                                                                           </div> :
                                                                           <img src={media.name} alt={media.name} style={{ width: "100%", height: "auto" }} onClick={() => {
                                                                              this.props.setMediaToViewer(data.newsFeedShareRoot.mediaPlays)
                                                                              this.props.toggleMediaViewerDrawer(true, {
                                                                                 actions: data.newsFeedShareRoot.iduserpost == profile.id ? mediaRootActions(this) : mediaGuestActions(this),
                                                                                 showInfo: true,
                                                                                 activeIndex: index
                                                                              })
                                                                           }} />
                                                                     }
                                                                  </GridListTile>
                                                               ))}
                                                            </GridList>
                                                      )
                                                   }
                                                </div>
                                                {
                                                   data.newsFeedShareRoot.numlike > 0 || data.newsFeedShareRoot.numcomment > 0 ? <div className="react-reward">
                                                      <span>{data.newsFeedShareRoot.numlike + data.newsFeedShareRoot.numcomment} lượt xem</span>
                                                   </div> : ""
                                                }
                                             </CardContent>}
                                       </Card>
                                    }
                                 </div>
                              </div> : ""
                           }
                        </div>
                        {
                           data.numlike > 0 || data.numcomment > 0 ? <div className="react-reward">
                              {
                                 data.numlike > 0 ? <span className="like" onClick={() => this.setState({ showLikeRewardDrawer: true })}>

                                    {
                                       data.iconNumbers.filter(item => item.icon != data.iconlike).map((item, index) => item.icon > 0 && item.num > 0 && <img key={index} src={ReactSelectorIcon[item.icon].icon}></img>)
                                    }
                                    {
                                       data.islike == 1 && data.iconlike > 0 ? <img src={ReactSelectorIcon[data.iconlike].icon}></img> : ""
                                    }
                                    <span>{data.numlike}</span>
                                 </span> : <span className="like">
                                    </span>
                              }
                              {
                                 data.numcomment > 0 && <span className="comment">
                                    {data.numcomment > 0
                                       && `${data.numcomment} bình luận `
                                    }
                                    {data.mediaPlays[0] && data.mediaPlays[0].numview > 0
                                       && `${data.mediaPlays[0].numview} lượt xem `
                                    }
                                    {
                                       data.numshare > 0 && `${data.numshare} chia sẻ `
                                    }
                                 </span>
                              }
                           </div> : ""
                        }
                     </CardContent>
                     <CardActions disableSpacing className="post-actions">
                        <FacebookSelector
                           open={openReactions}
                           active={data.iconlike}
                           onClose={() => this.setState({ openReactions: false })}
                           onReaction={(reaction) => this.likePosted(reaction)}
                           onShortPress={(reaction) => data.islike == 1 ? this.dislikePosted(reaction) : this.likePosted(reaction)}
                        />
                        {(data.postforid !== 4 && data.typegroup !== 2) && <Button onClick={() => this.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>}
                     </CardActions>
                     {
                        daskMode ? "" : (data.numcomment > 0 ? <Collapse in={true} timeout="auto" unmountOnExit className={"comment-container"}>
                           <CardContent className={"card-container"}>
                              <ul className="comment-list" onClick={() => this.setState({ showCommentDrawer: true, currentPost: data })}>
                                 {
                                    comments.map((comment, index) => <Comment
                                       key={index}
                                       comment={comment}
                                       hideReactions={false}
                                       onReply={comment => this.setState({ replyFor: comment })}
                                       posted={data}
                                    />)
                                 }
                              </ul>
                              {
                                 <div style={{ height: "50px", background: "#fff", zIndex: 0 }}>
                                    {
                                       isLoading ? <Loader type="small" daskMode={true} style={{ background: "#fff" }} width={30} height={30} /> : ""
                                    }
                                 </div>
                              }
                           </CardContent>
                        </Collapse> : "")
                     }

                  </Card> : ""
               }
            </div>
            <div className="comment-input-text">
               <div className="image-selected">
                  {
                     imageSelected && imageSelected.map((image, index) => <div key={index} >
                        <div style={{ background: "url(" + URL.createObjectURL(image.file) + ")" }}></div>
                        <IconButton onClick={() => this.handleDeleteImage(image)}><CloseIcon /></IconButton>
                     </div>)
                  }
               </div>
               {
                  replyFor ? <div className="reply-for-comment">
                     <IconButton onClick={() => this.setState({ replyFor: null })}><CloseIcon /></IconButton>
                     <span>Đang trả lời <span>{replyFor.nameusercomment}</span></span>
                  </div> : ""
               }
               <div className="input-box">
                  <Dropzone onDrop={acceptedFiles => this.selectImage(acceptedFiles)}>
                     {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} id="bt-select-image">
                           <input {...getInputProps()} accept="image/*" multiple={false} />
                           <IconButton><img src={Picture} /></IconButton>
                        </div>
                     )}
                  </Dropzone>
                  <MultiInput
                     ref={this.commentInput}
                     style={{
                        minHeight: "20px",
                        border: "none",
                     }}
                     onChange={value => this.setState({
                        commentContent: value.text,
                        mentionSelected: value.mentionSelected,
                        hashtagSelected: value.hashtagSelected,
                     })}
                     topDown={false}
                     placeholder={"Bình luận của bạn"}
                     enableHashtag={true}
                     enableMention={true}
                     centerMode={false}
                     value={commentContent}
                     suggestionClass="custom-suggestion"
                  />
                  {
                     commentContent != '' || commentContent.length > 0 || imageSelected.length > 0 ? <IconButton onClick={() => this.handleComment()}><img src={Send} /></IconButton> : ""
                  }
               </div>
            </div>
            {
               renderDetailPosted(this)
            }
            {
               renderConfirmDrawer(this)
            }
            {
               renderLikeRewardDrawer(this)
            }
         </div >
      );
   }
}


const mapStateToProps = state => {
   return {
      ...state.user,
      ...state.comment
   }
};
const mapDispatchToProps = dispatch => ({
   setCurrentGroup: (group) => dispatch(setCurrentGroup(group)),
   toggleGroupDetailDrawer: (isShow) => dispatch(toggleGroupDetailDrawer(isShow)),
   toggleReportComment: (isShow, data) => dispatch(toggleReportComment(isShow, data)),
   updateCommentPosted: (comments, postId) => dispatch(updateCommentPosted(comments, postId)),
   togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
   toggleMediaViewerDrawer: (isShow, features) => dispatch(toggleMediaViewerDrawer(isShow, features)),
   setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
   updatePosted: (posted, userId) => dispatch(updatePosted(posted, userId)),
   likePosted: (post, likeIcon, targetKey, userId) => dispatch(likePosted(post, likeIcon, targetKey, userId)),
   dislikePosted: (post, targetKey, userId) => dispatch(dislikePosted(post, targetKey, userId)),
   likeImage: (postId, imageId, iconCode, userId) => dispatch(likeImage(postId, imageId, iconCode, userId)),
   dislikeImage: (postId, imageId, userId) => dispatch(dislikeImage(postId, imageId, userId)),
   setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
   toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
   toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
   setCurrentPosted: (post) => dispatch(setCurrentPosted(post)),
   deletePostSuccess: (postId, userId) => dispatch(deletePostSuccess(postId, userId)),
   commentSuccess: (comment, postId) => dispatch(commentSuccess(comment, postId)),
   setComment: (comments, postId) => dispatch(setComment(comments, postId)),
   replySuccess: (comment, replyId, postId) => dispatch(replySuccess(comment, replyId, postId)),
   changeCommentCountForPost: (number, postId, userId) => dispatch(changeCommentCountForPost(number, postId, userId)),
});


export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Index);

const mediaRootActions = (component) => [
   {
      label: "Lưu vào điện thoại",
      action: (value) => component.downloadImage(value.name)
   },
   {
      label: "Chỉnh sửa nội dung",
      action: (value) => alert("Chỉnh sửa nội dung")
   },
   {
      label: "Đặt làm ảnh đại diện",
      action: (value) => alert("Đặt làm ảnh đại diện")
   },
   {
      label: "Đặt làm ảnh bìa",
      action: (value) => alert("Đặt làm ảnh bìa")
   },
   {
      label: "Chỉnh sửa quyền riêng tư",
      action: (value) => component.setState({
         currentImage: value,
         showUpdatePrivacyDrawer: true,
         privacySelected: component.props.data.postforid,
      })
   },
   {
      label: "Xoá ảnh",
      action: (value) => component.setState({
         showConfim: true,
         okCallback: () => component.deleteImage(value),
         confirmTitle: "",
         confirmMessage: "Khi xoá ảnh sẽ xoá luôn bài đăng, bạn vẫn muốn tiếp tục?"
      })
   },
   {
      label: "Đặt làm ảnh đại diện album",
      action: (value) => component.setImageToAlbumBackground(value)
   }
]

const mediaGuestActions = (component) => [
   {
      label: "Lưu vào điện thoại",
      action: (value) => component.downloadImage(value.name)
   },
   {
      label: "Chỉnh sửa nội dung",
      action: (value) => alert("Chỉnh sửa nội dung")
   },
   {
      label: "Đặt làm ảnh đại diện",
      action: (value) => alert("Đặt làm ảnh đại diện")
   },
   {
      label: "Đặt làm ảnh bìa",
      action: (value) => alert("Đặt làm ảnh bìa")
   },
   {
      label: "Chỉnh sửa quyền riêng tư",
      action: (value) => component.setState({
         currentImage: value,
         showUpdatePrivacyDrawer: true,
         privacySelected: component.props.data.postforid,
      })
   },
   {
      label: "Xoá ảnh",
      action: (value) => component.setState({
         showConfim: true,
         okCallback: () => component.deleteImage(value),
         confirmTitle: "",
         confirmMessage: "Khi xoá ảnh sẽ xoá luôn bài đăng, bạn vẫn muốn tiếp tục?"
      })
   },
   {
      label: "Đặt làm ảnh đại diện album",
      action: (value) => component.setImageToAlbumBackground(value)
   }
]

const renderDetailPosted = (component) => {
   let {
      showPostedDetail,
   } = component.state
   let {
      data,
      profile,
      daskMode,
      openReactions,
      anchor,
      showLocalMenu
   } = component.props

   let PrivacyOptions = objToArray(Privacies)

   return (
      <Drawer anchor="bottom" className="posted-detail-drawer" open={showPostedDetail}>
         <div className="drawer-detail">
            <div className="drawer-header">
               <div className="direction" onClick={() => component.setState({ showPostedDetail: false })}>
                  <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                     <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                  </IconButton>
               </div>
            </div>
            <div className="filter"></div>
            <div className="drawer-content" style={{ overflow: "scroll", background: "#ededed", padding: "10px" }}>
               {
                  data && <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                     {
                        data.kindpost == 4 ? <div className="album-name">
                           <span>Album <span>{data.albumname}</span></span>
                        </div> : ""
                     }
                     <CardHeader
                        className="card-header"
                        avatar={
                           <Avatar aria-label="recipe" className="avatar">
                              <div className="img" style={{ background: `url("${data.avataruserpost}")` }} />
                           </Avatar>
                        }
                        action={
                           <CustomMenu>
                              <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.props.togglePostDrawer(true))}>Chỉnh sửa bài đăng</MenuItem>
                              {
                                 data.kindpost != 2 && data.kindpost != 3 ? <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.handleDeletePost())}>Xoá bài đăng</MenuItem> : ""
                              }
                              <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => copyToClipboard(PostLinkToCoppy + data.nfid))}>Sao chép liên kết</MenuItem>
                              {
                                 data.iduserpost != profile.id ? <MenuItem onClick={() => component.setState({ showLocalMenu: false })}>Ẩn bài đăng</MenuItem> : ""
                              }
                              {
                                 data.iduserpost != profile.id ? <MenuItem onClick={() => component.setState({ showLocalMenu: false }, () => component.props.toggleReportComment(true, data))}>Báo cáo vi phạm</MenuItem> : ""
                              }
                           </CustomMenu>
                        }
                        title={<span className="poster-name">
                           <span className="name">{data.nameuserpost}</span>
                           {
                              data.kindpost == 4 ? <span>{data.titlepost.replace("{usernamesend}", " ").replace("{namealbum}", data.albumname)}</span> : ""
                           }
                           {
                              data.kindpost == 3 ? <span>{data.titlepost.replace("{username}", " ")}</span> : ""
                           }
                           {
                              data.kindpost == 2 ? <span>{data.titlepost.replace("{username}", " ")}</span> : ""
                           }
                        </span>}
                        subheader={<div className="poster-subtitle">
                           <div>
                              <img src={PrivacyOptions.find(privacy => privacy.code == data.postforid).icon1} />
                              <FiberManualRecordIcon />
                              {fromNow(moment(data.createdate), moment(new Date))}
                           </div>
                           {
                              data.groupidpost > 0 && <div>
                                 <img src={Group} />
                                 <FiberManualRecordIcon style={{ width: "6px", height: "6px" }} />
                                 <span><u
                                    onClick={
                                       () => {
                                          component.handleGetGroupDetail(data.groupidpost)
                                          this.props.toggleGroupDetailDrawer(true)
                                       }
                                    }
                                 >
                                    {data.groupnamepost}
                                 </u></span>
                              </div>
                           }
                        </div>}
                     />
                     {
                        data.nfcontent != "" ? <div
                           className={"post-content" + (data.backgroundid > 0 ? " have-background" : "")}
                           style={{ background: "url(" + backgroundList.filter(item => item.id == data.backgroundid)[0].background + ")" }} >
                           <PostContent content={data} />
                        </div> : ""
                     }

                     <CardContent className="card-content">
                        {
                           data.numlike > 0 || data.numcomment > 0 ? <div className="react-reward">
                              {
                                 data.numlike > 0 ? <span className="like" onClick={() => component.setState({ showLikeRewardDrawer: true })}>
                                    {
                                       data.iconNumbers.filter(item => item.icon != data.iconlike).map((item, index) => item.icon > 0 && item.num > 0 && <img key={index} src={ReactSelectorIcon[item.icon].icon}></img>)
                                    }
                                    {
                                       data.islike == 1 && data.iconlike > 0 ? <img src={ReactSelectorIcon[data.iconlike].icon}></img> : ""
                                    }
                                    <span>{data.numlike}</span>
                                 </span> : <span className="like">
                                    </span>
                              }
                              {
                                 data.numcomment > 0 ? <span className="comment">{data.numcomment} bình luận</span> : ""
                              }
                           </div> : ""
                        }
                     </CardContent>
                     <CardActions disableSpacing className="post-actions">
                        <FacebookSelector
                           open={openReactions}
                           active={data.iconlike}
                           onClose={() => component.setState({ openReactions: false })}
                           onReaction={(reaction) => component.likePosted(reaction)}
                           onShortPress={(reaction) => data.islike == 1 ? component.dislikePosted(reaction) : component.likePosted(reaction)}
                        />

                        <Button onClick={() => component.setState({ showCommentDrawer: true, currentPost: data })}><img src={daskMode ? comment1 : comment} />Bình luận</Button>
                        <Button onClick={() => component.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
                     </CardActions>


                  </Card>
               }
               {

                  data.newsFeedShareRoot && <div className="list-image">
                     <ul>
                        {
                           data.newsFeedShareRoot.mediaPlays.map((media, index) => <li key={index}>
                              <Card className={"post-item " + (daskMode ? "dask-mode" : "")}>
                                 <CardContent className="card-content">
                                    {
                                       media.typeobject == 2 ?
                                          <div>
                                             <div
                                                onClick={() => {
                                                   component.props.setMediaToViewer([media])
                                                   component.props.toggleMediaViewerDrawer(true, {
                                                      showInfo: true,
                                                      isvideo: true
                                                   })
                                                }}>
                                                <IconButton className="bt-play">
                                                   <PlayArrowIcon />
                                                </IconButton>
                                                <img src={media.thumbnailname} style={{ width: "100%" }} />
                                             </div>
                                          </div>
                                          : <img src={media.name} className="image" onClick={() => {
                                             component.props.setMediaToViewer([media])
                                             component.props.toggleMediaViewerDrawer(true, {
                                                showInfo: true,
                                             })
                                             component.handlePauseVideo()
                                          }} />
                                    }
                                    {
                                       media.numlike > 0 || media.numcomment > 0 ? <div className="react-reward">
                                          {
                                             media.numlike > 0 ? <span className="like" onClick={() => component.setState({ showLikeRewardDrawer: true, currentImage: media })}>
                                                {
                                                   media.iconNumbers.filter(item => item.icon != media.iconlike).map((item, index) => item.icon > 0 && item.num > 0 && <img key={index} src={ReactSelectorIcon[item.icon].icon}></img>)
                                                }
                                                {
                                                   media.islike == 1 && media.iconlike > 0 ? <img src={ReactSelectorIcon[media.iconlike].icon}></img> : ""
                                                }
                                                <span>{media.numlike}</span>
                                             </span> : <span className="like">
                                                </span>
                                          }
                                          {
                                             media.numcomment > 0 ? <span className="comment">{media.numcomment} bình luận</span> : ""
                                          }
                                       </div> : ""
                                    }
                                 </CardContent>
                                 <CardActions disableSpacing className="post-actions">
                                    <FacebookSelector
                                       open={openReactions}
                                       active={media.iconlike > 0 ? media.iconlike : 0}
                                       onClose={() => component.setState({ openReactions: false })}
                                       onReaction={(reaction) => component.likeImage(reaction, media)}
                                       onShortPress={(reaction) => media.islike == 1 ? component.dislikeImage(media) : component.likeImage(reaction, media)}
                                    />
                                    <Button onClick={() => component.setState({ showCommentDrawer: true, currentPost: data })}><img src={daskMode ? comment1 : comment} />Bình luận</Button>
                                    <Button onClick={() => component.setState({ showShareDrawer: true })}><img src={daskMode ? share1 : share} />Chia sẻ</Button>
                                 </CardActions>

                              </Card>
                           </li>)
                        }
                     </ul>
                  </div>
               }
            </div>

         </div>

         {/* {
        isProccesing == true ? <Loader type="dask-mode" isFullScreen={true} /> : ""
      } */}
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
         className="like-reward-drawed"
         open={showLikeRewardDrawer}
         onClose={() => component.setState({ showLikeRewardDrawer: false })}
      >
         <LikeReward data={data} image={currentImage} history={component.props.history} onClose={() => component.setState({ showLikeRewardDrawer: false })} />
      </Drawer>
   );
};
