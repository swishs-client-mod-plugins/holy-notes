import React, { useState } from 'react'

import { FormTitle, Modal, AdvancedScrollerThin, Button } from '@vizality/components'
import { close as closeModal } from '@vizality/modal'
import { TextArea } from '@vizality/components/settings'

const NotesHandler = new (require('../../NotesHandler'))()
export default () => {
  const [PersonalPinsData, setPersonalPinsData] = useState('')
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
            onChange={val => setPersonalPinsData(val)}
            placeholder={`{\n  "choices": {\n  "defaultFilter": "channel",\n  "defaultOrder": "ascending",\n  "defaultSort": "notetime"\n  },\n  "notes": {`}
            resizeable={false}
            rows={7}
            value={PersonalPinsData}>
            Input the text from your "PersonalPins.config.json" file located in your BD Plugins folder.
          </TextArea>
        </AdvancedScrollerThin>
      </Modal.Content>
      <Modal.Footer>
        <Button
          color={Button.Colors.GREEN}
          onClick={() => {
            NotesHandler.parseBDNotes(PersonalPinsData)
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