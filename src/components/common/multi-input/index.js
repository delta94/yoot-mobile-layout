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
            onChange,
            useHashtags,
            useMentions
        } = this.props
        var hashtags = false;
        var mentions = false;
        let that = this
        $(document).on('keyup', id ? ("#" + id) : '#vk-input', function (e) {
            if ($(this)[0].outerText.length > 0) {
                $("#placeholder").css("display", "none");
            } else {
                $("#placeholder").css("display", "inherit")
            }
            that.props.onChange(this.outerText);
        })
        $(document).on('click', '#mention-options .item', function(e){
            var str = this.innerText;
            var multiInput = $('#vk-input');
            var innerHTML = multiInput[0].innerHTML.replace('<span class="highlight">@</span>', '<span class="highlight">@' + str + '</span>&nbsp;')
            mentions = false;
            $('#vk-input').html(innerHTML);
            that.props.onChange(multiInput[0].outerText);
            that.placeCaretAtEnd(this);
            $('#mention-options').css("display", "none");
        })
        $(document).on('keydown', id ? ("#" + id) : '#vk-input', function (e) {
            let arrow = {
                space: 32,
                del: 8,
            };
            if(useHashtags){
                arrow.hashtag = 51;
            }
            if(useMentions){
                arrow.mentions = 50;
            }
            var input_field = $(this);
            if (e.shiftKey){
                switch (e.keyCode) {
                    case arrow.mentions:
                        mentions = true;
                        break;
                    case arrow.hashtag:
                        hashtags = true;
                        break;
                }
            } else{
                mentions = false;
                hashtags = false;
                switch (e.keyCode) {
                    case arrow.del:
                        $('#mention-options').css("display", "none");
                        break;
                    case arrow.space:
                        $('#mention-options').css("display", "none");
                        input_field.html(input_field.html() + "</span>&nbsp;");
                        break;
                }
            }
            if(mentions){
                input_field.html(input_field.html() + "<span class='highlight'>@");
                $('#mention-options').css("display", "block");
                mentions = false;
                e.preventDefault();
            }
            if(hashtags){
                input_field.html(input_field.html() + "<span class='highlight'>#");
                hashtags = false;
                e.preventDefault();
            }
            that.placeCaretAtEnd(this);
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
            placeholder,
            userOptions,
            useHashtags,
            useMentions
        } = this.props
        return (
            <div className={"multi-input " + className}>
                <div id={id ? id : "vk-input"} contenteditable="true" onChange={() => alert()}>
                    {value ? value : ""}
                </div>
                {useMentions ? <div id="mention-options" style={{display:'none'}}>
                    {
                        userOptions && userOptions.length > 0 ? userOptions.map((user,index)=><p key={index} className="item">
                            {user.fullname}
                        </p>):""
                    }
                </div> : ""}
                <input type="hidden" id="dddd" name="text" placeholder="Nhập nội dung" onChange={() => alert()} />
                {
                    value && value.length > 0 ? "" : < span className="placeholder" id="placeholder">{placeholder ? placeholder : "Placeholder"}</span>
                }
            </div>
        )
    }
}
export default Loader
