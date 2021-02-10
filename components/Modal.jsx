const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { Card } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { FormTitle, Text } = require('powercord/components')
const { close: closeModal } = require('powercord/modal')
const { Avatar } = getModule(['Avatar'], false)
const NotesHandler = new (require('../NotesHandler'))()

class noteDisplay extends React.PureComponent {
  constructor(props) {
	super(props)
  }


  async componentDidMount() {
  }

  render() {
	const settings = NotesHandler.getNotes()
	console.log(settings)
	console.log(settings.length)
	console.log(Object.keys(settings).length)

	const noteArray = []
	const userId = []

	for(let i = 0; i < Object.keys(settings).length; i++) {
		let note = settings[Object.keys(settings)[i]]
		userId.push(note['User ID'])
		noteArray.push(<Avatar style={{'position' : 'absolute'}} src={note['Avatar URL']} size='SIZE_40'/>)
		noteArray.push(<span style={{
		  'color' : 'white', 
		  'position' : 'absolute', 
		  'padding-left' : '10px', 
		  'margin-top' : '23px'
		}}>{note['Username']}</span>)
		noteArray.push(<Text selectable={true} style={{'padding-left': '50px', 'position': 'absolute'}}>{note['Content']}</Text>)
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
