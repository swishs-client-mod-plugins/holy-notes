import React from 'react'

import { FormTitle, Modal, Button } from '@vizality/components'
import { TextInput } from '@vizality/components/settings'
import { close as closeModal } from '@vizality/modal'

const NotesHandler = new (require('../NotesHandler'))()
class CreateModal extends React.PureComponent {
  constructor(props) {
		super(props)
    props.value
  }

  render() {
    return(
      <Modal className='TextModal' size={Modal.Sizes.SMALL}>
				<Modal.Header>
					<FormTitle tag='h3'>Create Notebook</FormTitle>
					<Modal.CloseButton onClick={closeModal}/>
				</Modal.Header>
				<Modal.Content>
          <TextInput
            value={this.range}
            required={false}
            onChange={value => this.value = value}
          >
            Notebook Name
          </TextInput>
				</Modal.Content>
				<Modal.Footer>
					<Button
						onClick={() => { 
              NotesHandler.newNotebook(this.value)
              closeModal()
            }}
						color={Button.Colors.GREEN}
					>
						Create Notebook
					</Button>
					<Button
						onClick={closeModal}
						look={Button.Looks.LINK}
						color={Button.Colors.TRANSPARENT}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
    )
  }
}
module.exports = CreateModal