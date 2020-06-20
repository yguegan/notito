/* eslint-disable comma-dangle */
import 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';

import NoteEdition from '../../component/NoteEdition';
import Note from '../../model/Note';

const note = new Note(1, 'title note', 'description note');

describe('NoteEdition component', () => {
  describe('constructor', () => {
    it('renders correctly', async () => {
      const navigationMock = {
        setOptions: () => {}
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });
    });

    it('should initialise the state with the note sent as the route params', async () => {
      let mockResult;

      const navigationMock = {
        setOptions: () => {}
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      expect(mockResult.getInstance().state.note).toEqual(note);
    });

    it('should update the navigation button after the initialisation', async () => {
      let mockResult;
      let isTheSetOptionCalled = false;

      const navigationMock = {
        setOptions: () => {
          isTheSetOptionCalled = true;
        }
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      expect(isTheSetOptionCalled).toEqual(true);
    });
  });

  describe('call updateTitleNote', () => {
    it('should update the title of the note in the state with the title as parameter', async () => {
      let mockResult;

      const navigationMock = {
        setOptions: () => {}
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      await act(async () => {
        mockResult.getInstance().updateTitleNote('updated title');
      });

      expect(mockResult.getInstance().state.note.title).toEqual('updated title');
    });
  });

  describe('call updateDescriptionNote', () => {
    it('should update the description of the note in the state with the description as parameter', async () => {
      let mockResult;

      const navigationMock = {
        setOptions: () => {}
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      await act(async () => {
        mockResult.getInstance().updateDescriptionNote('updated description');
      });

      expect(mockResult.getInstance().state.note.description).toEqual('updated description');
    });
  });

  describe('trigger the dom events', () => {
    it('should call the updateTitleNote when the text-input-modification-note-title text change events', async () => {
      let mockResult;

      const navigationMock = {
        setOptions: () => {}
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      mockResult.getInstance().updateTitleNote = jest.fn();

      await act(async () => {
        mockResult.root
        .findByProps({testID: 'text-input-modification-note-title'})
        .props.onChangeText('updated title');
      });

      expect(mockResult.getInstance().updateTitleNote).toHaveBeenCalled();
      expect(mockResult.getInstance().updateTitleNote).toHaveBeenCalledWith('updated title');
    });

    it('should call the updateDescriptionNote when the text-input-modification-note-description text change events', async () => {
      let mockResult;

      const navigationMock = {
        setOptions: () => {}
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      mockResult.getInstance().updateDescriptionNote = jest.fn();

      await act(async () => {
        mockResult.root
        .findByProps({testID: 'text-input-modification-note-description'})
        .props.onChangeText('updated description');
      });

      expect(mockResult.getInstance().updateDescriptionNote).toHaveBeenCalled();
      expect(mockResult.getInstance().updateDescriptionNote).toHaveBeenCalledWith('updated description');
    });
  });

  describe('call navigateToHomePage', () => {
    it('should navigate to the Home page (NoteList) with the state note', async () => {
      let mockResult;
      let titlePageUsed;
      let paramsPageUsed;

      const navigationMock = {
        setOptions: () => {},
        navigate: (titlePage, paramsPage) => {
          titlePageUsed = titlePage;
          paramsPageUsed = paramsPage;
        }
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      await act(async () => {
        mockResult.getInstance().navigateToHomePage();
      });

      expect(titlePageUsed).toEqual('Home');
      expect(paramsPageUsed.note).toEqual(mockResult.getInstance().state.note);
    });
  });

  describe('call updateNavigationButtons', () => {
    it('should set the option with a save button on the right', async () => {
      let mockResult;
      let optionsSet

      const navigationMock = {
        setOptions: (options) => {
          optionsSet = options;
        },
      };
      const routeMock = {
        params: {
          note: note
        }
      };

      await act(async () => {
        mockResult = create(<NoteEdition route={routeMock} navigation={navigationMock} />);
      });

      await act(async () => {
        mockResult.getInstance().updateNavigationButtons();
      });

      expect(optionsSet.headerRight().type).toEqual(TouchableOpacity);
      expect(optionsSet.headerRight().props.onPress).toEqual(mockResult.getInstance().navigateToHomePage);
    });
  });
});