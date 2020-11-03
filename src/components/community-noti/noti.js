import React from "react";
import {
  Avatar,
  Button
} from "@material-ui/core";
import {
  FiberManualRecord as FiberManualRecordIcon
} from '@material-ui/icons'
import {
  deleteNoti
} from '../../actions/noti'
import {
  setCurrenUserDetail,
} from '../../actions/user'
import {
  toggleUserPageDrawer
} from '../../actions/app'
import {
  get
} from '../../api'
import {
  setUnreadNotiCount
} from '../../actions/noti'
import moment from 'moment'
import { fromNow, objToQuery } from "../../utils/common";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { connect } from 'react-redux'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  acceptFriend(friendId) {
    let {
      data
    } = this.props
    let param = {
      friendid: friendId
    }
    if (!friendId) return
    get(SOCIAL_NET_WORK_API, "Friends/AcceptFriends" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(data.notificationid)
      }
    })
  }

  openUserPage(noti) {
    this.props.setCurrenUserDetail({ friendid: noti.idusersend })
    this.props.toggleUserPageDrawer(true)
    // get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=" + noti.idusersend, result => {
    //   if (result && result.result == 1) {
    //     this.props.setCurrenUserDetail(result.content.user)
    //     this.props.toggleUserPageDrawer(true)
    //   }
    // })


  }

  acceptUserToGroup(noti) {
    get(SOCIAL_NET_WORK_API, "GroupUser/AcceptMemberGroupUser?idjoin=" + noti.idjoin, result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(noti.notificationid)
      }
    })
  }

  refuseUserToGroup(noti) {
    get(SOCIAL_NET_WORK_API, "GroupUser/RefuseMemberGroupUser?idjoin=" + noti.idjoin, result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(noti.notificationid)
      }
    })
  }

  acceptInviteGroup(noti) {
    get(SOCIAL_NET_WORK_API, "GroupUser/AcceptInviteGroupUser?groupid=" + noti.groupid, result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(noti.notificationid)
      }
    })
  }

  refuseInviteGroup(noti) {
    get(SOCIAL_NET_WORK_API, "GroupUser/RefuseInviteGroupUser?groupid=" + noti.groupid, result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(noti.notificationid)
      }
    })
  }

  acceptInviteAdminGroup(noti) {
    get(SOCIAL_NET_WORK_API, "GroupUser/AcceptInviteAdminGroupUser?groupid=" + noti.groupid, result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(noti.notificationid)
      }
    })
  }

  refuseInviteAdminGroup(noti) {
    get(SOCIAL_NET_WORK_API, "GroupUser/RefuseInviteAdminGroupUser?groupid=" + noti.groupid, result => {
      if (result && result.result == 1) {
        this.props.deleteNoti(noti.notificationid)
      }
    })
  }


  componentWillMount() {

  }
  render() {
    let {
      data,
      onNotiClick
    } = this.props
    return (
      data ? <li className={"noti-item" + (data.userstatus == 0 ? " unread" : "")} onClick={() => onNotiClick(data)}>
        <Avatar className="avatar">
          <div className="img" style={{ background: "url(" + data.avatarthumbusersend + ")" }} />
        </Avatar>
        {
          data.type == 1 ? renderType1(this) : ""
        }
        {
          data.type == 2 ? renderType2(this) : ""
        }
        {
          data.type == 3 ? renderType3(this) : ""
        }
        {
          data.type == 4 ? renderType4(this) : ""
        }
        {
          data.type == 5 ? renderType5(this) : ""
        }
        {
          data.type == 8 ? renderType8(this) : ""
        }
        {
          data.type == 9 ? renderType9(this) : ""
        }
        {
          data.type == 34 ? renderType34(this) : ""
        }
        {
          data.type == 35 ? renderType35(this) : ""
        }
        {
          data.type == 36 ? renderType36(this) : ""
        }
      </li> : ""
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.noti
  }
};

const mapDispatchToProps = dispatch => ({
  deleteNoti: (notiId) => dispatch(deleteNoti(notiId)),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

//Lời mời kết bạn
const renderType1 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)

        }}>
        </pre>
        <div className="actions">
          <Button className="bt-submit" onClick={() => component.acceptFriend(data.idusersend)}>Chấp nhận</Button>
          <Button className="bt-cancel" onClick={() => component.props.deleteNoti(data.notificationid)}>Từ chối</Button>
        </div>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Trả lời lời mời kết bạn
const renderType2 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35" onClick={() => component.openUserPage(data)}>
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)

        }}>
        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Bình luận bài đăng
const renderType3 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace(data.contentcomment != "" ? '{contentcomment}' : '"{contentcomment}"', `<b>${data.contentcomment}</b>`)

        }}>

        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Trả lời bình luận
const renderType4 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace(data.contentcomment != "" ? '{contentcomment}' : '"{contentcomment}"', `<b>${data.contentcomment}</b>`)

        }}>

        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Thích bài đăng
const renderType5 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)

        }}>

        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Lời mời vào nhóm
const renderType8 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('{groupname}', `<b>${data.namegroup}</b>`)

        }}>
        </pre>
        <div className="actions">
          <Button className="bt-submit" onClick={() => component.acceptInviteGroup(data)}>Chấp nhận</Button>
          <Button className="bt-cancel" onClick={() => component.refuseInviteGroup(data)}>Từ chối</Button>
        </div>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Lời xin vào nhóm
const renderType9 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('{groupname}', `<b>${data.namegroup}</b>`)

        }}>
        </pre>
        <div className="actions">
          <Button className="bt-submit" onClick={() => component.acceptUserToGroup(data)}>Chấp nhận</Button>
          <Button className="bt-cancel" onClick={() => component.refuseUserToGroup(data)}>Từ chối</Button>
        </div>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Xác nhận làm quản lý
const renderType34 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35" >
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('{groupname}', `<b>${data.namegroup}</b>`)
        }}>
        </pre>
        <div className="actions">
          <Button className="bt-submit" onClick={() => component.acceptInviteAdminGroup(data)}>Chấp nhận</Button>
          <Button className="bt-cancel" onClick={() => component.refuseInviteAdminGroup(data)}>Từ chối</Button>
        </div>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Đăng bài vào nhóm
const renderType35 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('{groupname}:', `<b>${data.namegroup.trim()}</b>`)
            .replace('{contentpost}', `${data.contentpost.trim().substr(0, 60)}${data.contentpost.trim().length > 60 ? "..." : ""}`)

        }}>

        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}
//Nhận thông báo xác nhận quản lý
const renderType36 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35">
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('{groupname}', `<b>${data.namegroup.trim()}</b>`)

        }}>

        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}

