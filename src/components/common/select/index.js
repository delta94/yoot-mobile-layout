import React from "react";
import "./style.scss";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Check as CheckIcon,
    HighlightOff as HighlightOffIcon
} from '@material-ui/icons'
import {
    Drawer, Button, TextField,
    InputAdornment
} from '@material-ui/core'
import {
    cleanAccents
} from '../../../utils/app'
const search = require('../../../assets/images/find.png')
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
            currentValue: null
        }
    }

    handleSelect(item) {
        let { onSelected, haveConfirm } = this.props
        if (haveConfirm && item != null) {
            this.setState({
                currentValue: item
            })
        } else {
            if (onSelected) onSelected(item)
            this.setState({
                showOptions: false,
                search: ''
            })
        }
    }
    handleConfirm() {
        let { onSelected } = this.props
        if (onSelected) {
            let {
                currentValue
            } = this.state
            onSelected(currentValue)
        }
        this.setState({
            showOptions: false,
            search: ''
        })
    }

    render() {
        let {
            showOptions,
            currentValue,
            searchKey
        } = this.state
        let {
            options,
            value,
            placeholder,
            height,
            title,
            clearable,
            style,
            haveConfirm,
            optionStyle,
            searchable
        } = this.props
        if (searchable && searchKey != '' && searchKey && options && options.length > 0)
            options = options.filter(item => cleanAccents(item.label.toLowerCase()).indexOf(cleanAccents(searchKey.toLowerCase())) >= 0)

        return (
            <div className="mobile-custom-select" style={style}>
                <div className="display-value" >
                    {
                        value ? <span style={{ width: clearable ? "calc(100% - 70px)" : "calc(100% - 40px)" }} onClick={() => this.setState({ showOptions: true })}>{value.label}</span> : <span style={{ opacity: 0.4, width: clearable ? "calc(100% - 70px)" : "calc(100% - 40px)" }} onClick={() => this.setState({ showOptions: true })}>{placeholder}</span>
                    }
                    <KeyboardArrowDownIcon style={{ opacity: 0.6 }} onClick={() => this.setState({ showOptions: true })} />
                    {
                        clearable && value ? <HighlightOffIcon style={{ opacity: 0.4, position: "absolute", right: "60px", width: "20px", height: "20px" }} onClick={() => this.handleSelect(null)} /> : ""
                    }
                </div>
                <Drawer anchor="bottom" className="mobile-custom-select-modal" open={showOptions} onClose={() => this.setState({ showOptions: false })}>
                    <div className="modal-header">
                        <label>{title ? title : ""}</label>
                        {
                            searchable ? <TextField
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                style={{
                                    width: "calc(100% - 20px)",
                                    marginLeft: "10px",
                                }}
                                value={searchKey}
                                onChange={e => this.setState({ searchKey: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src={search} />
                                        </InputAdornment>
                                    ),
                                }}
                            /> : ""
                        }
                    </div>
                    <div className="select-list" style={{ height: height ? height : "unset" }}>
                        <ul>
                            {
                                options ? options.map((item, index) => <li key={index} onClick={() => this.handleSelect(item)} style={optionStyle}>
                                    <span>{item.label ? item.label : ""}</span>
                                    {
                                        (value && value.value == item.value) || (currentValue && currentValue.value == item.value) ? <div className="check-icon">
                                            <CheckIcon style={{ color: "royalblue", width: "20px" }} />
                                        </div> : ""
                                    }
                                </li>) : ""
                            }
                        </ul>
                    </div>
                    <div className="action">
                        <Button onClick={() => this.setState({ showOptions: false })}>Đóng</Button>
                        {
                            haveConfirm ? <Button onClick={() => this.handleConfirm()}>Xác nhận</Button> : ""
                        }
                    </div>
                </Drawer>
            </div>

        );
    }
}
export default Index;
