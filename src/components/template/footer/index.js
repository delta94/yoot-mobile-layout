import React from "react";
import "./style/style.scss";

class Index extends React.Component {
  render() {
    return (
      <footer className="main-footer">
        <div className="clear-fix">
          <div className="footer-pull-left">
            <p>
              Copyright © 2018 <b>METUB</b>. All rights reserved.
            </p>
          </div>
          <div className="footer-pull-right">
            <p>
              Version <b>1.0.0</b>
            </p>
          </div>
        </div>
      </footer>
    );
  }
}
export default Index;
