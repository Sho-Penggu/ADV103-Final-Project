import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import Home from './Home';
import Login from './Login';
//import React from "react";


function App() {
  const [currentUser, setCurrentUser] = useState(false);

  const handleLogout = () => {
    // Your logout logic here
    setCurrentUser(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<Login setCurrentUser={setCurrentUser} handleLogout={handleLogout} />} // Pass handleLogout as a prop
          />
          <Route
            exact
            path="/Home"
            element={<Home currentUser={currentUser} handleLogout={handleLogout} />} // Pass handleLogout as a prop
          />
          {/* ... (other routes) */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;