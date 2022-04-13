import React from 'react';
import { Routes, Route } from 'react-router-dom';

import List from './pages/List';
import Detail from './pages/Detail';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/:idx" element={<Detail />} />
    </Routes>
  );
};

export default App;
