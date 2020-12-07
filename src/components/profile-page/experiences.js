import React from 'react';
import { IconButton, Drawer, Button, TextField, FormControl, NativeSelect, Menu, MenuItem } from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon, ControlPoint as ControlPointIcon, PlayArrow as PlayArrowIcon, ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import Job from './job'
import { Months, Years, Privacies } from '../../constants/constants'
import { post, get } from '../../api';
import { setUserProfile, getFolowedMe, getMeFolowing } from '../../actions/user'
import { connect } from "react-redux"
import { Loader } from '../common/loader'
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import { showNotification, objToArray, objToQuery } from '../../utils/common';


export class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddForm: false,
            companyName: "",
            position: "",
            description: "",
            expPrivacy: Privacies.Public,
        };
    }

    handleResetState() {
        this.setState({
            showAddForm: false,
            companyName: "",
            position: "",
            description: "",
            expPrivacy: Privacies.Public,
            isChange: false
        })
    }

    handleCreateExp() {
        let { companyName, position, description, fromMonth, toMonth, fromYear, toYear, expPrivacy } = this.state
        let param = {
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

        if (companyName == '') {
            showNotification("", <span className="app-noti-message">Vui lòng nhập tên công ty.</span>, null)
            return
        }

        this.setState({ isProcessing: true })

        post(SOCIAL_NET_WORK_API, "User/UpdateUserExperience", param, result => {
            this.getProfile()
            this.setState({ showAddForm: false, isProcessing: false })
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
        let { isChange } = this.state
        if (isChange) {
            this.setState({
                showCloseConfim: true
            })
        } else {
            this.setState({
                showAddForm: false
            })
        }
    }

    render() {
        let {
            showAddForm, companyName, position, description, fromMonth,
            toMonth, fromYear, toYear, isProcessing, expPrivacy, showExpPrivacyList, anchor
        } = this.state
        let { data } = this.props

        let PrivaciesOptions = objToArray(Privacies)

        return (
            <div className="content-box">
                <label>
                    <img src={require('../../assets/icon/Arrow@1x.png')} style={{ width: "15px", height: "15px", margin: "0px 4px" }} />
                    <span>Kinh nghiệm làm việc</span>
                </label>
                <div className="add-bt" onClick={() => this.setState({ showAddForm: true })}>
                    <ControlPointIcon />
                    <span>Thêm công việc...</span>
                </div>
                <ul className="job">
                    {
                        data.userExperience.map((item, index) => <Job key={index} item={item} />)
                    }
                </ul>
                <Drawer anchor="bottom" className="drawer-form" open={showAddForm} onClose={() => this.setState({ showAddForm: false })}>
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
                                onChange={e => this.setState({ companyName: e.target.value, isChange: true })}
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
                                onChange={e => this.setState({ position: e.target.value, isChange: true })}
                            />
                        </div>
                        <div className="congraduate-select">
                            <div className='input-field'>
                                <label>Ngày bắt đầu</label>
                                <div>
                                    <FormControl variant="outlined" className={"custom-select ml20 "}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={fromMonth}
                                            onChange={(e) => this.setState({ fromMonth: e.target.value, isChange: true })}
                                        >
                                            {
                                                Months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl variant="outlined" className={"custom-select ml20 "}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={fromYear}
                                            onChange={(e) => this.setState({ fromYear: e.target.value, isChange: true })}
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
                                    <FormControl variant="outlined" className={"custom-select ml20"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={toMonth}
                                            onChange={(e) => this.setState({ toMonth: e.target.value, isChange: true })}
                                        >
                                            {
                                                Months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl variant="outlined" className={"custom-select ml20"}>
                                        <NativeSelect
                                            id="demo-customized-select-native"
                                            value={toYear}
                                            onChange={(e) => this.setState({ toYear: e.target.value, isChange: true })}
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
                                onChange={e => this.setState({ description: e.target.value, isChange: true })}
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
                                id="privacy-menu"
                                className="privacy-menu"
                                anchorEl={anchor}
                                keepMounted
                                open={showExpPrivacyList}
                                onClose={() => this.setState({ showExpPrivacyList: false })}
                            >
                                {
                                    PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showExpPrivacyList: false, expPrivacy: privacy, isChange: true })}>
                                        <img src={privacy.icon1} />
                                        <div>
                                            <label>{privacy.label}</label>
                                            <span>{privacy.description}</span>
                                        </div>
                                    </MenuItem>)
                                }
                            </Menu>
                        </div>
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.handleCreateExp()}>Lưu thông tin</Button>
                    </div>
                    {
                        isProcessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                    }
                </Drawer>
                {
                    renderCloseForm(this)
                }
            </div>
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
                    <Button className="bt-confirm" onClick={() => component.setState({ showCloseConfim: false, showAddForm: false }, () => component.handleResetState())}>Đồng ý</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showCloseConfim: false })}>Quay lại</Button>
                </div>
            </div>
        </Drawer>
    )
}




