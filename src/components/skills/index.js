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
  IconButton
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'

const noti = require('../../assets/icon/NotiBw@1x.png')
const Newfeed = require('../../assets/icon/Newfeed@1x.png')

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
      <div className="skills-page" >
        {
          <ul>
            {
              sources.map((source, index) => <li className="source-item" onClick={() => this.props.history.push("/skills/1219")}>
                <div style={{ background: "url(" + source.background + ")" }}>
                  <div>
                    <div className="reward">
                      <span>{source.lessonCount} bài</span>
                      <span>{source.documentsCount} tài liệu</span>
                    </div>
                    <span className="source-name">{source.name}</span>
                  </div>
                </div>
              </li>)
            }
          </ul>
        }
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
      <label>Khoá học</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li>
          <img src={Newfeed}></img>
          <span style={{ color: "#f54746" }}>Danh sách</span>
        </li>
        <li onClick={() => history.push('/skills-noti')}>
          <img src={noti}></img>
          <span >Thông báo</span>
        </li>
      </ul>
    </div>
  )
}

const sources = [
  {
    name: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
    background: "https://andrews.edu.vn/wp-content/uploads/Prensention_mbaandrews.jpg",
    documentsCount: 1,
    lessonCount: 10
  },
  {
    name: "Kỹ năng giao tiếp hiệu quả",
    background: "https://www.sprc.org/sites/default/files/styles/featured_image_large/public/SPRC_EllyStout_DirCorner_Cropped_node_6.jpg?itok=aqVkwAEq",
    documentsCount: 1,
    lessonCount: 10
  }
]
