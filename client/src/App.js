import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  socket = io('http://localhost:3000');

  componentDidMount(){
    this.socket()
  }

  render() {
    let tasks = ['Shopping', 'Go out with a dog'];
    
    socket.on('updateData', (list) => tasks = list)

    const removeTask = (task) => {
      // const index = tasks.indexOf(task);
      // tasks.splice(index, 1);
      socket.emit('removeTask', task)
    }

    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li class="task">{task}
                <button 
                  class="btn btn--red"
                  onClick={removeTask(task)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form">
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;
