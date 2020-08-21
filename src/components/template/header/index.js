import React from "react";
import $ from "jquery";
import "./style/style.scss";
import DropDown from "../../common/dropdown";
import { signOut, getCurrentUser } from "../../../auth";
import UpdateInfo from './updateProfileInfo'
import { BASE_API } from "../../../constants/appSettings";
import { NavLink } from "react-router-dom"


class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openUpdateUser: false,

    }
  }

  _signOut = () => {
    signOut();
  };

  _onOffMenu = () => {
    let body = $("body");
    body.toggleClass("sidebar-collapse");
  };

  _onCloseUpdateUser = () => {
    this.setState({
      openUpdateUser: false
    })
  }
  _onOpenUpdateUser = () => {
    this.setState({
      openUpdateUser: true
    })
  }
  _forceUpdate = () => {
    this.forceUpdate()
  }
  render() {
    const user = getCurrentUser();
    const { openUpdateUser } = this.state;
    const { style } = this.props
    if (!user) return null
    return (
      <header className="main-header" style={style}>
        <NavLink to="/" className="logo opacity-hover">
          <span className="logo-mini">METUB</span>
          <span className="logo-lg">
            <b style={{ color: "#F05661" }}>Metub</b>
            CRM
          </span>
        </NavLink>
        <nav className="navbar">
          <a className="sidebar-toggle" onClick={e => this._onOffMenu(e.target)}>
            <i className="fas fa-bars"> </i>
          </a>
          <div className="navbar-custom-menu">
            <ul className="nav clear-fix">
              <li className="user-menu">
                <DropDown
                  header={
                    <div>
                      {user.avatar ? (
                        <img
                          className="user-image"
                          src={BASE_API + user.avatar}
                          alt="Avatar"
                        />
                      ) : (
                          <img
                            className="user-image"
                            src={require("../../../assets/images/avatar.png")}
                            alt="Avatar"
                          />
                        )}
                      <span >
                        {user.fullName}
                      </span>
                    </div>
                  }
                  content={
                    <div className="user-box">
                      <div className="header">
                        {user.avatar ? (
                          <img
                            className="user-image"
                            src={BASE_API + user.avatar}
                            alt="Avatar"
                          />
                        ) : (
                            <img
                              className="user-image"
                              src={require("../../../assets/images/avatar.png")}
                              alt="Avatar"
                            />
                          )}
                      </div>
                      <div className="content" >
                        <div className="email">
                          <table className="table list-item border-none">
                            <tbody>
                              <tr>
                                <td className="coin text-left width100">
                                  <i className="far fa-envelope"></i>
                                </td>
                                <td className="text-left">
                                  <span>{user.email}</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="coin text-left width100">
                                  <i className="fas fa-user-shield"></i>
                                </td>
                                <td className="text-left">
                                  <span>{user.roleName}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="submit">
                        <button
                          onClick={this._onOpenUpdateUser} style={{ margin: '0', padding: '0' }}>
                          Cập nhật
                          </button>
                        <button onClick={this._signOut} style={{ margin: '0', padding: '0' }}>Đăng xuất</button>
                      </div>
                    </div>
                  }
                />
              </li>
            </ul>
          </div>
        </nav>
        <UpdateInfo
          open={openUpdateUser}
          onClose={this._onCloseUpdateUser}
          onUpdateSucceed={this._forceUpdate}
          fullName={user && user.fullName}
          avatar={user && user.avatar}
          id={user && user.id}
        />
      </header>
    );
  }
}
export default Index
