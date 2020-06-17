import 'react';

class Note {
  constructor(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isSelected = false;
  }

  isEqual(noteToCompare) {
    return noteToCompare !== undefined && noteToCompare.id === this.id;
  }
}

export default Note;
