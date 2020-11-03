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
import moment from 'moment'
import { fromNow, objToQuery, showNotification } from "../../utils/common";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { connect } from 'react-redux'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  openReviewList(noti) {
    const text =
      noti.hwvstatus != 2
        ? noti.reviewstatus == 1
          ? 'Bạn đã đánh giá bài tập này. '
          : ''
        : noti.reviewstatus == 1
          ? 'Bạn đã đánh giá bài tập này. '
          : `${noti.nameusersend} đã yêu cầu thay đổi người đánh giá khác hoặc đã xóa bài tập thực hành.`;
    if (text != "") {
      showNotification("", text)
    } else {
      this.props.history.replace(`/skills/${noti.courseid}/assess`)

    }
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
          data.type == 17 ? renderType17(this) : ""
        }
        {
          data.type == 18 ? renderType18(this) : ""
        }
        {
          data.type == 33 ? renderType33(this) : ""
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

//Gửi chấm điểm
const renderType17 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35" onClick={() => component.openReviewList(data)}>
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('"{namecourse}"', `<b>"${data.courseName}"</b>`)
        }}>
        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}

//Đã chấm điểm
const renderType18 = (component) => {
  let {
    data
  } = component.props
  console.log("skills/113/exercise", data)
  return (
    <div className="noti-content content-type-35" onClick={() => component.props.history.replace(`/skills/${data.courseid}/exercise?tabIndex=1`)}>
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('"{namecourse}"', `<b>"${data.courseName}"</b>`)
        }}>
        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}

//Nhắc nhở đánh giá bài tập
const renderType33 = (component) => {
  let {
    data
  } = component.props
  return (
    <div className="noti-content content-type-35" onClick={() => component.openReviewList(data)}>
      <div className="noti-info">
        <pre className="message" dangerouslySetInnerHTML={{
          __html: data.content
            .replace('{usernamesend}', `<b>${data.nameusersend}</b>`)
            .replace('"{namecourse}"', `<b>"${data.courseName}"</b>`)
        }}>
        </pre>
        <span className="time">{fromNow(moment(data.createdate), moment(new Date))}</span>
      </div>
    </div>
  )
}

