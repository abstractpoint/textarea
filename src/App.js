import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import shortid from 'shortid';
import './App.css';
import { findAndModifyFirst } from 'obj-traverse/lib/obj-traverse';
import traverse from 'traverse';

const Note = (props) => {
    return(
      <div className="indented">
        <Textarea onBlur={props.handler} value={props.value} defaultValue={props.defaultValue} />
        {props.sub}
      </div>
    )
  }


class App extends Component {
  constructor() {
    super();
    this.state = {
      defaultValue: 'empty',
      notes: [
        {
          id:111,
          value:'',
          notes: null
        },
        {
          id:112,
          value:'',
          notes: [
            {
              id:222,
              value:'',
              notes: null
            },
            {
              id:333,
              value:'',
              notes: null
            }
          ]
        }
      ]
    }
  }




  RenderNotes = (notes) => {
    
    if (notes)
    return notes.map(note=>{
      return(
        <Note 
          handler={e=>this.noteUpdate(note.id, {id:note.id,value:e.target.value,notes:note.notes})} 
          id={note.id ? note.id : shortid.generate}
          key={note.id ? note.id : shortid.generate}
          defaultValue={note.value} 
          sub={this.RenderNotes(note.notes)}
        />
      )
    })
  }

  noteUpdate = (id, newNote) => {
    //copy the tree
    // console.log(newNote);
    let notes = [...this.state.notes];
    console.log(notes);

    if (newNote.value.endsWith('>>>')) {
      // newNote.value = newNote.value.slice(0,-3);
      newNote.value = "replaced";
      newNote = {...newNote, value:'replaced',notes:[{id:shortid.generate(),value:'',notes:null}]};
    }

    if (newNote.value.endsWith('---')) {
      newNote = {...newNote, value:'[todelete]'};
    }

    notes = traverse(notes).map(function(note){
      if (note && note.id === id && newNote.value === '[todelete]') return this.remove(true);
      if (note && note.id === id) return newNote;
    })

    // let status = findAndModifyFirst(notes, 'notes', {id: 111} , note);
    console.log(notes);
    this.setState({notes: notes});
  }

  render() {
    return (
      <div className="w-100">
      {this.RenderNotes(this.state.notes)}
      </div>
    );
  }
}

export default App;
