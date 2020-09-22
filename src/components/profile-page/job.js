
import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    TextField,
    Button,
    FormControl,
    NativeSelect
} from '@material-ui/core'
import {
    MoreHoriz as MoreHorizIcon,
    ChevronLeft as ChevronLeftIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import { Months, Years, Privacies } from '../../constants/constants'
import { post, get } from '../../api';
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import { showNotification, objToArray, objToQuery } from '../../utils/common';
import { connect } from 'react-redux'
import Loader from '../common/loader'

const job = require('../../assets/icon/job@1x.png')


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLocalMenu: false,
            anchor: null,
            showUpdateForm: false,
            companyName: "",
            position: "",
            description: "",
            expPrivacy: Privacies.Public
        };
    }

    handleSetDefault() {
        let { item } = this.props
        if (!item) return

        let PrivaciesOptions = objToArray(Privacies)

        let existPrivacy = PrivaciesOptions.find(privacy => privacy.code == item.levelauthorizeid)

        this.setState({
            companyName: item.companyname,
            position: item.title,
            description: item.description,
            fromMonth: item.frommonth,
            toMonth: item.tomonth,
            fromYear: item.fromyear,
            toYear: item.toyear,
            expPrivacy: existPrivacy ? existPrivacy : Privacies.Public
        }, () => this.setState({
            defaultState: this.state
        }))
    }

    handleUpdate() {
        let {
            item
        } = this.props
        let {
            companyName,
            position,
            description,
            fromMonth,
            toMonth,
            fromYear,
            toYear,
            expPrivacy
        } = this.state
        if (!item) return
        let param = {
            id: item.id,
            userid: 0,
            salary: "0",
            companyname: companyName,
            title: position,
            description: description,
            frommonth: fromMonth,
            tomonth: toMonth,
            fromyear: fromYear,
            toyear: toYear,
            levelauthorizeid: expPrivacy.code
        }
        this.setState({ isProcessing: true })

        post(SOCIAL_NET_WORK_API, "User/UpdateUserExperience", param, result => {
            this.getProfile()
            this.setState({ showUpdateForm: false, isProcessing: false })
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

    handleDeleteExp() {
        let {
            item
        } = this.props
        if (!item) return
        let param = {
            userExperienceId: item.id
        }
        this.setState({
            isProcessing: true
        })
        get(SOCIAL_NET_WORK_API, "User/DeleteUserExperience" + objToQuery(param), () => {
            this.getProfile()
            this.setState({
                isProcessing: false,
                showDeleteExpConfirm: false
            })
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
        this.handleSetDefault()
    }

    render() {
        let {
            showLocalMenu,
            anchor,
            showUpdateForm,
            companyName,
            position,
            description,
            fromMonth,
            toMonth,
            fromYear,
            toYear,
            isProcessing,
            expPrivacy,
            showExpPrivacyList,
        } = this.state
        let {
            item
        } = this.props

        let PrivaciesOptions = objToArray(Privacies)
        return (
            <li className="job">
                <img src={job} />
                <div>
                    <label className="name">{item.companyname}</label>
                    <span>{item.fromyear} - {item.toyear}</span>
                    <label>Chức vụ: <span>{item.title}</span></label>
                    <label>Mô tả công việc:</label>
                    <span>{item.description}</span>
                </div>
                <IconButton onClick={(e) => this.setState({ showLocalMenu: true, anchor: e.target })}>
                    <MoreHorizIcon />
                </IconButton>
                <Menu
                    className="custom-menu"
                    anchorEl={anchor}
                    keepMounted
                    open={showLocalMenu}
                    onClose={() => this.setState({ showLocalMenu: false })}
                >
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateForm: true }, () => this.handleSetDefault())}>Chỉnh sửa</MenuItem>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showDeleteExpConfirm: true })}>Xoá</MenuItem>
                </Menu>

                <Drawer anchor="bottom" className="drawer-form" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.handleClose()}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Kinh nghiệm làm việc</label>
                    </div>
                    <div className="form-content">
                        <label>Thêm kinh nghiệm làm việc của bạn</label>
                        <p>Vui lòng cung cấp cho chúng tôi những thông tin về công việc hiện tại hoặc trước đây của bạn.</p>
                        <div className='input-field'>
                            <label>Công ty của bạn</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập tên công ty"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={companyName}
                                onChange={e => this.setState({ companyName: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Chức danh / Vị trí công việc của bạn</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập chức danh (không bắt buộc)"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={position}
                                onChange={e => this.setState({ position: e.target.value })}
                            />
                        </div>
                        <div className="congraduate-select">
                            <div className='input-field'>
                                <label>Ngày bắt đầu</label>
                                <div>
                                    <FormControl variant="outlined" className={"custom-select ml15"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={fromMonth}
                                            onChange={(e) => this.setState({ fromMonth: e.target.value })}
                                        >
                                            {
                                                Months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl variant="outlined" className={"custom-select ml15"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={fromYear}
                                            onChange={(e) => this.setState({ fromYear: e.target.value })}
                                        >
                                            {
                                                Years.map((year, index) => <option key={index} value={year}>{year}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                </div>
                            </div>
                            <div className='input-field'>
                                <label>Ngày kết thúc</label>
                                <div>
                                    <FormControl variant="outlined" className={"custom-select ml15"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={toMonth}
                                            onChange={(e) => this.setState({ toMonth: e.target.value })}
                                        >
                                            {
                                                Months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl variant="outlined" className={"custom-select ml15"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={toYear}
                                            onChange={(e) => this.setState({ toYear: e.target.value })}
                                        >
                                            {
                                                Years.map((year, index) => <option key={index} value={year}>{year}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <div className='input-field'>
                            <label>Mô tả công việc</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Mô tả công việc (không bắt buộc)"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                }}
                                multiline
                                value={description}
                                onChange={e => this.setState({ description: e.target.value })}
                            />
                        </div>
                        <div className="privacy-select">
                            <IconButton onClick={(e) => this.setState({ showExpPrivacyList: true, anchor: e.target })}>
                                {
                                    expPrivacy ? <img src={expPrivacy.icon}></img> : ""
                                }
                                {
                                    expPrivacy.label
                                }
                                <ExpandMoreIcon />
                            </IconButton>
                            <Menu
                                className="privacy-menu"
                                anchorEl={anchor}
                                keepMounted
                                open={showExpPrivacyList}
                                onClose={() => this.setState({ showExpPrivacyList: false })}
                            >
                                {
                                    PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showExpPrivacyList: false, expPrivacy: privacy })}>
                                        <img src={privacy.icon1} />
                                        <div>
                                            <label>{privacy.label}</label>
                                            <span>{privacy.description}</span>
                                        </div>
                                    </MenuItem>)
                                }
                            </Menu>
                        </div>
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.handleUpdate()}>Lưu thông tin</Button>
                    </div>
                    {
                        isProcessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                    }
                </Drawer>

                {
                    renderDeleteExpConfirm(this)
                }
                {
                    renderCloseForm(this)
                }
            </li>

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

const renderDeleteExpConfirm = (component) => {
    let {
        showDeleteExpConfirm,
        isProcessing,
    } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showDeleteExpConfirm} onClose={() => component.setState({ showDeleteExpConfirm: false })}>
            <div className='jon-group-confirm'>
                <label>Xoá thông tin kinh nghiệm làm việc.</label>
                <p>Bạn có chắc chắn muốn xoá thông tin này không?</p>
                <div className="mt20">
                    <Button className="bt-cancel" onClick={() => component.setState({ showDeleteExpConfirm: false })}>Huỷ</Button>
                    <Button className="bt-submit" onClick={() => component.handleDeleteExp()}>Xoá</Button>
                </div>
            </div>
            {
                isProcessing ? <Loader type="dask-mode small" isFullScreen={false} /> : ""
            }
        </Drawer>
    )
}


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
                    <Button className="bt-confirm" onClick={() => component.setState({ showCloseConfim: false, showUpdateForm: false })}>Đồng ý rời khỏi</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showCloseConfim: false })}>Quay lại thay đổi</Button>
                </div>
            </div>
        </Drawer>
    )
}

