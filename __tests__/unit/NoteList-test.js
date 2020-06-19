/* eslint-disable comma-dangle */
import 'react-native-gesture-handler';
import 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';

import NoteList from '../../component/NoteList';
import NoteView from '../../component/NoteView';
import Note from '../../model/Note';

describe('NoteList component', () => {
  describe('constructor', () => {
    it('renders correctly', async () => {
      await act(async () => {
        create(<NoteList route={{}}/>);
      });
    });

    it('should initialise the state with the value returned by the Dao if there is no notes', async () => {
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

      expect(mockResult.getInstance().state.notes).toEqual([]);
    });

    it('should initialise the state with the value returned by the Dao if there is some available notes', async () => {
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

      expect(mockResult.getInstance().state.notes).toEqual(expectedNotes);
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

    it('should update the navigation bar when the user select a note', async () => {
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

      mockResult.getInstance().updateNavigationButtons = jest.fn();

      await act(async () => {
        mockResult.getInstance().selectNote(new Note(1, 'Updated note', 'This note should involve some navigation button updates'));
      });

      expect(mockResult.getInstance().updateNavigationButtons).toHaveBeenCalled();
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
        mockResult.getInstance().selectNote(note);
        mockResult.getInstance().selectNote(noteThree);
      });

      expect(mockResult.getInstance().state.notes.filter(note => note.isSelected).length).toEqual(
        2
      );
    });
  });

  describe('Call deleteNote', () => {
    it('should delete the selected note', async () => {
      let mockResult;
      let setOptionsParameter;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      note.isSelected = true;
      noteThree.isSelected = true;
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
        mockResult.getInstance().deleteNote();
      });

      expect(mockResult.getInstance().state.notes.length).toEqual(1);
      expect(mockResult.getInstance().state.notes.filter(n => (note.isEqual(n) || noteThree.isEqual(n))).length).toEqual(0);
      expect(mockResult.getInstance().state.notes.filter(n => n.isSelected).length).toEqual(0);
    });

    it('should call the dao to save the new state', async () => {
      let mockResult;
      let newNoteCollectionToSave;
      let isSaveCollectionFromDaoCalled = false;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      note.isSelected = true;
      noteThree.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async (notes) => {
          isSaveCollectionFromDaoCalled = true;
          newNoteCollectionToSave = notes;
        }
      }

      const mockNavigation = {
        setOptions: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.getInstance().deleteNote();
      });

      expect(isSaveCollectionFromDaoCalled).toEqual(true);
      expect(mockResult.getInstance().state.notes).toEqual(newNoteCollectionToSave);
    });

    it('should update the navigation buttons once notes removed', async () => {
      let mockResult;
      let newNoteCollectionToSave;
      let isSaveCollectionFromDaoCalled = false;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      note.isSelected = true;
      noteThree.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async (notes) => {
          isSaveCollectionFromDaoCalled = true;
          newNoteCollectionToSave = notes;
        }
      }

      const mockNavigation = {
        setOptions: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      mockResult.getInstance().updateNavigationButtons = jest.fn();

      await act(async () => {
        mockResult.getInstance().deleteNote();
      });

      expect(mockResult.getInstance().updateNavigationButtons).toHaveBeenCalled();
    });
  });

  describe('call generateNewEmptyNote', () => {
    it('should return an empty note with an id generated by the Dao', async () => {
      let mockResult;
      let generatedNote;
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
        setOptions: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        generatedNote = mockResult.getInstance().generateNewEmptyNote();
      });

      expect(expectedNoteCreation.isEqual(generatedNote)).toEqual(true);
    });
  });

  describe('call clearSelection', () => {
    it('should unselect all the selected notes', async () => {
      let mockResult;
      let newNoteCollectionToSave;
      let isSaveCollectionFromDaoCalled = false;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      note.isSelected = true;
      noteThree.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async (notes) => {
          isSaveCollectionFromDaoCalled = true;
          newNoteCollectionToSave = notes;
        }
      }

      const mockNavigation = {
        setOptions: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.getInstance().clearSelection();
      });

      expect(mockResult.getInstance().state.notes.filter(n => n.isSelected).length).toEqual(0);
    });

    it('should update the navigation buttons', async () => {
      let mockResult;
      let newNoteCollectionToSave;
      let isSaveCollectionFromDaoCalled = false;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      const noteThree = new Note(3, 'test title 3', 'test description 3');
      note.isSelected = true;
      noteThree.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);
      expectedNotes.push(noteThree);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async (notes) => {
          isSaveCollectionFromDaoCalled = true;
          newNoteCollectionToSave = notes;
        }
      }

      const mockNavigation = {
        setOptions: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      mockResult.getInstance().updateNavigationButtons = jest.fn();

      await act(async () => {
        mockResult.getInstance().clearSelection();
      });

      expect(mockResult.getInstance().updateNavigationButtons).toHaveBeenCalled();
    });
  });

  describe('call goToNoteCreation', () => {
    it('should call clear the selection', async () => {
      let mockResult;
      const generatedId = 255;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      note.isSelected = true;
      expectedNotes.push(note);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        generateNewIdNote: () => {
          return generatedId
        }
      }

      const mockNavigation = {
        setOptions: () => {},
        navigate: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      mockResult.getInstance().clearSelection = jest.fn();

      await act(async () => {
        mockResult.getInstance().goToNoteCreation();
      });

      expect(mockResult.getInstance().clearSelection).toHaveBeenCalled();
    });

    it('should navigate to the NoteEdition screen with a note containing a generatedId from the dao and empty title and description', async () => {
      let mockResult;
      let pageTitleUsed;
      let paramsUsed;
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
        navigate: (pageTitle, params) => {
          pageTitleUsed = pageTitle;
          paramsUsed = params;
        },
        setOptions: options => {
          setOptionsParameter = options;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.getInstance().goToNoteCreation();
      });

      expect(pageTitleUsed).toEqual('NoteEdition');
      expect(paramsUsed.note).toEqual(expectedNoteCreation);
    });
  });

  describe('call goToNoteEdition', () => {
    it('should select the note if some other notes are selected and the selected note is not selected', async () => {
      let mockResult;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title 2', 'test description 2');
      note.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: () => {},
        navigate: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      mockResult.getInstance().selectNote = jest.fn();

      await act(async () => {
        mockResult.getInstance().goToNoteEdition(noteTwo);
      });

      expect(mockResult.getInstance().selectNote).toHaveBeenCalled();
    });

    it('should not call the navigate method when at least one note is selected', async () => {
      let mockResult;
      let isNavigationCalled = false;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      note.isSelected = true;
      expectedNotes.push(note);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: () => {},
        navigate: () => {
          isNavigationCalled = true;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.getInstance().goToNoteEdition(note);
      });

      expect(isNavigationCalled).toEqual(false);
    });

    it('should navigate to NoteEdition and open the chosen note when none of the notes are selected', async () => {
      let mockResult;
      let pageTitleUsed;
      let paramsUsed;
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
        setOptions: () => {},
        navigate: (pageTitle, params) => {
          pageTitleUsed = pageTitle;
          paramsUsed = params;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.getInstance().goToNoteEdition(note);
      });

      expect(pageTitleUsed).toEqual('NoteEdition');
      expect(paramsUsed.note).toEqual(note);
    });
  });

  describe('call isSelectModeEnabled', () => {
    it('should return false if no note is selected', async () => {
      let mockResult;
      let pageTitleUsed;
      let paramsUsed;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title two', 'test description two');
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: () => {},
        navigate: (pageTitle, params) => {
          pageTitleUsed = pageTitle;
          paramsUsed = params;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      expect(mockResult.getInstance().isSelectModeEnabled()).toEqual(false);
    });

    it('should return true if at least one note is selected', async () => {
      let mockResult;
      let pageTitleUsed;
      let paramsUsed;
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title two', 'test description two');
      noteTwo.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: () => {},
        navigate: (pageTitle, params) => {
          pageTitleUsed = pageTitle;
          paramsUsed = params;
        }
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      expect(mockResult.getInstance().isSelectModeEnabled()).toEqual(true);
    });
  });

  describe('call updateNavigationButtons', () => {
    it('should set the navigation bar without right hand side button when no selected notes', async () => {
      let mockResult;
      let paramsUsed;
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
        setOptions: (params) => {
          paramsUsed = params;
        },
        navigate: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      await act(async () => {
        mockResult.getInstance().updateNavigationButtons();
      });

      expect(paramsUsed.headerRight()).toEqual(undefined);
    });

    it('should set the navigation bar with a delete button on the right when there is at least one selected note', async () => {
      let mockResult;
      let paramsUsed;
      const expectedOption = "CancelButton";
      const expectedNotes = [];
      const note = new Note(1, 'test title', 'test description');
      const noteTwo = new Note(2, 'test title two', 'test description two');
      note.isSelected = true;
      expectedNotes.push(note);
      expectedNotes.push(noteTwo);

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: (params) => {
          paramsUsed = params;
        },
        navigate: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      jest.spyOn(mockResult.getInstance(), 'renderDeleteButton').mockImplementation(() => expectedOption);

      await act(async () => {
        mockResult.getInstance().updateNavigationButtons();
      });

      expect(paramsUsed.headerRight()).toEqual(expectedOption);
    });
  });

  describe('call renderDeleteButton', () => {
    it('should return a delete button', async () => {
      let mockResult;
      const expectedNotes = [];

      const mockNoteDao = {
        getNotesFromDatabase: async callback => {
          callback(expectedNotes);
        },
        saveNotesCollection: async () => {}
      }

      const mockNavigation = {
        setOptions: () => {},
        navigate: () => {}
      }

      await act(async () => {
        mockResult = create(<NoteList route={{}} navigation={mockNavigation} noteDao={mockNoteDao}/>);
      });

      expect(mockResult.getInstance().renderDeleteButton().props.testID).toEqual('btnRemoveSelectedNotes');
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