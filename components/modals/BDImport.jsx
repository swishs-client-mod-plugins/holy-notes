const { FormTitle, AdvancedScrollerThin, Button } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { close: closeModal } = require('powercord/modal')
const { React } = require('powercord/webpack')
const { TextAreaInput, TextInput } = require('powercord/components/settings')
const { useState } = React

const NotesHandler = new (require('../../NotesHandler'))()
module.exports = () => {
  const [PersonalPinsData, setPersonalPinsData] = useState('')
  const [Notebook, setNotebook] = useState('PersonalPins')
  return (
    <Modal className='bd-const-modal' size={Modal.Sizes.LARGE}>
      <Modal.Header>
        <FormTitle tag='h3'>Import from PersonalPins</FormTitle>
        <Modal.CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Content>
        <AdvancedScrollerThin fade={true}>
          <TextAreaInput
            autofocus={true}
            autosize={true}
            onChange={setPersonalPinsData}
            placeholder={[
              '{',
              '  "choices": {',
              '  "defaultFilter": "channel",',
              '  "defaultOrder": "ascending",',
              '  "defaultSort": "notetime"',
              '  },',
              '  "notes": {',
            ].join('\n')}
            resizeable={false}
            rows={7}
            value={PersonalPinsData}>
            Input the text from your "PersonalPins.config.json" file located in your BD Plugins folder.
          </TextAreaInput>
          <TextInput
            note='You can add the notes to pre-existing notebooks!'
            defaultValue={'PersonalPins'}
            onChange={setNotebook}>
            Add to Notebook
          </TextInput>
        </AdvancedScrollerThin>
      </Modal.Content>
      <Modal.Footer>
        <Button
          color={Button.Colors.GREEN}
          onClick={() => {
            NotesHandler.parseBDNotes(PersonalPinsData, Notebook)
            closeModal()
          }}>
          Parse Data
        </Button>
        <Button
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
          onClick={closeModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}