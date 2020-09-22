import React from "react";
import "./style/style.scss";
import { signIn } from "../../auth";
import { post } from "../../api";
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  IconButton,
  Drawer
} from '@material-ui/core'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@material-ui/icons'
import SwipeableViews from 'react-swipeable-views';
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { USER_ACCOUNT } from '../../constants/localStorageKeys'
import { showNotification } from "../../utils/common";
import { setUserProfile } from '../../actions/user'
import Loader from '../common/loader'
import moment from 'moment'
import { connect } from 'react-redux'
import {NumberFormatCustom} from '../../utils/common'

const logo = require('../../assets/images/yoot-full.png')
const bgImg = require('../../assets/images/Bg-img.png')
const checkIcon = require('../../assets/images/check.png')
const checkedIcon = require('../../assets/images/checked.png')

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      gender: "Male",
      isShowLoginPass: false,
      isShowRegisterPass: false,
      isShowConfirmPass: false,
      isProccessinng: false,
      rememberPassword: false,
    };
  }

  login() {
    let {
      loginPhoneNumber,
      loginPassword,
      rememberPassword
    } = this.state
    let param = {
      phone: loginPhoneNumber,
      password: loginPassword,
    }
    if (!param.phone || param.phone == '') {
      showNotification(
        "",
        <span className="app-noti-message">Vui lòng nhập số điện thoại.</span>,
        null
      )
      return
    }
    if (!param.password || param.password == '') {
      showNotification(
        "",
        <span className="app-noti-message">Vui lòng nhập mật khẩu.</span>,
        null
      )
      return
    }

    this.setState({
      isProccessinng: true
    })

    post(SOCIAL_NET_WORK_API, "Login/Index", param, (result) => {
      if (result.result == 1) {
        signIn({
          comunityAccessToken: result.content.myToken,
          skillAccessToken: result.content.myTokenTraining,
          careerGuidanceAccessToken: result.content.myTokenBuildYS
        });
        this.setState({
          isProccessinng: false
        })
        if (rememberPassword == true) {
          window.sessionStorage.setItem(USER_ACCOUNT, JSON.stringify(param))
        } else {
          window.sessionStorage.removeItem(USER_ACCOUNT)
        }
        this.props.history.go(0)
      } else {
        this.setState({
          isProccessinng: false
        })
        showNotification(
          "",
          <span className="app-noti-message">Số điện thoại hoặc mật khẩu không đúng. Vui lòng thử lại</span>,
          null
        )
      }

    })
  };

  register() {
    let {
      registerPhoneNumber,
      registerPassword,
      registerConfirmPassword,
      registerName,
      registerEmail,
      registerBirthDay,
      gender,
      isAcceptTerms
    } = this.state;

    if (!registerName || registerName == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập họ và tên.</span>)
      return
    }
    if (!registerPhoneNumber || registerPhoneNumber == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập số điện thoại.</span>)
      return
    }
    if (!registerEmail || registerEmail == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập email.</span>)
      return
    }
    if (!registerBirthDay || registerBirthDay == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập ngày sinh.</span>)
      return
    }
    if (!registerBirthDay || registerBirthDay == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập ngày sinh.</span>)
      return
    }
    if (registerBirthDay) {
      if (moment(new Date).year() - moment(registerBirthDay).year() < 16) {
        showNotification("", <span className="app-noti-message">Bạn chưa đủ tuổi để sử dụng ứng dụng, vui lòng kiểm tra lại.</span>)
        return
      }
    }
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(registerEmail)) {
      showNotification("", <span className="app-noti-message">Email không hợp lệ.</span>)
      return
    }
    if (!registerPassword || registerPassword == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập mật khẩu.</span>)
      return
    }
    if (registerPassword.length > 25 || registerPassword.length < 6) {
      showNotification("", <span className="app-noti-message">Mật khẩu phải có độ dài từ 6 đến 25 ký tự.</span>)
      return
    }
    if (!registerConfirmPassword || registerConfirmPassword == '') {
      showNotification("", <span className="app-noti-message">Vui lòng xác nhận mật khẩu.</span>)
      return
    }
    if (registerConfirmPassword != registerPassword) {
      showNotification("", <span className="app-noti-message">Mật khẩu xác nhận không trùng khớp.</span>)
      return
    }
    if (!isAcceptTerms) {
      showNotification("", <span className="app-noti-message">Vui lòng xác nhận với điều khoản sử dụng.</span>)
      return
    }

    let param = {
      phone: registerPhoneNumber,
      email: registerEmail,
      name: registerName,
      gender: gender == "Male" ? 0 : 1,
      address: "",
      password: registerPassword,
      birthday: moment(registerBirthDay)
    }

    this.setState({
      isProccessinng: true
    })

    post(SOCIAL_NET_WORK_API, "Login/Register", param, result => {
      showNotification("", <span className="app-noti-message">{result.message}</span>)
      this.setState({
        isProccessinng: false
      })
    })

  }

  resetPassword() {
    let {
      resetPassEmail
    } = this.state
    if (!resetPassEmail || resetPassEmail == '') {
      showNotification("", <span className="app-noti-message">Vui lòng nhập email đã đăng ký.</span>)
      return
    }
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(resetPassEmail)) {
      showNotification("", <span className="app-noti-message">Email không hợp lệ.</span>)
      return
    }
    this.setState({
      isProccessinng: true
    })

    let param = {
      email: resetPassEmail
    }

    post(SOCIAL_NET_WORK_API, "Login/ForgetPassword", param, result => {
      showNotification("", <span className="app-noti-message">{result.message}</span>)
      this.setState({
        isProccessinng: false
      })
    })

  }

  componentWillMount() {
    let userAccount = JSON.parse(window.sessionStorage.getItem(USER_ACCOUNT))
    if (userAccount && userAccount.phone && userAccount.password) {

      this.setState({
        loginPhoneNumber: userAccount.phone,
        loginPassword: userAccount.password,
        rememberPassword: true
      })
    }
  }

  render() {
    let {
      value,
      gender,
      isShowLoginPass,
      isShowRegisterPass,
      isShowConfirmPass,
      loginPhoneNumber,
      loginPassword,
      isProccessinng,
      rememberPassword,
      registerPhoneNumber,
      registerPassword,
      registerConfirmPassword,
      registerName,
      registerEmail,
      registerBirthDay,
      isAcceptTerms,
    } = this.state

    return (
      <div className="sign-in-page" >
        <div className="logo"><img src={logo} /></div>
        <div className="sign-in-bg"><img src={bgImg} /></div>
        <div className="sign-in-form">
          <AppBar position="static" color="default" className={"custom-tab"}>
            <Tabs
              value={value}
              onChange={(e, value) => this.setState({ value: value })}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              className="tab-header"
            >
              <Tab label="Đăng nhập" {...a11yProps(0)} className="tab-item" />
              <Tab label="Đăng ký mới" {...a11yProps(1)} className="tab-item" />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={value}
            onChangeIndex={(value) => this.setState({ value: value })}
            className="tab-content"
          >
            <TabPanel value={value} index={0} className="content-box">
              <div>
                <TextField
                  className="custom-input"
                  variant="outlined"
                  placeholder="Email, số điện thoại"
                  style={{
                    width: "100%",
                    marginBottom: "10px"
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  value={loginPhoneNumber}
                  onChange={e => this.setState({ loginPhoneNumber: e.target.value.length < 11 ? e.target.value : loginPhoneNumber })}
                />
                <TextField
                  className="custom-input"
                  variant="outlined"
                  placeholder="Mật khẩu"
                  style={{
                    width: "100%",
                  }}
                  value={loginPassword}
                  type={isShowLoginPass ? "text" : "password"}
                  onChange={e => this.setState({ loginPassword: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => this.setState({ isShowLoginPass: !isShowLoginPass })}>
                          {
                            isShowLoginPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="password-option">
                  <span onClick={() => this.setState({ showResetPassDrawer: true })}>Quên mật khẩu?</span>
                  <div>
                    <FormControlLabel
                      control={<Checkbox checked={rememberPassword} onChange={() => this.setState({ rememberPassword: !rememberPassword })} icon={<img src={checkIcon} style={{ width: 20, height: 20 }} />} checkedIcon={<img src={checkedIcon} style={{ width: 20, height: 20 }} />} name="checkedH" />}
                      label={<span>Nhớ mật khẩu</span>}
                    />
                  </div>
                </div>
                <Button variant="contained" className={"bt-submit"} onClick={() => this.login()}>Đăng nhập</Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1} >
              <div className="sign-up-form">
                <div>
                  <label>Thông tin tài khoản</label>
                  <TextField
                    className="custom-input"
                    variant="outlined"
                    placeholder="Số điện thoại"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    value={registerPhoneNumber}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    onChange={e => this.setState({ registerPhoneNumber: e.target.value.length < 11 ? e.target.value : registerPhoneNumber })}
                  />
                  <TextField
                    className="custom-input"
                    variant="outlined"
                    placeholder="Mật khẩu"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    type={isShowRegisterPass ? "text" : "password"}
                    value={registerPassword}
                    onChange={e => this.setState({ registerPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => this.setState({ isShowRegisterPass: !isShowRegisterPass })}>
                            {
                              isShowRegisterPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                            }
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    className="custom-input"
                    variant="outlined"
                    placeholder="Nhập lại mật khẩu"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    type={isShowConfirmPass ? "text" : "password"}
                    value={registerConfirmPassword}
                    onChange={e => this.setState({ registerConfirmPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => this.setState({ isShowConfirmPass: !isShowConfirmPass })}>
                            {
                              isShowConfirmPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                            }
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="mt10">
                  <label>Thông tin cá nhân</label>
                  <TextField
                    className="custom-input"
                    variant="outlined"
                    placeholder="Họ và tên"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    value={registerName}
                    onChange={e => this.setState({ registerName: e.target.value })}
                  />
                  <TextField
                    className="custom-input"
                    variant="outlined"
                    placeholder="Email"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    value={registerEmail}
                    onChange={e => this.setState({ registerEmail: e.target.value })}
                  />

                  <TextField
                    className="custom-input"
                    variant="outlined"
                    placeholder="Sinh nhật"
                    type="date"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    onChange={e => this.setState({ registerBirthDay: e.target.value })}
                    label={registerBirthDay ? null : <span className="custom-placehoder">Ngày sinh</span>}
                  />

                  <div className="gender-select">
                    <span className="title">Giới tính</span>
                    <div className="options">
                      <span className={gender == "Male" ? "active" : ""} onClick={() => this.setState({ gender: "Male" })}>Nam</span>
                      <span className={gender == "Female" ? "active" : ""} onClick={() => this.setState({ gender: "Female" })}>Nữ</span>
                    </div>
                  </div>
                  <div className="accept-role">
                    <FormControlLabel
                      control={<Checkbox checked={isAcceptTerms} onChange={() => this.setState({ isAcceptTerms: !isAcceptTerms })} icon={<img src={checkIcon} style={{ width: 20, height: 20 }} />} checkedIcon={<img src={checkedIcon} style={{ width: 20, height: 20 }} />} name="checkedH" />}
                      label={<span>Tôi đồng ý với </span>}
                    />
                    <label>Điều khoản sử dụng</label>
                  </div>
                  <Button variant="contained" className={"bt-submit"} onClick={() => this.register()}>Đăng ký</Button>

                </div>
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
        {
          isProccessinng ? <Loader type="dask-mode" isFullScreen={true} /> : ""
        }
        {
          renderResetPassDrawer(this)
        }
      </div>
    );
  }
}


export default Index;

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

const renderResetPassDrawer = (component) => {
  let {
    showResetPassDrawer,
    resetPassEmail
  } = component.state
  return (
    <Drawer anchor="bottom" className="reset-pass-drawer" open={showResetPassDrawer} onClose={() => component.setState({ showResetPassDrawer: false })}>
      <div className="drawer-detail">
        <div className="sign-in-page" >
          <div className="logo"><img src={logo} /></div>
          <label>Quên mật khẩu</label>
          <span>Nhập email bạn đã đăng ký để khôi phục mật khẩu.</span>
          <div className="sign-in-form">
            <TextField
              className="custom-input"
              variant="outlined"
              placeholder="Địa chỉ email"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              value={resetPassEmail}
              onChange={e => component.setState({ resetPassEmail: e.target.value })}
            />
            <Button variant="contained" className={"bt-submit"} onClick={() => component.resetPassword()}>Gửi mật khẩu mới</Button>
            <Button variant="contained" className={"bt-cancel"} onClick={() => component.setState({ showResetPassDrawer: false })}>Quay lại đăng nhập</Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}