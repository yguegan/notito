import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Image,
    TouchableOpacity
  } from 'react-native';

  import Note from "../model/Note"

class NoteEdition extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            note: new Note(this.props.route.params.note.id, this.props.route.params.note.title, this.props.route.params.note.description),
        };
        this.updateNavigationButtons();
    }

    updateNavigationButtons = () => {
        this.props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity style={styles.rigthNavigationButton} onPress={() => this.props.navigation.navigate('Home', {note: this.state.note})}>
              <Image
              source={require('../images/save-note.png')}
              style={styles.imageIconStyle}
              />
            </TouchableOpacity>
          )
        })
      }

    render() {
        return (
            <TouchableOpacity onPress={() => this.onSelect(this.state.note)}>
            <View style={styles.note}>
                <TextInput
                    testID="text-input-modification-note-title"
                    style={styles.noteTitle}
                    value={this.state.note.title}
                    autoFocus
                    placeholder={'title'}
                    onChangeText={(newValue) => this.updateTitleNote(newValue) }
                />
                <TextInput
                    testID="text-input-modification-note-description"
                    value={this.state.note.description}
                    placeholder={'description'}
                    multiline={true}
                    onChangeText={(newValue) => this.updateDescriptionNote(newValue)}
                />
            </View>
            </TouchableOpacity>
        );
    }

    updateTitleNote(value) {
        let note = this.state.note;
        note.title = value;
        this.setState({
                note: note
        });
    }

    updateDescriptionNote(value) {
        let note = this.state.note;
        note.description = value;
        this.setState({
                note: note
        });
    }
}

const styles = StyleSheet.create({
    note: {
      marginLeft: 10,
      marginRight: 10,
      borderWidth: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 15,
      paddingRight: 15,
      borderColor: '#AAA',
      backgroundColor: '#ffe4b5',
      marginBottom: 5,
      marginTop: 15
    },
    noteTitle: {
      fontWeight: '700',
      textAlign: 'center'
    },
    rigthNavigationButton: {
        marginRight: 25
    },
    imageIconStyle: {
        width: 30,
        height: 30
    }
});

export default NoteEdition;