import React from "react";
import Select from 'react-select';
import "./style.scss";
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            labelWidth: "0px"
        }
    }

    _onValueChange(value) {
        this.props.onChange(value)
    }

    componentDidMount() {
        if (!this.props.allowNull) {
            if (!this.props.value)
                this.props.onChange(this.props.options[0])
            else
                this.props.onChange(this.props.value)
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.value != this.props.value)
            if (!nextProps.allowNull) {
                if (!nextProps.value)
                    nextProps.onChange(nextProps.options[0])
                else
                    nextProps.onChange(nextProps.value)
            }
    }

    render() {
        let {
            labelWidth
        } = this.state

        let {
            name,
            options,
            value,
            label,
            allowNull,
            errors,
            className,
            displayName,
            outLine,
            isMulti,
            placeholder
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
                                options={options}
                                value={value}
                                onChange={(value) => this._onValueChange(value)}
                                placeholder={placeholder ? placeholder : "Chọn tuỳ chọn"}
                                isClearable={allowNull ? true : false}
                                allowNull={allowNull}
                                isMulti={isMulti}
                            />
                            : <span
                            >
                                {
                                    value ? value.label : ""
                                }
                            </span>
                    }
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
            </div>

        );
    }
}
export default Index;
