import React from "react";
import { Route, Switch } from "react-router";

import Main from "./components/main";
import SignIn from "./components/sign-in";
import { isSignedIn } from "./auth";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css'
import "react-datepicker/dist/react-datepicker.css";
import './assets/style/app.scss'
import './assets/style/common.scss'

import $ from 'jquery'


const loading = require('./assets/images/loading.png')
const yootFull = require('./assets/images/yoot-full.png')
const imgBg = require('./assets/images/img-bg.png')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      let slashScreen = $("#slash-screen")
      if (slashScreen) slashScreen.fadeOut(() => {
        this.props.appStart()
      })

    }, 1000);
  }

  render() {
    return (
      <div>
        {/* <div id={"slash-screen"} style={{ background: "url(" + imgBg + ")" }}>
          <img src={yootFull} className="logo" />
        </div> */}
        {isSignedIn() ? (
          <Route exact path="/*" component={Main} />
        ) : (
            <Switch>
              <Route exact path="/*" component={SignIn} />
            </Switch>
          )}
        <ToastContainer
          position="top-right"
          autoClose={500000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnVisibilityChange
          draggable={false}
          pauseOnHover
          className="custom-toast"
        />
      </div>

    );
  }
}

export default App;
