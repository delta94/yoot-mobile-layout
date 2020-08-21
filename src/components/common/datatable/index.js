import React from "react";
import "./style.scss";
import Pagination from "../pagingation";
import { TableSize, TableSizeDefault } from "../../../constants/constants";
import Select from "react-select";
import Table from '@material-ui/core/Table';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: TableSizeDefault,
      isLoading: true,
      currentPage: 1,
    };
  }

  _onPageChange = page => {
    this.setState({
      currentPage: page
    })
    const { onChange } = this.props;
    const { pageSize } = this.state;
    if (!onChange) return;
    onChange({
      skip: (page - 1) * pageSize.value,
      take: pageSize.value,
      page: page
    });
  };

  _onPageSizeChange(pageSize) {
    const { onChange } = this.props;
    if (!onChange) return;

    this.setState(
      {
        pageSize: pageSize
      },
      () => {
        onChange({
          skip: 0,
          take: pageSize.value
        });
      }
    );
  }

  componentWillReceiveProps(props) {
    if (props.total >= 0)
      this.setState({ isLoading: false });
    this.setState({
      currentPage: props.currentPage
    })
  }
  componentDidMount() {
    let {
      total,
      currentPage
    } = this.props
    if (total >= 0)
      this.setState({ isLoading: false });
    this.setState({
      currentPage: currentPage
    })
  }

  render() {
    const { pageSize, isLoading, currentPage } = this.state;
    const { data, total, renderHeader, renderBody, isPaging } = this.props;
    return (
      <div className={"custom-table"}>
        <Table className="table list-item" style={{ margin: "0px" }}>
          {renderHeader()}
          {total > 0 ? renderBody(data) : null}
        </Table>
        {isLoading ? (
          <div className="table meta-data">Đang xử lý ...</div>
        ) : total === 0 ? (
          <div className="table meta-data">Dữ liệu không khả dụng</div>
        ) : null}
        {isPaging ? (
          <div className="footer">
            <div style={{ textAlign: "right" }}>
              {
                total > pageSize.value ? <Pagination total={total} pageSize={pageSize.value} currentPage={currentPage} onChange={page => this._onPageChange(page)} /> : ''
              }
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Index;
