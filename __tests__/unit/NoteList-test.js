/* eslint-disable comma-dangle */
import 'react-native-gesture-handler';
import 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';

import NoteList from '../../component/NoteList';
import NoteView from '../../component/NoteView';
import Note from '../../model/Note';

describe('NoteList component', () => {
  describe('rendering', () => {
    it('renders correctly', async () => {
      await act(async () => {
        create(<NoteList route={{}}/>);
      });
    });

    it('should not renderer any NoteView element if there is no notes returned by the Dao', async () => {
      let mockResult;
      const expectedNotes = [];
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}}/>);
      });

      expect(mockResult.root.findAllByType(NoteView).length).toEqual(expectedNotes.length);
    });

    it('should renderer a NoteView element per note returned by the Dao', async () => {
      const expectedNotes = [];
      expectedNotes.push(new Note(1, 'test title', 'test description'));
      expectedNotes.push(new Note(2, 'test title 2', 'test description 2'));
      expectedNotes.push(new Note(3, 'test title 3', 'test description 3'));

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }

      let mockResult;
      await act(async () => {
        mockResult = create(<NoteList route={{}} noteDao={mockNoteDao}/>);
      });

      expect(mockResult.root.findAllByType(NoteView).length).toEqual(expectedNotes.length);
    });

    it('should contain a NoteView element with note properties equals to the note return by the NoteDao', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }

      let mockResult;
      await act(async () => {
        mockResult = create(<NoteList route={{}} noteDao={mockNoteDao} />);
      });

      expect(mockResult.root.findByType(NoteView).props.note).not.toBeNull();
      expect(mockResult.root.findByType(NoteView).props.note).toEqual(note);
    });

    it('should contain a NoteView element with isSelected properties equals to the note.isSelected return by the noteDao', async () => {
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }

      let mockResult;
      await act(async () => {
        mockResult = create(<NoteList route={{}} noteDao={mockNoteDao} />);
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
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }
      const mockNavigation = {
        setOptions: options => options
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(mockResult.root.findByType(NoteView).props.isSelected).toEqual(
        true
      );
    });

    it('should change the isSelected to false when doing a click on a selected NoteView', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }
      const mockNavigation = {
        setOptions: options => options
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
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

    it('should call navigation setOptions method when the user select a note', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }
      const mockNavigation = {
        setOptions: jest.fn()
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(mockNavigation.setOptions).toHaveBeenCalled();
    });

    it('should call navigation setOptions method with a button with id btnRemoveSelectedNotes on the right menu part when the user select a note', async () => {
      let mockResult;
      let setOptionsParameter = null;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }
      const mockNavigation = {
        setOptions: options => {
          setOptionsParameter = options;
        }
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(
        setOptionsParameter.headerRight().props.testID
      ).toEqual('btnRemoveSelectedNotes');
    });

    it('should call navigation setOptions method with undefined on the right menu part when the user deselect all notes', async () => {
      let mockResult;
      let setOptionsParameter = null;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }
      const mockNavigation = {
        setOptions: options => {
          setOptionsParameter = options;
        }
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      await act(async () => {
        mockResult.root.findByType(NoteView).props.onLongSelect(note);
      });

      expect(
        setOptionsParameter.headerRight()
      ).toEqual(undefined);
    });

    it('should allow the selection of several NoteView', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        }
      }

      const mockNavigation = {
        setOptions: options => options
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[0].props.onLongSelect(note);
        mockResult.root
          .findAllByType(NoteView)[2]
          .props.onLongSelect(noteThree);
      });

      expect(mockResult.getInstance().state.notes.filter(note => note.isSelected).length).toEqual(
        2
      );
    });

    it('should delete the selected NoteView once click on delete button', async () => {
      let mockResult;
      let setOptionsParameter;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: options => {
          setOptionsParameter = options;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[0].props.onLongSelect(note);
        mockResult.root
          .findAllByType(NoteView)[2]
          .props.onLongSelect(noteThree);
      });

      await act(async () => {
        setOptionsParameter.headerRight().props.onPress();
      });

      expect(mockResult.getInstance().state.notes.length).toEqual(1);
    });

    it('should hide the delete button once the selected note deleted', async () => {
      let mockResult;
      let updatedNotes;
      let setOptionsParameter;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async notes => {
          updatedNotes = notes;
          done();
        }
      }

      const mockNavigation = {
        setOptions: options => {
          setOptionsParameter = options;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[0].props.onLongSelect(note);
        mockResult.root
          .findAllByType(NoteView)[2]
          .props.onLongSelect(noteThree);
      });

      await act(async () => {
        setOptionsParameter.headerRight().props.onPress();
      });

      expect(setOptionsParameter.headerRight()).toEqual(undefined);
    });
  });

  describe('click on a specific noteView', () => {
    it('should navigate to NoteEdition screen with the selected note information', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        navigate: jest.fn()
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.root.findAllByType(NoteView)[2].props.onSelect(noteThree);
      });

      expect(mockNavigation.navigate).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('NoteEdition', {note: expectedNotes[2]});
    });
  });

  describe('click on create note', () => {
    it('should clear the selection and remove the selection', async () => {
      let mockResult;
      let setOptionsParameter;
      const generatedId = 233;
      const notes = [];

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(notes);
        },
        generateNewIdNote: () => {
          return generatedId
        }
      }

      const mockNavigation = {
        navigate: jest.fn(),
        setOptions: options => {
          setOptionsParameter = options;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.root.findByProps({testID: 'btnAddNewNote'}).props.onPress();
      });

      expect(setOptionsParameter.headerRight()).toEqual(undefined);
    });

    it('should navigate to the NoteEdition screen with a note containing a generatedId from the dao and empty title and description', async () => {
      let mockResult;
      const generatedId = 233;
      const notes = [];
      const expectedNoteCreation = new Note(generatedId, '', '');

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(notes);
        },
        generateNewIdNote: () => {
          return generatedId
        }
      }

      const mockNavigation = {
        navigate: jest.fn(),
        setOptions: options => {
          setOptionsParameter = options;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.root.findByProps({testID: 'btnAddNewNote'}).props.onPress();
      });

      expect(mockNavigation.navigate).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('NoteEdition', {note: expectedNoteCreation});
    });
  });
});