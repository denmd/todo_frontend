import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HelloLogo from "../../assets/hello.png"
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [user, setUser] = useState('');
  const [view, setView]= useState('owned')

  useEffect(() => {
    fetchProjects();
    fetchUsername();
  }, []);

  const fetchProjects = async () => {
    try {
        const response = await fetch(`http://localhost:7000/project/get-projects?view=${view}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
          });
        
      const data = await response.json();
      
      console.log(data)
      if (!data){
        setProjects([])
      }
      console.log(data)
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const handleViewchange =(e)=>{
     setView(e.target.value)
  }


  const fetchUsername = async () => {
    try {
        const response = await fetch('http://localhost:7000/auth/user', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        const userData = await response.json();
        setUser(userData.username);
    } catch (error) {
        console.error('Error fetching username:', error);
    }
};
  const createNewProject = async (title) => {
   
    try {
      const response = await fetch('http://localhost:7000/project/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        fetchProjects(); 
        setIsModalOpen(false); 
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const viewProject = async (projectId) => {
   
    navigate('/todo',{ state: projectId })
};

const handleLogout = () => {
  localStorage.removeItem('token');
 navigate('/')
};

  return (
    <div className="homepage">
      <div className='home-header'>
      <div className='user-name-title'> <img src={HelloLogo} alt="Edit Icon" />{user}</div>
      <button className='logout' onClick={()=>{handleLogout()}}>logout</button>
      </div>
        <div className='inner-rectangle'>
          <div  className='inner-rectangle-head'>
      <button onClick={() => setIsModalOpen(true)} className="create-project-button"><p>New Project</p></button>
      <select className='viewdropdown' value={view} onChange={handleViewchange} >
        <option value="owned">owned projects</option>
        <option value="collobrated"> collobrated projects</option>
      </select>
      </div>
      <div className="project-list">
     {view === 'owned' ? (
      Array.isArray(projects) ? (
            projects.map((project) => (
              <div key={project._id} className="project-block">
                <div className="project-name">
                  <h3>{project.title}</h3>
                </div>
                <div className='data-div'>
                  <p>Created: {new Date(project.createdDate).toLocaleDateString()}</p>
               
                  <button onClick={() => viewProject(project._id)}>View Project</button>
                </div>
              </div>
            ))
          ) : (
            <p className=''>No projects found.</p>
          )):
          (<h2>no collaboraded proejcts</h2>)
        }
      </div>
        
    </div>
    {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Enter project title"
            />
            <button onClick={()=>createNewProject(newProjectTitle)}>Create</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
