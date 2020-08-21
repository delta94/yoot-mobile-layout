import React from "react";
import Select from 'react-select';
import "./style.scss";
import { get } from "../../../api";
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
        let {
            isMulti
        } = this.props
        this.setState({
            localValue: value
        }, () => {
            if (this.props.onChange) {
                if (isMulti == true && value && value.length > 0) {
                    let output = []
                    value.map(item => output.push(item.id))
                    this.props.onChange({ value: output })
                } else {
                    this.props.onChange(value)
                }
            }
        })
    }

    _getList() {
        const { optionType } = this.props
        if (!optionType)
            return;

        this.setState({
            isLoading: true
        }, () => {
            get("options/" + optionType + "/select-list", result => {
                const { value, allowNull, isMulti } = this.props
                this.setState({
                    data: result,
                    isLoading: false
                })

                if (!allowNull && value === null) {
                    result[0].value = result[0].id
                    result[0].label = result[0].name
                    this._onValueChange(result[0])
                    this.setState({
                        localValue: result[0]
                    })
                }

                if (isMulti == true && value && value.length > 0) {
                    let array = []
                    result.forEach(item => {
                        item.label = item.name
                        item.value = item.id
                        if (value.includes(item.id)) {
                            array.push(item)
                        }
                    })
                    if (array.length > 0) {
                        this._onValueChange(array)
                        this.setState({
                            localValue: array
                        })
                    }
                }
                else {
                    result.forEach(item => {
                        item.label = item.name
                        item.value = item.id
                        if (value === item.value) {
                            this._onValueChange(item)
                            this.setState({
                                localValue: item
                            })
                        }
                    });
                }


            }, null, true)
        })
    }

    componentWillMount() {
        this._getList()
    }

    componentDidMount() {
        this._getList();
    }


    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) != JSON.stringify(this.props.value))
            this._getList()
    }

    render() {
        let {
            labelWidth,
            data,
            localValue
        } = this.state

        let {
            name,
            label,
            allowNull,
            errors,
            className,
            displayName,
            outLine,
            isMulti
        } = this.props

        return (
            <div className={"custom-select " + (this.props.className ? this.props.className : "") + (this.props.edit ? "" : " view")}>
                <div
                    className={(this.props.edit ? ("edit" + (outLine ? " outline" : "")) : "")}
                    id={(this.props.id) ? this.props.id : ""}
                    style={{ width: "calc(100% - " + labelWidth + ")" }}
                    // id={name}
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
                        this.props.edit ?
                            <Select
                                className="select"
                                options={data}
                                value={localValue}
                                onChange={(value) => this._onValueChange(value)}
                                isSearchable={true}
                                placeholder={"Chọn tuỳ chọn"}
                                allowNull={allowNull}
                                isClearable={allowNull ? true : false}
                                isMulti={isMulti}
                                onBlur={() => this._onValueChange(localValue)}
                            />
                            : <span>
                                {
                                    localValue ? (isMulti ? (localValue.map(item => { return item.label + ", " })) : localValue.label) : ""
                                }
                            </span>
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
                    )}
            </div>

        );
    }
}
export default Index;
