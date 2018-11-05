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
import MenuItem from '@material-ui/core/MenuItem'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import BackIcon from '@material-ui/icons/ArrowBack'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  }, 
  listSection: {
    backgroundColor: 'inherit',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});


class ProductAttributesValuesGridList extends React.Component {

  constructor(){
      super();
      this.state = {
          elements: [],
          attributes: [],
          attrubute: '',
          edit: false,
          add: false,
          remove: false,
          success: false,
          loading: false,
          message: '',
          value: '',
          id: -1,
          openMessage: false,
      }
  }

  onClickAddHandler = () => {
    //this.setProduct([]); 
    console.log("Add");
    this.setState({
      add: true,
      openMessage: false,
    })
  }

  onClickEditHandler = (id) => {
    //this.setProduct(product);
    this.setState({
      edit: true,
      id: id,
      openMessage: false,
    })
  }

  onClickRemoveHandler = (id) => {
    //this.setProduct(product);  
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

    const { id } = this.props.match.params;

    var url = `${Config.API}productattributevalue/add/${id}.${this.state.attribute}.${this.state.value}`;

    debugger;

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

  handleValueChange = (event) => {
    this.setState({
        value: event.target.value
    })
  }

  handleAttributeChange = (event) => {
    this.setState({
        attribute: event.target.value
    })
  }

  onClickRemoveSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    var url = `${Config.API}productattributevalue/remove/${this.state.id}`;

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

    const { id } = this.props.match.params;

    var url = `${Config.API}productattributevalue/product/${id}`;
   
    console.log(`Call Api: ${url}`);
    
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        let elements = data.data.map((element) => {
            const { classes } = this.props;
            return (
                <ListItem key={element.ProductAttributeValueId}>
                  <ListItemText primary={`${element.Name}`} secondary={element.Value} />
                  <ListItemSecondaryAction>
                      <IconButton aria-label="Delete" onClick={( id = element.ProductAttributeValueId) => this.onClickRemoveHandler(id)}>
                        <DeleteIcon />
                      </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            )
        })
        this.setState({ elements: elements })
    })
  }

  getAttributeList(){
    var url = `${Config.API}productattribute/all`;
   
    console.log(`Call Api: ${url}`);
    
    fetch(url)
    .then(result => {
        return result.json();
    })
    .then(data => {
        this.setState({ attributes: data.data })
    })
  }

  componentDidMount() {
    this.getAttributeList();
    this.getElementsList();
  }

  
  render(){
    const { loading } = this.state;
    const { classes } = this.props;
    return ( 
      <div className={classes.root}>

          <AppBar position="static">
            <Toolbar variant="dense">
              <Link to={`/home`}>
                <IconButton className={classes.menuButton} aria-label="Menu">
                  <BackIcon />
                </IconButton>
              </Link>
                <Typography variant="h5" color="inherit">
                  Regresar
                </Typography>
            </Toolbar>
          </AppBar>
         
          <List className={classes.listSection}
                component="nav"
                subheader={<ListSubheader component="div">Lista de atributos de productos</ListSubheader>}
            >
            {this.state.elements}
          </List>

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
                  <TextField
                    id="attribute"
                    select
                    label="Select"
                    className={classes.textField}
                    value={this.state.attribute}
                    onChange={this.handleAttributeChange}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    helperText="Selecciona un atributo"
                    margin="normal"
                  >
                    {this.state.attributes.map(option => (
                      <MenuItem key={option.ProductAttributeId} value={option.ProductAttributeId}>
                        {option.Name}
                      </MenuItem>
                    ))}
                  </TextField>           
                   <TextField autoFocus 
                      margin="dense" 
                      id="value" 
                      name="value" 
                      className={classes.textField}
                      value={this.state.value} 
                      onChange={this.handleValueChange} 
                      label="Valor" 
                      type="text" 
                      fullWidth />
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
                        Esta seguro que desea eliminar el producto: {this.state.name}
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
                        variant="success"
                        message={this.state.message}
                    />
                    </Snackbar>
                </div> 
          </div>
        );
    }
}

ProductAttributesValuesGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductAttributesValuesGridList);