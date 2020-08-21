import React from "react";
import { Route, Switch } from "react-router";
import Home from "../home";
import YootNoti from '../yoot-noti'
import "./style.scss";
import { connect } from 'react-redux'
import {
  Avatar
} from '@material-ui/core'

const coin = require('../../assets/images/angry.png')


class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  render() {
    let {
      showHeader,
      showFooter,
      profile,
      headerContent,
      footerContent
    } = this.props
    console.log("this.props", this.props)
    return (
      <div className="wrapper">
        <div className={"fix-header " + (showHeader ? "showed" : "hided")} >
          <div className="direction">
            {headerContent}
          </div>
          {
            profile ? <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div> : ""
          }
        </div>
        <main className="content-main" style={{ marginTop: (showHeader ? "60px" : "0px"), marginBottom: showFooter ? "70px" : "0px" }}>
          <Switch >
            <Route exact path="/" component={Home} />
            <Route exact path="/yoot-noti" component={YootNoti} />
          </Switch>
        </main>
        <div className={"fix-footer " + (showFooter ? "showed" : "hided")} >
          {footerContent}
        </div>
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

const mapDispatchToProps = dispatch => null

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
