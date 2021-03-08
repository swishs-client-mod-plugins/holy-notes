import React, { useState } from 'react'

import { FormTitle, Modal, Button } from '@vizality/components'
import { TextInput } from '@vizality/components/settings'
import { close as closeModal } from '@vizality/modal'

const NotesHandler = new (require('../../NotesHandler'))()
export default () => {
	const [NotebookName, setNotebookName] = useState('')
	return(
		<Modal className='create-notebook' size={Modal.Sizes.SMALL}>
			<Modal.Header>
				<FormTitle tag='h3'>Create Notebook</FormTitle>
				<Modal.CloseButton onClick={closeModal}/>
			</Modal.Header>
			<Modal.Content>
				<TextInput
					value={this.range}
					required={false}
					onChange={value => setNotebookName(value)}>
					Notebook Name
				</TextInput>
			</Modal.Content>
			<Modal.Footer>
				<Button
					onClick={() => { 
						if(NotebookName !== '')
							NotesHandler.newNotebook(NotebookName)
						closeModal()
					}}
					color={Button.Colors.GREEN}>
					Create Notebook
				</Button>
				<Button
					onClick={closeModal}
					look={Button.Looks.LINK}
					color={Button.Colors.TRANSPARENT}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	)
}