import React, { useState } from 'react'

import { FormTitle, Modal, Button } from '@vizality/components'
import { AdvancedScrollerThin } from '@vizality/components'
import { TextArea, TextInput } from '@vizality/components/settings'
import { close as closeModal } from '@vizality/modal'

const NotesHandler = new (require('../../NotesHandler'))()
export default () => {
  const [PersonalPinsData, setPersonalPinsData] = useState('')
  const [Notebook, setNotebook] = useState('')
  return(
    <Modal className='bd-import-modal' size={Modal.Sizes.LARGE}>
      <Modal.Header>
        <FormTitle tag='h3'>Import from PersonalPins</FormTitle>
        <Modal.CloseButton onClick={closeModal}/>
      </Modal.Header>
      <Modal.Content>
        <AdvancedScrollerThin fade={true}>
          <TextArea
            autofocus={true}
            autosize={true}
            onChange={value => setPersonalPinsData(value)}
            placeholder={`{\n  "choices": {\n  "defaultFilter": "channel",\n  "defaultOrder": "ascending",\n  "defaultSort": "notetime"\n  },\n  "notes": {`}
            resizeable={false}
            rows={7}
            value={PersonalPinsData}>
            Input the text from your "PersonalPins.config.json" file located in your BD Plugins folder.
          </TextArea>
          <TextInput
            note='You can add the notes to pre-existing notebooks!'
            defaultValue={'PersonalPins'}
            required={false}
            onChange={value => setNotebook(value)}>
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