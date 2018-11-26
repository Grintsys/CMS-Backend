import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { MySnackbarContentWrapper } from '../SnackBarCustom'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar'
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    //overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  }
});

class Company extends React.Component {

  constructor(){
      super();
      this.state = {
          elements: [],
          edit: false,
          add: false,
          remove: false,
          success: false,
          loading: false,
          message: '',
          name: '',
          id: 1, //TODO: fix this eventually
          rtn: '',
          email: '',
          openMessage: false,
      }
  }

  handleChange = name => event => {

    debugger;
    this.setState({
      [name]: event.target.value,
    });
  };

  onClickEditSubmitHandler = (event) =>{
    event.preventDefault();

    this.setState({ loading: true });

    var data = new FormData();
    data.append('name', this.state.name);
    data.append('rtn', this.state.rtn);
    data.append('email', this.state.email);

    var url = `${process.env.REACT_APP_BACKEND_API} + 'company/${this.state.id}/edit',`
    
    axios({
        method: 'POST',
        url: url,
        data: data,
        config: { 
            headers: { 'Content-Type': 'multipart/form-data' }
        },
    })
    .then(res => {
          //TODO edit dom object to refresh image
          this.setState({
              success: res.data.success,
              message: res.data.message,  
              edit: false,
              openMessage: true,
              loading: false,
              id: 1,
              name: '',
              rtn: '',
              email: '',
          });

          this.getElementsList();
    })
    .catch(function (error) {
          console.log(error);
    });
}

  getElementsList(){

    this.setState({ loading: true });

    var id = this.state.id;
    var url = `${process.env.REACT_APP_BACKEND_API}company/${id}`;
    
    console.log(`Call Api: ${url}`);
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        var company = data.data.company[0];
        this.setState(
          { 
            name: company.Name,
            email: company.Email,
            rtn: company.RTN,    
            loading: false,      
          })
    })
  }

  componentDidMount() {
    this.getElementsList();
  }
  
  render(){
    const { loading } = this.state;
    const { classes } = this.props;
    return ( 
      <div className={classes.root}>    
         <div>
          <Paper className={classes.root} elevation={1}>
            <Typography component="p">
              <form onSubmit={this.onClickEditSubmitHandler}>
                  <DialogContent>     
                    <TextField id="id" name="id" type="hidden" value={this.state.id} />                                   
                    <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleChange} label="Nombre" type="text" fullWidth />
                    <TextField autoFocus margin="dense" id="email" name="email" value={this.state.email} onChange={this.handleChange} label="Email" type="text" fullWidth />
                    <TextField autoFocus margin="dense" id="rtn" name="rtn" value={this.state.rtn} onChange={this.handleChange} label="RTN" type="text" fullWidth />  
                    <TextField autoFocus margin="dense" id="tel" name="tel" value={this.state.rtn} onChange={this.handleChange} label="tel" type="text" fullWidth />  
                    <TextField autoFocus margin="dense" id="tel2" name="tel2" value={this.state.rtn} onChange={this.handleChange} label="tel2" type="text" fullWidth />  
                    <TextField autoFocus margin="dense" id="address" name="address" value={this.state.rtn} onChange={this.handleChange} label="Direccion 1" type="text" fullWidth />  
                    <TextField autoFocus margin="dense" id="address2" name="address2" value={this.state.rtn} onChange={this.handleChange} label="Direccion 2" type="text" fullWidth />  
                  </DialogContent>
                    {loading && <LinearProgress />}
                  <DialogActions>
                      <Button type="submit" color="primary">Salvar</Button>
                  </DialogActions>
              </form>
            </Typography>
          </Paper>
        </div>
         <div>
             <Snackbar
                 anchorOrigin={{
                 vertical: 'bottom',
                 horizontal: 'left',
                 }}
                 open={this.state.openMessage}
                 autoHideDuration={6000}
                 onClose={this.onClickCloseHandle}>
             <MySnackbarContentWrapper
                 onClose={this.onClickCloseHandle}
                 variant={!this.state.success ? "error" : "success" }
                 message={this.state.message}
             />
            </Snackbar>
          </div>
      </div>
        );
    }
}

Company.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Company);