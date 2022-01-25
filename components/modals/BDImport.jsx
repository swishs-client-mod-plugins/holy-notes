const { Modal } = require('powercord/components/modal');
const { close: closeModal } = require('powercord/modal');
const { React, getModuleByDisplayName } = require('powercord/webpack');
const { FormTitle, AdvancedScrollerThin, Button } = require('powercord/components');
const { useState } = React;

const Divider = getModuleByDisplayName('Divider', false);
const TextArea = getModuleByDisplayName('TextArea', false);
const TextInput = getModuleByDisplayName('TextInput', false);
const NotesHandler = new (require('../../NotesHandler'))();
module.exports = () => {
  const [personalPinsData, setPersonalPinsData] = useState('');
  const [notebook, setNotebook] = useState('PersonalPins');
  return (
    <Modal className='bd-const-modal' size={Modal.Sizes.LARGE}>
      <Modal.Header className='notebook-header'>
        <FormTitle tag='h3'>Import from PersonalPins</FormTitle>
        <Modal.CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Content>
        <AdvancedScrollerThin fade={true}>
          <FormTitle>
            Input the text from your "PersonalPins.config.json" file located in your BD Plugins folder.
          </FormTitle>
          <TextArea
            rows={7}
            autosize={true}
            autofocus={true}
            resizeable={false}
            value={personalPinsData}
            onChange={setPersonalPinsData}
            placeholder={[
              '{',
              '  "choices": {',
              '  "defaultFilter": "channel",',
              '  "defaultOrder": "ascending",',
              '  "defaultSort": "notetime"',
              '  },',
              '  "notes": {',
            ].join('\n')}>
          </TextArea>
          <Divider style={{ marginTop: '20px' }} />
          <FormTitle>Add to Notebook</FormTitle>
          <TextInput
            hideBorder={true}
            onChange={setNotebook}
            defaultValue={'PersonalPins'}
            style={{ marginBottom: '10px' }}
            note='You can add the notes to pre-existing notebooks!' />
        </AdvancedScrollerThin>
      </Modal.Content>
      <Modal.Footer>
        <Button
          color={Button.Colors.GREEN}
          onClick={() => {
            NotesHandler.parseBDNotes(personalPinsData, notebook);
            closeModal();
          }}>
          Parse Data
        </Button>
        <Button
          onClick={closeModal}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};