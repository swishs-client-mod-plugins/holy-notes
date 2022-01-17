const { Plugin } = require('powercord/entities')
const { Tooltip } = require('powercord/components')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { open: openModal } = require('powercord/modal')
const { findInReactTree } = require('powercord/util')

const NotesHandler = new (require('./NotesHandler'))()
const NotebookButton = require('./components/icons/NotebookButton')
const NoteButton = require('./components/icons/NoteButton');
const NotebookModal = require('./components/modals/Notebook')

module.exports = class Notebook extends Plugin {
  async startPlugin() {
    this._injectHeaderBarContainer()
    this._injectContextMenu()
    this._injectToolbar()

    this.loadStylesheet('style.scss')
  }

  pluginWillUnload() {
    uninject('holy-header-bar')
    uninject('holy-context-menu')
    uninject('holy-toolbar')
    uninject('holy-context-lazy-menu')
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
    this.lazyPatchContextMenu('MessageContextMenu', MessageContextMenu => {
			const { MenuGroup, MenuItem } = getModule(['MenuGroup', 'MenuItem'], false)
			inject('holy-context-menu', MessageContextMenu, 'default', (args, res) => {
    if (!MessageContextMenu) return;

      if (!findInReactTree(res, c => c.props?.id == 'notebook')) res.props.children.splice(4, 0,
        React.createElement(MenuGroup, null, React.createElement(MenuItem, {
          action: () => NotesHandler.addNote(args[0], 'Main'),
          id: 'notebook', label: 'Note Message'
        }, Object.keys(NotesHandler.getNotes()).map(notebook =>
          React.createElement(MenuItem, {
            label: `Add to ${notebook}`, id: notebook,
            action: () => NotesHandler.addNote(args[0], notebook)
              })
            ))
          ))
          return res
        })
        MessageContextMenu.default.displayName = 'MessageContextMenu'
      })
    }

  async lazyPatchContextMenu(displayName, patch) {
		const filter = m => m.default && m.default.displayName === displayName
		const m = getModule(filter, false)
		if (m) patch(m)
		else {
			const module = getModule([ 'openContextMenuLazy' ], false)
			inject('holy-context-lazy-menu', module, 'openContextMenuLazy', args => {
				const lazyRender = args[1]
				args[1] = async () => {
					const render = await lazyRender(args[0])

					return (config) => {
						const menu = render(config)
						if (menu?.type?.displayName === displayName && patch) {
							uninject('holy-context-lazy-menu')
							patch(getModule(filter, false))
							patch = false
						}
						return menu
					}
				}
				return args
			}, true)
		}
  }

  async _injectToolbar() {
    const MiniPopover = await getModule((m) => m?.default?.displayName === 'MiniPopover');
    inject('holy-toolbar', MiniPopover, 'default', (args, res) => {
        const props = findInReactTree(res, (r) => r?.message);
        const channel = findInReactTree(args, (r) => r?.channel);
        if (!props) return res;
        res.props.children.unshift(
            React.createElement(NoteButton, {
                message: props.message,
                channel: channel.channel
            })
        );
        return res;
    });
    MiniPopover.default.displayName = 'MiniPopover';
  }
}
