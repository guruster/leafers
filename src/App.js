import React, { useEffect } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import All from './componenets/All';
import Terms from './componenets/Terms'
import Privacy from './componenets/Privacy';
import MyCollection from './componenets/MyCollection';

import './App.css'

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<All />} />
          <Route path='/term' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/collection' element={<MyCollection />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
