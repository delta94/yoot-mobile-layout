import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import {
  setSkillNoti
} from '../../actions/noti'
import { connect } from 'react-redux'
import {
  IconButton
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import {
  get
} from '../../api'
import { SCHOOL_API } from "../../constants/appSettings";

const noti = require('../../assets/icon/NotiBw@1x.png')
const Newfeed = require('../../assets/icon/Newfeed@1x.png')

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allSource: []
    };
  }

  getAllSource() {
    get(SCHOOL_API, "Course/getalls", result => {
      if (result && result.StatusCode == 1) {
        this.setState({
          allSource: result.Data
        })
      }
    })
  }

  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }

  componentDidMount() {
    this.getAllSource()
  }
  render() {
    let {
      allSource
    } = this.state

    console.log("allSource", allSource[0] ? allSource[0].IMAGE : "")
    return (
      <div className="skills-page" >
        {
          allSource && allSource.length > 0 ? <ul>
            {
              allSource.map((source, index) => <li key={index} className="source-item" onClick={() => this.props.history.push("/skills/" + source.ID)}>
                <div style={{ background: "url(" + source.IMAGE + ")" }}>
                  <div>
                    <div className="reward">
                      <span>{source.NUM_LESSION} bài</span>
                      <span>{source.NUM_DOCUMENT} tài liệu</span>
                    </div>
                    <span className="source-name">{source.NAME}</span>
                  </div>
                </div>
              </li>)
            }
          </ul> : ""
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
  setSkillNoti: (noties) => dispatch(setSkillNoti(noties)),
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
const renderFooter = (component) => {
  return (
    <div className="app-footer">
      <ul>
        <li>
          <img src={Newfeed}></img>
          <span style={{ color: "#f54746" }}>Danh sách</span>
        </li>
        <li onClick={() => component.props.history.push('/skills-noti')}>
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
