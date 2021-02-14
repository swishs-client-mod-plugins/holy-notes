const { Plugin } = require('powercord/entities')
const { Tooltip} = require('powercord/components')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName} = require('powercord/webpack')
const { open: openModal } = require('powercord/modal')
const { findInReactTree } = require('powercord/util')
const { getMessage } = getModule(['getMessages'], false)
const NotesHandler = new (require('./NotesHandler'))()

/* TODO:
Inject into the 3 dot message menu
Inject message component into embed
*/

const NotebookButton = require('./components/NotebookButton')
const Modal = require('./components/Modal')

module.exports = class Notebook extends Plugin {
  async startPlugin () {
    this._injectHeaderBarContainer()
    this._injectContextMenu()

    powercord.api.commands.registerCommand({
        command: 'notebook',
        description: 'Add, Get, Delete and List notes',
        usage: '{c} [ args ]',
        executor: (args) => {
            let IDArray
            if(args[1]) IDArray = args[1].split("/")
            let n = Number(args[1])
            let result
            let notes
            let note
            switch(args[0]){               
                case 'write':
                    if(!args[1]) return {
                        send: false,
                        result: 'Please input a valid link'
                    }
                    this.saveMessageFromLink(args[1])
                    return {
                        send: false,
                        result: 'Note **'+IDArray[IDArray.length-1].toString()+'** added'
                    }
                    break
                case 'erase':
                    let messageID
                    notes = NotesHandler.getNotes()
                    if(n.isNaN)return {
                        send: false,
                        result: 'Please input a number or vald ID'
                    }
                    note = notes[Object.keys(notes)[n-1]]
                    //console.log(note)
                    messageID = note['Message_ID'] 
                    if(messageID===undefined)return {
                        send: false,
                        result: '```\nNot a note.\n```'
                    }
                    if(args[2]!=='please'){
                        result = {
                            type: "rich",
                            author: {
                                iconURL: note['Avatar_URL'].replace("png","webm"),
                                name: note['Username'],
                            },
                            footer: {
                                text: note['Timestamp'].replace("T"," ").replace("Z","")
                            },
                            description: note['Content']
                        }
                        if(note['Attachment']) {
                            result['image'] = {
                                url: note['Attachment'],
                                height: note['Height'],
                                width: note['Width']
                            }
                        }
                        result['footer'] = {
                                text: 'If you really want to erase permanently the note '+n.toString()+', as seen above, add "please" at the end of the command. '
                            },
                        //console.log(result)
                        return {
                            send: false,
                            result
                        }
                    }
                    NotesHandler.deleteNote(messageID)
                    return {
                        send: false,
                        result: 'Note **'+n.toString()+'** deleted'
                    }
                    break
                case 'open':
                    if(!n) n = 1
                    notes = NotesHandler.getNotes()
                    if(!Object.keys(notes).length) return {
                        send: false,
                        result: '```\nThere are no notes in your Notebook.\n```'
                    }
                    let end
                    if(Math.floor(Object.keys(notes).length/10) < n || args[1]==='last'){
                        n = Math.floor(Object.keys(notes).length/10)+1
                        end = Object.keys(notes).length
                    }
                    else end = 10*n
                    let out = ''
	                for(let i =10*(n-1); i<end; i++) {	        
                        let note = Object.keys(notes)[i]
                        //console.log(note)
                        let noteID = i+1
                        let noteUser = notes[note]["Username"]         
                        out+= '**Note '+noteID.toString()+"** by *"+ noteUser+"*:\n```"
                        let contentwords = notes[note]["Content"].split(" ")
                        for(let i = 0; i<contentwords.length && i<10; i++) out+=" "+contentwords[i]
                        if(contentwords.length>10) out+= "..."
                        out+='\n```'
                    }
                    result = {
                        type: 'rich',
                        title: 'Notebook (page '+ n.toString() +')\nNotes '+ (10*(n-1)+1).toString() +" to "+ end.toString() +':',
                        description: out
                    };     
                    return {
                        send: false,
                        result
                    }
                    break
                case 'read':
                    if(n.isNaN)return {
                        send: false,
                        result: '`Not a note.`'
                    }
                    notes = NotesHandler.getNotes()
                    note = notes[Object.keys(notes)[n-1]]
                    if(note===undefined)return {
                        send: false,
                        result: '```\nNot a note.\n```'
                    }
                    result = {
                        type: "rich",
                        author: {
                            iconURL: note['Avatar_URL'].replace("png","webm"),
                            name: note['Username'],
                        },
                        footer: {
                            text: note['Timestamp'].replace("T"," ").replace("Z","")
                        },
                        description: note['Content']
                    }
                    if(note['Attachment']) {
                        result['image'] = {
                            url: note['Attachment'],
                            height: note['Height'],
                            width: note['Width']
                        }
                    }
                    return {
                        send: false,
                        result
                    }
                    break
            }
        },
        autocomplete: (args) => {
			if (args.length !== 1) {
				return false;
			}
            let options = {
                read: 'Shows Note as embed given it\'s number',
                open: 'Opens the Nth Page of Notebook, with 10 notes/page.',
                write: 'Writes Note given it\'s message link',
                erase: 'Erases Note from your Notebook given it\'s number. As a safe measuere, type \'confirm\' after it.'
            }
			return {
				commands: Object.keys(options)
					.filter((option) => option.includes(args[0].toLowerCase()))
					.map((option) => ({
						command: option,
						description: options[option],
					})),
				header: 'Notebook commands',
			};
		}
    }) 
  }
  pluginWillUnload () {
    uninject('note-button-dev')
    uninject('note-context-menu-dev')
    powercord.api.commands.unregisterCommand('Notebook')
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
    if (attachments) {
        noteFormat['Attachment'] = attachments.url
        noteFormat['Height'] = attachments.height
        noteFormat['Width'] = attachments.width
    }
    NotesHandler.setNote(noteFormat)
  }
  //The obvious modifying saveMessage() broke in a weird way, and i don't have time to make this in a prettier way, so...
  saveMessageFromLink(args) {
    let linkArray = args.split("/")         
    let message= getMessage(linkArray[linkArray.length-2],linkArray[linkArray.length-1])
    //console.log(message)   
    let attached = message.attachments[0]
    let noteFormat = {
      'Message_ID' : message.id,
      'Username' : message.author.username,
      'User_ID' : message.author.id,
      'Content' : message.content,
      'Timestamp' : message.timestamp,
      'Editstamp' : message.editedTimestamp,
      'Message_URL' : args,
      'Avatar_URL' : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
    }
    if (attached) {
        noteFormat['Attachment'] = attached.url
        noteFormat['Height'] = attached.height
        noteFormat['Width'] = attached.width
    }
    NotesHandler.setNote(noteFormat)
  }
}
