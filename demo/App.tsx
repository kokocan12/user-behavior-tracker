import React from 'react';
import { Routes, Route } from 'react-router-dom';

import List from './pages/List';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
    </Routes>
  );
};

export default App;
