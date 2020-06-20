/* eslint-disable comma-dangle */
import 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';

import NoteView from '../../component/NoteView';
import Note from '../../model/Note';

const note = new Note(1, 'title note', 'description note');

describe('NoteView component', () => {
  describe('constructor', () => {
    it('renders correctly', async () => {
      await act(async () => {
        create(<NoteView note={note} onSelect={() => {}} onLongSelect={() => {}}/>);
      });
    });

    it('should initialise onSelect attribute with the method injected in the onSelect props', async () => {
      let mockResult;

      const onSelectMock = () => {
        console.log("test");
      }
      await act(async () => {
        mockResult = create(<NoteView note={note} onSelect={onSelectMock} onLongSelect={() => {}}/>);
      });

      expect(mockResult.getInstance().onSelect).toEqual(onSelectMock);
    });
  });

  describe('call genrateNoteStyling', () => {
    it('should return normal note styling when the property isSelected is set to false', async () => {
      let mockResult;
      const isSelected = false;

      await act(async () => {
        mockResult = create(<NoteView note={note} onSelect={() => {}} onLongSelect={() => {}} isSelected={isSelected}/>);
      });

      expect(mockResult.getInstance().genrateNoteStyling().borderColor).toEqual('#AAA');
      expect(mockResult.getInstance().genrateNoteStyling().borderWidth).toEqual(1);
    });

    it('should return selected note styling when the property isSelected is set to true', async () => {
      let mockResult;
      const isSelected = true;

      await act(async () => {
        mockResult = create(<NoteView note={note} onSelect={() => {}} onLongSelect={() => {}} isSelected={isSelected}/>);
      });

      expect(mockResult.getInstance().genrateNoteStyling().borderColor).toEqual('#000');
      expect(mockResult.getInstance().genrateNoteStyling().borderWidth).toEqual(3);
    });
  });

  describe('call dom events', () => {
    it('should call onSelect property method when triggering the onPress event', async () => {
      let mockResult;
      let isOnSelectMethodHasBeenCalled = false;
      const onSelectMock = () => {
        isOnSelectMethodHasBeenCalled = true;
      }

      await act(async () => {
        mockResult = create(<NoteView note={note} onSelect={onSelectMock} onLongSelect={() => {}} isSelected={false}/>);
      });

      await act(async () => {
        mockResult.root.findAllByType(TouchableOpacity)[0].props.onPress();
      });

      expect(isOnSelectMethodHasBeenCalled).toEqual(true);
    });

    it('should call onLongSelect property method when triggering the onLongPress event', async () => {
      let mockResult;
      let isOnLongSelectMethodHasBeenCalled = false;
      const onLongSelectMock = () => {
        isOnLongSelectMethodHasBeenCalled = true;
      }

      await act(async () => {
        mockResult = create(<NoteView note={note} onSelect={() => {}} onLongSelect={onLongSelectMock} isSelected={false}/>);
      });

      await act(async () => {
        mockResult.root.findAllByType(TouchableOpacity)[0].props.onLongPress();
      });

      expect(isOnLongSelectMethodHasBeenCalled).toEqual(true);
    });
  });
});