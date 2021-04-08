const { Plugin } = require('powercord/entities')
const { Tooltip } = require('powercord/components')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { open: openModal } = require('powercord/modal')
const { findInReactTree } = require('powercord/util')

const NotesHandler = new (require('./NotesHandler'))()
const NotebookButton = require('./components/icons/NotebookButton')
const NotebookModal = require('./components/modals/Notebook')

module.exports = class Notebook extends Plugin {
  async startPlugin() {
    this._injectHeaderBarContainer()
    this._injectContextMenu()

    this.loadStylesheet('style.scss')
  }

  pluginWillUnload() {
    uninject('holy-header-bar')
    uninject('holy-context-menu')
  }

  async _injectHeaderBarContainer() {
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer')
    const classes = await getModule(['iconWrapper', 'clickable'])
    inject('holy-header-bar', HeaderBarContainer.prototype, 'render', (args, res) => {
      res.props.toolbar.props.children.push(
        React.createElement(Tooltip, {
          text: 'Notebook', position: 'bottom'
        }, React.createElement('div', {
          className: `note-button ${classes.iconWrapper} ${classes.clickable}`
        }, React.createElement(NotebookButton, {
          className: `note-button ${classes.icon}`,
          onClick: () =>
            openModal(() => React.createElement(NotebookModal))
        }))))
      return res
    })
  }

  async _injectContextMenu() {
    const Menu = await getModule(['MenuGroup', 'MenuItem'])
    const MessageContextMenu = await getModule(m => m.default?.displayName === 'MessageContextMenu')
    inject('holy-context-menu', MessageContextMenu, 'default', (args, res) => {
      if (!findInReactTree(res, c => c.props?.id == 'notebook')) res.props.children.splice(4, 0,
        React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
          action: () => NotesHandler.addNote(args[0], 'Main'),
          id: 'notebook', label: 'Note Message'
        }, Object.keys(NotesHandler.getNotes()).map(notebook =>
          React.createElement(Menu.MenuItem, {
            label: `Add to ${notebook}`, id: notebook,
            action: () => NotesHandler.addNote(args[0], notebook)
          })
        ))
      ))
      return res
    })
    MessageContextMenu.default.displayName = 'MessageContextMenu'
  }
}
