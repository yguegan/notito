import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Note from '../Note';

class NoteDao {
    constructor() {
        this.getLastIdGenerated((lastIdGenerated) => {
          this.lastIdGenerated = parseInt(lastIdGenerated);
        });
    }

    getLastIdGenerated = async(callback) => {
        try {
            const index = await AsyncStorage.getItem('@NotesIndex');
            callback(index || "0");
          } catch(e) {
            // error reading value
        }
    }

    saveLastIdGenerated = async(lastIdGenerated) => {
        try {
            await AsyncStorage.setItem('@NotesIndex', lastIdGenerated.toString());
          } catch (e) {
            // saving error
          }
    }

    generateNewIdNote = () => {
      this.lastIdGenerated = ++this.lastIdGenerated;
      this.saveLastIdGenerated(this.lastIdGenerated);
      return this.lastIdGenerated;
    }

    saveNotesCollection = async(notes) => {
        try {
            await AsyncStorage.setItem('@Notes', JSON.stringify(notes));
          } catch (e) {
            console.log("error save notes");
          }
    }

    getNotesFromDatabase  = async(callback) => {
        try {
          const rowNotesData = await AsyncStorage.getItem('@Notes')
          let notes = [];
          if(rowNotesData !== null) {
            parsedNotesData = JSON.parse(rowNotesData);
            parsedNotesData.forEach(
              note => notes.push(new Note(note.id, note.title, note.description))
            );
          }
          callback(notes) 
        } catch(e) {
          // error reading value
        }
    }
}

export default NoteDao;