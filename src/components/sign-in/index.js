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
  IconButton
} from '@material-ui/core'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@material-ui/icons'
import SwipeableViews from 'react-swipeable-views';

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
      isShowConfirmPass: false
    };
  }

  login() {
    signIn({
      accessToken: "abcd"
    });
    this.props.history.go(0)
  };

  render() {
    let {
      value,
      gender,
      isShowLoginPass,
      isShowRegisterPass,
      isShowConfirmPass
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
                  variant="outlined"
                  placeholder="Email, số điện thoại"
                  style={{
                    width: "100%",
                    marginBottom: "10px"
                  }}
                />
                <TextField
                  variant="outlined"
                  placeholder="Mật khẩu"
                  style={{
                    width: "100%",
                  }}
                  type={isShowLoginPass ? "text" : "password"}
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
                  <span>Quên mật khẩu?</span>
                  <div>
                    <FormControlLabel
                      control={<Checkbox icon={<img src={checkIcon} style={{ width: 20, height: 20 }} />} checkedIcon={<img src={checkedIcon} style={{ width: 20, height: 20 }} />} name="checkedH" />}
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
                    variant="outlined"
                    placeholder="Số điện thoại"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Mật khẩu"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    type={isShowRegisterPass ? "text" : "password"}
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
                    variant="outlined"
                    placeholder="Nhập lại mật khẩu"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                    type={isShowConfirmPass ? "text" : "password"}
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
                    variant="outlined"
                    placeholder="Họ và tên"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
                  />
                  <TextField
                    variant="outlined"
                    placeholder="Email"
                    style={{
                      width: "100%",
                      marginBottom: "10px"
                    }}
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
                      control={<Checkbox icon={<img src={checkIcon} style={{ width: 20, height: 20 }} />} checkedIcon={<img src={checkedIcon} style={{ width: 20, height: 20 }} />} name="checkedH" />}
                      label={<span>Tôi đồng ý với </span>}
                    />
                    <label>Điều khoản sử dụng</label>
                  </div>
                  <Button variant="contained" className={"bt-submit"}>Đăng ký</Button>

                </div>
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
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