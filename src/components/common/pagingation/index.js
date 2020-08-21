import React from "react";
import $ from "jquery";
import "./style.scss";
import ReactPagination from "react-js-pagination";

let displayCount = 2

export class Pagination extends React.Component {
  constructor(props) {
    super(props);

    window.addEventListener("resize", () => this.responsive());

    this.state = {
      isMobile: false,
      currentPage: 1,
      pages: [],
      lastPage: 1
    };
  }

  responsive = () => {
    let { isMobile } = this.state;

    if ($(window).width() < 768 && !isMobile) {
      this.setState({ isMobile: true });
    } else if ($(window).width() >= 768 && isMobile) {
      this.setState({ isMobile: false });
    }
  };

  componentWillReceiveProps(props) {
    const { total, pageSize, currentPage } = props;
    this.setState({
      currentPage: currentPage
    })
    if (total === this.props.total && pageSize === this.props.pageSize) return;
    if (pageSize !== this.props.pageSize || total !== this.props.total) {
      this.setState(
        {
          currentPage: currentPage
        }, () => {
          this.resolvePages(props);
          if (props.onChange) props.onChange(currentPage)
        }
      );
    }
    this.resolvePages(props);
  }

  resolvePages = props => {
    const { total, pageSize } = props;
    const { currentPage } = this.state;
    let pages = [];

    var numOfPages = parseInt(total / pageSize) + (total % pageSize > 0 ? 1 : 0);

    for (var i = 1; i <= numOfPages; i++) {
      if (i >= currentPage - displayCount && i < currentPage + displayCount)
        pages.push(i)
    }
    this.setState({
      pages,
      lastPage: numOfPages
    });
  };

  onChange = page => {
    this.setState({ currentPage: page }, () => {
      this.resolvePages(this.props);
      let { onChange } = this.props;
      if (!onChange) return;
      onChange(page);
    });
  };

  componentDidMount() {
    this.responsive();
    this.resolvePages(this.props);
  }

  render() {
    return this.renderForDesktop();
  }

  renderForDesktop() {
    // let { pages, lastPage, currentPage } = this.state;
    let {
      currentPage,
      total,
      pageSize
    } = this.props
    return (
      <ReactPagination
        hideDisabled
        activePage={currentPage}
        itemsCountPerPage={pageSize}
        totalItemsCount={total}
        onChange={page => { this.props.onChange(page) }}
      />
    );
  }
}
export default Pagination;
