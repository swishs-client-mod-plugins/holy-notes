import React, { useState } from 'react'

import { getModule } from '@vizality/webpack'
import { TabBar, AdvancedScrollerThin, Button, Tooltip, SearchBar } from '@vizality/components'
import { FormTitle, Flex, Modal, Icon, ErrorBoundary } from '@vizality/components'
import { close as closeModal, open as openModal } from '@vizality/modal'
import { useForceUpdate } from '@vizality/hooks'

import NoResultsMessage from '../sections/NoResultsMessage'
import RenderMessage from '../sections/RenderMessage'
import NotebookManagementButton from '../sections/NotebookManagementButton'
import HelpModal from './HelpModal'

const NotesHandler = new (require('../../NotesHandler'))()

const classes = {
	...getModule('tabBarContainer')
}

const NotebookRender = ({ notes, notebook, updateParent, sortDirection, sortType, searchInput }) => {
	if (Object.keys(notes).length === 0) {
		return ( <NoResultsMessage error={false}/> )
	} else {
		let MessageArray
		sortType ?
			MessageArray = Object.keys(notes).map(note =>
				<RenderMessage
					note={notes[note]}
					notebook={notebook}
					updateParent={updateParent}
					fromDeleteModal={false}
					closeModal={closeModal}/>
			) :
			MessageArray = Object.keys(notes).map(note =>
				<RenderMessage
					note={notes[note]}
					notebook={notebook}
					updateParent={updateParent}
					fromDeleteModal={false}
					closeModal={closeModal}/>
			).sort((a, b) => new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp))
		if (!sortDirection) MessageArray.reverse()

		/* Search Filter */
		if (searchInput && searchInput !== '')
			MessageArray = MessageArray.filter(m =>
				m.props.note.content.toLowerCase()
					.indexOf(searchInput.trim()) > -1)
		return (MessageArray)
	}
}

export default () => {
	const [CurrentNotebook, setCurrentNotebook] = useState('Main')
	const [SearchInput, setSearchInput] = useState('')
	const [SortDirection, setSortDirection] = useState(false)
	const [SortType, setSortType] = useState(false)
	const forceUpdate = useForceUpdate()
	const notes = NotesHandler.getNotes()[CurrentNotebook]
	return (
		<Modal className='notebook' size={Modal.Sizes.LARGE} style={{ borderRadius: '8px' }}>
			<Flex className={`notebook-flex`} direction={Flex.Direction.VERTICAL} style={{ width: '100%' }}>
				<div className={classes.topSectionNormal}>
					<Modal.Header className={classes.header}>
						<FormTitle tag='h4' className='notebook-header'>
							NOTEBOOK
						</FormTitle>
						<Icon
							className='help-icon' name='HelpCircle'
							onClick={() => openModal(() => <HelpModal/>)}/>
						<SearchBar
							className={'notebook-search'}
							size={SearchBar.Sizes.MEDIUM}
							autofocus={false}
							placeholder='Search'
							onChange={query => setSearchInput(query)}
       				onClear={() => setSearchInput('')}
							query={SearchInput}/>
						<Modal.CloseButton onClick={closeModal}/>
					</Modal.Header>
					<div className={classes.tabBarContainer}>
						<TabBar
							className={classes.tabBar}
							selectedItem={CurrentNotebook}
							type={TabBar.Types.TOP}
							onItemSelect={setCurrentNotebook}>
							{Object.keys(NotesHandler.getNotes()).map(notebook =>
								<TabBar.Item className={classes.tabBarItem} id={notebook}>{notebook}</TabBar.Item>
							)}
						</TabBar>
					</div>
				</div>
				<Modal.Content>
					<AdvancedScrollerThin fade={true}>
						<ErrorBoundary>
							<NotebookRender
								notes={notes}
								notebook={CurrentNotebook}
								updateParent={() => forceUpdate()}
								sortDirection={SortDirection}
								sortType={SortType}
								searchInput={SearchInput}/>
						</ErrorBoundary>
					</AdvancedScrollerThin>
				</Modal.Content>
			</Flex>
			<Modal.Footer>
				<NotebookManagementButton notebook={CurrentNotebook}/>
				<Button
					style={{ paddingLeft : '5px', paddingRight : '10px' }}
					look={Button.Looks.LINK}
					color={Button.Colors.TRANSPARENT}
					onClick={closeModal}>
					Cancel
				</Button>
				<div className='sort-button-container'>
					<Button
						className='sort-button-text'
						color={Button.Colors.TRANSPARENT}
						onClick={() => setSortType(!SortType)}>
						{SortType ? 'Date Added' : 'Message Date'}
					</Button>
					<Button
						className='sort-button-icon'
						color={Button.Colors.TRANSPARENT}
						onClick={() => setSortDirection(!SortDirection)}>
						{SortDirection
							? <Tooltip text='New to Old' position='top'>
									<Icon name='ArrowDropDown'/>
								</Tooltip>
							: <Tooltip text='Old to New' position='top'>
									<Icon name='ArrowDropUp'/>
								</Tooltip>
						}
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	)
}