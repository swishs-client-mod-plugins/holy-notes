import React, { memo } from 'react'

import { Markdown } from '@vizality/components'
import { FormTitle, Modal, AdvancedScrollerThin, Button } from '@vizality/components'
import { close as closeModal, open as openModal } from '@vizality/modal'

import BDModal from './ImportModal'

const markdown =`
#### Adding Notes
To add a note right click on a message then hover over the "Note Message" item and click the button with the notebook name you would like to note the message to.

Protip: Clicking the "Note Message" button by itself will note to Main by default! 

---
#### Deleting Notes
Note you can either right click the note and hit "Delete Note" or you can hold the 'DELETE' key on your keyboard and click on a note; it's like magic!

---
#### Moving Notes
To move a note right click on a note and hover over the "Move Note" item and click on the button corrosponding to the notebook you would like to move the note to.

---
#### Jump to Message
To jump to the location that the note was originally located at just right click on the note and hit "Jump to Message".`

export default memo(() => {
  return (
    <Modal className='help-modal' size={Modal.Sizes.MEDIUM}>
      <Modal.Header>
        <FormTitle tag='h3'>Help Modal</FormTitle>
        <Modal.CloseButton onClick={closeModal}/>
      </Modal.Header>
      <Modal.Content>
        <AdvancedScrollerThin fade={true}>
          <Markdown source={markdown}/>
        </AdvancedScrollerThin>
      </Modal.Content>
      <Modal.Footer>
        <Button
          onClick={() => openModal(() => <BDModal/>)}>
          Import from BD
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
})