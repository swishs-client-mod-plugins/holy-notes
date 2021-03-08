import React from 'react'
import { getModule, contextMenu } from '@vizality/webpack'
import { ContextMenu } from '@vizality/components'
import { clipboard } from 'electron'

const User = getModule(m => m?.prototype?.tag)
const NotesHandler = new (require('../../NotesHandler'))()
const ChannelTransitioner = getModule('transitionTo')
const ChannelMessage = getModule(m => m?.type?.displayName === 'ChannelMessage')
const MessageC = getModule(m => m?.prototype?.getReaction && m.prototype.isSystemDM)

let isHoldingDelete = false

const deleteToggle = (e) => {
	if (e.key === 'Delete') {
		if (e.type === 'keydown') {
			isHoldingDelete = true
		} else if (e.type === 'keyup') {
			isHoldingDelete = false
		}
	}
}

document.addEventListener('keydown', deleteToggle)
document.addEventListener('keyup', deleteToggle)

const channel = {
	isPrivate: () => false, 
	isSystemDM: () => false, 
	getGuildId: () => 'uwu'
}

const classes = {
  ...getModule('cozyMessage')
}

export default ({ note, notebook, updateParent, fromDeleteModal, closeModal }) => {
	const messageNote = Object.assign({}, note)
	messageNote.author = new User({...note.author})
	messageNote.timestamp = {
		'toDate' : () => new Date(note.timestamp),
		'locale' : () => 'en' }
	if (messageNote?.embeds[0]?.timestamp)
	messageNote.embeds[0].timestamp = {
		'toDate' : () => new Date(note.timestamp),
		'locale' : () => 'en' }
	return (
		<div className='holy-note'>
			<ChannelMessage
				style={{
					marginBottom: '5px',
					marginTop: '5px',
					paddingTop: '5px',
					paddingBottom: '5px'}}
				className={[
						classes.message,
						classes.cozyMessage,
						classes.groupStart
				].join(' ')}
				message={new MessageC({...messageNote})}
				channel={channel}
				onClick={() => {
					if (isHoldingDelete && !fromDeleteModal) {
						NotesHandler.deleteNote(note.id, notebook)
						updateParent()
					}
				}}
				onContextMenu={event => {
          if (!fromDeleteModal)
            return (
              contextMenu.openContextMenu(event, () =>
                <NoteContextMenu
                  note={note}
                  notebook={notebook}
                  updateParent={updateParent}
                  closeModal={closeModal}
                />
              )
            )
        }}
			/>
		</div>
	)
}

const NoteContextMenu = ({ note, notebook, updateParent, closeModal }) => {
  return <>
    <ContextMenu.Menu onClose={contextMenu.closeContextMenu}>
      <ContextMenu.Item
        label='Jump to Message' id='jump'
        action={() => {
          ChannelTransitioner.transitionTo(`/channels/${note.guild_id ? note.guild_id : '@me'}/${note.channel_id}/${note.id}`)
          closeModal()
        }}
      />
      <ContextMenu.Item
        label='Copy Text' id='ctext'
        action={() => clipboard.writeText(note.content)}
      />
      <ContextMenu.Item
        color='colorDanger'
        label='Delete Note' id='delete'
        action={() => {
          NotesHandler.deleteNote(note.id, notebook)
          updateParent()
        }}
      />
      {Object.keys(NotesHandler.getNotes()).length !== 1 ?
        <ContextMenu.Item
          label='Move Note' id='move'>
          {Object.keys(NotesHandler.getNotes()).map(key => {
            if (key != notebook) {
              return (
                <ContextMenu.Item
                  label={`Move to ${key}`} id={key}
                  action={() => {
                    NotesHandler.moveNote(note, key, notebook)
                    updateParent()
                  }}/>
                )
              }
            }
          )}
        </ContextMenu.Item> : null}
      <ContextMenu.Item
        label='Copy ID' id='cid'
        action={() => clipboard.writeText(note.id)}
      />
    </ContextMenu.Menu>
  </>
}