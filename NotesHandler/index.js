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
			fs.writeFileSync(notesPath, JSON.stringify({}, null, '\t'))
		}
	}

	getNotes = () => {
		this.initNotes()
		return JSON.parse(fs.readFileSync(notesPath))
	}

	getNote = (noteName) => {
		let note
		try {
			note = this.getNotes()[noteName]
		} catch {
			return null
		}
		return note
	}

	setNote = (noteData) => {
		this.initNotes()
		let notes
		try {
			notes = this.getNotes()
		} catch {
			return
		}
		let messageId = Object.keys(noteData)[0]
		/* Create a new object array with the key set as the MessageID */
		notes[noteData[messageId]] = {}
		/* Define 'newNoteData' as this new object array */
		let newNoteData = notes[noteData[messageId]]
		//fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
		for (let i = 0; i < Object.keys(noteData).length; i++) {
			let noteDataName = Object.keys(noteData)[i]
			let noteDataValue = noteData[noteDataName]
			newNoteData[noteDataName] = noteDataValue
		}
		fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
	}
    deleteNote = (noteName) => {
        this.initNotes()
        let notes
		try {
			notes = this.getNotes()
		} catch {
			return
		}
        if(this.getNote(noteName)){
            delete notes[noteName]
        }
        fs.writeFileSync(notesPath, JSON.stringify(notes, null, '\t'))
    }
}

module.exports = NotesHandler
