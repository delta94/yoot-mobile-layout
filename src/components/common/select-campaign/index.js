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
            existedCampaigns: [],
            listCampaigns: [],
            availableCampaigns: []
        }
    }

    _onValueChange(value) {
        if (this.props.onChange) this.props.onChange(value)
        this.setState({
            localValue: value
        })
    }

    _getExistedCampaignsList() {
        const { id } = this.state
        let listCampaignFanpages = []
        if (!id) return;
        get("fanpages/" + id + "/campaigns", (result) => {
            result.items.map((item) => {
                listCampaignFanpages.push(item.campaignId)
            })
            this.setState({
                existedCampaigns: [...listCampaignFanpages]
            })
        }, null, true)

    }
    _getCampaignList() {
        get("campaigns", result => {
            this.setState({
                listCampaigns: [...result.items]
            })
        }, null, true)

    }
    _filterAvailableCampaigns = (campaignsList, ExistedCampaignsList) => {
        let listCampaigns = [...campaignsList]
        let existedCampaigns = [...ExistedCampaignsList]
        return listCampaigns.filter((item => existedCampaigns.indexOf(item.id) === -1))
    }
    listAvailableCampaigns = (availableCampaigns) => {
        let listAvailableCampaigns = []
        availableCampaigns.map(i => {
            var item = {
                label: i.name,
                value: i.id
            }
            listAvailableCampaigns.push(item)
        })
        return listAvailableCampaigns
    }
    componentDidMount() {
        let { id } = this.props
        if (!id) return
        this.setState({
            id: id
        },
            () => {
                this._getCampaignList()
                this._getExistedCampaignsList()
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
                this._getCampaignList()
                this._getExistedCampaignsList()
            })
    }

    render() {
        let {
            labelWidth,
            localValue,
            isLoading
        } = this.state
        let {
            existedCampaigns,
            listCampaigns,
        } = this.state
        let {
            name,
            label,
            allowNull,
            errors,
            className,
            displayName
        } = this.props
        let availableCampaigns = this.listAvailableCampaigns(this._filterAvailableCampaigns(listCampaigns, existedCampaigns))
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
                                options={availableCampaigns}
                                value={localValue}
                                onChange={(value) => this._onValueChange(value)}
                                isSearchable={true}
                                isLoading={isLoading}
                                placeholder={"Chọn campaign"}
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
