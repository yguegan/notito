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

  describe('call selectNote', () => {
    it('should change the isSelected to true for the note set as parameter when calling selectNote and the isSelected attribute is false', async () => {
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
        mockResult.getInstance().selectNote(note);
      });

      expect(mockResult.getInstance().state.notes.filter(n => note.isEqual(n))[0].isSelected).toEqual(
        true
      );
    });

    it('should change the isSelected to true for the note set as parameter when calling selectNote and the isSelected attribute is false', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      note.isSelected = true;
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
        mockResult.getInstance().selectNote(note);
      });

      expect(mockResult.getInstance().state.notes.filter(n => note.isEqual(n))[0].isSelected).toEqual(
        false
      );
    });

    it('should not change the isSelected attribute if the note does not exist in the state', async () => {
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
        mockResult.getInstance().selectNote(new Note(789, 'Non existing note', 'This note should not been reflected in the state'));
      });

      expect(mockResult.getInstance().state.notes.filter(n => n.isSelected).length).toEqual(
        0
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

  describe('call updateNote', () => {
    it('should add a new note if the id of the note is note matching with any existing note', async () => {
      let mockResult;
      const expectedNotes = [];
      const noteToAdd = new Note(322, 'my new note here', 'note created to test creation behavior');
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }
      const mockNavigation = {
        setOptions: options => options
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.getInstance().updateNote(noteToAdd);
      });
      
      expect(mockResult.getInstance().state.notes.length).toEqual(2);
      expect(mockResult.getInstance().state.notes[1]).toEqual(noteToAdd);
    });

    it('should update a note if the id of the note is matching with an existing note', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }
      const mockNavigation = {
        setOptions: options => options
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        note.description = 'update test description to see if we are updating the existing note';
        mockResult.getInstance().updateNote(note);
      });
      
      expect(mockResult.getInstance().state.notes.length).toEqual(1);
      expect(mockResult.getInstance().state.notes[0]).toEqual(note);
    });

    it('should call the dao save collection method with the modification reflected when creating a new note', async () => {
      let mockResult;
      let isSaveNoteCollectionCalled = false;
      let savedNotes;
      const expectedNotes = [];
      const noteToAdd = new Note(322, 'my new note here', 'note created to check we are calling the dao save collection');
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async (notes) => {
          isSaveNoteCollectionCalled = true;
          savedNotes = notes;
        }
      }
      const mockNavigation = {
        setOptions: options => options
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.getInstance().updateNote(noteToAdd);
      });
      
      expect(isSaveNoteCollectionCalled).toEqual(true);
      expect(savedNotes).toEqual(mockResult.getInstance().state.notes);
    });

    it('should call the dao save collection method with the modification reflected when updating a note', async () => {
      let mockResult;
      let isSaveNoteCollectionCalled = false;
      let savedNotes;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async (notes) => {
          isSaveNoteCollectionCalled = true;
          savedNotes = notes;
        }
      }
      const mockNavigation = {
        setOptions: options => options
      }
      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        note.description = 'update test description to see if we are calling save note';
        mockResult.getInstance().updateNote(note);
      });
      
      expect(isSaveNoteCollectionCalled).toEqual(true);
      expect(savedNotes).toEqual(mockResult.getInstance().state.notes);
    });
  });

  describe('call componentDidUpdate', () => {
    it('should set route.params.note to null when it is containing a note', async () => {
      let mockResult;
      const expectedNotes = [];
      const noteToAdd = new Note(322, 'my new note here', 'note created to test creation behavior');
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }
      const mockNavigation = {
        setOptions: options => options
      }

      const mockRoute = {
        params: {
          note: noteToAdd
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.update(<NoteList route={mockRoute} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });
      
      expect(mockResult.getInstance().props.route.params.note).toEqual(null);
    });

    it('should update the state of notes when route is containing a new note', async () => {
      let mockResult;
      const expectedNotes = [];
      const noteToAdd = new Note(322, 'my new note here', 'note created to test creation behavior');
      const note = new Note(1, 'test title', 'test description');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }
      const mockNavigation = {
        setOptions: options => options
      }

      const mockRoute = {
        params: {
          note: noteToAdd
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.update(<NoteList route={mockRoute} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });
      
      expect(mockResult.getInstance().state.notes.length).toEqual(2);
      expect(mockResult.getInstance().state.notes[1]).toEqual(noteToAdd);
    });

    it('should update the state of notes when route is containing an updated note', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const updatedNote = new Note(1, 'test title', 'test description after update');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }
      const mockNavigation = {
        setOptions: options => options
      }

      const mockRoute = {
        params: {
          note: updatedNote
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.update(<NoteList route={mockRoute} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });
      
      expect(mockResult.getInstance().state.notes.length).toEqual(1);
      expect(mockResult.getInstance().state.notes[0]).toEqual(updatedNote);
    });

    it('should keep the state as it is if route params is undefined', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const updatedNote = new Note(1, 'test title', 'test description after update');
      expectedNotes.push(note);
      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }
      const mockNavigation = {
        setOptions: options => options
      }

      const mockRoute = {}

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      await act(async () => {
        mockResult.update(<NoteList route={mockRoute} navigation={mockNavigation} noteDao={mockNoteDao} />);
      });

      expect(mockResult.getInstance().state.notes).toEqual(expectedNotes);
    });
  });
});