
import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    TextField,
    Button
} from '@material-ui/core'
import {
    MoreHoriz as MoreHorizIcon,
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'

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
            description: ""
        };
    }

    handleSetDefault() {
        let { item } = this.props
        if (!item) return
        this.setState({
            companyName: item.company,
            position: item.position,
            description: item.description
        })
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
            description
        } = this.state
        let {
            item
        } = this.props
        return (
            <li className="job">
                <img src={job} />
                <div>
                    <label className="name">{item.company}</label>
                    <span>{item.start} - {item.end}</span>
                    <label>Chức vụ: <span>{item.position}</span></label>
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
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateForm: true })}>Chỉnh sửa</MenuItem>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Xoá</MenuItem>
                </Menu>

                <Drawer anchor="bottom" className="drawer-form" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showUpdateForm: false })}>
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
                        <div className='input-field'>
                            <label>Mô tả công việc</label>
                            <TextField
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
                        <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
                    </div>
                </Drawer>
            </li>

        )
    }
}
export default Index