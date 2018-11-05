import React from 'react';
import { Redirect } from  'react-router-dom';

class Home extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            loggedIn: sessionStorage.getItem('loggedin') === 'true',
        }
    }

    render(){

        if(this.state.loggedIn === true) {
            return <Redirect to='/home'/>;
        }else{
            return <Redirect to='/login'/>;
        }      
    }
}

export default Home;