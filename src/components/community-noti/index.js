import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import Noti from './noti'
import { connect } from 'react-redux'
import {
  IconButton
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'

const Newfeed = require('../../assets/icon/Lesson.png')
const Group1 = require('../../assets/icon/Group1@1x.png')
const NotiBw = require('../../assets/icon/NotiBw1.png')
const ProfileBW = require('../../assets/icon/ProfileBW.png')
const Videos = require('../../assets/icon/Video.png')






class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
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
      <div className="community-page groups-page" >
        <ul>
          {
            noties.map((noti, index) => <Noti key={index} data={noti} />)
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.user
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
        <li onClick={() => history.replace('/community')}>
          <img src={Newfeed}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => history.replace('/videos')}>
          <img src={Videos}></img>
          <span >Video</span>
        </li>
        <li onClick={() => history.replace('/groups')}>
          <img src={Group1}></img>
          <span >Nhóm</span>
        </li>
        <li onClick={() => history.replace('/community-noti')}>
          <img src={NotiBw}></img>
          <span style={{ color: "#f54746" }}>Thông báo</span>
        </li>
        <li onClick={() => history.replace('/communiti-profile')}>
          <img src={ProfileBW}></img>
          <span>Cá nhân</span>
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
