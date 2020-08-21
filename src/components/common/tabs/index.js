import React from "react";
import "./style.scss";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import $ from "jquery";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div p={3}>{children}</div>}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  }
});
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      scrollPosition: "none",
      isHanldeScroll: true
    };
  }


  handleChange = (event, value) => {
    this.setState({ value });
    let { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  scrollLeft() {
    this.setState({
      isHanldeScroll: false
    }, () => {
      let tabBar = $("#custom-tab-bar>div>div>div");
      tabBar.animate({ scrollLeft: 0 }, 'slow');
    })
  }
  scrollRight() {
    this.setState({
      isHanldeScroll: false
    }, () => {
      let tabBar = $("#custom-tab-bar>div>div>div");
      tabBar.animate({ scrollLeft: tabBar.get(0).scrollWidth - tabBar.innerWidth() }, 'slow');
    })
  }
  componentWillUpdate() {
    // setTimeout(() => {
    //   let currentTabContent = $(".container-inndex-" + this.state.value)
    //   if (currentTabContent) {
    //     $(".custom-tabs").css("height", (currentTabContent.innerHeight() + 110) + "px")
    //   }
    // }, 500);
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    })
    // let count = 1
    // let intervalId = null
    // intervalId = setInterval(() => {
    //   let currentTabContent = $(".container-inndex-" + this.state.value)
    //   if (currentTabContent) {
    //     $(".custom-tabs").css("height", (currentTabContent.innerHeight() + 110) + "px")
    //     count++
    //   }
    //   if (count == 30) {
    //     clearInterval(intervalId)
    //   }

    // }, 500);
  }

  render() {
    let { value } = this.state;

    const { theme, tabLabels, tabContainers, disableScroll } = this.props;

    return (
      <div
        className={
          "custom-tabs " + (this.props.className ? this.props.className : "") + (disableScroll ? " disable-scroll" : "")
        }
      >
        <AppBar position="static" color="default" className="tab-bar" id="custom-tab-bar">
          {/* {
            (scrollPosition === "end" || scrollPosition === "midle") &&
            <div className="back">
              <IconButton onClick={() => this.scrollLeft()}>
                <NavigateBeforeIcon />
              </IconButton>
            </div>
          } */}
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
            scrollButtons="auto"
            id="tab-header"
          >
            {tabLabels &&
              tabLabels.length > 0 &&
              tabLabels.map((tab, i) => tab && <Tab label={tab} key={i} />)}
          </Tabs>
          {/* {
            (scrollPosition === "start" || scrollPosition === "midle") &&
            <div className="next">
              <IconButton onClick={() => this.scrollRight()}>
                <NavigateNextIcon />
              </IconButton>
            </div>
          } */}
        </AppBar>
        {tabContainers &&
          tabContainers.length > 0 &&
          tabContainers.map((container, i) =>
            container && <TabPanel
              value={this.state.value}
              index={i}
              key={i}
              className={"tab-container "}
            >
              <div className={("container-inndex-" + i)}>
                {container}
              </div>
            </TabPanel>
          )}
        {/* <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          className={"tab-content "}
          style={{
            height: "500px !important"
          }}
        >
          {tabContainers &&
            tabContainers.length > 0 &&
            tabContainers.map((container, i) =>
              container && <TabContainer
                dir={theme.direction}
                key={i}
                className={"tab-container "}
              >
                <div className={("container-inndex-" + i)}>
                  {container}
                </div>
              </TabContainer>
            )}
        </SwipeableViews> */}
      </div>
    );
  }
}
Index.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Index);


