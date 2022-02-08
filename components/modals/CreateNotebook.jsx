const { Modal } = require('powercord/components/modal');
const { close: closeModal } = require('powercord/modal');
const { FormTitle, Button } = require('powercord/components');
const { React, getModuleByDisplayName } = require('powercord/webpack');
const { useState } = React;

const TextInput = getModuleByDisplayName('TextInput', false);
const NotesHandler = new (require('../../NotesHandler'))();
module.exports = () => {
	const [notebookName, setNotebookName] = useState('');
	return (
		<Modal className='create-notebook' size={Modal.Sizes.SMALL}>
			<Modal.Header className='notebook-header'>
				<FormTitle tag='h3'>Create Notebook</FormTitle>
				<Modal.CloseButton onClick={closeModal} />
			</Modal.Header>
			<Modal.Content>
				<FormTitle>Notebook Name</FormTitle>
				<TextInput
					hideBorder={true}
					value={notebookName}
					placeholder='JS Snippets'
					onChange={setNotebookName}
					style={{ marginBottom: '10px' }} />
			</Modal.Content>
			<Modal.Footer>
				<Button
					onClick={() => {
						if (notebookName !== '')
							NotesHandler.newNotebook(notebookName);
						closeModal();
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
	);
};