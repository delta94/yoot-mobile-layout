import React from "react";
import $ from 'jquery'
const SVG = require('react-svg-draw')
const { Line } = SVG;

class Index extends React.Component {

    renderD() {
        return (
            <SVG><Line x1="40" y1="40" x2="100" y2="100" /></SVG>
        );
    }

    render() {
        let innerChart = $('#style-chart')
        let value = [6, 4, 3, 3]
        let point1 = $('span#1-' + value[0])[0]
        let point2 = $('span#2-' + value[1])[0]
        let point3 = $('span#3-' + value[2])[0]
        let point4 = $('span#4-' + value[3])[0]
        if (point1)
            point1.classList.add("active")
        if (point2)
            point2.classList.add("active")
        if (point3)
            point3.classList.add("active")
        if (point4)
            point4.classList.add("active")
        return (
            <div className="career-guidance-page" id="style-chart" style={{ position: "relative" }}>
                <div>
                    <span>D</span> <span>I</span> <span>S</span> <span>C</span>
                    <span id="1-0">0</span> <span id="2-0">0</span> <span id="3-0">0</span> <span id="4-0">0</span>
                    <span> </span> <span> </span> <span id="3-1">1</span> <span id="4-1">1</span>
                    <span id="1-1">1</span> <span> </span> <span> </span> <span> </span>
                    <span> </span> <span id="2-1">1</span> <span id="3-2">2</span> <span> </span>
                    <span> </span> <span> </span> <span> </span> <span id="4-2">2</span>
                    <span id="1-2">2</span> <span> </span> <span> </span> <span> </span>
                    <span> </span> <span id="2-2">2</span> <span id="3-3">3</span> <span id="4-3">3</span>
                    <span id="1-3">3</span> <span> </span> <span> </span> <span> </span>
                    <span> </span> <span id="2-3">3</span> <span id="3-4">4</span> <span id="4-4">4</span>
                    <span id="1-4">4</span> <span> </span> <span> </span> <span> </span>
                    <span> </span> <span> </span> <span id="3-5">5</span> <span id="4-5">5</span>
                    <span id="1-5">5</span> <span id="2-4">4</span> <span> </span> <span> </span>
                    <span> </span> <span> </span> <span id="3-6">6</span> <span id="4-6">6</span>
                    <span id="1-6">6</span> <span id="2-5">5</span> <span> </span> <span id="4-7">7</span>
                    <span> </span> <span> </span> <span id="3-7">7</span> <span> </span>
                    <span id="1-7">7</span> <span id="2-6">6</span> <span> </span> <span id="4-8">8</span>
                    <span id="1-8">8</span> <span> </span> <span id="3-8">8</span> <span> </span>
                    <span id="1-9">9</span> <span id="2-7">7</span> <span> </span> <span id="4-9">9</span>
                    <span id="1-10">10</span> <span> </span> <span id="3-9">9</span> <span> </span>
                    <span id="1-11">11</span> <span id="2-8">8</span> <span> </span> <span id="4-10">10</span>
                    <span id="1-12">12</span> <span> </span> <span id="3-10">10</span> <span> </span>
                    <span id="1-13">13</span> <span id="2-9">9</span> <span id="3-11">11</span> <span id="4-11">11</span>
                    <span id="1-14">14</span> <span> </span> <span id="3-12">12</span> <span id="4-12">12</span>
                    <span id="1-15">15</span> <span id="2-10">10</span> <span> </span> <span id="4-13">13</span>
                    <span id="1-16">16</span> <span id="2-11">11</span> <span id="3-13">13</span> <span> </span>
                    <span id="1-17">17</span> <span id="2-12">12</span> <span id="3-14">14</span> <span id="4-14">14</span>
                </div>
                <span className="y-border border-left"></span>
                <span className="y-border border-1"></span>
                <span className="y-border border-2"></span>
                <span className="y-border border-3"></span>
                <span className="y-border border-right"></span>
                <span className="x-border border-1"></span>
                <span className="x-border border-bottom"></span>
                <SVG width={innerChart ? innerChart.innerWidth() : "100vw"} height={innerChart ? innerChart.innerHeight() : "100vw"} style={{ position: "absolute", top: "0px", left: "0px" }}>
                    {
                        point1 && point2 ? <Line x1={point1.offsetLeft + 10} y1={point1.offsetTop + 10} x2={point2.offsetLeft + 10} y2={point2.offsetTop + 10} style={{ stroke: "#ff5a5a", strokeWidth: 3 }} /> : ""
                    }
                    {
                        point2 && point3 ? <Line x1={point2.offsetLeft + 10} y1={point2.offsetTop + 10} x2={point3.offsetLeft + 10} y2={point3.offsetTop + 10} style={{ stroke: "#ff5a5a", strokeWidth: 3 }} /> : ""
                    }
                    {
                        point3 && point4 ? <Line x1={point3.offsetLeft + 10} y1={point3.offsetTop + 10} x2={point4.offsetLeft + 10} y2={point4.offsetTop + 10} style={{ stroke: "#ff5a5a", strokeWidth: 3 }} /> : ""
                    }
                </SVG>
            </div>
        );
    }
}
export default Index;
