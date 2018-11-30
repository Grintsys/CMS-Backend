import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import { MySnackbarContentWrapper } from './SnackBarCustom'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar'
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },  
  listSection: {
    backgroundColor: 'inherit',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.unit * 4,
  },
});


class BrandsGridList extends React.Component {

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
          id: -1,
          openMessage: false,
      }
  }

  onClickAddHandler = () => {
    this.setState({
      add: true,
      openMessage: false,
    })
  }

  onClickEditHandler = (id) => {
    this.setState({
      edit: true,
      id: id,
      openMessage: false,
    })
  }

  onClickRemoveHandler = (id) => {
    this.setState({
      remove: true,
      id: id,
      openMessage: false,
    })
  }

  onClickCloseHandle = () => {
    this.setState({
      add: false,
      edit: false,
      remove: false,
      openMessage: false,
    })
  }

  onClickAddSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    var url = `${process.env.REACT_APP_BACKEND_API}brand/add/${this.state.name}`;

    axios.get(url)
    .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,  
          add: false,
          openMessage: true,
          loading: false,
        })

        this.getElementsList();
    })
    .catch(function (error) {
       console.log(error);
    });
  }

  handleNameChange = (event) => {
    this.setState({
        name: event.target.value
    })
  }

  onClickEditSubmitHandler = (event) =>{
    event.preventDefault();

    this.setState({ loading: true });

    var data = new FormData();
    data.append('id', this.state.id);
    data.append('name', this.state.name);
    
   axios({
       method: 'POST',
       url: process.env.REACT_APP_BACKEND_API + 'productattribute/edit',
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
            id: -1,
            name: ''
        });

        this.getElementsList();
   })
   .catch(function (error) {
        console.log(error);
   });
}

  onClickRemoveSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    var url = `${process.env.REACT_APP_BACKEND_API}brand/remove/${this.state.id}`;

    axios.get(url)
    .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,  
          remove: false,
          openMessage: true,
          loading: false,
          id: -1,
          name: ''
      });

      this.getElementsList();
    })
    .catch(function (error) {
       console.log(error);
    });
  }

  getElementsList(){
    var url = `${process.env.REACT_APP_BACKEND_API}brand/all`;
    console.log(`Call Api: ${url}`);
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        let elements = data.data.map((element) => {
            let bId = element.BrandId;
            return (
                <ListItem key={bId}>
                  <ListItemText primary={`${element.Name}`} secondary={`Id: ${bId}`}/>
                  <ListItemSecondaryAction>
                      <IconButton aria-label="Delete" onClick={() => this.onClickRemoveHandler(bId)}>
                        <DeleteIcon />
                      </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            )
        })
        this.setState({ elements: elements })
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
         <Grid item xs={12} md={6}>
            <List className={classes.listSection}
                  component="nav"
                  subheader={<ListSubheader component="div">Lista de marcas</ListSubheader>}
              >
              {this.state.elements}
            </List>
          </Grid>

            <Button variant="fab" color="primary" aria-label="Add" className={classes.fab} onClick={this.onClickAddHandler}>
              <AddIcon />
            </Button>
        <div>

          <Dialog
              open={this.state.add}
              onClose={this.onClickCloseHandle}
              aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Agregar</DialogTitle>
              <form onSubmit={this.onClickAddSubmitHandler}>
                <DialogContent>              
                   <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                </DialogContent>
                  {loading && <LinearProgress />}
                <DialogActions>
                    <Button onClick={this.onClickCloseHandle} color="primary">Cancelar</Button>
                    <Button type="submit" color="primary">Agregar</Button>
                </DialogActions>
              </form>
          </Dialog>

          <Dialog
              open={this.state.edit}
              onClose={this.onClickCloseHandle}
              aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Editar</DialogTitle>
              <form onSubmit={this.onClickEditSubmitHandler}>
                <DialogContent> 
                  <TextField id="id" name="id" type="hidden" value={this.state.categoryId} onChange={this.handleIdChange} />                
                  <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                    </DialogContent>
                      {loading && <LinearProgress />}
                    <DialogActions>
                      <Button onClick={this.onClickCloseHandle} color="primary">Cancelar</Button>
                      <Button type="submit" color="primary">Guardar</Button>
                    </DialogActions>
              </form>
            </Dialog>
            <Dialog
              open={this.state.remove}
              onClose={this.onClickCloseHandle}
              aria-labelledby="form-dialog-title">          
              <DialogTitle id="form-dialog-title">Eliminar</DialogTitle>
                <form onSubmit={this.onClickRemoveSubmitHandler}>
                  <DialogContent> 
                    <DialogContentText id="alert-dialog-description">
                        Esta seguro que desea eliminar el producto id: {this.state.id}
                     </DialogContentText>
                      <TextField id="id" name="id" type="hidden" value={this.state.id} />                
                    </DialogContent>
                      {loading && <LinearProgress />}
                      <DialogActions>
                        <Button onClick={this.onClickCloseHandle} color="primary">Cancelar</Button>
                        <Button type="submit" color="primary">Guardar</Button>
                        </DialogActions>
                  </form>
                </Dialog>
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

BrandsGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BrandsGridList);