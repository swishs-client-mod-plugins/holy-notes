const { getModule, contextMenu, React, React: { useEffect } } = require('powercord/webpack')
const { clipboard } = require('electron')

const User = getModule(m => m.prototype?.tag, false)
const NotesHandler = new (require('../../NotesHandler'))()
const ContextMenu = getModule(['MenuGroup', 'MenuItem'], false)
const transitionTo = getModule(['transitionTo'], false).transitionTo
const Timestamp = getModule(m => m.prototype?.toDate && m.prototype.month, false)
const ChannelMessage = getModule(m => m.type?.displayName === 'ChannelMessage', false)
const Message = getModule(m => m.prototype?.getReaction && m.prototype.isSystemDM, false)
const Channel = getModule(m => m.prototype?.getGuildId, false)

module.exports = ({ note, notebook, updateParent, fromDeleteModal, closeModal }) => {
  const classes = getModule(['cozyMessage'], false)

  let isHoldingDelete
  useEffect(() => {
    const deleteHandler = (e) => e.key === 'Delete' && (isHoldingDelete = e.type === 'keydown')
    
    document.addEventListener('keydown', deleteHandler)
    document.addEventListener('keyup', deleteHandler)

    return () => {
      document.removeEventListener('keydown', deleteHandler)
      document.removeEventListener('keyup', deleteHandler)
    }
  }, [])

  return (
    <div className='holy-note'>
      <ChannelMessage
        style={{
          marginBottom: '5px',
          marginTop: '5px',
          paddingTop: '5px',
          paddingBottom: '5px'
        }}
        className={[
          classes.message,
          classes.cozyMessage,
          classes.groupStart
        ].join(' ')}
        message={
          new Message(
            Object.assign({ ...note }, {
              author: new User({ ...note.author }),
              timestamp: new Timestamp(new Date(note.timestamp)),
              embeds: note.embeds.map(embed => embed.timestamp ? Object.assign(embed, {
                timestamp: new Timestamp(new Date(embed.timestamp))
              }) : embed)
            })
          )
        }
        channel={new Channel({ id: 'holy-notes' })}
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
          transitionTo(`/channels/${note.guild_id ?? '@me'}/${note.channel_id}/${note.id}`)
          closeModal()
        }} />
      <ContextMenu.MenuItem
        label='Copy Text' id='ctext'
        action={() => clipboard.writeText(note.content)} />
      <ContextMenu.MenuItem
        color='colorDanger'
        label='Delete Note' id='delete'
        action={() => {
          NotesHandler.deleteNote(note.id, notebook)
          updateParent()
        }} />
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
                  }} />
              )
            }
          }
          )}
        </ContextMenu.MenuItem> : null}
      <ContextMenu.MenuItem
        label='Copy ID' id='cid'
        action={() => clipboard.writeText(note.id)} />
    </ContextMenu.default>
  </>
}