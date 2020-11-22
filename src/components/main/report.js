import React, { useEffect, useState } from 'react'
import { Button, Drawer, IconButton, Radio } from '@material-ui/core';
import { ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";
import MultiInput from "../common/multi-input";

import "./style.scss";
import { get, post } from '../../api';
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import { objToQuery, showNotification } from '../../utils/common';
import { connect } from 'react-redux';
import { toggleReportComment } from '../../actions/app';
const block = require("../../assets/icon/block@1x.png");
const report = require("../../assets/icon/report@1x.png");
const thank = require("../../assets/icon/thank.png");
const unfriend = require("../../assets/icon/unfriend@1x.png");
const unfollow = require("../../assets/icon/unfollow@1x.png");


const Report = ({  toggleReportComment,app }) => {
   if(!app.currentPostForComment){
      return null
   }
   const { currentPostForComment,showReportPost } = app
   const [state, setState] = useState(
      {
         reasonSelected: {},
         showReportPostDrawer: showReportPost,
         postReportReason: [],
         orderReasonText: "",
         willBlock: false,
         willUnfollow: false,
         willUnfriend: false,
         showReportSuccessAlert: false
      }
   )
   useEffect(() => {
      getReportReasonForPost()
   }, [])
   const getReportReasonForPost = () => {
      get(
         SOCIAL_NET_WORK_API,
         "Data/GetListReportIssues?typeissue=PostInGroup",
         (result) => {
            if (result && result.result == 1) {
               setState({
                  ...state,
                  postReportReason: result.content.issues,
               });
            }
         }
      );
   }

   const handleSelectReason = (reason) => {
      setState({
         ...state,
         reasonSelected: reason,
         orderReasonText: ""
      });
   }

   const handleReportPost = () => {
      let {
         reasonSelected,
         orderReasonText,
         willBlock,
         willUnfriend,
         willUnfollow,
      } = state;
      const { currentPostForComment } = app
      if (reasonSelected || orderReasonText !== "") {
         let param = {
            postid: currentPostForComment.nfid,
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
               if (result && result.result === 1) {
                  setState({...state,
                     showReportSuccessAlert: true,
                  });
                  if (willBlock === true) {
                     bandFriend(currentPostForComment.iduserpost);
                  }
                  if (willUnfollow === true) {
                     unFolowFriend(currentPostForComment.iduserpost);
                  }
                  if (willUnfriend === true) {
                     removeFriend(currentPostForComment.iduserpost);
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

   const bandFriend = (friendid) => {
      let { friends, allUsers } = state;
      let param = {
         friendid: friendid,
      };
      if (!friendid) return;
      get(
         SOCIAL_NET_WORK_API,
         "Friends/BandFriends" + objToQuery(param),
         (result) => {
            if (result && result.result == 1) {
               setState({
                  ...state,
                  friends: friends.filter((friend) => friend.friendid !== friendid),
                  showFriendActionsDrawer: false,
                  rejectFriends: [],
                  isEndOfRejectFriends: false,
                  rejectFriendsCurrentPage: 0,
               });
               // this.getRejectFriends(0, 0);
            }
         }
      );
   }
   const unFolowFriend = (friendid) => {
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
               friends.map((friend) => {
                  if (friend.friendid === friendid) friend.ismefollow = 0;
               });
               setState({
                  ...state,
                  friends: friends,
                  allUsers: allUsers,
                  showFriendActionsDrawer: false,
               });
            }
         }
      );
   }

   const removeFriend = (friendid) => {
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
               setState({
                  ...state,
                  friends: friends.filter((friend) => friend.friendid !== friendid),
                  allUsers: allUsers.filter((friend) => friend.friendid !== friendid),
                  showFriendActionsDrawer: false,
               });
            }
         }
      );
   }
   return (
      <Drawer
         anchor="bottom"
         className="report-drawer"
         open={showReportPost}
         onClose={() => toggleReportComment(false)}
      >
         <div className="drawer-detail">
            <div className="drawer-header">
               <div
                  className="direction"
                  onClick={() => {
                     setState({
                        ...state,
                        reasonSelected: null,
                        orderReasonText: "",
                        willBlock: false,
                        willUnfollow: false,
                        willUnfriend: false,
                     })
                     toggleReportComment(false)
                  }
                  }
               >
                  <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}>
                     <ChevronLeftIcon
                        style={{ color: "#ff5a59", width: "25px", height: "25px" }}
                     />
                  </IconButton>
                  <label>Báo cáo bài đăng</label>
               </div>
            </div>
            <div className="filter"></div>
            <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
               <div>
                  <img src={report} />
                  <label>Bạn thấy bài đăng này có dấu hiệu nào dưới đây?</label>
                  <div className="reason-box">
                     <ul>
                        {state.postReportReason && state.postReportReason.map((reason, index) => (
                           <li
                              key={index}
                              className={(state.reasonSelected && state.reasonSelected.issueid === reason.issueid) && "active"}
                              onClick={() => handleSelectReason(reason)}
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
                              setState({
                                 ...state,
                                 orderReasonText: value.text,
                                 reasonSelected: null,
                              })
                           }
                           topDown={true}
                           placeholder={"Khác (Ghi tối đa 20 chữ)"}
                           enableHashtag={false}
                           enableMention={false}
                           centerMode={false}
                           value={state.orderReasonText}
                           maxLength={20}
                           unit="Word"
                        />
                     </div>
                  </div>
               </div>
               <div className="re-action">
                  <label>Bạn có muốn?</label>
                  {currentPostForComment && <ul>
                     <li onClick={() => setState({ ...state, willBlock: !state.willBlock })}>
                        <img src={block} />
                        <div>
                           <label>Chặn {currentPostForComment.nameuserpost}</label>
                           <span>Bạn và người này sẽ không nhìn thấy bài đăng và liên hệ với nhau.</span>
                        </div>
                        <Radio checked={state.willBlock} />
                     </li>
                     <li
                        onClick={() =>
                           setState({ ...state, willUnfollow: !state.willUnfollow })
                        }
                     >
                        <img src={unfollow} />
                        <div>
                           <label>Bỏ theo dõi {currentPostForComment.nameuserpost}</label>
                           <span>Bạn sẽ không nhìn thấy những bài đăng từ người này nhưng vẫn là bạn bè của nhau.</span>
                        </div>
                        <Radio checked={state.willUnfollow} />
                     </li>
                     <li
                        onClick={() =>
                           setState({ ...state, willUnfriend: !state.willUnfriend })
                        }
                     >
                        <img src={unfriend} />
                        <div>
                           <label>Huỷ kết bạn {currentPostForComment.nameuserpost}</label>
                           <span>Hai bạn không còn trong danh sách bạn bè của nhau trên YOOT.</span>
                        </div>
                        <Radio checked={state.willUnfriend} />
                     </li>
                  </ul>}
                  <Button
                     className="bt-submit"
                     onClick={() => handleReportPost()}
                  >
                     Báo cáo
                  </Button>
               </div>
            </div>
         </div>
         <ReportSuccessAlert state={state} setState={setState} />
      </Drawer>
   );
}

const ReportSuccessAlert = ({state,setState}) => {
   let {
     showReportSuccessAlert,
     reasonSelected,
     orderReasonText,
   } = state;
   return (
     <Drawer
       anchor="bottom"
       className="confirm-drawer report-success-alert"
       open={showReportSuccessAlert}
       onClose={() =>
         setState({...state,
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
         onClick={() => setState({ ...state,showReportSuccessAlert: false })}
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
           <Button className="btn-reason" disabled>
             {orderReasonText}
           </Button>
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
const mapActionToProps = {
   toggleReportComment
}
const mapStateToProps = state => ({
   app: state.app
})

export default connect(mapStateToProps,mapActionToProps)(Report)
