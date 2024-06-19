import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Writelogo  from "../../assets/write.png"
import ExportLogo from "../../assets/export.png"
import './Todo.css'; 
import PlusLogo from "../../assets/plus.png"

const Todo = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [newtodo, setNewtodo] = useState('');
  const [listtodos, setListtodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoDescriptions, setEditTodoDescriptions] = useState({});
  const [projectTitle, setProjectTitle] = useState('vbvv')
  const [updatedProjectTitle, setUpdatedProjectTitle] = useState('');
  const [editProjectTitle, setEditProjectTitle] = useState(false);
   
 

  const projectid = location.state;

  useEffect(() => {
    fetchTodos();
    fetchProjectTitle()
  }, []);
  const fetchProjectTitle = async () => {
    try {
      const response = await fetch(`http://localhost:7000/project/get-project-title?projectId=${projectid}`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjectTitle(data.title);
      } else {
        console.error('Failed to fetch project title');
      }
    } catch (error) {
      console.error('Error fetching project title:', error);
    }
  };

  const updateProjectTitle = async () => {
    try {
      const response = await fetch(`http://localhost:7000/project/update-project?projectId=${projectid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ title: updatedProjectTitle })
      });
      if (response.ok) {
      
        fetchProjectTitle();
        setEditProjectTitle(false); 
      } else {
        console.error('Failed to update project title');
      }
    } catch (error) {
      console.error('Error updating project title:', error);
    }
  };
  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:7000/todo/get-all-todos?projectId=${projectid}`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setListtodos(data.todos);
      } else {
        console.error('Failed to fetch project');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const markCompleted = async (id, currentStatus) => {
    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
    editTodo(id, { status: newStatus });
  };

  const createNewTodo = async (description) => {
    try {
      const response = await fetch(`http://localhost:7000/todo/new-todo?projectId=${projectid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ description })
      });

      if (response.ok) {
        fetchTodos();
        setIsOpen(false);
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
const handleset=(id,des)=>{
  console.log(id)
  console.log(des)
  setEditTodoId(id)
  setEditTodoDescriptions({
    ...editTodoDescriptions,
    [id]: des
  });
}

  const editTodo = async (id,updates) => {
    console.log(updates)
  
    
    try {
    
      const response = await fetch(`http://localhost:7000/todo/update-todo?todoId=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchTodos();
        setEditTodoId(null);
        setEditTodoDescriptions({});
      } else {
        console.error('Failed to update todo');
      }
    
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
        const response = await fetch(`http://localhost:7000/todo/remove-todo?todoId=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            fetchTodos();
        } else {
            console.error('Failed to delete todo');
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
};
const exportSummary = async () => {
  try {
    const response = await fetch(`http://localhost:7000/gist/export-summary?projectId=${projectid}`, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
    if (response.ok) {
      const data = await response.json();
    
     
      const blob = new Blob([data.fileContent], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error('Failed to export summary');
    }
  } catch (error) {
    console.error('Error exporting summary:', error);
  }
};
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    updateProjectTitle();
  }
};



  return (
    <div className="todo-list-container">
      <div className="project-title">
      {editProjectTitle ? (
          <input
            type="text"
            value={updatedProjectTitle}
            onChange={(e) => setUpdatedProjectTitle(e.target.value)}
            onKeyDown={handleKeyDown} 
            autoFocus 
          />
         
        ) : (
          <>
            <span>{projectTitle}</span>
            <button className="edit-icon" onClick={() => {setEditProjectTitle(true);setUpdatedProjectTitle(projectTitle)}}> <img src={Writelogo} alt="Edit Icon" /></button>
           
          </>
          
        )}
      </div>
      <div className="header">
        <div className='left-btns' style={{display:'flex',flexDirection:'row'
        }}>
        <button className="create-todo-button" onClick={() => setIsOpen(true)}><img src={PlusLogo} alt="Edit Icon" /><h4>New Todo</h4></button>
        <button className="collaborator-button" ><img src={PlusLogo} alt="Edit Icon" /><h4>collaborators</h4></button>
        </div>
         <button className="export-summary-button" onClick={()=>exportSummary()}> <img src={ExportLogo} alt="Edit Icon" /><h4>Export Summary</h4></button>
      </div>

     
      <div className="todos">
      {listtodos && listtodos.length > 0 ? (
          listtodos.map(todo => (
            
            <div key={todo._id} className="todo">
              <input
              className='check-box'
                type="checkbox"
                checked={todo.status === 'complete'}
                onChange={() =>markCompleted(todo._id, todo.status)}
              />
           
        
              {editTodoId === todo._id ? (
                <input
                className='edit-input'
                  type="text"
                  value={editTodoDescriptions[todo._id] !== undefined ? editTodoDescriptions[todo._id] : todo.description}
                  onChange={(e) => setEditTodoDescriptions({ ...editTodoDescriptions, [todo._id]: e.target.value })}
                />
              ) : (
                <div className="todo-description">{todo.description}</div>
              )}
                 <div className='dates'>
               <div className="todo-date">Created:  {new Date(todo.createdDate).toLocaleDateString()}</div>
               <div className="todo-date">updated:  {new Date(todo.createdDate).toLocaleDateString()}</div>
               </div>
              <div className="todo-actions">
                {editTodoId === todo._id ? (
                  <>
                    <button className='btn1' onClick={() => editTodo(todo._id,{description:editTodoDescriptions[todo._id]})}>Save</button>
                    <button className='btn1' onClick={() => { setEditTodoId(null); setEditTodoDescriptions({}); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className='btn2' onClick={() => handleset(todo._id,todo.description)}>Edit</button>
                    <button className='btn2' onClick={() => deleteTodo(todo._id)}> Delete</button>
                  </>
                )}
              </div>
            
            </div>
            
          ))
        ) : (
          <div className="no-todos">No todos found.</div>
        )}
      </div>
     
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Todo</h2>
            <input
              type="text"
              value={newtodo}
              onChange={(e) => setNewtodo(e.target.value)}
              placeholder="Enter New Todo"
            />
            <button onClick={() => createNewTodo(newtodo)}>Create</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
