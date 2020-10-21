import React from "react";
import "./style.scss";
import ContentLoader from "react-content-loader"

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let {
      daskMode
    } = this.props
    return (
      <li style={{ marginBottom: "10px" }}>
        <div>
          <div>
            <div className={"post-item " + (daskMode == true ? "dask-mode" : "")} style={{ minHeight: "400px", background: "#fff", padding: "15px" }}>
              <ContentLoader
                speed={2}
                width={200}
                height={42}
                viewBox="0 0 200 42"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                style={{
                  opacity: daskMode == true ? "0.2" : "1"
                }}
              >
                <rect x="60" y="27" rx="4" ry="4" width="140" height="8" />
                <rect x="60" y="3" rx="8" ry="8" width="100" height="15" />
                <rect x="0" y="0" rx="100" ry="100" width="40" height="40" />
              </ContentLoader>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
export default Index;
