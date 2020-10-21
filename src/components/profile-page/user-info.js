import React from 'react';
import {
    IconButton,
    Drawer,
    TextField,
    Button,
    NativeSelect,
    FormControl,
    Menu,
    MenuItem,
    ClickAwayListener
} from '@material-ui/core'
import {
    MoreHoriz as MoreHorizIcon,
    PlayArrow as PlayArrowIcon,
    ChevronLeft as ChevronLeftIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import moment from 'moment'
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import { Dates, Months, Privacies } from '../../constants/constants'
import { get, post } from '../../api';
import { showNotification, objToArray } from '../../utils/common';
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import { connect } from "react-redux"
import { Loader } from '../common/loader'
import { NumberFormatCustom } from '../../utils/common'
import CustomMenu from '../common/custom-menu'
import { request } from 'https';


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showUpdateForm: false,
            gender: null,
            email: "",
            address: "",
            fullName: "",
            isUpdatePreccessing: false,
            phone: "",
            anchor: null,
            addressPrivacy: Privacies.Public,
            dateOfBirthPrivacy: Privacies.Public,
            yearOfBirthPrivacy: Privacies.Public,
            genderPrivacy: Privacies.Public,
            showGenderSelect: false
        };
    }

    _handleSetDefault() {
        let { data } = this.props
        if (!data) return

        let defaultAddressPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 1).levelid || 2
        let defaultDateOfBirthPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 2).levelid || 2
        let defaultYearOfBirthPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 3).levelid || 2
        let defaultGenderPrivacy = data.authorizeUsers.find(item => item.authorizeinfoid == 4).levelid || 2
        let PrivaciesOptions = objToArray(Privacies)

        this.setState({
            fullName: data.fullname,
            email: data.email,
            address: data.address,
            gender: data.gender == 0 ? "Nam" : "Nữ",
            dateOfBirth: moment(data.birthday).format("D"),
            mounthOfBirth: moment(data.birthday).format("M"),
            yearOfBirth: moment(data.birthday).year(),
            phone: data.phone,
            addressPrivacy: PrivaciesOptions.find(item => item.code == defaultAddressPrivacy),
            dateOfBirthPrivacy: PrivaciesOptions.find(item => item.code == defaultDateOfBirthPrivacy),
            yearOfBirthPrivacy: PrivaciesOptions.find(item => item.code == defaultYearOfBirthPrivacy),
            genderPrivacy: PrivaciesOptions.find(item => item.code == defaultGenderPrivacy)

        }, () => this.setState({
            defaultState: this.state
        }))
    }

    updateProfile() {
        let {
            email,
            address,
            fullName,
            gender,
            dateOfBirth,
            mounthOfBirth,
            yearOfBirth,
            phone,
            addressPrivacy,
            dateOfBirthPrivacy,
            yearOfBirthPrivacy,
            genderPrivacy
        } = this.state
        this.setState({
            isUpdatePreccessing: true
        })
        let param = {
            phone: phone,
            email: email,
            name: fullName,
            gender: gender == "Nam" ? 0 : 1,
            address: address,
            birthday: moment(dateOfBirth + "/" + mounthOfBirth + "/" + yearOfBirth, "DD/MM/YYYY").format()
        }
        let privacys = [
            {
                authorizeinfoid: 1, //Địa chỉ
                levelid: addressPrivacy.code
            },
            {
                authorizeinfoid: 2, //Ngày sinh
                levelid: dateOfBirthPrivacy.code
            },
            {
                authorizeinfoid: 3, //Năm sinh
                levelid: yearOfBirthPrivacy.code
            },
            {
                authorizeinfoid: 4, //Giới tính
                levelid: genderPrivacy.code
            }
        ]
        post(SOCIAL_NET_WORK_API, "User/EditProfile", param, result => {
            if (result.result == 1) {
                this.getProfile()

                post(SOCIAL_NET_WORK_API, "User/SetAuthorizeUser", privacys, result => {
                    this.setState({
                        showUpdateForm: false
                    })
                })

            }
            else {
                showNotification("", result.message, null)
            }
            this.setState({ isUpdatePreccessing: false })
        })
    }

    getProfile() {
        get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
            if (result.result == 1) {
                this.props.setUserProfile(result.content.user)
                this.props.getFolowedMe(0)
                this.props.getMeFolowing(0)
                this.setState({ isUpdatePreccessing: false })
            } else {
                showNotification("", <span className="app-noti-message">{result.message}</span>, null)
            }

        })
    }

    handleClose() {
        if (Object.entries(this.state).toString() != Object.entries(this.state.defaultState).toString()) {
            this.setState({
                showCloseConfim: true
            })
        } else {
            this.setState({
                showUpdateForm: false
            })
        }
    }

    componentDidMount() {
        this._handleSetDefault()
    }

    render() {
        let {
            showUpdateForm,
            gender,
            fullName,
            email,
            address,
            dateOfBirth,
            mounthOfBirth,
            yearOfBirth,
            isUpdatePreccessing,
            anchor,
            showAddressPrivacyList,
            addressPrivacy,
            dateOfBirthPrivacy,
            showDateOfBirthPrivacyList,
            showYearOfBirthPrivacyList,
            yearOfBirthPrivacy,
            genderPrivacy,
            showGenderPrivacyList,
            showGenderSelect
        } = this.state
        let {
            data
        } = this.props
        let PrivaciesOptions = objToArray(Privacies)
        return (
            <div className="content-box">
                <label>
                    <img src={require('../../assets/icon/Arrow@1x.png')} style={{ width: "15px", height: "15px", margin: "0px 4px" }} />
                    <span>Thông tin cá nhân</span>
                </label>
                <ul>
                    <li>
                        <label className="name">{data.fullname}</label>
                    </li>
                    <li>
                        <label>Email: </label>
                        <span>{data.email}</span>
                    </li>
                    <li>
                        <label>Địa chỉ: </label>
                        <span>{data.address}</span>
                    </li>
                    <li>
                        <label>Ngày sinh: </label>
                        <span>{moment(data.birthday).format("DD/MM/YYYY")}</span>
                    </li>
                    <li>
                        <label>Giới tính: </label>
                        <span>{data.gendertext}</span>
                    </li>
                </ul>
                <IconButton onClick={() => this.setState({ showUpdateForm: true }, () => this._handleSetDefault())}>
                    <MoreHorizIcon />
                </IconButton>

                <Drawer anchor="bottom" className="drawer-form" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.handleClose()}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Cập nhật thông tin cá nhân</label>
                    </div>
                    <div className="form-content">
                        <div className='input-field'>
                            <label>Tên <span className="red">(*)</span></label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập tên"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={fullName}
                                onChange={e => this.setState({ fullName: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Email <span className="red">(*)</span></label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập email"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>
                                Địa chỉ
                                < CustomMenu
                                    centerMode={true}
                                    customButton={addressPrivacy ? <img src={addressPrivacy.icon}></img> : ""}
                                >
                                    {
                                        PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showAddressPrivacyList: false, addressPrivacy: privacy })}>
                                            <img src={privacy.icon1} />
                                            <div>
                                                <label>{privacy.label}</label>
                                                <span>{privacy.description}</span>
                                            </div>
                                        </MenuItem>)
                                    }
                                </CustomMenu>
                            </label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập địa chỉ"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={address}
                                onChange={e => this.setState({ address: e.target.value })}
                            />
                        </div>
                        <div className="custom-input-field">
                            <div className='input-field'>
                                <label>
                                    Ngày sinh
                                    < CustomMenu
                                        centerMode={true}
                                        customButton={dateOfBirthPrivacy ? <img src={dateOfBirthPrivacy.icon}></img> : ""}
                                    >
                                        {
                                            PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showDateOfBirthPrivacyList: false, dateOfBirthPrivacy: privacy })}>
                                                <img src={privacy.icon1} />
                                                <div>
                                                    <label>{privacy.label}</label>
                                                    <span>{privacy.description}</span>
                                                </div>
                                            </MenuItem>)
                                        }
                                    </CustomMenu>
                                </label>
                                <div className="date-select pr10">
                                    <FormControl variant="outlined" className={"custom-select"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={dateOfBirth}
                                            onChange={(e) => this.setState({ dateOfBirth: e.target.value })}
                                        >
                                            {
                                                Dates.map((date, index) => <option key={index} value={index + 1}>{date}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl variant="outlined" className={"custom-select ml20"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={mounthOfBirth}
                                            onChange={(e) => this.setState({ mounthOfBirth: e.target.value })}
                                        >
                                            {
                                                Months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                </div>
                            </div>
                            <div className='input-field year-input'>
                                <label>
                                    Năm sinh
                                    < CustomMenu
                                        centerMode={true}
                                        customButton={yearOfBirthPrivacy ? <img src={yearOfBirthPrivacy.icon}></img> : ""}
                                    >
                                        {
                                            PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showYearOfBirthPrivacyList: false, yearOfBirthPrivacy: privacy })}>
                                                <img src={privacy.icon1} />
                                                <div>
                                                    <label>{privacy.label}</label>
                                                    <span>{privacy.description}</span>
                                                </div>
                                            </MenuItem>)
                                        }
                                    </CustomMenu>
                                </label>
                                <div>
                                    <TextField
                                        className="custom-input"
                                        variant="outlined"
                                        placeholder="Nhập năm sinh"
                                        value={yearOfBirth}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        onChange={e => this.setState({ yearOfBirth: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='input-field  mt10'>
                            <label>
                                Giới tính
                                < CustomMenu
                                    centerMode={true}
                                    customButton={genderPrivacy ? <img src={genderPrivacy.icon}></img> : ""}
                                >
                                    {
                                        PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showGenderPrivacyList: false, genderPrivacy: privacy })}>
                                            <img src={privacy.icon1} />
                                            <div>
                                                <label>{privacy.label}</label>
                                                <span>{privacy.description}</span>
                                            </div>
                                        </MenuItem>)
                                    }
                                </CustomMenu>
                            </label>
                            <ClickAwayListener onClickAway={() => this.setState({ showGenderSelect: false })}>
                                <div className="gender-select custom" onClick={() => this.setState({ showGenderSelect: !showGenderSelect })}>
                                    <span className="title" >{gender}</span>
                                    {
                                        showGenderSelect ? <div className="options">
                                            <span className={gender == "Nam" ? "active" : ""} onClick={() => this.setState({ gender: "Nam" })}>Nam</span>
                                            <span className={gender == "Nữ" ? "active" : ""} onClick={() => this.setState({ gender: "Nữ" })}>Nữ</span>
                                        </div> : ""
                                    }
                                </div>
                            </ClickAwayListener>
                        </div>
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.updateProfile()}>CẬP NHẬT</Button>

                        {
                            isUpdatePreccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                        }
                    </div>
                </Drawer>
                {
                    renderCloseForm(this)
                }
            </div >
        )
    }
}


const mapDispatchToProps = dispatch => ({
    setUserProfile: (user) => dispatch(setUserProfile(user)),
    getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
    getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage))
});

export default connect(
    null,
    mapDispatchToProps
)(Index);


const renderCloseForm = (component) => {
    let {
        showCloseConfim,
    } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showCloseConfim} onClose={() => component.setState({ showCloseConfim: false })}>
            <div className='jon-group-confirm'>
                <label>Bạn muốn rời khỏi trang này?</label>
                <p>Những thông tin vừa thay đổi vẫn chưa được lưu.</p>
                <div className="mt20">
                    <Button className="bt-confirm" onClick={() => component.setState({ showCloseConfim: false, showUpdateForm: false })}>Đồng ý</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showCloseConfim: false })}>Quay lại</Button>
                </div>
            </div>
        </Drawer>
    )
}
