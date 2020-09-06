import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import { connect } from 'react-redux'
import {
  IconButton,
  Avatar,
  Button
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import moment from 'moment'

const noti = require('../../assets/icon/NotiBw1.png')
const Newfeed = require('../../assets/icon/Lesson.png')

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    return (
      <div className="skills-noti" >
        <ul>
          {
            noties.map((noti, index) => <li className={"noti-item" + (noti.type == "canAction" ? " action" : "")} key={index}>
              <Avatar className="avatar"><img src={noti.avatar} /></Avatar>
              <div className="noti-info">
                <span className="message">{noti.message}</span>
                {
                  noti.type == "canAction" ? <div className="actions">
                    <Button className="bt-submit">Chấp nhận</Button>
                    <Button className="bt-cancel">Từ chối</Button>
                  </div> : ""
                }
                <span className="time">{moment(noti.time).format("DD/MM/YYYY hh:mm")}</span>
              </div>
            </li>)
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header">
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.props.history.push('/')}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Thông báo</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => history.push('/skills')}>
          <img src={Newfeed}></img>
          <span >Danh sách</span>
        </li>
        <li>
          <img src={noti}></img>
          <span style={{ color: "#f54746" }}>Thông báo</span>
        </li>
      </ul>
    </div>
  )
}

const noties = [
  {
    avatar: "https://us.123rf.com/450wm/anekoho/anekoho1803/anekoho180300019/103156248-wooded-bridge-to-pavilion-at-koh-kood-island-with-white-sand-beauty-beach-and-kayak-boat-this-immage.jpg?ver=6",
    message: "Bạn và Hậu đã trở thành bạn bè của nhau.",
    time: new Date()
  },
  {
    avatar: "https://us.123rf.com/450wm/anekoho/anekoho1803/anekoho180300019/103156248-wooded-bridge-to-pavilion-at-koh-kood-island-with-white-sand-beauty-beach-and-kayak-boat-this-immage.jpg?ver=6",
    message: "Bạn và Hậu đã trở thành bạn bè của nhau.",
    time: new Date()
  },
  {
    avatar: "https://us.123rf.com/450wm/anekoho/anekoho1803/anekoho180300019/103156248-wooded-bridge-to-pavilion-at-koh-kood-island-with-white-sand-beauty-beach-and-kayak-boat-this-immage.jpg?ver=6",
    message: "YOOT đã gửi cho bạn lời mời tham gia nhóm ABC.",
    time: new Date(),
    type: "canAction"
  },
  {
    avatar: "https://us.123rf.com/450wm/anekoho/anekoho1803/anekoho180300019/103156248-wooded-bridge-to-pavilion-at-koh-kood-island-with-white-sand-beauty-beach-and-kayak-boat-this-immage.jpg?ver=6",
    message: "Bạn và Hậu đã trở thành bạn bè của nhau.",
    time: new Date()
  }
]