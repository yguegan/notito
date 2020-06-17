/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';

import AsyncStorage from '@react-native-community/async-storage';
import MockReactNavigation from '../__mocks__/@react-navigation/MockReactNavigation';

import NoteList from '../component/NoteList';
import NoteView from '../component/NoteView';
import NoteEdition from '../component/NoteEdition';
import Note from '../model/Note';

describe('NoteList component', () => {
  describe('rendering', () => {
    it('renders correctly', async () => {
      await act(async () => {
        create(<NoteList />);
      });
    });

    it('should renderer the component with the navigation menu and the right title', async () => {
      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      expect(mockResult.toJSON()).toMatchSnapshot();
    });

    it('should not renderer any NoteView element if there is no notes in the AsyncStorage', async () => {
      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      expect(mockResult.root.findAllByType(NoteView).length).toEqual(0);
    });

    it('should renderer a NoteView element per note contained in the AsyncStorage', async () => {
      const expectedNotes = [];
      expectedNotes.push(new Note(1, 'test title', 'test description'));
      expectedNotes.push(new Note(2, 'test title 2', 'test description 2'));
      expectedNotes.push(new Note(3, 'test title 3', 'test description 3'));

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      expect(mockResult.root.findAllByType(NoteView).length).toEqual(3);
    });

    it('should contain a NoteView element with note properties equals to the note in the AsyncStorage', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      expect(mockResult.root.findByType(NoteView).props.note).not.toBeNull();
      expect(mockResult.root.findByType(NoteView).props.note).toEqual(note);
    });

    it('should contain a NoteView element with isSelected properties equals to the note.isSelected in the AsyncStorage', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      expect(
        mockResult.root.findByType(NoteView).props.isSelected
      ).not.toBeNull();
      expect(mockResult.root.findByType(NoteView).props.isSelected).toEqual(
        note.isSelected
      );
    });
  });

  describe('long click on a note', () => {
    it('should change the isSelected to true when doing an long click on the NoteView', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(mockResult.root.findByType(NoteView).props.isSelected).toEqual(
        true
      );
    });

    it('should change the isSelected to false when doing a click on a selected NoteView', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onSelect(note);
      });

      expect(mockResult.root.findByType(NoteView).props.isSelected).toEqual(
        false
      );
    });

    it('should display the delete icon in the header when the user select a note', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(
        mockResult.root.findByProps({testID: 'btnRemoveSelectedNotes'}).length
      ).not.toBeNull();
    });

    it('should display hide delete icon in the header when the user unselect all notes', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(
        mockResult.root.findAllByProps({testID: 'btnRemoveSelectedNotes'})
          .length
      ).toEqual(0);
    });

    it('should change allow the selection of several NoteView', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[0].props.onLongSelect(note);
        mockResult.root
          .findAllByType(NoteView)[2]
          .props.onLongSelect(noteThree);
      });

      expect(mockResult.root.findAllByProps({isSelected: true}).length).toEqual(
        2
      );
    });

    it('should delete the selected NoteView once click on delete button', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[0].props.onLongSelect(note);
        mockResult.root
          .findAllByType(NoteView)[2]
          .props.onLongSelect(noteThree);
      });

      await act(async () => {
        mockResult.root
          .findByProps({testID: 'btnRemoveSelectedNotes'})
          .props.onPress();
      });

      expect(mockResult.root.findAllByType(NoteView).length).toEqual(1);
    });

    it('should hide the delete button once the selected note deleted', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[0].props.onLongSelect(note);
        mockResult.root
          .findAllByType(NoteView)[2]
          .props.onLongSelect(noteThree);
      });

      await act(async () => {
        mockResult.root
          .findByProps({testID: 'btnRemoveSelectedNotes'})
          .props.onPress();
      });

      expect(
        mockResult.root.findAllByProps({testID: 'btnRemoveSelectedNotes'})
          .length
      ).toEqual(0);
    });
  });

  describe('click on a specific noteView', () => {
    it('should open the NoteEdition screen', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[2].props.onSelect(noteThree);
      });

      expect(mockResult.root.findAllByType(NoteEdition).length).toEqual(1);
    });

    it('should open the NoteEdition screen with the selected note information', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      await AsyncStorage.setItem('@Notes', JSON.stringify(expectedNotes));

      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[2].props.onSelect(noteThree);
      });

      expect(
        mockResult.root.findByProps({
          testID: 'text-input-modification-note-title'
        }).props.value
      ).toEqual(noteThree.title);
      expect(
        mockResult.root.findByProps({
          testID: 'text-input-modification-note-description'
        }).props.value
      ).toEqual(noteThree.description);
    });
  });

  describe('click on create note', () => {
    it('should open the NoteEdition screen', async () => {
      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findByProps({testID: 'btnAddNewNote'}).props.onPress();
      });

      expect(mockResult.root.findAllByType(NoteEdition).length).toEqual(1);
    });

    it('should open the NoteEdition screen with an empty note', async () => {
      let mockResult;
      await act(async () => {
        mockResult = create(<MockReactNavigation />);
      });

      await act(async () => {
        mockResult.root.findByProps({testID: 'btnAddNewNote'}).props.onPress();
      });

      expect(
        mockResult.root.findByProps({
          testID: 'text-input-modification-note-title'
        }).props.value
      ).toEqual('');
      expect(
        mockResult.root.findByProps({
          testID: 'text-input-modification-note-description'
        }).props.value
      ).toEqual('');
    });
  });
});
