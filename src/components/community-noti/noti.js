import React from "react";
import {
  Avatar,
  Button
} from "@material-ui/core";
import moment from 'moment'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }
  render() {
    let {
      data
    } = this.props
    return (
      data ? <li className={"noti-item" + (data.type == "canAction" ? " action" : "")} >
        <Avatar className="avatar"><img src={data.avatar} /></Avatar>
        <div className="noti-info">
          <span className="message">{data.message}</span>
          {
            data.type == "canAction" ? <div className="actions">
              <Button className="bt-submit">Chấp nhận</Button>
              <Button className="bt-cancel">Từ chối</Button>
            </div> : ""
          }
          <span className="time">{moment(data.time).format("DD/MM/YYYY hh:mm")}</span>
        </div>
      </li> : ""
    );
  }
}

export default Index;