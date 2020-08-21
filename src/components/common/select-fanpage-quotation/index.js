import React from "react";
import Select from 'react-select';
import "./style.scss";
import { get } from "../../../api";
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            labelWidth: "0px",
            isError: false,
            data: [],
            localValue: null,
            isLoading: false,
            existedQuotations: [],
            listQuotations: [],
            availableQuotations: []
        }
    }

    _onValueChange(value) {
        if (this.props.onChange) this.props.onChange(value)
        this.setState({
            localValue: value
        })
    }

    _getExistedQuotationsList() {
        const { id } = this.state
        let listFanpageQuotations = []
        if (!id) return;
        get("fanpages/" + id + "/quotations", (result) => {
            result.items.map((item) => {
                listFanpageQuotations.push(item.quotationId)
            })
            this.setState({
                existedFanpages: [...listFanpageQuotations]
            })
        }, null, true)

    }
    _getQuotationsList() {
        get("options/PriceQuotation/select-list", result => {
            this.setState({
                listQuotations: [...result]
            })
        }, null, true)

    }
    _filterAvailableQuotations = (QuotationsList, ExistedQuotationsList) => {
        let listQuotations = [...QuotationsList]
        let existedQuotations = [...ExistedQuotationsList]
        return listQuotations.filter((item => existedQuotations.indexOf(item.id) === -1))
    }
    listAvailableQuotations = (availableQuotations) => {
        let listAvailableQuotations = []
        availableQuotations.map(i => {
            var item = {
                label: i.name,
                value: i.id
            }
            listAvailableQuotations.push(item)
        })
        return listAvailableQuotations
    }
    componentDidMount() {
        let { id } = this.props
        if (!id) return
        this.setState({
            id: id
        },
            () => {
                this._getQuotationsList()
                this._getExistedQuotationsList()
            }
        )
    }

    componentWillReceiveProps(props) {
        let { id } = props
        if (!id) return;
        this.setState({
            id: id
        },
            () => {
                this._getQuotationsList()
                this._getExistedQuotationsList()
            }
        )
    }

    render() {
        let {
            labelWidth,
            localValue,
            isLoading
        } = this.state
        let {
            listQuotations,
            existedQuotations
        } = this.state
        let {
            name,
            label,
            allowNull,
            errors,
            className,
            displayName
        } = this.props
        let availableQuotations = this.listAvailableQuotations(this._filterAvailableQuotations(listQuotations, existedQuotations))
        return (
            <div className={"custom-select " + (this.props.className ? this.props.className : "")}>
                <div
                    className={(this.props.edit ? "edit" : "")}
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
                                className="select-coin"
                                options={availableQuotations}
                                value={localValue}
                                onChange={(value) => this._onValueChange(value)}
                                isSearchable={true}
                                isLoading={isLoading}
                                placeholder={"Chọn loại báo gía"}
                                allowNull={allowNull}
                                isClearable={true}
                            />
                            : <span>
                                {
                                    localValue ? localValue.label : ""
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
