import React, { useEffect, useState} from "react";
import api from 'services/api';


import "./styles.css";

function App() {
  const [repository, setRepository] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => {
      setRepository(response.data);
    });
  }, []);



  async function handleAddRepository() {
    const response = await api.post('repositories',{
      title:"Fabiano",
	    url:"link do site",
	    techs:["html, css"],
    });

    const newRepository = response.data;
    
    setRepository([...repository, newRepository]);
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);
      setRepository(repository.filter((e) => e.id !== id));
    }catch (err) {
      console.log(err.response.data.err);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
      {repository.map((e) => (
        <li key={e.id}> {e.title}

          <button onClick={() => handleRemoveRepository(e.id)}>
            Remover
          </button>
        </li> ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
