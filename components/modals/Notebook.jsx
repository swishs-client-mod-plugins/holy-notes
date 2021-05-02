const { TabBar, AdvancedScrollerThin, Button } = require('powercord/components')
const { FormTitle, Flex, Icon, Tooltip } = require('powercord/components')
const { close: closeModal, open: openModal } = require('powercord/modal')
const { React, React: { useState }, getModule } = require('powercord/webpack')
const { Modal } = require('powercord/components/modal')

const NoResultsMessage = require('../sections/NoResultsMessage')
const RenderMessage = require('../sections/RenderMessage')
const NotebookManagementButton = require('../sections/NotebookManagementButton')
const HelpModal = require('./HelpModal')

const NotesHandler = new (require('../../NotesHandler'))()
const SearchBar = getModule(m => m.defaultProps?.useKeyboardNavigation, false)

const NotebookRender = ({ notes, notebook, updateParent, sortDirection, sortType, searchInput }) => {
	if (Object.keys(notes).length === 0) {
		return <NoResultsMessage error={false} />
	} else {
		let messageArray
		sortType ?
			messageArray = Object.keys(notes).map(note =>
				<RenderMessage
					note={notes[note]}
					notebook={notebook}
					updateParent={updateParent}
					fromDeleteModal={false}
					closeModal={closeModal} />
			) :
			messageArray = Object.keys(notes).map(note =>
				<RenderMessage
					note={notes[note]}
					notebook={notebook}
					updateParent={updateParent}
					fromDeleteModal={false}
					closeModal={closeModal} />
			).sort((a, b) => new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp))
		if (!sortDirection) messageArray.reverse()

		/* Search Filter */
		if (searchInput && searchInput !== '')
			messageArray = messageArray.filter(m =>
				m.props.note.content.toLowerCase()
					.indexOf(searchInput.trim()) > -1)
		return messageArray
	}
}

module.exports = () => {
	const classes = getModule(['tabBarContainer'], false)
	const [currentNotebook, setCurrentNotebook] = useState('Main')
	const [searchInput, setSearchInput] = useState('')
	const [sortDirection, setSortDirection] = useState(false)
	const [sortType, setSortType] = useState(false)
	// since hooks don't have a native forceUpdate() function this is the easisest workaround
	const forceUpdate = useState(0)[1]
	const notes = NotesHandler.getNotes()[currentNotebook]
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
							onClick={() => openModal(() => <HelpModal />)} />
						<SearchBar
							className={'notebook-search'}
							size={SearchBar.Sizes.MEDIUM}
							autofocus={false}
							placeholder='Search'
							onQueryChange={query => setSearchInput(query)}
							onClear={() => setSearchInput('')}
							query={searchInput} />
						<Modal.CloseButton onClick={closeModal} />
					</Modal.Header>
					<div className={classes.tabBarContainer}>
						<TabBar
							className={classes.tabBar}
							selectedItem={currentNotebook}
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
						<NotebookRender
							notes={notes}
							notebook={currentNotebook}
							updateParent={() => forceUpdate(u => ~u)}
							sortDirection={sortDirection}
							sortType={sortType}
							searchInput={searchInput} />
					</AdvancedScrollerThin>
				</Modal.Content>
			</Flex>
			<Modal.Footer>
				<NotebookManagementButton notebook={currentNotebook} />
				<Button
					style={{ paddingLeft: '5px', paddingRight: '10px' }}
					look={Button.Looks.LINK}
					color={Button.Colors.TRANSPARENT}
					onClick={closeModal}>
					Cancel
				</Button>
				<div className='sort-button-container notebook-display-left'>
					<Button
						className='sort-button-text'
						color={Button.Colors.TRANSPARENT}
						onClick={() => setSortType(!sortType)}>
						{sortType ? 'Date Added' : 'Message Date'}
					</Button>
					<Button
						className='sort-button-icon'
						color={Button.Colors.TRANSPARENT}
						onClick={() => setSortDirection(!sortDirection)}>
						{sortDirection
							? <Tooltip text='New to Old' position='top'>
								<Icon name='ArrowDropDown' />
							</Tooltip>
							: <Tooltip text='Old to New' position='top'>
								<Icon name='ArrowDropUp' />
							</Tooltip>
						}
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	)
}