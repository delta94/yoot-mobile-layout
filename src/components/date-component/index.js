import React from "react";
import ReactDOM from 'react-dom';
import DatePicker from 'react-mobile-datepicker';

import './style.scss'
const monthMap = {
    '1': 'Tháng 1',
    '2': 'Tháng 2',
    '3': 'Tháng 3',
    '4': 'Tháng 4',
    '5': 'Tháng 5',
    '6': 'Tháng 6',
    '7': 'Tháng 7',
    '8': 'Tháng 8',
    '9': 'Tháng 9',
    '10': 'Tháng 10',
    '11': 'Tháng 11',
    '12': 'Tháng 12',
};
const dateConfig = {
    'month': {
        format: value => monthMap[value.getMonth() + 1],
        caption: 'Month',
        step: 1,
    },
    'date': {
        format: 'DD',
        caption: 'Day',
        step: 1,
    },
    'year': {
        format: 'YYYY',
        caption: 'Year',
        step: 1,
    },
};
class DateComponent extends React.Component {
    
    constructor(props) {
      super(props)
      this.state = {
        index: 0
      }
    }

    state = {
        time: new Date(),
        isOpen: false,
    }

    handleClick = () => {
        this.setState({ isOpen: true });
    }
 
    handleCancel = () => {
        this.setState({ isOpen: false });
    }
 
    handleSelect = (time) => {
        this.setState({ time, isOpen: false });
        alert(time);
    }
    render() {
        return (
            <div className="date-component">
                <a
                    className="select-btn"
                    onClick={this.handleClick}>
                    select time
                </a>
                <DatePicker
                    showHeader={true}
                    customHeader={"Chọn ngày"}
                    confirmText={'Xác nhận'}
                    cancelText={"Hủy"}
                    theme={'ios'}
                    value={this.state.time}
                    isOpen={this.state.isOpen}
                    onSelect={this.handleSelect}
                    onCancel={this.handleCancel} 
                    dateConfig={dateConfig}/>
            </div>
        );
    }
}

export default DateComponent;
