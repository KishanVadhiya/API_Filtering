// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; 
import Navbar from './components/Navbar';
import AllProduct from './components/AllProduct';
import Spotlight from './components/Spotlight';
import theme from './theme'; 

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<AllProduct />} />
          <Route path="/spotlight" element={<Spotlight />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
