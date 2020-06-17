/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import NoteList from './NoteList';
import NoteEdition from './NoteEdition';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={NoteList}
            options={{
              title: 'Available notes'
            }}
          />
          <Stack.Screen name="NoteEdition" component={NoteEdition} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
