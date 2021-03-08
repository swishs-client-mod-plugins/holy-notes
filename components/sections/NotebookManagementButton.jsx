import React from 'react'

import { Button } from '@vizality/components'
import { open as openModal } from '@vizality/modal'

import DeleteNotebook from '../modals/DeleteNotebook'
import CreateNotebook from '../modals/CreateNotebook'

export default ({ notebook }) => {
	if (notebook != 'Main') {
		return <>
			<Button
				color={Button.Colors.RED}
				onClick={() => openModal(() => <DeleteNotebook notebook={notebook}/>)}>
				Delete Notebook
			</Button>
		</>
	} else {
		return <>
			<Button
				color={Button.Colors.GREEN}
				onClick={() => openModal(() => <CreateNotebook/>)}>
				Create Notebook
			</Button>
		</>
	}
}