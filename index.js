const { Plugin } = require('powercord/entities')
const { Tooltip} = require('powercord/components')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName} = require('powercord/webpack')
const { open: openModal } = require('powercord/modal')
const { findInReactTree } = require('powercord/util')
const NotesHandler = new (require('./NotesHandler'))()

/* TODO: (cancelled due to recent events)
Inject into not only messagecontext but the 3 dot message menu as well
Create simulated channel and add messages
Replace the word "settings" with "notes" in Modal.jsx
*/

const NotebookButton = require('./components/NotebookButton')
const Modal = require('./components/Modal')

module.exports = class Notebook extends Plugin {
  async startPlugin () {
    this._injectHeaderBarContainer()
    this._injectContextMenu()
  }

  pluginWillUnload () {
    uninject('note-button')
    uninject('note-context-menu')
  }

  async _injectHeaderBarContainer () {
      const classes = await getModule([ 'iconWrapper', 'clickable' ])
      const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer')
      inject('note-button', HeaderBarContainer.prototype, 'renderLoggedIn', (args, res) => {
        const Switcher = React.createElement(Tooltip, {
          text: 'Notebook',
          position: 'bottom'
        }, React.createElement('div', {
          className: [ 'note-button', classes.iconWrapper, classes.clickable ].join(' ')
        }, React.createElement(NotebookButton, {
          className: [ 'note-button', classes.icon ].join(' '),
          onClick: () =>
            openModal(() => React.createElement(Modal))
        })))
        if (!res.props.toolbar) {
          res.props.toolbar = Switcher
        } else {
          res.props.toolbar.props.children.push(Switcher)
        }
      return res
    })
  }

  async _injectContextMenu() {
    const Menu = await getModule(['MenuGroup', 'MenuItem'])
    const MessageContextMenu = await getModule(m => m.default && m.default.displayName == 'MessageContextMenu')
    inject('note-context-menu', MessageContextMenu, 'default', (args, res) => {
      if (!findInReactTree(res, c => c.props && c.props.id == 'notebook')) res.props.children.splice(4, 0,
        React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
          action: () => this.saveMessage(args),
          id: 'notebook',
          label: 'Note Message'
        })
      )) 
      return res
    })
    MessageContextMenu.default.displayName = 'MessageContextMenu'
  }

  saveMessage(args) {
    let attachments = args[0].message.attachments[0]
    let noteFormat = {
      'Message ID' : args[0].message.id,
      'Username' : args[0].message.author.username,
      'User ID' : args[0].message.author.id,
      'Content' : args[0].message.content,
      'Timestamp' : args[0].message.timestamp,
      'Editstamp' : args[0].message.editedTimestamp,
      'Message URL' : `https://discord.com/channels/${args[0].channel.guild_id}/${args[0].channel.id}/${args[0].message.id}`,
      'Avatar URL' : `https://cdn.discordapp.com/avatars/${args[0].message.author.id}/${args[0].message.author.avatar}.png`
    }
    if (attachments) noteFormat['Attachment'] = attachments.url
    NotesHandler.setNote(noteFormat)
  }
}