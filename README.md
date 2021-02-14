# holy-notes
 A Powercord plugin that lets you keep messages in a Notebook, as personal pins. (Work in Progress, will look better, I hope)


### Description:

Saving and deleting notes is fully functional. To save a note, right click a message and click "Note Message" or add through command with the message link.

Notebook Commands:

- .notebook read [N]: Shows Note given it's number. You can use 'last' instead of a number to get the last note
- .notebook open [N]: Opens the Nth Page of Notebook, with 10 notes/page. You can use 'last' instead of a number to get the last page
- .notebook write [link]: Writes Note given it's message link',
- .notebook erase [N] please: Erases Note from your Notebook given it's number. As a safe measure, added 'please' at the end because I lost one of my notes by mistake.

 
### Some quick notes:

Since Swishilicous will not be working on this plugin anymore, I decided to work on it as a hobby and personal project because this is the last plugin I still need to replace from my old BD plugin list. I want to stop using BDCompat.

The actual display of noted messages (accessible through the notebook icon button at the top bar of discord) doesn't work like the original plugin from BD, and I have no idea how to fix it properly at the moment, so... I just patched Swishlicious original implementation so that the messages wouldn't overlap. I'm looking into so to do it properly, so it may take a while.

There is one missing injection, if you click the three dots on a message it shows a drop down with more options. I will try to add the note button to this menu too.
