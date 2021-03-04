import React from 'react'

import { getModule } from '@vizality/webpack'
import { FormTitle, Modal, AdvancedScrollerThin, Button } from '@vizality/components'
import { close as closeModal } from '@vizality/modal'

const User = getModule(m => m?.prototype?.tag)
const ChannelMessage = getModule(m => m?.type?.displayName === 'ChannelMessage')
const MessageC = getModule(m => m?.prototype?.getReaction && m.prototype.isSystemDM)
const Channel = { isPrivate: () => false, isSystemDM: () => false, getGuildId: () => 'uwu' }

const NotesHandler = new (require('../NotesHandler'))()

class RenderMessage extends React.PureComponent {
	constructor(props) {
		super(props)

		this.classes = {
			...getModule('cozyMessage')
		}
	}

	render() {
		const { note } = this.props
		const messageNote = Object.assign({}, note)
		messageNote.author = new User({...note.author})
		messageNote.timestamp = {
			'toDate' : () => new Date(note.timestamp.timestamp),
			'locale' : () => note.timestamp.locale }
		return(
			<div className='holy-note'>
				<ChannelMessage 
					style={{ 
						marginBottom: '5px', 
						marginTop: '5px',
						paddingTop: '5px',
						paddingBottom: '5px'}}
					className={[
							this.classes.message,
							this.classes.cozyMessage,
							this.classes.groupStart
					].join(' ')}
					message={new MessageC({...messageNote})}
					channel={Channel}/>
			</div>
		)
	}
}

class DeleteModal extends React.PureComponent {
  constructor(props) {
		super(props)

		this.classes = {
			...getModule('emptyResultsWrap')
    }
  }

  render() {
    const { notebook } = this.props
		const notes = NotesHandler.getNotes()[notebook]
    return(
      <Modal className='DeleteModal' size={Modal.Sizes.LARGE}>
				<Modal.Header>
					<FormTitle tag='h3'>Confirm Deletion</FormTitle>
					<Modal.CloseButton onClick={closeModal}/>
				</Modal.Header>
				<Modal.Content>
          <AdvancedScrollerThin fade={true}>
						{JSON.stringify(notes) === '{}' ? 
							<div className={this.classes.emptyResultsWrap}>
								<div className={this.classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
									<div className={this.classes.noResultsImage}/>
									<div className={this.classes.emptyResultsText}>
										No notes were found saved in this notebook.
									</div>
								</div>
							</div> :
							Object.keys(notes).map(note =>
								<RenderMessage note={notes[note]}/>
						)}
          </AdvancedScrollerThin>
				</Modal.Content>
				<Modal.Footer>
					<Button
						onClick={() => {
							NotesHandler.deleteNotebook(notebook)
              closeModal()
            }}
						color={Button.Colors.RED}
					>
						Delete
					</Button>
					<Button
						onClick={closeModal}
						look={Button.Looks.LINK}
						color={Button.Colors.TRANSPARENT}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
    )
  }
}
module.exports = DeleteModal