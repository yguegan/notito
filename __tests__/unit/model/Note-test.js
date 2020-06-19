/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native';

import Note from '../../../model/Note';

describe('note', () => {
  describe('constructor', () => {
    it('it should initialise the id of the note with the first parameter', () => {
      const idNote = 154;

      const note = new Note(idNote, '', '');

      expect(note.id).not.toBeNull();
      expect(note.id).toEqual(idNote);
    });

    it('it should initialise the title of the note with the second parameter', () => {
      const titleNote = 'this is the title of the note';

      const note = new Note(1, titleNote, '');

      expect(note.title).not.toBeNull();
      expect(note.title).toEqual(titleNote);
    });

    it('it should initialise the description of the note with the second parameter', () => {
      const descriptionNote = 'this is the description of the note';

      const note = new Note(1, '', descriptionNote);

      expect(note.description).not.toBeNull();
      expect(note.description).toEqual(descriptionNote);
    });

    it('it should initialise the isSelected attribute by default with falser', () => {
      const note = new Note(1, '', '');

      expect(note.isSelected).not.toBeNull();
      expect(note.isSelected).toEqual(false);
    });
  });

  describe('isEqual', () => {
    it('it should return true when we call isEqual and both note id are same', () => {
      const noteReference = new Note(25, 'title note', 'description note');
      const noteToCompare = new Note(
        25,
        'title note after modification',
        'description note after modification'
      );

      const isEqual = noteReference.isEqual(noteToCompare);

      expect(isEqual).toEqual(true);
    });

    it('it should return false when we call isEqual and both note id are different', () => {
      const noteReference = new Note(25, 'title note', 'description note');
      const noteToCompare = new Note(28, 'title note', 'description note');

      const isEqual = noteReference.isEqual(noteToCompare);

      expect(isEqual).toEqual(false);
    });
  });
});
