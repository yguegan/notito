/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';

import App from '../component/App';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
let appRenderer;

describe('App component', () => {
  describe('rendering', () => {
    it('renders correctly', async () => {
      await act(async () => {
        appRenderer = create(<App />);
      });
    });

    it('it should render the navigation container', async () => {
      await act(async () => {
        appRenderer = create(<App />);
      });

      const appInstance = appRenderer.root;

      expect(appInstance.findByType(NavigationContainer)).not.toBeNull();
    });

    it('it should render the stack navigation', async () => {
      await act(async () => {
        appRenderer = create(<App />);
      });
      const appInstance = appRenderer.root;

      expect(appInstance.findByType(Stack.Navigator)).not.toBeNull();
    });

    it('it should render the Home screen', async () => {
      await act(async () => {
        appRenderer = create(<App />);
      });
      const appInstance = appRenderer.root;

      expect(appInstance.findByProps({name: 'Home'})).not.toBeNull();
    });

    it('should renderer the default page with NoteList', async () => {
      await act(async () => {
        appRenderer = create(<App />);
      });

      expect(appRenderer.toJSON()).toMatchSnapshot();
    });
  });
});
