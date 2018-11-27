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
import Divider from '@material-ui/core/Divider';
import Address from './Address';
import Phones from './Phones';

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
          tel_principal: '',
          tel_secundario: '',
          tel_alterno: '',
          address1: '',
          address2: '',
          message: '',
          name: '',
          id: 1, //TODO: fix this eventually
          rtn: '',
          email: '',
          addresses: [],
          phones: [],
          openMessage: false,
      }
  }

  handleChange = name => event => {

    //debugger;
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
    data.append('tel_principal', this.state.tel_principal);
    data.append('tel_secundario', this.state.tel_secundario);
    data.append('tel_alterno', this.state.tel_alterno);
    data.append('address1', this.state.address1);
    data.append('address2', this.state.address2);

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

          this.getCompany();
    })
    .catch(function (error) {
          console.log(error);
    });
}

  getCompany(){

    this.setState({ loading: true });

    var id = this.state.id;
    var url = `${process.env.REACT_APP_BACKEND_API}company/${id}`;
    
    console.log(`Call Api: ${url}`);
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        var company = data.data;
        this.setState(
        { 
            name: company.Name,
            email: company.Email,
            rtn: company.RTN,
            loading: false,      
        })
    })
  }

  getCompanyAddress(){

    this.setState({ loading: true });

    var id = this.state.id;
    var url = `${process.env.REACT_APP_BACKEND_API}company/${id}/address`;
    
    console.log(`Call Api: ${url}`);
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        this.setState(
          {  
            addresses: data.data,
            loading: false,      
          })
    })
  }

  getCompanyPhones(){

    this.setState({ loading: true });

    var id = this.state.id;
    var url = `${process.env.REACT_APP_BACKEND_API}company/${id}/phones`;
    
    console.log(`Call Api: ${url}`);
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        this.setState(
          {  
            phones: data.data,
            loading: false,      
          })
    })
  }

  componentDidMount() {
    this.getCompany();
    this.getCompanyAddress();
    this.getCompanyPhones();
  }

  /*
  
   <TextField margin="dense" id="tel_principal" name="tel_principal" value={this.state.tel_principal} onChange={this.handleChange('tel_principal')} label="Tel principal" type="text" fullWidth />  
                    <TextField margin="dense" id="tel_secundario" name="tel_secundario" value={this.state.tel_secundario} onChange={this.handleChange('tel_secundario')} label="Tel Secundario" type="text" fullWidth />  
                    <TextField margin="dense" id="tel_alterno" name="tel_alterno" value={this.state.tel_alterno} onChange={this.handleChange('tel_alterno')} label="Tel Alterno" type="text" fullWidth />  
                    <TextField margin="dense" id="address1" name="address1" value={this.state.address1} onChange={this.handleChange('address1')} label="Direccion 1" type="text" fullWidth />  
                    <TextField margin="dense" id="address2" name="address2" value={this.state.address2} onChange={this.handleChange('address2')} label="Direccion 2" type="text" fullWidth />  
  
  */
  
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
                    <TextField margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleChange('name')} label="Nombre" type="text" fullWidth />
                    <TextField margin="dense" id="email" name="email" value={this.state.email} onChange={this.handleChange('email')} label="Email" type="text" fullWidth />
                    <TextField margin="dense" id="rtn" name="rtn" value={this.state.rtn} onChange={this.handleChange('rtn')} label="RTN" type="text" fullWidth />  
                  </DialogContent>
                    {loading && <LinearProgress />}
                  <Divider />
                  <DialogActions>
                      <Button type="submit" color="primary">Salvar</Button>
                  </DialogActions>
              </form>
            </Typography>
          </Paper>

          <Address state={this.state} classes={classes} />
          <Phones state={this.state} classes={classes} />
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