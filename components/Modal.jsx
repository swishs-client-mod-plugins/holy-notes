import React from 'react'

import { getModule, contextMenu, getModules } from '@vizality/webpack'
import { TabBar, AdvancedScrollerThin, Button, Tooltip } from '@vizality/components'
import { FormTitle, Flex, Modal, ContextMenu, Icon, ErrorBoundary } from '@vizality/components'
import { close as closeModal, open as openModal } from '@vizality/modal'
import { clipboard } from 'electron'

import DeleteModal from './DeleteModal'
import CreateModal from './CreateModal'
import HelpModal from './HelpModal'

const { transitionTo } = getModule('transitionTo')
const User = getModule(m => m?.prototype?.tag)
const SearchBar = getModules(m => Object.values(m).includes('SearchBar'))[1]
const NotesHandler = new (require('../NotesHandler'))()
const ChannelMessage = getModule(m => m?.type?.displayName === 'ChannelMessage')
const MessageC = getModule(m => m?.prototype?.getReaction && m.prototype.isSystemDM)
const Channel = { isPrivate: () => false, isSystemDM: () => false, getGuildId: () => 'uwu' }

/* Delete Key Detection */
let isHoldingDelete = false

const deleteToggle = (e) => {
	if (e.key === 'Delete') {
		if (e.type === 'keydown') {
			isHoldingDelete = true
		} else if (e.type === 'keyup') {
			isHoldingDelete = false
		}
	}
}

document.addEventListener('keydown', deleteToggle)
document.addEventListener('keyup', deleteToggle)

