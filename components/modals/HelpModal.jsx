const { FormTitle, Button } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { AdvancedScrollerThin } = require('powercord/components')
const { close: closeModal, open: openModal } = require('powercord/modal')
const { React } = require('powercord/webpack')

const NotesHandler = new (require('../../NotesHandler'))()
const BDModal = require('./BDImport')

module.exports = () => {
  return (
    <Modal className='help-modal' size={Modal.Sizes.MEDIUM}>
      <Modal.Header>
        <FormTitle tag='h3'>Help Modal</FormTitle>
        <Modal.CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Content>
        <AdvancedScrollerThin fade={true}>
          <div className='help-markdown'>
            <h4>Adding Notes</h4>
            <p>To add a note right click on a message then hover over the "Note Message" item and click the button with the notebook name you would like to note the message to.</p>
            <br />
            <p>Protip: Clicking the "Note Message" button by itself will note to Main by default!</p>
            <hr />
            <h4>Deleting Notes</h4>
            <p>Note you can either right click the note and hit "Delete Note" or you can hold the 'DELETE' key on your keyboard and click on a note; it's like magic!</p>
            <hr />
            <h4>Moving Notes</h4>
            <p>To move a note right click on a note and hover over the "Move Note" item and click on the button corrosponding to the notebook you would like to move the note to.</p>
            <hr />
            <h4>Jump to Message</h4>
            <p>To jump to the location that the note was originally located at just right click on the note and hit "Jump to Message".</p>
          </div>
        </AdvancedScrollerThin>
      </Modal.Content>
      <Modal.Footer>
        <Button
          onClick={() => openModal(() => <BDModal />)}>
          Import from BD
        </Button>
        <Button
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
          onClick={closeModal}>
          Cancel
        </Button>
        <div className='notebook-display-left'>
          <Button
            look={Button.Looks.GHOST}
            color={Button.Colors.GREEN}
            onClick={() => {
              NotesHandler.refreshAvatars()
              closeModal()
            }}>
            Refresh Avatars
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}