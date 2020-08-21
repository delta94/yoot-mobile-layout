import React from "react";
import DatePicker from "react-datepicker";
import $ from "jquery";
import { validateAsync } from "../../../utils/validators";
import { DATE_FORMAT_INPUT, DATETIME_FORMAT_INPUT } from "../../../constants/appSettings";
import { getDate } from '../../../utils/common'
import moment from "moment";
import './style.scss'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labelWidth: "0px",
        };
    }


    componentDidMount() {
        this.setState({
            labelWidth:
                this.props.labelPosition === "top-left" ||
                    this.props.labelPosition === "top-right"
                    ? "0px"
                    : $(this.refs.acb).width() + 20 + "px"
        });
    }

    _onBlur = async name => {
        const { onBlur } = this.props
        if (onBlur) onBlur()

        let { validations } = this.props;
        await validateAsync(name, validations);
    };

    _handleDateChange(date) {
        if (!this.props.onChange)
            return

        if (moment(date).toISOString())
            date = moment(date).toISOString(true).replace(".000Z", ".0000000");

        this.props.onChange(date);
    }

    render() {



        let { labelWidth } = this.state;
        let { maxDate, inline, placeholder, value, edit, name, type, className, errors, displayName, border, minDate, isClearable } = this.props;

        // if (!value) {
        //     value = getDate()
        // }

        const format = type === "date-time" ? DATETIME_FORMAT_INPUT : DATE_FORMAT_INPUT;

        var date = moment(value);
        if (date.isValid()) {
            value = date.toDate();
        }

        const isNull = !value ? true : false


        return (
            edit ? <div
                className={(edit ? "edit" : "view")
                    + " custom-date-time-picker"
                    + (border == false ? " border-none" : "")
                    + (inline == true ? " inline" : "")
                }
                id={this.props.id ? this.props.id : ""}
                style={{ width: "calc(100% - " + labelWidth + ")" }}
                // id={name}
                name={name}
            >
                <DatePicker
                    selected={value}
                    onChange={value => this._handleDateChange(value)}
                    dateFormat={format}
                    todayButton={"Hôm nay"}
                    placeholderText={placeholder ? placeholder : "DD/MM/YYYY"}
                    width={"100%"}
                    className={"custom-date-time-picker" + (isNull ? " disable" : "")}
                    minDate={minDate}
                    isClearable={isClearable}
                    inline={inline}
                    maxDate={maxDate}
                    minDate={minDate}
                />
                {errors && (
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
            </div> :
                <span className={"custom-date-time-picker view" + (isNull ? " disable" : "")}>{value ? moment(value).format("DD/MM/YYYY") : "-/-"}</span>
        );
    };
}
export default Index;
