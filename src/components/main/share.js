import { Avatar, Button, Drawer, IconButton, InputAdornment, TextField } from '@material-ui/core';
import {
   Favorite as FavoriteIcon, Share as ShareIcon, MoreHoriz as MoreHorizIcon, FiberManualRecord as FiberManualRecordIcon,
   ChevronLeft as ChevronLeftIcon, MusicOff as MusicOffIcon, MusicNote as MusicNoteIcon, FullscreenExit as FullscreenExitIcon,
   Fullscreen as FullscreenIcon, PlayArrow as PlayArrowIcon, Pause as PauseIcon, Forward10 as Forward10Icon,
   Replay10 as Replay10Icon, Close as CloseIcon, Done as DoneIcon, AssignmentReturn, FormatListBulletedSharp,
} from "@material-ui/icons";
import React, { useRef, useState } from 'react';
import moment from "moment";

import { connect } from 'react-redux';
import {
   updatePosted, likePosted, dislikePosted, likeImage, dislikeImage, setCurrentPosted, deletePostSuccess, createPostSuccess
} from "../../actions/posted";
import { toggleSharePost, setProccessDuration } from '../../actions/app'
import { get, postFormData } from '../../api';
import { SOCIAL_NET_WORK_API, CurrentDate } from '../../constants/appSettings';
import { Privacies, ReactSelectorIcon, backgroundList, GroupPrivacies, } from "../../constants/constants";
import MultiInput from "../common/multi-input";
import Loader from "../common/loader";
import { useEffect } from 'react';
import { fromNow, objToArray, objToQuery, showNotification, } from "../../utils/common";
import { truncate } from 'lodash';

const tag = require("../../assets/icon/tag@1x.png");
const Newfeed = require("../../assets/icon/Newfeed@1x.png");
const Group = require("../../assets/icon/Group@1x.png");
const search = require("../../assets/icon/Find@1x.png");

