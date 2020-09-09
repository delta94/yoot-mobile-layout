import React from "react";
import { Button } from "@material-ui/core";
import {
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon
} from '@material-ui/icons'

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mostValue: null,
            leastValue: null,
            answers: [],
            currentQuestion: questions[0]
        };
    }

    handleClickMostOption(value, question) {
        let {
            answers
        } = this.state
        let answer = answers[question]
        if (!answer) answers[question] = { most: null, least: null }
        answers[question].most = value
        this.setState({
            mostValue: value,
            answers: answers
        })
    }
    handleClickLeastOption(value, question) {
        let {
            answers
        } = this.state
        let answer = answers[question]
        if (!answer) answers[question] = { most: null, least: null }
        answers[question].least = value

        this.setState({
            leastValue: value
        })
    }

    handleClickNext() {
        let {
            answers,
            currentQuestion
        } = this.state
        let answer = answers[currentQuestion.stt]
        let nextQuestion = questions.find(item => item.stt == currentQuestion.stt + 1)
        if (!nextQuestion) {
            this.setState({ isLastQuestion: true })
            return
        }
        if (answer && answer.most != null && answer.least != null) {
            this.setState({
                currentQuestion: nextQuestion,
                leastValue: answers[nextQuestion.stt] ? answers[nextQuestion.stt].least : null,
                mostValue: answers[nextQuestion.stt] ? answers[nextQuestion.stt].most : null
            })
        }
    }
    handleClickPre() {
        let {
            answers,
            currentQuestion
        } = this.state
        let answer = answers[currentQuestion.stt]
        let nextQuestion = questions.find(item => item.stt == currentQuestion.stt - 1)
        if (!nextQuestion) return
        if (answer && answer.most != null && answer.least != null) {
            this.setState({
                currentQuestion: nextQuestion,
                leastValue: answers[nextQuestion.stt] ? answers[nextQuestion.stt].least : null,
                mostValue: answers[nextQuestion.stt] ? answers[nextQuestion.stt].most : null,
                isLastQuestion: false
            })
        }
    }
    render() {
        let {
            mostValue,
            leastValue,
            isLastQuestion,
            currentQuestion
        } = this.state
        return (
            <div className="test-page">
                <label className="red">Hướng dẫn:</label>
                <div className="description">
                    <span>1. Đọc kỹ 4 cụm từ trong các câu bên dưới, đối chiếu <b>HÀNH VI HẰNG NGÀY</b> của chính bản thân bạn.</span>
                    <span>2. Nhấn chọn cụm từ mô tả <b>GIỐNG BẠN NHẤT [MOST]</b>.</span>
                    <span>3. Nhấn chọn cụm từ mô tả <b>ÍT GIỐNG BẠN NHẤT [LEAST]</b>.</span>
                    <span>4. Ứng với <b>MỖI CÂU</b>, phải chọn <b>MỘT</b> câu trả lời <b>MOST</b> và <b>MỘT</b> câu trả lời <b>LEAST</b>.</span>
                    <span>5. Để tăng độ chính xác, bài trắc nghiệm này chỉ nên hoàn thành tất trong <b>7 PHÚT</b>, hoặc càng nhanh càng tốt.</span>
                </div>
                <label className="red">Trắc nghiệm:</label>
                <div className="question">
                    <div className="tutorial">
                        <span>
                            <span>Chỉ chọn <b>MỘT</b> câu <b>MOST</b> và <b>MỘT</b> câu <b>LEAST</b></span>
                        </span>
                        <span className="red">Most</span>
                        <span className="red">Least</span>
                    </div>
                    <div className="current-question">
                        <span className="red">Câu {currentQuestion.stt}</span>
                        <table cellSpacing={"3px"}>
                            <tbody>
                                {
                                    currentQuestion.options.map((option, index) => <tr key={index}>
                                        <td >{option.label}</td>
                                        <td className="radio" onClick={() => this.handleClickMostOption(index, currentQuestion.stt)}>
                                            <Button><span className={"radio-bt " + (index == mostValue ? "active" : "")}></span></Button>
                                        </td>
                                        <td className="radio" onClick={() => this.handleClickLeastOption(index, currentQuestion.stt)}>
                                            <Button><span className={"radio-bt " + (index == leastValue ? "active" : "")}></span></Button>
                                        </td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="actions">
                        <Button onClick={() => this.handleClickPre()}><NavigateBeforeIcon /></Button>
                        <Button onClick={() => this.handleClickNext()}><NavigateNextIcon /></Button>
                    </div>
                </div>
                {
                    isLastQuestion ? <Button className="bt-submit">Kết quả</Button> : ""
                }
            </div>
        );
    }
}
export default Index;

const questions = [
    {
        stt: 1,
        options: [
            {
                value: 1,
                label: "Dễ tin, nhiệt tình"
            },
            {
                value: 2,
                label: "Khoan dung, lễ phép"
            },
            {
                value: 3,
                label: "Can đảm, thích mạo hiểm"
            },
            {
                value: 4,
                label: "Dễ chịu, thoả hiệp"
            }
        ],
    },
    {
        stt: 2,
        options: [
            {
                value: 1,
                label: "Dễ tin, nhiệt tình"
            },
            {
                value: 2,
                label: "Khoan dung, lễ phép"
            },
            {
                value: 3,
                label: "Can đảm, thích mạo hiểm"
            },
            {
                value: 4,
                label: "Dễ chịu, thoả hiệp"
            }
        ],
    },
    {
        stt: 3,
        options: [
            {
                value: 1,
                label: "Dễ tin, nhiệt tình"
            },
            {
                value: 2,
                label: "Khoan dung, lễ phép"
            },
            {
                value: 3,
                label: "Can đảm, thích mạo hiểm"
            },
            {
                value: 4,
                label: "Dễ chịu, thoả hiệp"
            }
        ],
    },
    {
        stt: 4,
        options: [
            {
                value: 1,
                label: "Dễ tin, nhiệt tình"
            },
            {
                value: 2,
                label: "Khoan dung, lễ phép"
            },
            {
                value: 3,
                label: "Can đảm, thích mạo hiểm"
            },
            {
                value: 4,
                label: "Dễ chịu, thoả hiệp"
            }
        ],
    }
]
