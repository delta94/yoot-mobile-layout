import React from 'react';
import './style.scss'
import { EditorState, ContentState, Modifier, convertFromRaw, genKey, ContentBlock, Entity } from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import {
    stateFromHTML
} from 'draft-js-import-html';
import htmlToDraft from 'html-to-draftjs';
import createMentionPlugin from 'draft-js-mention-plugin';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import 'draft-js-mention-plugin/lib/plugin.css';
import { CurrentDate, SOCIAL_NET_WORK_API } from '../../../constants/appSettings';
import { objToQuery, removeAccents } from '../../../utils/common';
import moment from 'moment'
import { get } from '../../../api'

const styleMap = {
    'MENTION': {
        color: '#2e64c9',
        background: "#e7f2fc",
    },
};

export class Loader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            suggestions: [],
            mentionIdSelected: []
        };
        this.editor = React.createRef()
        this.mentionPlugin = createMentionPlugin(
            {
                mentionComponent: (mentionProps) => (
                    <span
                        className={mentionProps.className}
                        style={{
                            fontFamily: "Roboto-Medium",
                        }}
                    >
                        {mentionProps.children}
                    </span>
                ),
                entityMutability: 'SEGMENTED',
                mentionPrefix: '@',
                supportWhitespace: true
            }
        );
        this.hashtagPlugin = createHashtagPlugin();
    }

    onChange = (editorState) => {

        let {
            mentionIdSelected
        } = this.state
        let {
            maxLength,
            unit
        } = this.props

        let outputString = editorState.getCurrentContent().getPlainText("")

        // let isOver = false
        // if (unit == "Word") {
        //     if (outputString.length > 0 && outputString.match(/\S+/g).length > maxLength) {
        //         isOver = true
        //     }

        // }

        // if (isOver == false) {
        //     this.setState({ editorState });
        // }

        this.setState({ editorState });


        let mentionSelected = outputString.match(/@(\S+)/g) ? outputString.match(/@(\S+)/g) : []

        mentionIdSelected.map(item => {
            if (mentionSelected.includes(item.key)) {
                item.selected = true
            }
            else {
                item.selected = false
            }
        })

        mentionIdSelected = mentionIdSelected.filter(item => item.selected == true)



        let hashtagSelected = outputString.match(/#(\S+)/g)

        if (this.props.onChange) {
            this.props.onChange({
                text: outputString,
                mentionSelected: mentionIdSelected ? mentionIdSelected : [],
                hashtagSelected: hashtagSelected ? hashtagSelected : []
            })
        }

    };

    onSearchChange = ({ value }) => {
        let {
            editorState,
        } = this.state

        let outputString = editorState.getCurrentContent().getPlainText("")

        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 5,
            status: "Friends",
            forFriendId: 0,
            groupid: 0,
            findstring: value
        }

        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result.result == 1) {
                let userInvites = result.content.userInvites
                for (var i = 0; i < userInvites.length; i++) {
                    userInvites[i].avatar = userInvites[i].friend_thumbnail_avatar
                    userInvites[i].name = removeAccents(userInvites[i].friendname).split(" ").join("")
                    if (outputString.indexOf(userInvites[i].name) >= 0) {
                        userInvites[i] = null
                    }

                }
                userInvites = userInvites.filter(item => item != null)

                this.setState({
                    suggestions: userInvites,
                })
            }
        })
    };

    onAddMention = (mention) => {
        let {
            mentionIdSelected
        } = this.state
        mentionIdSelected = mentionIdSelected.filter(item => item.id != mention.friendid)
        mentionIdSelected.push({ id: mention.friendid, key: '@' + mention.name })
        this.setState({
            mentionIdSelected: mentionIdSelected
        })
    }

    focus = () => {
        this.editor.focus();
    };

    stringToBlock(string) {
        let blocks = []
        let rows = (string.trim() + " ").split('↵')
        if (rows && rows.length > 0) {
            rows.map(row => {
                let text = row
                let mentionIndex = text.indexOf("@")
                let block = {
                    "key": genKey(),
                    "text": text,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": []
                }
                let mentionSelected = text.match(/@(\S+)/g)
                if (mentionSelected && mentionSelected.length > 0) {
                    mentionSelected.map(item => {
                        let start = text.indexOf(item)
                        let length = item.length
                        block.inlineStyleRanges.push({
                            "offset": start,
                            "length": length,
                            "style": ["MENTION"]
                        })
                    })
                }
                blocks.push(block)
            })
        }
        return blocks
    }

    setDefaultValue(value) {
        let blocks = this.stringToBlock(value)

        const contentState = convertFromRaw({
            blocks: blocks,
            "entityMap": {}
        });
        let newstate = EditorState.createWithContent(contentState)
        this.setState({
            editorState: newstate
        }, () => {
            this.editor.componentWillMount()
        })
    }

    componentDidMount() {
        let {
            value
        } = this.props
        if (value && value.length > 0)
            this.setDefaultValue(value)
    }



    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        let plugins = [];
        let {
            style,
            topDown,
            placeholder,
            enableHashtag,
            enableMention,
            centerMode,
            suggestionClass
        } = this.props

        if (enableHashtag == true) {
            plugins.push(this.hashtagPlugin)
        }
        if (enableMention == true) {
            plugins.push(this.mentionPlugin)
        }
        if (centerMode == true) {
            plugins = []
        }

        return (
            topDown == false ?
                <div onClick={this.focus} className={"root-input" + (centerMode ? " center-mode" : "")} style={style}>

                    <div className="mention-box">
                        <MentionSuggestions
                            onSearchChange={this.onSearchChange}
                            suggestions={this.state.suggestions}
                            onAddMention={this.onAddMention}
                            entryComponent={Entry}
                            className={suggestionClass}
                        />
                    </div>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => { this.editor = element; }}
                        placeholder={placeholder}
                    />
                </div>
                : <div onClick={this.focus} className={"root-input" + (centerMode ? " center-mode" : "")} style={style}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => { this.editor = element; }}
                        placeholder={placeholder}
                        customStyleMap={styleMap}
                    />
                    <div className="mention-box">
                        <MentionSuggestions
                            onSearchChange={this.onSearchChange}
                            suggestions={this.state.suggestions}
                            onAddMention={this.onAddMention}
                            entryComponent={Entry}
                            className={suggestionClass}
                        />
                    </div>
                </div>
        )
    }
}
export default Loader

const Entry = (props) => {
    const {
        mention,
        theme,
        searchValue, // eslint-disable-line no-unused-vars
        isFocused, // eslint-disable-line no-unused-vars
        ...parentProps
    } = props;

    return (
        <div {...parentProps}>
            <div className={theme.mentionSuggestionsEntryContainer} className="mention-suggesstions-item">
                <div className={theme.mentionSuggestionsEntryContainerLeft}>
                    <img
                        src={mention.friend_thumbnail_avatar}
                        className={theme.mentionSuggestionsEntryAvatar}
                        role="presentation"
                    />
                </div>
                <div className={theme.mentionSuggestionsEntryContainerRight}>
                    <div className={theme.mentionSuggestionsEntryText}>
                        {mention.friendname}
                    </div>
                </div>
            </div>
        </div>
    );
};