const Share = ({ currentPostForComment, showShareDrawer, toggleSharePost, createPostSuccess, setProccessDuration }) => {
   const [state, setState] = useState({
      privacy: Privacies.Public,
      postContent: "",
      tagedFrieds: [],
      isPosting: false,
      groupForShare: [],
      groupSelected: null,
      mentionSelected: "",
      hashtagSelected: [],
      backgroundSelected: "",
      imageSelected: "",
      videoSelected: "",
      nfid: "",
      postedImage: "",
      postedVideo: "",
      pageGroup: 0,
      endPage: false,
      groupSearchKey: "",
      showTagFriendDrawer: false,
      friends: [],
      searchKey: "",
      isLoadMore: false
   })
   let {
      privacy, postContent, tagedFrieds, isPosting, groupForShare, groupSelected, mentionSelected, hashtagSelected,
      backgroundSelected, imageSelected, videoSelected, nfid, postedImage, postedVideo,
   } = state;

   const getFriends = (currentpage) => {
      let { searchKey } = state;
      let param = {
         currentpage: currentpage,
         currentdate: moment(new Date()).format(CurrentDate),
         limit: 20,
         status: "Friends",
         forFriendId: 0,
         groupid: 0,
         findstring: searchKey,
      };
      get(
         SOCIAL_NET_WORK_API,
         "Friends/GetListFriends" + objToQuery(param),
         (result) => {
            if (result && result.result === 1) {
               setState(prevState => ({
                  ...prevState,
                  friends: currentpage === 0 ? result.content.userInvites : state.friends.concat(result.content.userInvites),
               }));
            }
         }
      );
   }
   const getGroup = (currentpage) => {
      let { groupSearchKey } = state;
      let param = {
         currentpage: currentpage,
         currentdate: moment(new Date()).format(CurrentDate),
         limit: 20,
         skin: "Join",
         findstring: groupSearchKey ? groupSearchKey : "",
      };
      // if (state.endPage === false) {
      get(
         SOCIAL_NET_WORK_API,
         "GroupUser/GetListGroupUser" + objToQuery(param),
         (result) => {
            if (result && result.result === 1) {
               if (result.content.groupUsers.length === 0) {
                  // setState({ ...state, endPage: true })
               } else {
                  setState(prevState => ({
                     ...prevState,
                     groupForShare: currentpage === 0 ? result.content.groupUsers : state.groupForShare.concat(result.content.groupUsers),
                     pageGroup: currentpage
                  }));
               }
            }
         }
      );
      // }

   }
   const handleCloseDrawer = () => {
      setState({
         ...state,
         postContent: "",
         tagedFrieds: [],
         privacy: Privacies.Public,
      });
      toggleSharePost(false, currentPostForComment)
   }
   const handleShare = (groupId) => {
      let { albumSelected, profile, data } = this.props;
      if (isPosting == true) return;

      setState({
         ...state,
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
               setState({
                  ...state,
                  isPosting: false,
               });
               createPostSuccess(result.content.newsFeeds, profile.id);
               this.handleCloseDrawer(true);
               setProccessDuration(20);
            }
         }
      );
   }

   useEffect(() => {
      getFriends(0)
      getGroup(0)
   }, [])


   const listInnerRef = useRef();
   const onScroll = () => {
      if (listInnerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
         if (scrollTop + clientHeight + 1 >= scrollHeight) {
            console.log('next page')
            const { pageGroup } = state
            getGroup(pageGroup + 1)
         }
      }
   };
   console.log(state)
   return (
      <Drawer
         anchor="bottom"
         className="share-drawer poster-drawer fit-popup fix-scroll"
         open={showShareDrawer}
      >
         <div className="drawer-detail" onScroll={onScroll} ref={listInnerRef}>
            <div className="drawer-header">
               <div
                  className="direction"
                  onClick={() => handleCloseDrawer()}
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
                     onClick={() => handleShare()}
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
                     onClick={() => setState({ ...state, showTagFriendDrawer: true })}
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
                     setState({
                        ...state,
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
                        setState({ ...state, showSharePrivacySelectOption: true })
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
                     onClick={() => handleShare()}
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
                        setState({ ...state, showFindGroupToShareDrawer: true })
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
                                    onClick={() => handleShare(group.groupid)}
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
         <TagFriend state={state} setState={setState} />
         <SharePrivacyMenu state={state} setState={setState} getFriends={getFriends} />
         <GroupForShare state={state} setState={setState} getGroup={getGroup} />
      </Drawer>
   );
};
const mapStateToProps = state => ({
   ...state.app
})
const mapActionToProps = {
   toggleSharePost,
   createPostSuccess,
   setProccessDuration
}
export default connect(mapStateToProps, mapActionToProps)(Share)



const TagFriend = ({ state, setState, getFriends }) => {
   let { showTagFriendDrawer, tagedFrieds, friends, searchKey } = state;
   const handleTagFriend = (friend) => {
      const { tagedFrieds } = state;
      let existFriend = tagedFrieds.find((item) => item.friendid === friend.friendid);
      if (existFriend) {
         tagedFrieds = tagedFrieds.filter(
            (item) => item.friendid !== friend.friendid
         );
      } else {
         tagedFrieds.push(friend);
      }
      setState({
         ...state,
         tagedFrieds: tagedFrieds,
         isChange: true,
      });
   }
   return (
      <Drawer
         anchor="bottom"
         className="tag-friend-drawer fit-popup"
         open={showTagFriendDrawer}
         onClose={() => setState({ ...state, showTagFriendDrawer: false })}
      >
         <div className="drawer-detail">
            <div className="drawer-header">
               <div
                  className="direction"
                  onClick={() => setState({
                     ...state,
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
                  onClick={() => { setState({ ...state, showTagFriendDrawer: false }) }}
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
                  value={searchKey}
                  onChange={(e) => {
                     setState({
                        ...state,
                        searchKey: e.target.value,
                     })
                     getFriends(0)
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
                        onClick={() => setState({ ...state, tagedFrieds: [] })}
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
                              onClick={() => handleTagFriend(friend)}
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

const SharePrivacyMenu = ({ state, setState }) => {
   let { showSharePrivacySelectOption } = state;
   let privacyOptions = objToArray(Privacies);
   return (
      <Drawer
         anchor="bottom"
         className="img-select-option fit-popup-1"
         open={showSharePrivacySelectOption}
         onClose={() =>
            setState({ ...state, showSharePrivacySelectOption: false })
         }
      >
         <div className="option-header">
            <IconButton
               style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
               onClick={() =>
                  setState({ ...state, showSharePrivacySelectOption: false })
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
                        setState({
                           ...state,
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

const GroupForShare = ({ state, setState, getGroup }) => {
   let { showFindGroupToShareDrawer, groupForShare, groupSearchKey } = state;

   const listInnerRef = useRef();

   const onScroll = () => {
      if (listInnerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
         if (scrollTop + clientHeight + 1 >= scrollHeight) {
            console.log('next page')
            const { pageGroup } = state
            getGroup(pageGroup + 1)
         }
      }
   };

   return (
      <Drawer
         anchor="bottom"
         className="tag-friend-drawer fit-popup fix-scroll"
         open={showFindGroupToShareDrawer}
      >
         <div className="drawer-detail " ref={listInnerRef} onScroll={onScroll}>
            <div className="drawer-header">
               <div
                  className="direction"
                  onClick={() => {
                     setState({
                        ...state,
                        showFindGroupToShareDrawer: false,
                        groupSearchKey: ""
                     })
                     getGroup(0)
                  }}
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
                  onChange={(e) => {
                     setState({
                        ...state,
                        groupSearchKey: e.target.value,
                     })
                     getGroup(0)
                  }}
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
                                 setState({
                                    ...state,
                                    groupSelected: group,
                                    showFindGroupToShareDrawer: false,
                                    groupSearchKey: "",
                                 },
                                    () => getGroup(0)
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
      </Drawer >
   );
};