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
        var that = this
        var hashtags = false;
        var mentions = false;
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
            $('#vk-input').html(multiInput[0].innerHTML.replace('<span class="highlight mentions new">@</span>', '<span class="highlight mentions" contenteditable="false">@' + str + '</span>&nbsp;'));
            that.placeCaretAtEnd(this);
            mentions = false;
            that.props.onChange(multiInput[0].outerText);
            $('#mention-options').css("display", "none");
        })       
        $(document).on('keypress', id ? ("#" + id) : '#vk-input', function(e) {
            var input_field = $(this);
            var x = e.which || e.keyCode;
            if (x == 32){ // space key
              if(hashtags || mentions){
                e.preventDefault();
                input_field.html(input_field.html() + "</span>&nbsp;");
                that.placeCaretAtEnd(this);
                hashtags = false;
                mentions = false;
                if(document.getElementsByClassName("new")){
                    document.getElementsByClassName("new")[0].setAttribute("contenteditable", false);
                }
              }
              $('#mention-options').css("display", "none");
            }
            if (x == 35){ // hash key (#)
              e.preventDefault();
              $(".highlight").removeClass("new");
              input_field.html(input_field.html() + "<span class='highlight hashtag new'>#");
              that.placeCaretAtEnd(this);
              hashtags = true;
            }
            if (x == 64){ // hash key (@)
                e.preventDefault();
                $(".highlight").removeClass("new");
                input_field.html(input_field.html() + "<span class='highlight mentions new'>@");
                that.placeCaretAtEnd(this);
                mentions = true;
                $('#mention-options').css("display", "block");
              }
            // various punctuation characters
            if (x == 8 || x == 9 || x >=16 && x <= 18 || x == 27 || x == 33 || x == 34 || x >= 36 && x <= 47 || x >= 58 && x < 64 || x >= 91 && x <= 94 || x == 96 || x >= 123 && x <= 126) {
                if(hashtags || mentions) {
                    e.preventDefault();
                    input_field.html(input_field.html() + "</span>" + String.fromCharCode(x));
                    that.placeCaretAtEnd(this);
                    hashtags = false;
                    mentions = false;
                    if(document.getElementsByClassName("new")){
                        document.getElementsByClassName("new")[0].setAttribute("contenteditable", false);
                    }
                }
            }
            if(x == 13){// return key
              document.execCommand('defaultParagraphSeparator', false, 'p');
              $('#mention-options').css("display", "none");
            }
            
        });
    }
    placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
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
                <div id={id ? id : "vk-input"} contentEditable="true" onChange={() => alert()}>
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
