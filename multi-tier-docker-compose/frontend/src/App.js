import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://backend:3000";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Three-Tier Docker App</h1>
      <h2>Items from API:</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

