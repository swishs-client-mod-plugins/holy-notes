const { getModule, contextMenu, React } = require('powercord/webpack')
const { clipboard } = require('electron')

const User = getModule(m => m.prototype?.tag, false)
const NotesHandler = new (require('../../NotesHandler'))()
const ContextMenu = getModule(['MenuGroup', 'MenuItem'], false)
const transitionTo = getModule(['transitionTo'], false).transitionTo
const Timestamp = getModule(m => m.prototype?.toDate && m.prototype.month, false)
const ChannelMessage = getModule(m => m.type?.displayName === 'ChannelMessage', false)
const MessageC = getModule(m => m.prototype?.getReaction && m.prototype.isSystemDM, false)

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
  ...getModule(['cozyMessage'], false)
}

module.exports = ({ note, notebook, updateParent, fromDeleteModal, closeModal }) => {
	const messageNote = Object.assign({}, note)
	messageNote.author = new User({...note.author})
	messageNote.timestamp = new Timestamp(new Date(note.timestamp))
  messageNote.embeds.map((embed, index) => {
    messageNote.embeds[index].timestamp = new Timestamp(new Date(embed.timestamp))
  })

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
    <ContextMenu.default onClose={contextMenu.closeContextMenu}>
      <ContextMenu.MenuItem
        label='Jump to Message' id='jump'
        action={() => {
          transitionTo(`/channels/${note.guild_id ? note.guild_id : '@me'}/${note.channel_id}/${note.id}`)
          closeModal()
        }}/>
      <ContextMenu.MenuItem
        label='Copy Text' id='ctext'
        action={() => clipboard.writeText(note.content)}/>
      <ContextMenu.MenuItem
        color='colorDanger'
        label='Delete Note' id='delete'
        action={() => {
          NotesHandler.deleteNote(note.id, notebook)
          updateParent()
        }}/>
      {Object.keys(NotesHandler.getNotes()).length !== 1 ?
        <ContextMenu.MenuItem
          label='Move Note' id='move'>
          {Object.keys(NotesHandler.getNotes()).map(key => {
            if (key != notebook) {
              return (
                <ContextMenu.MenuItem
                  label={`Move to ${key}`} id={key}
                  action={() => {
                    NotesHandler.moveNote(note, key, notebook)
                    updateParent()
                  }}/>
                )
              }
            }
          )}
        </ContextMenu.MenuItem> : null}
      <ContextMenu.MenuItem
        label='Copy ID' id='cid'
        action={() => clipboard.writeText(note.id)}/>
    </ContextMenu.default>
  </>
}