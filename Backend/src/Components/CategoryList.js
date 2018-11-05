import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { MySnackbarContentWrapper } from './SnackBarCustom'
import Snackbar from '@material-ui/core/Snackbar'
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  gridItemImage: {
    width: '300px',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  button: {
    margin: theme.spacing.unit,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

function CategoriesRender(props){

    const { classes, categories } = props;

    if(!categories){
        return null;
    }

    if(categories.length === 0){
        return null;
    }
    
    let view = categories.map((category) => { 
        let cId = category.CategoryId;
        return (
            <GridListTile key={cId}>
                <img src={process.env.REACT_APP_BACKEND_API+category.ImageUrl}
                     alt={category.Name} 
                     className={classes.gridItemImage} />
                <GridListTileBar onClick={() => props.clicked(cId)}
                                 title={category.Name}
                                 actionIcon={
                                        <IconButton className={classes.icon} onClick={() => props.remove(cId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                //className={classes.titleBar}
                />
            </GridListTile>
        );
    })

    return view;
}

function SubCategoriesRender(props){

    const { classes, subcategories } = props;

    if(!subcategories){
        return null;
    }

    if(subcategories.length === 0){
        return null;
    }

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell numeric>Id</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell numeric>Fecha de Creación</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {subcategories.map(row => {
                    return (
                    <TableRow key={row.SubCategoryId}>
                        <TableCell numeric>{row.SubCategoryId}</TableCell>
                        <TableCell component="th" scope="row">{row.Name}</TableCell>
                        <TableCell numeric>{row.CreatedAt}</TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
        </Paper>
    );
}

class TitlebarGridList extends React.Component {

    constructor(){
        super();
        this.state = {
            categories: [],
            subcategories: [],
            edit: false,
            add: false,
            remove: false,
            succes: false,
            loading: false,
            message: '',
            openMessage: false,
            cId: -1,
            id: -1,
            name: '',
            file: [],
        }
    }

    handleClose = () => {
        this.setState({ 
            edit: false, 
            add: false, 
            remove: false,
            openMessage: false,
        });
    };

    onClickEditSubmitHandler = (event) =>{
        event.preventDefault();

        this.setState({ loading: true });

        var data = new FormData();
        data.append('id', this.state.id);
        data.append('name', this.state.name);
        data.append('file', this.state.file);
        
       axios({
           method: 'POST',
           url: process.env.REACT_APP_BACKEND_API + 'category/edit',
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
                name: '',
                file: []
            });

            this.getCategoryList();
       })
       .catch(function (error) {
            console.log(error);
       });
    }

    onClickAddSubmitHandler = (event) =>{
        event.preventDefault();

        this.setState({ loading: true });

        var data = new FormData();
        data.append('name', this.state.name);
        data.append('file', this.state.file);
        
       axios({
           method: 'POST',
           url: process.env.REACT_APP_BACKEND_API + 'category/add',
           data: data,
           config: { 
               headers: {'Content-Type': 'multipart/form-data' }
            },
        })
       .then(res => {
            //TODO add dom object to grid list
            this.setState({
                success: res.data.success,
                message: res.data.message,  
                add: false,
                openMessage: true,
                loading: false,
                id: -1,
                name: '',
                file: []
            });

            this.getCategoryList();
       })
       .catch(error => {
            console.log(error);
       });
    }

    onClickRemoveSubmitHandler = (event) => {
        event.preventDefault();
    
        this.setState({ loading: true });
    
        var url = `${process.env.REACT_APP_BACKEND_API}category/remove/${this.state.id}`;
    
        axios.get(url)
        .then(res => {
            this.setState({
              success: res.data.success,
              message: res.data.message,  
              remove: false,
              openMessage: true,
              loading: false,
              id: -1,
              name: '',
              file: []
          });

          this.getCategoryList();
        })
        .catch(function (error) {
           console.log(error);
        });
      }

    onClickAddHandler = () => {
        this.setState({ 
            add: true,
            openMessage: false,
        });
    }

    onClickEditHandler = (category) => {
        this.setState({ 
            edit: true, 
            id: category.CategoryId, 
            name: category.Name,
            openMessage: false,
        });
    }

    onClickRemoveHandler = (category) => {
        this.setState({
            remove: true,
            id: category.CategoryId, 
            name: category.Name,
            openMessage: false,
        })
    }

    handleIdChange = (event) => {
        this.setState({
            id: event.target.value
        })
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    handleCategoryClick = (id) => {
        //console.log("entro aqui");
        this.getSubCategoryList(id);
    }

    handleFileChange = (event) => {
        const file = event.target.files[0];
        this.setState({
            file: file
        })
    }

    getCategoryList(){
        var url = `${process.env.REACT_APP_BACKEND_API}category/all`;
        console.log(`Url API: ${url}`);

        fetch(url)
        .then(result => {
            return result.json();
        })
        .then(data => {
            this.setState({ categories: data.data })
        })
    }

    getSubCategoryList(categoryId){
        var url = `${process.env.REACT_APP_BACKEND_API}subcategory/category/${categoryId}`;
        console.log(`Url API: ${url}`);

        if(!categoryId){
            return null;
        }

        fetch(url)
        .then(result => {
            return result.json();
        })
        .then(data => {
            this.setState({ subcategories: data.data, categories: [] })
        })
    }

    componentDidMount() {
        this.getCategoryList();
    }

    render(){
        const { loading } = this.state;
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <GridList className={classes.gridList}>
                    <CategoriesRender categories={this.state.categories} 
                                      clicked={this.handleCategoryClick} 
                                      remove={this.onClickRemoveHandler}
                                      {...this.props} />
                    <SubCategoriesRender subcategories={this.state.subcategories} 
                                      {...this.props}/>
                </GridList>
                <div>
                    <Button variant="fab" color="primary" aria-label="Add" className={classes.fab} onClick={this.onClickAddHandler}>
                        <AddIcon />
                    </Button>
                </div>
                <div>
                    <Dialog
                        open={this.state.edit}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title">

                        <DialogTitle id="form-dialog-title">Editar</DialogTitle>
                        <form onSubmit={this.onClickEditSubmitHandler}>
                            <DialogContent> 
                                    <TextField id="id" name="id" type="hidden" value={this.state.categoryId} onChange={this.handleIdChange} />                
                                    <TextField required autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
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
                                    <TextField required autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                                    <TextField required autoFocus margin="dense" id="file" name="file" onChange={this.handleFileChange} label="File" type="file" fullWidth/>
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
                                Esta seguro que desea eliminar el producto: {this.state.name} ?
                                Si una categoria posee otras asignadas no se podra eliminar.
                            </DialogContentText>
                                <TextField id="id" name="id" type="hidden" value={this.state.id} />                
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
                        variant={!this.state.success ? "error" : "success" }
                        message={this.state.message}
                    />
                    </Snackbar>
                </div>  
            </div>
        );
    }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);