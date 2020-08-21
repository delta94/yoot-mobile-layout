import React from "react";
import DatePicker from "react-datepicker";
import "./style.scss";
import $ from "jquery";
import { validateAsync } from "../../../utils/validators";
import moment from "moment"
import { DATE_FORMAT, DATE_FORMAT_INPUT } from "../../../constants/appSettings";
import { isString } from "util";
import { formatDate, getDate } from '../../../utils/common'
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labelWidth: "0px",
      startDate: new Date()
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
    this.props.onChange && this.props.onChange(date);
  }

  render() {
    let { type } = this.props;

    var input = null;
    if (type === "date-time") input = this._renderDatetime();
    else input = this._renderInput();

    return (
      <div
        className={
          "custom-input " + (this.props.className ? this.props.className : "")
        }
      >
        {input}

      </div>
    );
  }

  _renderInput = () => {
    let { labelWidth } = this.state;
    let {
      name,
      displayName,
      type,
      placeholder,
      value,
      tabIndex,
      fontSize,
      autoFocus,
      multiline,
      edit,
      disable,
      minHeight,
      outLine,
      height,
      errors,
      className,
      linkTarget
    } = this.props;

    value = value ? value : "";

    return (
      <div
        className={edit ? ("edit" + (outLine ? " outline" : "")) : "view"}
        id={this.props.id ? this.props.id : ""}
        style={{ width: "calc(100% - " + labelWidth + ")" }}
      >
        {
          this.props.edit ? (
            !multiline ? (
              <input
                id={name}
                type={type}
                placeholder={placeholder ? placeholder : ""}
                value={value}
                tabIndex={tabIndex}
                onChange={e => this.props.onChange(e)}
                onBlur={() => this._onBlur(name)}
                style={{ fontSize: fontSize, height: height }}
                autoFocus={autoFocus}
                disabled={disable}
              />
            ) : (
                <textarea
                  id={name}
                  placeholder={placeholder ? placeholder : ""}
                  value={value}
                  tabIndex={tabIndex}
                  onChange={e => this.props.onChange(e)}
                  onBlur={() => this._onBlur(name)}
                  autoFocus={autoFocus}
                  disabled={disable}
                  style={{
                    minHeight: minHeight ? minHeight : "100px",
                    fontSize: fontSize,
                  }}
                />
              )

          ) : (
              type == "link" ? <a href={value} target={linkTarget ? linkTarget : ""}>{value}</a>
                : <pre className="value-not-edit" style={{ fontSize }}>{value}</pre>
            )}
        {
          this.props.edit && <div
            id={"validator-for-" + name + "-container"}
            className={"text-danger"}
          >
            <pre id={"validator-for-" + name} />
            <a id={"validator-name-" + name} hidden>
              {displayName}
            </a>
          </div>
        }
        {
          errors && (
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
      </div>
    );
  };

  _renderDatetime = () => {
    let { labelWidth } = this.state;
    let { placeholder, value, edit, name } = this.props;

    value = value ? value : getDate();
    if (isString(value))
      value = moment(value, DATE_FORMAT).toDate()
    if (!moment(value).isValid())
      value = getDate();

    return (
      edit ? <div
        className={edit ? "edit" : "view"}
        id={this.props.id ? this.props.id : ""}
        style={{ width: "calc(100% - " + labelWidth + ")" }}
        // id={name}
        name={name}
      >
        <DatePicker
          selected={value}
          onChange={value => this._handleDateChange(value)}
          dateFormat={DATE_FORMAT_INPUT}
          todayButton={"Hôm nay"}
          placeholderText={placeholder}
          width={"100%"}
        />
      </div> : <span>{formatDate(value)}</span>
    );
  };
}
export default Index;
