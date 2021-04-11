/* Credits to Kyza for making this custom SettingsHandler */
const fs = require('fs')
const path = require('path')
const notesPath = path.join(__dirname, 'notes.json')

class NotesHandler {
	constructor() {
		this.initNotes()
	}

	initNotes = () => {
		if (!fs.existsSync(notesPath)) {
			fs.writeFileSync(notesPath, JSON.stringify({ 'Main': {} }, null, '\t'))
		}
	}

	getNotes = () => {
		this.initNotes()
		return JSON.parse(fs.readFileSync(notesPath))
	}

	addNote = (noteData, notebook) => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }

		let noteFormat = {
			[noteData.message.id]: {
				id: noteData.message.id,
				channel_id: noteData.channel.id,
				guild_id: noteData.channel.guild_id,
				content: noteData.message.content,
				author: {
					id: noteData.message.author.id,
					avatar: noteData.message.author.avatar,
					discriminator: noteData.message.author.discriminator,
					username: noteData.message.author.username,
				},
				timestamp: noteData.message.timestamp,
				attachments: noteData.message.attachments,
				embeds: noteData.message.embeds,
				reactions: noteData.message.reactions
			}
		}

		Object.assign(notes[notebook], noteFormat)
		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}

	deleteNote = (note, notebook) => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }

		delete notes[notebook][note]

		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}

	moveNote = (note, toNotebook, fromNotebook) => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }

		delete notes[fromNotebook][note.id]
		Object.assign(notes[toNotebook], { [note.id]: note })
		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}

	newNotebook = (name) => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }

		Object.assign(notes, { [name]: {} })
		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}

	deleteNotebook = (notebook) => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }

		delete notes[notebook]
		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}

	parseBDNotes = (data, notebook) => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }
		if (!Object.keys(notes).includes(notebook))
			Object.assign(notes, { [notebook]: {} })
		let BDNotes = JSON.parse(data).notes

		for (let guildID in BDNotes) {
			for (let channelID in BDNotes[guildID]) {
				for (let messageID in BDNotes[guildID][channelID]) {
					let note = JSON.parse(BDNotes[guildID][channelID][messageID].message)
					Object.assign(notes[notebook], {
						[note.id]: {
							id: note.id,
							channel_id: channelID,
							guild_id: guildID,
							content: note.content,
							author: {
								id: note.author.id,
								avatar: note.author.avatar,
								discriminator: note.author.discriminator,
								username: note.author.username,
							},
							timestamp: note.timestamp,
							attachments: note.attachments,
							embeds: note.embeds,
							reactions: note.reactions
						}
					})
				}
			}
		}
		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}

	refreshAvatars = async () => {
		this.initNotes()
		let notes
		try { notes = this.getNotes() }
		catch { return }

		const { getModule } = require('powercord/webpack')
		const User = getModule(m => m?.prototype?.tag, false)
		const getCachedUser = getModule(['getCurrentUser'], false).getUser
		const fetchUser = getModule(['getUser'], false).getUser

		for (let notebook in notes) {
			for (let noteID in notes[notebook]) {
				let note = notes[notebook][noteID]
				let user = getCachedUser(note.author.id)
					?? await fetchUser(note.author.id)
					?? new User({ ...note.author })

				Object.assign(notes[notebook][noteID].author, {
					avatar: user.avatar,
					discriminator: user.discriminator,
					username: user.username
				})
			}
		}

		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}
}

module.exports = NotesHandler