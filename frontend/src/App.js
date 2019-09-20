import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import AdminPage from './components/pages/admin';
import HomePage from './components/pages/home';
import LoginPage from './components/pages/login';
import RegisterPage from './components/pages/register';
import SearchPage from './components/pages/search-results/';
import UploadPage from './components/pages/upload';
import UserPage from './components/pages/user';


const AppRouter = () => (
  <Router>
      <a href="/">Home</a><br/>
      <Route path="/" exact component={HomePage} />
      <Route path="/login/" exact component={LoginPage} />
      <Route path="/register/" exact component={RegisterPage} />
	    <Route path="/search/query=:query?&filters=:filters?" component={SearchPage}/>
	    <Route path="/upload/" component={UploadPage}/>
      <Route path="/user/:id" component={UserPage}/>
      <Route path="/admin" component={AdminPage}/>
  </Router>
);

export default AppRouter;









