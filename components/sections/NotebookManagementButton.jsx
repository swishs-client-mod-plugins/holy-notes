const { Button } = require('powercord/components')
const { open: openModal } = require('powercord/modal')
const { React } = require('powercord/webpack')

const DeleteNotebook = require('../modals/DeleteNotebook')
const CreateNotebook = require('../modals/CreateNotebook')

module.exports = ({ notebook }) => {
	if (notebook != 'Main') {
		return <>
			<Button
				color={Button.Colors.RED}
				onClick={() => openModal(() => <DeleteNotebook notebook={notebook} />)}>
				Delete Notebook
			</Button>
		</>
	} else {
		return <>
			<Button
				color={Button.Colors.GREEN}
				onClick={() => openModal(() => <CreateNotebook />)}>
				Create Notebook
			</Button>
		</>
	}
}