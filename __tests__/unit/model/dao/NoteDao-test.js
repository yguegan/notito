/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native';
import 'react';
import AsyncStorage from '@react-native-community/async-storage';

import NoteDao from '../../../../model/dao/NoteDao';
import Note from '../../../../model/Note';

describe('NoteDao', () => {
  beforeEach(async () => {
    await AsyncStorage.getAllKeys().then(keys =>
      AsyncStorage.multiRemove(keys)
    );
  });

  describe('call constructor', () => {
    it('it should initialise lastIdGenerated with 0', async () => {
      const noteDao = new NoteDao();

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(noteDao.lastIdGenerated).not.toBeNull();
      expect(noteDao.lastIdGenerated).toBe(0);
    });

    it('it should initialise lastIdGenerated with the value from AsyncStorage when defined', async () => {
      await AsyncStorage.setItem('@NotesIndex', 25);

      const noteDao = new NoteDao();

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(noteDao.lastIdGenerated).not.toBeNull();
      expect(noteDao.lastIdGenerated).toBe(25);
    });
  });

  describe('call saveLastIdGenerated', () => {
    it('it should save the lastGeneratedId in the AsyncStorage with the value put as parameter', async () => {
      const noteDao = new NoteDao();

      noteDao.saveLastIdGenerated(15);

      const valueSavedInStorage = parseInt(
        await AsyncStorage.getItem('@NotesIndex'),
        10
      );

      expect(valueSavedInStorage).toBe(15);
    });
  });

  describe('call getLastIdGenerated', () => {
    it('it should call the callback with the default value if no value stored in the AsyncStorage', async done => {
      const noteDao = new NoteDao();
      function callback(lastIdGenerated) {
        try {
          expect(lastIdGenerated).toBe('0');
          done();
        } catch (error) {
          done(error);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));

      noteDao.getLastIdGenerated(callback);
    });

    it('it should call the callback with the value stored in the AsyncStorage', async done => {
      await AsyncStorage.setItem('@NotesIndex', '25');
      function callback(lastIdGenerated) {
        try {
          expect(lastIdGenerated).toBe('25');
          done();
        } catch (error) {
          done(error);
        }
      }

      const noteDao = new NoteDao();

      noteDao.getLastIdGenerated(callback);
    });
  });

  describe('call generateNewIdNote', () => {
    it('it should return the id incremented by one', () => {
      const noteDao = new NoteDao();
      noteDao.lastIdGenerated = 35;

      const incrementedId = noteDao.generateNewIdNote();

      expect(incrementedId).toBe(36);
    });

    it('it should increment the id by one', async () => {
      await AsyncStorage.setItem('@NotesIndex', '42');
      const noteDao = new NoteDao();

      await new Promise(resolve => setTimeout(resolve, 100));
      noteDao.generateNewIdNote();
      expect(noteDao.lastIdGenerated).toBe(43);
    });

    it('it should save the incremented value of the lastIdGenerated', async () => {
      await AsyncStorage.setItem('@NotesIndex', '25');
      const noteDao = new NoteDao();
      await new Promise(resolve => setTimeout(resolve, 100));

      noteDao.generateNewIdNote();

      await new Promise(resolve => setTimeout(resolve, 100));
      const savedLastIdGenerated = parseInt(
        await AsyncStorage.getItem('@NotesIndex'),
        10
      );
      expect(savedLastIdGenerated).toBe(26);
    });
  });

  describe('call saveNotesCollection', () => {
    it('it should save the notes collection in AsyncStorage', async () => {
      const notes = [];
      const note = new Note(1, 'test title', 'test description');
      const anotherNote = new Note(
        2,
        'another test title',
        'another test description'
      );
      notes.push(note);
      notes.push(anotherNote);
      const noteDao = new NoteDao();

      await noteDao.saveNotesCollection(notes);

      await new Promise(resolve => setTimeout(resolve, 100));
      const expectedNotes = await AsyncStorage.getItem('@Notes');
      expect(JSON.parse(expectedNotes)).toEqual(notes);
    });
  });

  describe('call getNotesFromDatabase', () => {
    it('it should return an empty array if nothing is defined in AsyncStorage', async done => {
      const noteDao = new NoteDao();
      function callback(notes) {
        try {
          expect(notes).toStrictEqual([]);
          done();
        } catch (error) {
          done(error);
        }
      }

      noteDao.getNotesFromDatabase(callback);
    });

    it('it should return an array of notes reflecting the content of the AsyncStorage', async done => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const anotherNote = new Note(
        2,
        'another test title',
        'another test description'
      );
      expectedNotes.push(note);
      expectedNotes.push(anotherNote);
      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));
      const noteDao = new NoteDao();
      function callback(notes) {
        try {
          expect(notes).toStrictEqual(expectedNotes);
          done();
        } catch (error) {
          done(error);
        }
      }

      noteDao.getNotesFromDatabase(callback);
    });
  });
});
