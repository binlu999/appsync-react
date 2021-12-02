import './App.css';
import React from 'react';
import DisplayPosts from './components/displayPosts';
import AddPost from './components/AddPost';

function App() {
  return (
    <div className="App">
      <AddPost/>
      <DisplayPosts/>
    </div>
  );
}

export default App;
