import React from "react";
import Pagination from '../common/pagingation'
import './style.scss'


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            skip: 0,
            take: 0,
            page: 1,
            items: null,
        }
    }

    componentDidMount() {
    }

    render() {
        let {
            total,
            skip,
            take,
            page,
            items,
        } = this.state

        const { headers, render } = this.props

        return
        <div>
            <table className="table list-item">
                <thead>
                    {headers}
                </thead>
                <tbody>
                    {render()}
                </tbody>
            </table>
            {
                total > take ? < Pagination total={total} take={10} currentPage={page ? page : 1} /> : ""
            }
        </div >
    }
}

