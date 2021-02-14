const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { Card } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { FormTitle, Text } = require('powercord/components')
const { close: closeModal } = require('powercord/modal')
const { Avatar } = getModule(['Avatar'], false)
const { ListItem } = getModule(['ListItem'], false)
const NotesHandler = new (require('../NotesHandler'))()

class noteDisplay extends React.PureComponent {
  constructor(props) {
	super(props)
  }


  async componentDidMount() {
  }

  render() {
	const notes = NotesHandler.getNotes()
	console.log(notes)
	console.log(notes.length)
	console.log(Object.keys(notes).length)

	const noteArray = []
	const userId = []

	/* First option: A for loop just pushes a ton of stuff to an array to display later, so it's basically just displaying the note in plain text (looks awful) */
	for(let i = 0; i < Object.keys(notes).length; i++) {
		let note = notes[Object.keys(notes)[i]]
		userId.push(note['User_ID'])
        noteArray.push(<Avatar style={{'position' : 'absolute'}} src={note['Avatar_URL']} size='SIZE_40'/>)
		noteArray.push(<span style={{
		  'color' : 'white', 
		  'position' : 'absolute', 
		  'padding-left' : '10px', 
		  'margin-top' : '23px'
		}}>{note['Username']}</span>)
		noteArray.push(<Text selectable={true} style={{'padding-left': '50px', 'position': 'absolute'}}>{note['Content']}</Text>)
        for(let j=0; j<(note['Content'].length/100+1);j++){
        	noteArray.push(<br/>)
        }
    
	return(	
	  <Modal className='Notebook' size={Modal.Sizes.LARGE}>
		<Modal.Header>
        		<FormTitle tag='h3'>Notebook</FormTitle>
        		<Modal.CloseButton onClick={closeModal}/>
    		</Modal.Header>
		<Modal.Content>
            		{noteArray}
    		</Modal.Content>
	  </Modal>
	)
  }
}

module.exports = noteDisplay
