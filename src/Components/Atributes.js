import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import axios from 'axios';
import { MySnackbarContentWrapper } from './SnackBarCustom'
import { Config } from './Config'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar'
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
  },  
  fab: {
    position: 'absolute',
    //overflow: true,
    //bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 4,
    top: theme.spacing.unit * 10,
    //padding: '0 0px',
  },
});


class SimpleGridList extends React.Component {

  constructor(){
      super();
      this.state = {
          elements: [],
          element: [],
          edit: false,
          add: false,
          remove: false,
          success: false,
          loading: false,
          message: '',
          openMessage: false,
      }
  }

  getElementsList(){
    console.log(`Call Api: ${Config.API}productattribute/all`);
    fetch(Config.API+'productattribute/all')
    .then(result => {
        return result.json();
    })
    .then(data => {
        let elements = data.data.map((element) => {
            const { classes } = this.props;
            return (
                <ListItem key={element.ProductAttributeId}>
                  <ListItemText primary={`${element.Name}`} secondary={element.CreatedAt} />
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
          <div>
            <Button variant="fab" color="primary" aria-label="Add" className={classes.fab} onClick={this.onClickAddHandler}>
              <AddIcon />
            </Button>
          </div>
          <List component="nav"
                subheader={<ListSubheader component="div">Lista de atributos de productos</ListSubheader>}
          >
            {this.state.elements}
          </List>
        <div>
          <Dialog
            open={this.state.edit}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Editar</DialogTitle>
              <form onSubmit={this.onClickEditSubmitHandler}>
                <DialogContent> 
                  <TextField id="id" name="id" type="hidden" value={this.state.categoryId} onChange={this.handleIdChange} />                
                  <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                  <TextField autoFocus margin="dense" id="file" name="file" onChange={this.handleFileChange} label="File" type="file" fullWidth/>
                    </DialogContent>
                      {loading && <LinearProgress />}
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancelar</Button>
                        <Button type="submit" color="primary">Guardar</Button>
                       </DialogActions>
              </form>
            </Dialog>
            <Dialog
              open={this.state.add}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title">

              <DialogTitle id="form-dialog-title">Agregar</DialogTitle>
                  <form onSubmit={this.onClickAddSubmitHandler}>
                            <DialogContent>              
                                    <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                                    <TextField autoFocus margin="dense" id="file" name="file" onChange={this.handleFileChange} label="File" type="file" fullWidth/>
                            </DialogContent>
                                {loading && <LinearProgress />}
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">Cancelar</Button>
                                <Button type="submit" color="primary">Agregar</Button>
                            </DialogActions>
                        </form>
                    </Dialog>

                    <Dialog
                        open={this.state.remove}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Eliminar</DialogTitle>
                            <form onSubmit={this.onClickRemoveSubmitHandler}>
                            <DialogContent> 
                            <DialogContentText id="alert-dialog-description">
                                Esta seguro que desea eliminar el producto: {this.state.Name}
                            </DialogContentText>
                                <TextField id="id" name="id" type="hidden" value={this.state.ProductId} />                
                            </DialogContent>
                                {loading && <LinearProgress />}
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">Cancelar</Button>
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
                        variant="success"
                        message={this.state.message}
                    />
                    </Snackbar>
                </div> 
          </div>
        );
    }


    onClickAddHandler = () => {
      //this.setProduct([]); 
      this.setState({
        add: true,
      })
    }
  
    onClickEditHandler = (element) => {
      //this.setProduct(product);
      this.setState({
        edit: true,
      })
    }
  
    onClickRemoveHandler = (element) => {
      //this.setProduct(product);  
      this.setState({
        remove: true,
      })
    }
  
    onClickCloseHandle = () => {
      this.setState({
        add: false,
        edit: false,
        remove: false
      })
    }
  
    handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === 'file' ? target.files[0] : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }
}

SimpleGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleGridList);