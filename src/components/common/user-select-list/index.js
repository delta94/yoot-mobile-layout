import React from "react";
import Select from 'react-select';
import "./style.scss";
import { get } from "../../../api";
import { components } from 'react-select';
import { BASE_API } from '../../../constants/appSettings'
import { Avatar, CardHeader } from "@material-ui/core";
import { DefaultUserAvatar } from '../../../constants/constants'

const Option = (props) => {
    return (
        props.data.id ? <div>
            <components.Option {...props} >
                <div className="custom-option">
                    <CardHeader
                        avatar={
                            <Avatar src={props.data.avatar ? (BASE_API + props.data.avatar) : DefaultUserAvatar}>

                            </Avatar>
                        }
                        title={props.data.fullName ? props.data.fullName : ""}
                        subheader={props.data.email ? (props.data.email + " | " + (props.data.roleName ? props.data.roleName : "")) : ""}
                    />
                </div>
            </components.Option>
        </div> : <div>
                null
        </div>
    );
};
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            labelWidth: "0px",
            isError: false,
            data: [],
            localValue: null,
            isLoading: false
        }
    }

    _onValueChange(value) {
        this.props.onChange(value)
        this.setState({
            localValue: value
        })

    }

    _getList() {
        this.setState({
            isLoading: true,
            localValue: null
        }, () => {
            get("users/select-list", result => {
                let { allowNull, value, defaultValue, filter } = this.props

                if (allowNull)
                    result.unshift({ name: "None", id: null })

                if (defaultValue && defaultValue.id) {
                    result = result.filter(e => e.id !== defaultValue.id)
                }

                result.forEach(item => {
                    item.value = item.id;
                    item.label = item.fullName;
                    if (item.value === value)
                        this.setState({
                            localValue: item
                        })
                })
                if (filter) result = filter(result)
                this.setState({
                    data: result,
                    isLoading: false
                })
            }, () => {
                this.setState({
                    isLoading: false
                })
            }, true)
        })
    }

    componentDidMount() {
        let { defaultValue, edit } = this.props
        if (defaultValue)
            this.setState({
                localValue: defaultValue
            })
        if (edit) this._getList()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value || this.props.edit !== nextProps.edit)
            this._getList()

    }

    render() {
        let {
            labelWidth,
            data,
            localValue,
            isLoading
        } = this.state

        let {
            name,
            value,
            label,
            allowNull,
            edit,
            className,
            displayName,
            errors,
            outLine,
            isHideUserSelected,
            style
        } = this.props

        if (!value)
            value = localValue;
        return (
            <div className={"custom-user-select "
                + (this.props.className ? this.props.className : "")
                + (localValue ? " unlimit-height" : "")
                + (this.props.edit ? "" : " view")
            }>
                <div
                    className={(this.props.edit ? ("edit" + (outLine ? " outline" : "")) : "input")}
                    id={(this.props.id) ? this.props.id : ""}
                    style={{ ...style, width: "calc(100% - " + labelWidth + ")" }}
                    name={name}
                >
                    {
                        label ? <label>
                            {
                                label
                            }
                        </label> : ""
                    }
                    {
                        edit ?
                            <Select
                                components={{ Option }}
                                defaultValue={data[0]}
                                options={data}
                                onChange={(value) => this._onValueChange(value)}
                                value={localValue}
                                isClearable={true}
                                placeholder="Chọn nhân viên"
                                isLoading={isLoading}
                            />
                            : ""
                    }
                </div>
                {
                    !allowNull && errors && (
                        <div
                            id={"validator-for-" + (className ? className : "") + "-container"}
                            className={"text-danger show " + (className ? className : "")}
                        >
                            <pre id={"validator-for-"}>{errors}</pre>
                            <a href id={"validator-name-" + className} hidden>
                                {displayName}
                            </a>
                        </div>
                    )
                }

                {
                    localValue && !isHideUserSelected && <div className={"user-selected" + (edit ? "" : " border-none")}>
                        <CardHeader
                            avatar={
                                <Avatar src={localValue.avatar ? (BASE_API + localValue.avatar) : DefaultUserAvatar} style={{ width: "40px", height: "40px" }}>

                                </Avatar>
                            }
                            title={localValue.fullName ? localValue.fullName : ""}
                            subheader={localValue.email ? (localValue.email + " | " + (localValue.roleName ? localValue.roleName : "")) : ""}
                        />
                    </div>
                }
                {
                    !isHideUserSelected && isLoading ? <div className='lazy-load '>
                        <div className="avatar loading"></div>
                        <div className="lazy-info">
                            <div className="lazy-head loading"></div>
                            <div className="lazy-bottom loading"></div>
                        </div>
                    </div> : ""
                }
            </div>
        );
    }
}
export default Index;
