/* eslint-disable comma-dangle */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import NoteList from '../../component/NoteList';
import NoteEdition from '../../component/NoteEdition';

const Stack = createStackNavigator();
const MockedReactNavigation = () => {
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

export default MockedReactNavigation;
