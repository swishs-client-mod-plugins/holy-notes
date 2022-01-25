const { Modal } = require('powercord/components/modal');
const { close: closeModal, open: openModal } = require('powercord/modal');
const { React, React: { useState }, getModule, contextMenu } = require('powercord/webpack');
const { TabBar, AdvancedScrollerThin, Button, FormTitle, Icon, Text, Flex } = require('powercord/components');

const HelpModal = require('./HelpModal');
const RenderMessage = require('../sections/RenderMessage');
const NoResultsMessage = require('../sections/NoResultsMessage');
const NotebookManagementButton = require('../sections/NotebookManagementButton');

const Classes = {
	TabBar: getModule(['tabBarContainer'], false),
	QuickSelect: getModule(['quickSelect'], false)
};

const NotesHandler = new (require('../../NotesHandler'))();
const ContextMenu = getModule(['MenuGroup', 'MenuItem'], false);
const SearchBar = getModule(m => m.defaultProps?.useKeyboardNavigation, false);

const NotebookRender = ({ notes, notebook, updateParent, sortDirection, sortType, searchInput }) => {
	if (Object.keys(notes).length === 0) {
		return <NoResultsMessage error={false} />;
	} else {
		let messageArray;
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
			).sort((a, b) => new Date(b.props.note.timestamp) - new Date(a.props.note.timestamp));
		if (sortDirection) messageArray.reverse();

		/* Search Filter */
		if (searchInput && searchInput !== '')
			messageArray = messageArray.filter(m =>
				m.props.note.content.toLowerCase()
					.indexOf(searchInput.trim()) > -1);
		return messageArray;
	}
};

module.exports = () => {
	const [sortType, setSortType] = useState(true);
	const [searchInput, setSearchInput] = useState('');
	const [sortDirection, setSortDirection] = useState(true);
	const [currentNotebook, setCurrentNotebook] = useState('Main');
	// since hooks don't have a native forceUpdate() function this is the easisest workaround
	const forceUpdate = useState(0)[1];
	const notes = NotesHandler.getNotes()[currentNotebook];
	if (!notes) return <></>;
	return (
		<Modal className='notebook' size={Modal.Sizes.LARGE} style={{ borderRadius: '8px' }}>
			<Flex className={`notebook-flex`} direction={Flex.Direction.VERTICAL} style={{ width: '100%' }}>
				<div className={Classes.TabBar.topSectionNormal}>
					<Modal.Header className={`${Classes.TabBar.header} notebook-header-main`}>
						<FormTitle tag='h4' className='notebook-heading'>
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
					<div className={Classes.TabBar.tabBarContainer}>
						<TabBar
							className={`${Classes.TabBar.tabBar} notebook-tabbar`}
							selectedItem={currentNotebook}
							type={TabBar.Types.TOP}
							onItemSelect={setCurrentNotebook}>
							{Object.keys(NotesHandler.getNotes()).map(notebook =>
								<TabBar.Item id={notebook} className={`${Classes.TabBar.tabBarItem} notebook-tabbar-item`}>
									{notebook}
								</TabBar.Item>
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
				<NotebookManagementButton
					notebook={currentNotebook}
					setNotebook={setCurrentNotebook} />
				<Button
					style={{ paddingLeft: '5px', paddingRight: '10px' }}
					look={Button.Looks.LINK}
					color={Button.Colors.TRANSPARENT}
					onClick={closeModal}>
					Cancel
				</Button>
				<div className='sort-button-container notebook-display-left'>
					<Flex align={Flex.Align.CENTER} className={Classes.QuickSelect.quickSelect} onClick={(event) => {
						contextMenu.openContextMenu(event, () => (
							<ContextMenu.default onClose={contextMenu.closeContextMenu}>
								<ContextMenu.MenuItem
									label='Ascending / Date Added' id='ada'
									action={() => { setSortDirection(true); setSortType(true); }} />
								<ContextMenu.MenuItem
									label='Ascending / Message Date' id='amd'
									action={() => { setSortDirection(true); setSortType(false); }} />
								<ContextMenu.MenuItem
									label='Descending / Date Added' id='dda'
									action={() => { setSortDirection(false); setSortType(true); }} />
								<ContextMenu.MenuItem
									label='Descending / Message Date' id='dmd'
									action={() => { setSortDirection(false); setSortType(false); }} />
							</ContextMenu.default>
						));
					}}>
						<Text className={Classes.QuickSelect.quickSelectLabel}>Change Sorting:</Text>
						<Flex grow={0} align={Flex.Align.CENTER} className={Classes.QuickSelect.quickSelectClick}>
							<Text class={Classes.QuickSelect.quickSelectValue}>
								{sortDirection ? 'Ascending' : 'Descending'} /
								{sortType ? ' Date Added' : ' Message Date'}
							</Text>
							<div className={Classes.QuickSelect.quickSelectArrow} />
						</Flex>
					</Flex>
					<div />
				</div>
			</Modal.Footer>
		</Modal>
	);
};