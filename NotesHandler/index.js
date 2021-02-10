const { Plugin } = require('powercord/entities')
const { Tooltip} = require('powercord/components')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName} = require('powercord/webpack')
const { open: openModal } = require('powercord/modal')
const { findInReactTree } = require('powercord/util')
const NotesHandler = new (require('./NotesHandler'))()

/* TODO:
Inject into not only messagecontext but the 3 dot message menu as well
Create embed for the messages
*/

const NotebookButton = require('./components/NotebookButton')
const Modal = require('./components/Modal')

module.exports = class Notebook extends Plugin {
  async startPlugin () {
    this._injectHeaderBarContainer()
    this._injectContextMenu()

    powercord.api.commands.registerCommand({
        command: 'ListNotes',
        description: 'Show List of Note\'s message ID and 10 word preview',
        usage: '{c}',
        executor: () => {
            let notes = NotesHandler.getNotes()
        	console.log(notes)
            console.log(Object.keys(notes).length)
            if(!Object.keys(notes).length) return {
                send: false,
                result: '```\nThere are no notes in your Notebook.\n```'
            }
            let out = '**List of notes:**\n\n'
	        for(let i = 0; i < Object.keys(notes).length; i++) {
		        let note = Object.keys(notes)[i]
                let noteID = notes[note]["Message_ID"]
                let noteUser = notes[note]["Username"]         
                out+= '*'+noteID+"* by **"+ noteUser+"**:\n```"
                let contentwords = notes[note]["Content"].split(" ")
                for(let i = 0; i<contentwords.length && i<10; i++) out+=" "+contentwords[i]
                if(contentwords.length>10) out+="..."
                out+='\n```\n'
            }         
            return {
            send: false,
            result: out
            }
            
        }

    })
    powercord.api.commands.registerCommand({
        command: 'GetNote',
        description: 'Show Note given it\'s message ID',
        usage: '{c} [ID]',
        executor: (ID) => {
            let note = NotesHandler.getNote(ID)
            if(!note)return {
                send: false,
                result: '```\nNot a note.\n```'
            }
            return {
                send: false,
                result: '```\n'+note['Content']+'\n```'
            }
        }
    })
    powercord.api.commands.registerCommand({
        command: 'DeleteNote',
        description: 'Deletes Note given it\'s message ID',
        usage: '{c} [ID]',
        executor: (ID) => {
            NotesHandler.deleteNote(ID)
            return {
                send: false,
                result: 'Note **'+ID+'** deleted'
            }
        }
    })
  }
  pluginWillUnload () {
    uninject('note-button')
    uninject('note-context-menu')
    powercord.api.commands.unregisterCommand('GetNote')
    powercord.api.commands.unregisterCommand('ListNotes')
    powercord.api.commands.unregisterCommand('DeleteNote')
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
      'Message_ID' : args[0].message.id,
      'Username' : args[0].message.author.username,
      'User_ID' : args[0].message.author.id,
      'Content' : args[0].message.content,
      'Timestamp' : args[0].message.timestamp,
      'Editstamp' : args[0].message.editedTimestamp,
      'Message_URL' : `https://discord.com/channels/${args[0].channel.guild_id}/${args[0].channel.id}/${args[0].message.id}`,
      'Avatar_URL' : `https://cdn.discordapp.com/avatars/${args[0].message.author.id}/${args[0].message.author.avatar}.png`
    }
    if (attachments) noteFormat['Attachment'] = attachments.url
    NotesHandler.setNote(noteFormat)
  }
}
