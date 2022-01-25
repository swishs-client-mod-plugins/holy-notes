const { Modal } = require('powercord/components/modal');
const { close: closeModal, open: openModal } = require('powercord/modal');
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { FormTitle, Button, AdvancedScrollerThin } = require('powercord/components');

const BDModal = require('./BDImport');
const Colors = getModule(['colorStatusGreen'], false);
const FormText = getModuleByDisplayName('FormText', false);
const NotesHandler = new (require('../../NotesHandler'))();

module.exports = () => {
  const [refreshText, setRefreshText] = React.useState('Refresh Avatars');
  return (
    <Modal className='help-modal' size={Modal.Sizes.MEDIUM}>
      <Modal.Header className='notebook-header'>
        <FormTitle tag='h3'>Help Modal</FormTitle>
        <Modal.CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Content>
        <AdvancedScrollerThin fade={true}>
          <div className='help-markdown'>
            <FormTitle>Adding Notes</FormTitle>
            <FormText type='description'>
              To add a note right click on a message then hover over the "Note Message" item and click the button with the notebook name you would like to note the message to.<br /><br />
              <span style={{ fontWeight: 'bold' }} className={Colors.colorStatusGreen}>Protip:</span> Clicking the "Note Message" button by itself will note to Main by default!
            </FormText><hr />
            <FormTitle>Deleting Notes</FormTitle>
            <FormText type='description'>
              Note you can either right click the note and hit "Delete Note" or you can hold the 'DELETE' key on your keyboard and click on a note; it's like magic!
            </FormText><hr />
            <FormTitle>Moving Notes</FormTitle>
            <FormText type='description'>
              To move a note right click on a note and hover over the "Move Note" item and click on the button corrosponding to the notebook you would like to move the note to.
            </FormText><hr />
            <FormTitle>Jump to Message</FormTitle>
            <FormText type='description' style={{ marginBottom: '14px' }}>
              To jump to the location that the note was originally located at just right click on the note and hit "Jump to Message".
            </FormText>
          </div>
        </AdvancedScrollerThin>
      </Modal.Content>
      <Modal.Footer>
        <Button
          onClick={() => openModal(() => <BDModal />)}>
          Import from BD
        </Button>
        <Button
          onClick={closeModal}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}>
          Cancel
        </Button>
        <div className='notebook-display-left'>
          <Button
            look={Button.Looks.GHOST}
            color={Button.Colors.GREEN}
            onClick={async () => {
              if (refreshText === '...')
                return setRefreshText('i\'m already trying dumbass');
              setRefreshText('...');
              await NotesHandler.refreshAvatars();
              closeModal();
              setRefreshText('Refresh Avatars');
            }}>
            {refreshText}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};