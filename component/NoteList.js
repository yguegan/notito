import React, {Component} from 'react';
import {
  FlatList,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import NoteView from './NoteView';

import NoteDao from '../model/dao/NoteDao';
import Note from '../model/Note';

class NoteList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      notes: []
    };
    this.noteDao = new NoteDao();
    this.noteDao.getNotesFromDatabase(notes => {
      this.setState(
        (this.state = {
          notes: notes
        })
      );
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.route.params?.note) {
      let updatedNote = this.props.route.params.note;
      this.props.route.params.note = null;
      this.updateNote(updatedNote);
    }
  }

  updateNavigationButtons = () => {
    this.props.navigation.setOptions({
      headerRight: state =>
        this.isSelectModeEnabled() ? (
          <TouchableOpacity
            style={styles.rigthNavigationButton}
            onPress={() => this.deleteNote()}
            testID="btnRemoveSelectedNotes">
            <Image
              source={require('../images/remove-note.png')}
              style={styles.imageIconStyle}
            />
          </TouchableOpacity>
        ) : (
          undefined
        )
    });
  };

  updateNote = updatedNote => {
    let notes = this.state.notes;
    let indexNote = -1;
    notes.forEach((note, index) => {
      if (note.isEqual(updatedNote)) {
        indexNote = index;
      }
    });
    if (indexNote === -1) {
      notes.push(updatedNote);
    } else {
      notes[indexNote] = updatedNote;
    }
    this.setState({notes: notes}, () =>
      this.noteDao.saveNotesCollection(this.state.notes)
    );
  };

  selectNote = selectedNote => {
    const notes = this.state.notes;
    notes.map(note => {
      if (note.id === selectedNote.id) {
        note.isSelected = !note.isSelected;
      }
    });
    this.setState({notes: notes}, this.updateNavigationButtons);
  };

  deleteNote = () => {
    let newNotesList = this.state.notes.filter(note => !note.isSelected);
    this.setState({notes: newNotesList}, () =>
      this.noteDao.saveNotesCollection(this.state.notes)
    );
    this.clearSelection();
  };

  generateNewEmptyNote = () => {
    return new Note(this.noteDao.generateNewIdNote(), '', '');
  };

  clearSelection = () => {
    this.updateNavigationButtons();
  };

  goToNoteCreation = () => {
    this.clearSelection();
    this.props.navigation.navigate('NoteEdition', {
      note: this.generateNewEmptyNote()
    });
  };

  goToNoteEdition = selectedNote => {
    if (selectedNote.isSelected || this.isSelectModeEnabled()) {
      this.selectNote(selectedNote);
    } else {
      this.props.navigation.navigate('NoteEdition', {note: selectedNote});
    }
  };

  isSelectModeEnabled = () =>
    this.state.notes.filter(note => note.isSelected).length > 0;

  render() {
    return (
      <>
        <FlatList
          style={styles.noteList}
          data={this.state.notes}
          renderItem={({item}) => (
            <NoteView
              isSelected={item.isSelected}
              note={item}
              onLongSelect={note => this.selectNote(note)}
              onSelect={this.goToNoteEdition}
            />
          )}
          keyExtractor={(item, index) => 'list-notes-' + item.id}
        />
        <TouchableHighlight
          style={styles.addNoteBtn}
          onPress={this.goToNoteCreation}
          underlayColor="#fff"
          testID="btnAddNewNote">
          <Image
            source={require('../images/add-note.png')}
            style={styles.imageIconStyle}
          />
        </TouchableHighlight>
      </>
    );
  }
}

const styles = StyleSheet.create({
  noteList: {
    marginTop: 15,
    paddingHorizontal: 10
  },
  listSeparator: {
    margin: 5
  },
  addNoteBtn: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: '#a8c0ff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 50
  },
  addNoteBtnText: {
    color: '#fff',
    textAlign: 'center'
  },
  rigthNavigationButton: {
    marginRight: 25
  },
  imageIconStyle: {
    width: 30,
    height: 30
  }
});

export default NoteList;
