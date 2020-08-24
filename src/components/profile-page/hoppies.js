import React from 'react';
import {
    IconButton,
    Drawer,
    Button,
    Menu,
    MenuItem,
    TextField
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    PlayArrow as PlayArrowIcon,
    MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons'

export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            showLocalMenu: false,
            showUpdateForm: false,
            hoppies: "",
            otherSkill: "",
            skillList: [
                {
                    value: 1,
                    label: "Lãnh đạo"
                },
                {
                    value: 2,
                    label: "Quản lý thời gian"
                },
                {
                    value: 3,
                    label: "Quản lý dự án"
                },
                {
                    value: 4,
                    label: "Ra quyết định"
                },
                {
                    value: 5,
                    label: "Làm việc nhóm"
                },
                {
                    value: 6,
                    label: "Quản lý stress"
                },
                {
                    value: 7,
                    label: "Giải quyết vấn đề"
                },
                {
                    value: 8,
                    label: "Quản lý sáng tạo"
                },
                {
                    value: 9,
                    label: "Học hiệu quả"
                },
                {
                    value: 10,
                    label: "Quản lý chiến lược"
                }
            ]
        };
    }

    componentDidMount() {
    }

    handleSelect(skill) {
        let {
            skillList
        } = this.state
        skillList.map(item => {
            if (item.value == skill.value)
                item.isChecked = item.isChecked ? !item.isChecked : true
        })
        this.setState({
            skillList
        })
    }

    render() {
        let {
            anchor,
            showLocalMenu,
            showUpdateForm,
            skillList,
            hoppies,
            otherSkill
        } = this.state
        let {
            data
        } = this.props
        return (
            <div className="content-box">
                <label>
                    <PlayArrowIcon />
                    <span>Kỹ năng sở trường</span>
                </label>
                <ul>
                    <li>
                        <label>Kỹ năng</label>
                        {
                            data.skills ? <ul className="skills">
                                {
                                    data.skills.map((item, index) => <li key={index} className="skill"><span>
                                        {
                                            item
                                        }
                                    </span></li>)
                                }

                            </ul> : ""
                        }
                    </li>
                    <li>
                        <label>Sở thích</label>
                        {
                            data.hopies ? <span>{data.hopies}</span> : ""
                        }
                    </li>
                    <li>
                        <label>Kỹ năng đặc biệt / tài lẻ</label>
                        {
                            data.orderSkills ? <span>{data.orderSkills}</span> : ""
                        }
                    </li>
                </ul>
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
                <Drawer anchor="bottom" className="drawer-form update-skill" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showUpdateForm: false })}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Kỹ năng và sở trường</label>
                    </div>
                    <div className="form-content">
                        <div>
                            <label>Thêm thông tin về bạn</label>
                            <p>Hãy cho chúng tối biết sở thích, sở trường của bạn và những kỹ năng bạn tự tin nhất.</p>
                        </div>
                        <div className="skill">
                            <label>Kỹ năng</label>
                            <ul>
                                {
                                    skillList.map((item, index) => <li key={index} className={item.isChecked ? "active" : ""}>
                                        <Button onClick={() => this.handleSelect(item)}>{item.label}</Button>
                                    </li>)
                                }
                            </ul>
                        </div>
                        <div className="skill">
                            <label>Sở thích</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập sở thích của bạn"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                                multiline
                                value={hoppies}
                                onChange={e => this.setState({ hoppies: e.target.value })}
                            />
                        </div>
                        <div className="skill" style={{ border: "none" }}>
                            <label>Kỹ năng đặc biệt / Tài lẻ</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập thông tin"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                                multiline
                                value={otherSkill}
                                onChange={e => this.setState({ otherSkill: e.target.value })}
                            />
                        </div>
                        <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}
export default Index




