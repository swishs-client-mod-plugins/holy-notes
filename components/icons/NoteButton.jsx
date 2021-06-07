const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');

const classes = getModule(['icon', 'isHeader'], false);
const Tooltip = getModuleByDisplayName('Tooltip', false);
const { Button } = getModule((m) => m?.default?.displayName === 'MiniPopover', false) || {};
const NotesHandler = new (require('../../NotesHandler'))();



let attachments;
let noteFormat = {};

class NoteButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Tooltip
                color="black"
                postion="top"
                text="Note Message"
            >{({ onMouseLeave, onMouseEnter }) => (
                    <Button
                        className={'note-button'}
                        onClick={(e) => {
                            NotesHandler.addNote(this.props, 'Main');
                            }}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    ><svg
                            x="0"
                            y="0"
                            aria-hidden="false"
                            width="22"
                            height="22"
                            viewBox='0 0 24 24'
                            class={classes.icon}
                        ><path
                                fill='currentColor'
                                d='M 18 0 L 13 0 L 13 11 L 10 8 L 7 11 L 7 0 L 2 0 L 2 20 L 4.464844 24 L 21 24 L 21 5.722656 Z M 19 22 L 5.535156 22 L 4.320313 20 L 18 20 L 18 4.136719 L 19 6.277344 Z'
                            />
                        </svg>
                    </Button>
                )}
            </Tooltip>
        );
    }
}

module.exports = NoteButton;
