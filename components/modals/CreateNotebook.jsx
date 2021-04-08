const { FormTitle, Button } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { close: closeModal } = require('powercord/modal')
const { TextInput } = require('powercord/components/settings')
const { React } = require('powercord/webpack')
const { useState } = React

const NotesHandler = new (require('../../NotesHandler'))()
module.exports = () => {
	const [NotebookName, setNotebookName] = useState('')
	return (
		<Modal className='create-notebook' size={Modal.Sizes.SMALL}>
			<Modal.Header>
				<FormTitle tag='h3'>Create Notebook</FormTitle>
				<Modal.CloseButton onClick={closeModal} />
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
						if (NotebookName !== '')
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