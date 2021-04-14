import React from 'react'

import { Plugin } from '@vizality/entities'
import { patch, unpatch } from '@vizality/patcher'
import { getModule, getModuleByDisplayName } from '@vizality/webpack'
import { findInReactTree } from '@vizality/util/react'
import { Tooltip } from '@vizality/components'
import { joinClassNames } from '@vizality/util/dom'
import { open as openModal } from '@vizality/modal'

import NotebookButton from './components/icons/NotebookButton'
import NotebookModal from './components/modals/Notebook'

const NotesHandler = new (require('./NotesHandler'))()
export default class Notebook extends Plugin {
  async start() {
    // Styles
    this.injectStyles('style.scss')

    // Patches
    this._patchHeaderBarContainer()
    this._patchContextMenu()
  }

  stop() {
    unpatch('holy-header-bar')
    unpatch('holy-context-menu')
  }

  async _patchHeaderBarContainer () {
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer')
    const classes = await getModule('iconWrapper', 'clickable')
    patch('holy-header-bar', HeaderBarContainer.prototype, 'render', (_args, res)=> {
      const toolbarButtons = res?.props.toolbar?.props.children

      toolbarButtons?.splice(
        toolbarButtons.length - 2,
        0,
        <Tooltip text='Notebook' position='bottom'>
          <div
            className={joinClassNames(
              'note-button',
              classes.iconWrapper,
              classes.clickable
            )}
          >
            <NotebookButton
              className={joinClassNames('note-button', classes.icon)}
              onClick={() => openModal(() => <NotebookModal />)}
            />
          </div>
        </Tooltip>
      )
      return res
    })
  }

  async _patchContextMenu() {
    const Menu = await getModule('MenuGroup', 'MenuItem')
    const MessageContextMenu = await getModule(m => m?.default?.displayName === 'MessageContextMenu')
    patch('holy-context-menu', MessageContextMenu, 'default', (args, res) => {
      if (!findInReactTree(res, c => c?.props?.id == 'notebook')) res.props.children.splice(4, 0,
        <Menu.MenuGroup>
          <Menu.MenuItem
            label='Note Message' id='note-message'
            action={() => NotesHandler.addNote(args[0], 'Main')}>
            {Object.keys(NotesHandler.getNotes()).map(notebook => 
              <Menu.MenuItem
                label={`Add to ${notebook}`} id={notebook}
                action={() => NotesHandler.addNote(args[0], notebook)}/>
            )}
          </Menu.MenuItem>
        </Menu.MenuGroup>)
      return res
    })
  }
}