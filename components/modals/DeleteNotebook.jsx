import React from 'react'

import { FormTitle, Modal, AdvancedScrollerThin, Button } from '@vizality/components'
import { close as closeModal } from '@vizality/modal'
import NoResultsMessage from '../sections/NoResultsMessage'

import NoResultsMessage from '../sections/NoResultsMessage'
import RenderMessage from '../sections/RenderMessage'

const NotesHandler = new (require('../../NotesHandler'))()

export default ({ notebook }) => {
	const notes = NotesHandler.getNotes()[notebook]
	return (
		<Modal className='delete-notebook' size={Modal.Sizes.LARGE}>
			<Modal.Header>
				<FormTitle tag='h3'>Confirm Deletion</FormTitle>
				<Modal.CloseButton onClick={closeModal}/>
			</Modal.Header>
			<Modal.Content>
				<AdvancedScrollerThin fade={true}>
					{JSON.stringify(notes) === '{}' || !notes
						? <NoResultsMessage error={false}/> 
						: Object.keys(notes).map(note =>
							 <RenderMessage 
							 	note={notes[note]} 
								notebook={notebook}
								fromDeleteModal={true}
							/>
					)}
				</AdvancedScrollerThin>
			</Modal.Content>
			<Modal.Footer>
				<Button
					onClick={() => {
						NotesHandler.deleteNotebook(notebook)
						closeModal()
					}}
					color={Button.Colors.RED}>
					Delete
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