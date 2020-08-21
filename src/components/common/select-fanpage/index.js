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
            existedFanpages: [],
            listFanpages: [],
            availableFanpages: []
        }
    }

    _onValueChange(value) {
        if (this.props.onChange) this.props.onChange(value)
        this.setState({
            localValue: value
        })
    }

    _getExistedFanpagesList() {
        const { id } = this.state
        let listCampaignFanpages = []
        if (!id) return;
        get("campaigns/" + id + "/fanpages", (result) => {
            result.items.map((item) => {
                listCampaignFanpages.push(item.fanpageId)
            })
            this.setState({
                existedFanpages: [...listCampaignFanpages]
            })
        }, null, true)

    }
    _getFanpageList() {
        get("fanpages", result => {
            this.setState({
                listFanpages: [...result.items]
            })
        }, null, true)

    }
    _filterAvailableFanpages = (FanpageList, ExistedFanpagesList) => {
        let listFanpages = [...FanpageList]
        let existedFanpages = [...ExistedFanpagesList]
        return listFanpages.filter((item => existedFanpages.indexOf(item.id) === -1))
    }
    listAvailableFanpages = (availableFanpages) => {
        let listAvailableFanpages = []
        availableFanpages.map(i => {
            var item = {
                label: i.name,
                value: i.id
            }
            listAvailableFanpages.push(item)
        })
        return listAvailableFanpages
    }
    componentDidMount() {
        let { id } = this.props
        if (!id) return
        this.setState({
            id: id
        },
            () => {
                this._getFanpageList()
                this._getExistedFanpagesList()
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
                this._getFanpageList()
                this._getExistedFanpagesList()
            })
    }

    render() {
        let {
            labelWidth,
            localValue,
            isLoading
        } = this.state
        let {
            listFanpages,
            existedFanpages
        } = this.state
        let {
            name,
            label,
            allowNull,
            errors,
            className,
            displayName
        } = this.props
        let availableFanpages = this.listAvailableFanpages(this._filterAvailableFanpages(listFanpages, existedFanpages))
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
                                options={availableFanpages}
                                value={localValue}
                                onChange={(value) => this._onValueChange(value)}
                                isSearchable={true}
                                isLoading={isLoading}
                                placeholder={"Chọn fanpage"}
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
