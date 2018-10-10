import React, { Component } from 'react';
import Login from './Components/Login'
import MainScreen from './Components/TopMenu'
import Home from './Components/Home'
import Values from './Components/ProductAttributeValues'
import { BrowserRouter as Router, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
        <CssBaseline />
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/home" component={MainScreen}/>
            <Route path="/values/:id" component={Values} />
          </div>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
