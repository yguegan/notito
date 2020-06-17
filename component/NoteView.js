import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

class NoteView extends Component {
  constructor(props, context) {
    super(props, context);
    this.onSelect = props.onSelect;
  }

  genrateNoteStyling() {
    let noteStyling = Object.assign({}, styles.note);
    if (this.props.isSelected) {
      noteStyling.borderWidth = 3;
      noteStyling.borderColor = '#000';
    }
    return noteStyling;
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onLongPress={() => this.props.onLongSelect(this.props.note)}
        onPress={() => this.onSelect(this.props.note)}>
        <View style={this.genrateNoteStyling()}>
          <Text style={styles.noteTitle}>{this.props.note.title}</Text>
          <Text>{this.props.note.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  note: {
    width: '100%',
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
    marginBottom: 15
  },
  noteTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25
  }
});

export default NoteView;
