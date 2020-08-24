import React from 'react';
import {
    IconButton,
    Drawer,
    TextField,
    Button
} from '@material-ui/core'
import {
    MoreHoriz as MoreHorizIcon,
    PlayArrow as PlayArrowIcon,
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import moment from 'moment'

export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showUpdateForm: false,
            gender: null,
            email: "",
            address: "",
            fullName: ""
        };
    }

    _handleSetDefault() {
        let { data } = this.props
        if (!data) return
        this.setState({
            fullName: data.fullName,
            email: data.email,
            address: data.address,
            gender: data.gender
        })
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
        } = this.state
        let {
            data
        } = this.props
        return (
            <div className="content-box">
                <label>
                    <PlayArrowIcon />
                    <span>Thông tin cá nhân</span>
                </label>
                <ul>
                    <li>
                        <label className="name">{data.fullName}</label>
                    </li>
                    <li>
                        <label>Email: </label>
                        <span>{data.email}</span>
                    </li>
                    <li>
                        <label>Ngày sinh: </label>
                        <span>{moment(data.birthday).format("DD/MM/YYYY")}</span>
                    </li>
                    <li>
                        <label>Giới tính: </label>
                        <span>{data.gender}</span>
                    </li>
                </ul>
                <IconButton onClick={() => this.setState({ showUpdateForm: true })}>
                    <MoreHorizIcon />
                </IconButton>

                <Drawer anchor="bottom" className="drawer-form" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showUpdateForm: false })}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Cập nhật thông tin cá nhân</label>
                    </div>
                    <div className="form-content">
                        <div className='input-field'>
                            <label>Tên <span className="red">(*)</span></label>
                            <TextField
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
                            <label>Địa chỉ</label>
                            <TextField
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
                        <div className='input-field'>
                            <label>Giới tính </label>
                            <div className="gender-select">
                                <span className="title">Giới tính</span>
                                <div className="options">
                                    <span className={gender == "Nam" ? "active" : ""} onClick={() => this.setState({ gender: "Nam" })}>Nam</span>
                                    <span className={gender == "Nữ" ? "active" : ""} onClick={() => this.setState({ gender: "Nữ" })}>Nữ</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}
export default Index