const NotebookManagementButton = ({ notebook }) => {
	if (notebook != 'Main') {
		return (
			<Button
				color={Button.Colors.RED}
				onClick={() => openModal(() => <DeleteModal notebook={notebook}/>)}>
				Delete Notebook
			</Button>
		)
	} else {
		return (
			<Button
				color={Button.Colors.GREEN}
				onClick={() => openModal(() => <CreateModal/>)}>
				Create Notebook
			</Button>
		)
	}
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
					updateParent={updateParent}/>
			) :
			MessageArray = Object.keys(notes).map(note =>
				<RenderMessage
					note={notes[note]}
					notebook={notebook}
					updateParent={updateParent}/>
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

class RenderMessage extends React.PureComponent {
	constructor(props) {
		super(props)

		this.classes = {
			...getModule('cozyMessage')
		}
	}

	render() {
		const { note, notebook, updateParent } = this.props
		// pass copy instead of memory address
		const messageNote = Object.assign({}, note)
		// manual object stuffs
		messageNote.author = new User({...note.author})
		messageNote.timestamp = {
			'toDate' : () => new Date(note.timestamp),
			'locale' : () => 'en' }
		if (messageNote?.embeds[0]?.timestamp)
		messageNote.embeds[0].timestamp = {
			'toDate' : () => new Date(note.timestamp),
			'locale' : () => 'en' }
		return (
			<div className='holy-note'>
				<ChannelMessage
					style={{
						marginBottom: '5px',
						marginTop: '5px',
						paddingTop: '5px',
						paddingBottom: '5px'}}
					className={[
							this.classes.message,
							this.classes.cozyMessage,
							this.classes.groupStart
					].join(' ')}
					message={new MessageC({...messageNote})}
					channel={Channel}
					onClick={() => {
						if (isHoldingDelete) {
							NotesHandler.deleteNote(note.id, notebook)
							updateParent()
						}
					}}
					onContextMenu={event =>
						contextMenu.openContextMenu(event, () =>
							<ContextMenu.Menu onClose={contextMenu.closeContextMenu}>
									<ContextMenu.Item
										label='Jump to Message' id='jump'
										action={() => {
											transitionTo(`/channels/${note.guild_id ? note.guild_id : '@me'}/${note.channel_id}/${note.id}`)
											closeModal()
										}}
									/>
									<ContextMenu.Item
										label='Copy Text' id='ctext'
										action={() => clipboard.writeText(note.content)}
									/>
									<ContextMenu.Item
										color='colorDanger'
										label='Delete Note' id='delete'
										action={() => {
											NotesHandler.deleteNote(note.id, notebook)
											updateParent()
										}}
									/>
									{Object.keys(NotesHandler.getNotes()).length !== 1 ?
										<ContextMenu.Item
											label='Move Note' id='move'>
											{Object.keys(NotesHandler.getNotes()).map(key => {
												if (key != notebook) {
													return (
														<ContextMenu.Item
															label={`Move to ${key}`} id={key}
															action={() => {
																NotesHandler.moveNote(note, key, notebook)
																updateParent()
															}}/>
														)
													}
												}
											)}
										</ContextMenu.Item> : null}
									<ContextMenu.Item
										label='Copy ID' id='cid'
										action={() => clipboard.writeText(note.id)}
									/>
							</ContextMenu.Menu>
						 )
					}
				/>
			</div>
		)
	}
}

class NoResultsMessage extends React.PureComponent {
	constructor(props) {
		super(props)

		this.classes = {
			...getModule('emptyResultsWrap')
		}
	}

	render() {
		const { error } = this.props
		console.log(error)

		if (this.error) { // not functional yet
			return (
				<div className={this.classes.emptyResultsWrap}>
					<div className={this.classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
						<div className={this.classes.errorImage}/>
						<div className={this.classes.emptyResultsText}>
							There was an error parsing your notes! The issue was logged in your console, press CTRL + I to access it! Please visit the support server if you need extra help!
						</div>
					</div>
				</div>
			)
		} else if (Math.floor(Math.random()*100) <= 10) {
			return (
				<div className={this.classes.emptyResultsWrap}>
					<div className={this.classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
						<div className={`${this.classes.noResultsImage} ${this.classes.alt}`}/>
						<div className={this.classes.emptyResultsText}>
							No notes were found. Empathy banana is here for you.
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className={this.classes.emptyResultsWrap}>
					<div className={this.classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
						<div className={this.classes.noResultsImage}/>
						<div className={this.classes.emptyResultsText}>
							No notes were found saved in this notebook.
						</div>
					</div>
				</div>
			)
		}
	}
}

class NoteDisplay extends React.PureComponent {
  constructor(props) {
		super(props)

		this.classes = {
      ...getModule('tabBarContainer')
    }

		this.handleNotebookSwitch = this.handleNotebookSwitch.bind(this)

		this.state = {
      currentNotebook: props.section,
			currentSortDirection: 0,
			currentSortType: 0,
			searchInput: props.input
    }
  }

	handleNotebookSwitch(currentNotebook) {
    this.setState({ currentNotebook })
  }

  render() {
		let currentNotebook
		if (!this.state.currentNotebook) currentNotebook = 'Main'
		else currentNotebook = this.state.currentNotebook

		const notes = NotesHandler.getNotes()[currentNotebook]
		return (
			<Modal className='notebook' size={Modal.Sizes.LARGE} style={{ borderRadius: '8px' }}>
				<Flex className={`notebook-flex`} direction={Flex.Direction.VERTICAL} style={{ width: '100%' }}>
					<div className={this.classes.topSectionNormal}>
						<Modal.Header className={this.classes.header}>
							<FormTitle
								tag='h4' style={{
									paddingBottom: '6px',
									maxWidth: '95px',
									transform: 'scale(0.85)'
								}}>NOTEBOOK
							</FormTitle>
							<Icon
								className='help-icon'
								name='HelpCircle' className='close-hZ94c6'
								onClick={() => openModal(() => <HelpModal/>)}/>
							<SearchBar
								className={'notebook-search'}
								size={SearchBar.Sizes.MEDIUM}
								autofocus={false}
								placeholder='Search'
								onQueryChange={value => {
									this.state.searchInput = value.toLowerCase()
									this.forceUpdate()
								}}
								onClear={() => {
									this.state.searchInput = ''
									this.forceUpdate()
								}}
								query={this.state.searchInput}/>
							<Modal.CloseButton onClick={closeModal}/>
						</Modal.Header>
					</div>
					<div className={this.classes.topSectionNormal}>
						<div className={this.classes.tabBarContainer}>
							<TabBar
								className={this.classes.tabBar}
								selectedItem={currentNotebook}
								type={TabBar.Types.TOP}
								onItemSelect={this.handleNotebookSwitch}>
								{Object.keys(NotesHandler.getNotes()).map(notebook =>
									<TabBar.Item className={this.classes.tabBarItem} id={notebook}>{notebook}</TabBar.Item>
								)}
							</TabBar>
						</div>
					</div>
					<Modal.Content>
						<AdvancedScrollerThin fade={true}>
							<ErrorBoundary>
								<NotebookRender
									notes={notes}
									notebook={currentNotebook}
									updateParent={() => this.forceUpdate()}
									sortDirection={this.state.currentSortDirection}
									sortType={this.state.currentSortType}
									searchInput={this.state.searchInput}/>
							</ErrorBoundary>
						</AdvancedScrollerThin>
					</Modal.Content>
				</Flex>
				<Modal.Footer>
					<NotebookManagementButton notebook={currentNotebook}/>
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
							onClick={() => {
								this.state.currentSortType = !this.state.currentSortType
								this.forceUpdate()
							}}>
							{this.state.currentSortType ? 'Date Added' : 'Message Date'}
						</Button>
						<Button
							className='sort-button-icon'
							color={Button.Colors.TRANSPARENT}
							onClick={() => {
								this.state.currentSortDirection = !this.state.currentSortDirection
								this.forceUpdate()
							}}>
							{this.state.currentSortDirection
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
}

module.exports = NoteDisplay
