import React from 'react';
import $ from 'jquery'
import './style.scss'

let value = ''

export class Loader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    componentWillMount() {
        let {
            id,
            onChange
        } = this.props
        var hashtags = false;

        let that = this

        $(document).on('keyup', id ? ("#" + id) : '#vk-input', function (e) {
            if ($(this)[0].outerText.length > 0) {
                $("#placeholder").css("display", "none")
            } else {
                $("#placeholder").css("display", "inherit")
            }
        })

        $(document).on('keydown', id ? ("#" + id) : '#vk-input', function (e) {
            let arrow = {
                hashtag: 51,
                space: 32
            };

            var input_field = $(this);

            switch (e.which) {
                case arrow.hashtag:
                    e.preventDefault();
                    input_field.html(input_field.html() + "<span class='highlight'>#");
                    that.placeCaretAtEnd(this);
                    hashtags = true;
                    break;
                case arrow.space:
                    if (hashtags) {
                        e.preventDefault();
                        input_field.html(input_field.html() + "</span>&nbsp;");
                        that.placeCaretAtEnd(this);
                        hashtags = false;
                    }
                    break;
            }
        });
    }
    placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    render() {
        let {
            value
        } = this.state
        let {
            className,
            id,
            placeholder
        } = this.props
        return (
            <div className={"multi-input " + className}>
                <div id={id ? id : "vk-input"} contenteditable="true" onChange={() => alert()}>
                    {value ? value : ""}
                </div>
                <input type="hidden" id="dddd" name="text" placeholder="Nhập nội dung" onChange={() => alert()} />
                {
                    value && value.length > 0 ? "" : < span className="placeholder" id="placeholder">{placeholder ? placeholder : "Placeholder"}</span>
                }
            </div>
        )
    }
}
export default Loader
