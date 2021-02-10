# holy-notes
 A Powercord plugin that lets you annotate messages in a Notebook as personal pins.


### Some quick notes:

Since Swishilicous will not be working on this plugin anymore, I decided to work on it as a hobby and personal project because this would be the last plugin I still need to replace on my old BD plugin list. I want to stop using BDCompat.

The actual display of noted messages (accessible through a notebook icon button at the top bar of discord) doesn't work like the original plugin from BD, and I have no idea how to fix it properly. I patched Swishlicious original implementation so that the messages wouldn't overlap.


Saving and deleting notes is fully functional. Currently, the only way to save a note is to right click a message and click "Note Message", the message will then be saved to a 'notes.json' file located in the 'NotesHandler' folder.

Added 3 commands:
 - .ListNotes, lists all note's IDs in your notebook, followed by a 10 word preview.
 - .GetNote {ID}, displays note as a text (will implement the embed later) given it's ID.
 - .DeleteNote {ID}, deletes note from your notebook given it's ID.
 
There is one missing injection, if you click the three dots on a message it shows a drop down with more options. I will try to add the note button to this menu too.
