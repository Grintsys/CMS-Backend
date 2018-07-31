import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Visibility from '@material-ui/icons/Visibility'
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button'
import { Redirect } from  'react-router-dom';
import { MySnackbarContentWrapper } from './SnackBarCustom'
import Snackbar from '@material-ui/core/Snackbar'

import { Config } from './Config'
import axios from 'axios';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    container: {
        minWidth: 180,
        maxWidth: 340,
    },
    buttom: {
        
    }
});

class LoginForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            showPassword: false,
            password: '',
            user: '',
            success: false,
            message: '',
            loggedIn: sessionStorage.getItem('loggedin') === 'true',
            openMessage: false,
        }
    }

    onLoginSubmitHandler = (event) => {
        event.preventDefault();

        var user = this.state.user;
        var pass = this.state.password;

        //if you dont sent a real multipart file the form params doesn't work
        var data = { User: user, Password: pass };

        axios({
            method: 'POST',
            url: Config.API + 'user/login',
            data: data
          })
        .then(res => {
            this.setState({
                success: res.data.success,
                message: res.data.message,    
            });

            if(this.state.success === true){
                console.log("login success");
                sessionStorage.setItem('loggedin', true);
                this.setState({
                    loggedIn: true,
                });
            } else {
                this.setState({
                    openMessage: true,
                })
            }
       })
       .catch(error => {
            console.log(error);
       });
    }

    handleClickShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword,
        })
    }

    handleMouseDownPassword = () => {

    }

    handleUserChange = (event) => {
        this.setState({
            user: event.target.value,
        })
    }

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value,
        })
    }

    handleClose = () => {
        this.setState({
            openMessage: false,
        })
    }


    render(){
        const { classes } = this.props;

        if(this.state.loggedIn) {
            return <Redirect to='/home'/>;
        }

        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <form onSubmit={this.onLoginSubmitHandler}>
                        <Paper className={classes.root} elevation={1}>
                            <FormGroup>
                                <FormControl>
                                    <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
                                    <Input
                                        id="input-with-icon-adornment"
                                        value={this.state.user}
                                        onChange={this.handleUserChange}
                                        startAdornment = {
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="adornment-password">Password</InputLabel>
                                    <Input
                                        id="adornment-password"
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        value={this.state.password}
                                        onChange={this.handlePasswordChange}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={this.handleClickShowPassword}
                                            onMouseDown={this.handleMouseDownPassword} >
                                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                    <Button variant="contained" color="primary" type="submit" className={classes.button}>
                                        Login
                                    </Button>
                                </FormControl>
                            </FormGroup>
                        </Paper>
                    </form>

                    <div>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={this.state.openMessage}
                            autoHideDuration={6000}
                            onClose={this.handleClose}>
                        <MySnackbarContentWrapper
                            onClose={this.handleClose}
                            variant="error"
                            message={this.state.message}
                        />
                        </Snackbar>
                    </div>
                </div>
            </div>
        );
    }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);