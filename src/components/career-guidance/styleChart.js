import React from "react";
import $ from 'jquery'
class Index extends React.Component {
    componentDidMount() {
        let value = [5, 4, 3, 3]
        let point1 = $('#style-table > tr')[5]
        console.log("point1", point1)
    }
    render() {
        return (
            <div className="career-guidance-page" >
                <table>
                    <thead>
                        <tr>
                            <th><span>D</span></th>
                            <th><span>I</span></th>
                            <th><span>S</span></th>
                            <th><span>C</span></th>
                        </tr>
                    </thead>
                    <tbody id="style-table">
                        <tr><td><span>0</span></td><td><span>0</span></td><td><span>0</span></td><td><span>0</span></td></tr>
                        <tr><td><span> </span></td><td><span> </span></td><td><span>1</span></td><td><span>1</span></td></tr>
                        <tr><td><span>1</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
                        <tr><td><span> </span></td><td><span>1</span></td><td><span>2</span></td><td><span> </span></td></tr>
                        <tr><td><span> </span></td><td><span> </span></td><td><span> </span></td><td><span>2</span></td></tr>
                        <tr><td><span>2</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
                        <tr><td><span> </span></td><td><span>2</span></td><td><span>3</span></td><td><span>3</span></td></tr>
                        <tr><td><span>3</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
                        <tr><td><span> </span></td><td><span>3</span></td><td><span>4</span></td><td><span>4</span></td></tr>
                        <tr><td><span>4</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
                        <tr><td><span> </span></td><td><span> </span></td><td><span>5</span></td><td><span>5</span></td></tr>
                        <tr><td><span>5</span></td><td><span>4</span></td><td><span> </span></td><td><span> </span></td></tr>
                        <tr><td><span> </span></td><td><span> </span></td><td><span>6</span></td><td><span>6</span></td></tr>
                        <tr><td><span>6</span></td><td><span>5</span></td><td><span> </span></td><td><span>7</span></td></tr>
                        <tr><td><span> </span></td><td><span> </span></td><td><span>7</span></td><td><span> </span></td></tr>
                        <tr><td><span>7</span></td><td><span>6</span></td><td><span> </span></td><td><span>8</span></td></tr>
                        <tr><td><span>8</span></td><td><span> </span></td><td><span>8</span></td><td><span> </span></td></tr>
                        <tr><td><span>9</span></td><td><span>7</span></td><td><span> </span></td><td><span>9</span></td></tr>
                        <tr><td><span>10</span></td><td><span> </span></td><td><span>9</span></td><td><span> </span></td></tr>
                        <tr><td><span>11</span></td><td><span>8</span></td><td><span> </span></td><td><span>10</span></td></tr>
                        <tr><td><span>12</span></td><td><span> </span></td><td><span>10</span></td><td><span> </span></td></tr>
                        <tr><td><span>13</span></td><td><span>9</span></td><td><span>11</span></td><td><span>11</span></td></tr>
                        <tr><td><span>14</span></td><td><span> </span></td><td><span>12</span></td><td><span>12</span></td></tr>
                        <tr><td><span>15</span></td><td><span>10</span></td><td><span> </span></td><td><span>13</span></td></tr>
                        <tr><td><span>16</span></td><td><span>11</span></td><td><span>13</span></td><td><span> </span></td></tr>
                        <tr><td><span>17</span></td><td><span>12</span></td><td><span>14</span></td><td><span>14</span></td></tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Index;