import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import { Config } from './Config'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 600,
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

class TitlebarGridList extends React.Component {

    constructor(){
        super();
        this.state = {
            categories: [],
            edit: false,
            add: false,
            remove: false,
            id: -1,
            name: '',
            file: [],
        }
    }

    handleClose = () => {
        this.setState({ edit: false, add: false });
    };

    handleEditSubmit = (event) =>{
        event.preventDefault();

        var data = new FormData();
        data.append('id', this.state.id);
        data.append('name', this.state.name);
        data.append('file', this.state.file);
        
       axios({
           method: 'POST',
           url: Config.API + 'category/edit',
           data: data,
           config: { 
               headers: { 'Content-Type': 'multipart/form-data' }
            },
        })
       .then(function (response) {
            //TODO edit dom object to refresh image
            console.log(response);
       })
       .catch(function (error) {
            console.log(error);
       });

       this.setState({ edit: false, id: -1, name: '', file: '' });
    }

    handleAddSubmit = (event) =>{
        event.preventDefault();

        var data = new FormData();
        data.append('name', this.state.name);
        data.append('file', this.state.file);
        
       axios({
           method: 'POST',
           url: Config.API + 'category/add',
           data: data,
           config: { 
               headers: {'Content-Type': 'multipart/form-data' }
            },
        })
       .then(res => {
            //TODO add dom object to grid list
            console.log(res);
       })
       .catch(error => {
            console.log(error);
       });

       this.setState({ add: false, id: -1, name: '', file: '' });
    }

    onClickAddHandler = () => {
        this.setState({ add: true });
    }

    onClickEditHandler = (category) => {
        this.setState({ edit: true, id: category.CategoryId, name: category.Name });
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

    handleFileChange = (event) => {
        const file = event.target.files[0];
        this.setState({
            file: file
        })
    }

    componentDidMount() {
        console.log("call apo: "+Config.API);

        fetch(Config.API+'category/all')
        .then(result => {
            return result.json();
        })
        .then(data => {
            let categories = data.data.map((category) => {
                const { classes } = this.props;
                return (
                    <GridListTile key={category.CategoryId}>
                        <img src={Config.API+category.ImageUrl} alt={category.Name} />
                        <GridListTileBar
                        title={category.Name}
                        actionIcon={
                            <IconButton className={classes.icon} onClick={() => this.onClickEditHandler(category)}>
                                <EditIcon />
                            </IconButton>
                        }
                        />
                    </GridListTile>
                )
            })
            this.setState({ categories: categories })
            console.log("state", this.state.categories);
        })
    }

    render(){
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <GridList cellHeight={180} className={classes.gridList}>
                    {this.state.categories}
                </GridList>
                <div>
                    <Dialog
                        open={this.state.edit}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title">

                        <DialogTitle id="form-dialog-title">Editar</DialogTitle>
                        <form onSubmit={this.handleEditSubmit}>
                            <DialogContent> 
                                    <TextField id="id" name="id" type="hidden" value={this.state.categoryId} onChange={this.handleIdChange} />                
                                    <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                                    <TextField autoFocus margin="dense" id="file" name="file" onChange={this.handleFileChange} label="File" type="file" fullWidth/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">Cancelar</Button>
                                <Button type="submit" color="primary">Guardar</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </div>
                <div>
                    <Dialog
                        open={this.state.add}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title">

                        <DialogTitle id="form-dialog-title">Agregar</DialogTitle>
                        <form onSubmit={this.handleAddSubmit}>
                            <DialogContent>              
                                    <TextField autoFocus margin="dense" id="name" name="name" value={this.state.name} onChange={this.handleNameChange} label="Nombre" type="text" fullWidth />
                                    <TextField autoFocus margin="dense" id="file" name="file" onChange={this.handleFileChange} label="File" type="file" fullWidth/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">Cancelar</Button>
                                <Button type="submit" color="primary">Agregar</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </div>
                <div>
                <Button variant="fab" color="primary" aria-label="Add" className={classes.fab} onClick={this.onClickAddHandler}>
                    <AddIcon />
                </Button>
                </div>
            </div>
        );
    }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);