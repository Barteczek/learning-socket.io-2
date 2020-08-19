import React from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';

class App extends React.Component {

  constructor() {
    super();
    this.socket = io('localhost:8000');
    this.tasks = [];
  }

  updateData(list) {
    this.tasks = [];
    list.forEach((element) => {
      
      this.tasks.push(element);
    });
    this.forceUpdate();
  }

  removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id)
    this.tasks.splice(index, 1);
    this.socket.emit('removeTask', id);
    this.forceUpdate();
  }

  addTask(event) {
    event.preventDefault();
    const taskContentInput = document.getElementById('task-name');
    let task = taskContentInput.value;

    if(!task.length) {
      alert('You have to type something!');
    }
    else {
      const newTask = {
        id: uuid(), 
        name: task,
      }
      this.tasks.push(newTask);
      this.socket.emit('addTask', newTask)
      taskContentInput.value = '';
      this.forceUpdate();
    }
  }

  render() {
    this.socket.on('updateData', (list) => this.updateData(list));

    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {!this.tasks ? null : this.tasks.map(({ id, name }) => (
              <li className="task">{name}
                <button 
                  className="btn btn--red"
                  onClick={() => this.removeTask(id)}
                  key={id}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form">
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name"/>
            <button className="btn" type="submit" onClick={(event) => this.addTask(event)}>Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;
