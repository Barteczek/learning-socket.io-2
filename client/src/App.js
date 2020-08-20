import React from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';

class App extends React.Component {

  constructor() {
    super();
    this.socket = io('localhost:8000');
    this.state = { tasks: [] }
  }

  updateData(list) {
    const tasks = [];
    list.forEach((element) => {
      tasks.push(element);
    });
    this.setState({tasks: tasks});
  }

  removeTask(id) {
    const index = this.state.tasks.findIndex(task => task.id === id)
    this.setState({tasks: this.state.tasks.splice(index, 1)});
    this.socket.emit('removeTask', id);
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
      const tasks = this.state.tasks;
      tasks.push(newTask)
      this.setState({tasks: tasks})
      this.socket.emit('addTask', newTask)
      taskContentInput.value = '';
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
            {this.state.tasks.map(({ id, name }) => (
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
