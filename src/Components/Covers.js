import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Config } from './Config'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import red from '@material-ui/core/colors/red';
import { MySnackbarContentWrapper } from './SnackBarCustom'
import Snackbar from '@material-ui/core/Snackbar'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    bottom: theme.spacing.unit * 1,
    right: theme.spacing.unit * 1,
    top: theme.spacing.unit * 1,
    left: theme.spacing.unit * 1,
    //backgroundColor: theme.palette.background.paper,
  },
  card: {
    //Width: 180,
    //minHeight: 300,
    minWidth: 180,
    maxWidth: 340,
    margin: theme.spacing.unit * 1,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  fab: {
    position: 'absolute',
    //overflow: true,
    //bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 4,
    top: theme.spacing.unit * 10,
    //padding: '0 0px',
  },
  button: {
    margin: theme.spacing.unit,
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class Covers extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      covers: [],
      FrontCoverPageId: -1,
      HeaderText: '',
      SubHeaderText: '',
      Position: 0,
      File: [],
      openMessage: false,
      success: false,
      message: '',
      add: false,
      edit: false,
      remove: false,
    };
  }

  handleChange = prop => event => {
    debugger;
    this.setState({ [prop]: event.target.value });
  };

  onCoverIdChangeHandle = (event) => {
    this.setState({
        FrontCoverPageId: event.target.value,
    })
  }

  onCoverHeaderChangeHandle = (event) => {
    this.setState({
        HeaderText: event.target.value,
    })
  }

  onCoverSubheaderChangeHandle = (event) => {
    this.setState({
        SubHeaderText: event.target.value,
    })
  }

  onCoverPositionChangeHandle = (event) => {
    this.setState({
        Position: event.target.value,
    })
  }

  onClickAddHandler = () => {
    this.setState({
      add: true,
    })
  }

  onClickEditHandler = (cover) => {
    this.setState({
      edit: true,
      FrontCoverPageId: cover.FrontCoverPageId,
      HeaderText: cover.HeaderText,
      SubHeaderText: cover.SubHeaderText,
      Position: cover.Position,
    })
  }

  onClickRemoveHandler = (id) => {
    this.setState({
      remove: true,
      FrontCoverPageId: id
    })
  }

  onClickCloseHandle = () => {
    this.setState({
      add: false,
      edit: false,
      remove: false,
      openMessage: false,
      FrontCoverPageId: -1,
      HeaderText: '',
      SubHeaderText: '',
      Position: 0,
    })
  }

  onFileChangeHandle = (event) => {
      this.setState({
        File: event.target.files[0],
      })
  }

  onClickAddSubmitHandler = (event) => {
        event.preventDefault();
        var params = new FormData();
        params.append('HeaderText', this.state.HeaderText);
        params.append('SubHeaderText', this.state.SubHeaderText);
        params.append('Position', this.state.Position);
        params.append('file', this.state.File);

        axios({
            method: 'POST',
            url: Config.API + 'coverpage/add',
            data: params
        })
        .then(res => {

            this.setState({
                success: res.data.success,
                message: res.data.message,  
                openMessage: true  ,
                add: false
            });
       })
       .catch(error => {
            console.log(error);
       });

       this.getCoverList();
  }

  onClickEditSubmitHandler = (event) => {
        event.preventDefault();
        var params = new FormData();
        params.append('FrontCoverPageId', this.state.FrontCoverPageId)
        params.append('HeaderText', this.state.HeaderText);
        params.append('SubHeaderText', this.state.SubHeaderText);
        params.append('Position', this.state.Position);
        params.append('file', this.state.File);

        axios({
            method: 'POST',
            url: Config.API + 'coverpage/edit',
            data: params
        })
        .then(res => {

            this.setState({
                success: res.data.success,
                message: res.data.message,  
                openMessage: true,
                edit: false
            });
       })
       .catch(error => {
            console.log(error);
       });

       this.getCoverList();
  }

  onClickRemoveSubmitHandler = (event) => {
    event.preventDefault();

    var url = `${Config.API}coverpage/remove/${this.state.FrontCoverPageId}`;
    console.log(url);
    axios.get(url)
    .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,  
          openMessage: true,
          remove: false
        })
    })
    .catch(function (error) {
       console.log(error);
    });

    this.getCoverList();
  }

  componentDidMount()
  {
    this.getCoverList();
  }

  getCoverList(){
    const { classes } = this.props;
    fetch(Config.API+'coverpage/all')
    .then(result => {
        return result.json();
    })
    .then(data => {
        let covers = data.data.map((cover) => {
          let key = cover.FrontCoverPageId;
            return (
              <Card key={key} className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={Config.API+cover.ImageUrl}
                  title={cover.HeaderText}
                />
                <CardContent>
                  <Typography gutterBottom variant="headline" component="h2">
                    {cover.HeaderText}
                  </Typography>
                  <Typography component="p">
                    {cover.SubHeaderText}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="secondary" onClick={() => this.onClickRemoveHandler(cover)} >
                    <DeleteIcon />
                  </Button>
                  <Button size="small" color="primary" onClick={() => this.onClickEditHandler(cover)} >
                    <EditIcon />
                  </Button>
                </CardActions>
            </Card>
              )
        })
            this.setState({ covers: covers })
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      {this.state.covers}
      <div>
          <Button variant="fab" color="primary" aria-label="Add" className={classes.fab} onClick={this.onClickAddHandler}>
              <AddIcon />
          </Button>
      </div>
        <div>
            <Dialog
                open={this.state.add}
                onClose={this.onClickCloseHandle}
                aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Agregar Cover</DialogTitle>
                    <form id="add" onSubmit={this.onClickAddSubmitHandler}>
                      <DialogContent> 
                        <TextField autoFocus margin="dense" name="HeaderText" label="Encabezado" type="text" required value={this.state.HeaderText} onChange={this.onCoverHeaderChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" name="SubHeaderText" label="SubEncabezado" required value={this.state.SubHeaderText} onChange={this.onCoverSubheaderChangeHandle} multiline fullWidth />     
                        <TextField autoFocus margin="dense" name="Position" label="Posicion" type="number" required value={this.state.Position} onChange={this.onCoverPositionChangeHandle} fullWidth />     
                        <TextField autoFocus id="File" name="File" label="Imagen" type="file" onChange={this.onFileChangeHandle} fullWidth />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.onClickCloseHandle} color="primary">Cancelar</Button>
                        <Button type="submit" color="primary">Guardar</Button>
                      </DialogActions>
                    </form>
            </Dialog>
            <Dialog
                open={this.state.edit}
                onClose={this.onClickCloseHandle}
                aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Editar Cover</DialogTitle>
                    <form id="edit" onSubmit={this.onClickEditSubmitHandler}>
                      <DialogContent> 
                        <TextField name="FrontCoverPageId" type="hidden" value={this.state.FrontCoverPageId} />                      
                        <TextField autoFocus name="HeaderText" label="Encabezado" type="text" required value={this.state.HeaderText} onChange={this.onCoverHeaderChangeHandle} fullWidth />
                        <TextField autoFocus name="SubHeaderText" margin="normal" label="SubEncabezado" required value={this.state.SubHeaderText} onChange={this.onCoverSubheaderChangeHandle}  multiline fullWidth />     
                        <TextField autoFocus name="Position" label="Posicion" type="number" required value={this.state.Position} onChange={this.onCoverPositionChangeHandle} fullWidth />     
                        <TextField autoFocus id="File" name="File" label="Imagen" type="file" onChange={this.onFileChangeHandle} fullWidth />
                      </DialogContent>
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
                        Esta seguro que desea eliminar el cover con ID: {this.state.FrontCoverPageId}
                      </DialogContentText>
                        <TextField id="id" name="id" type="hidden" value={this.state.FrontCoverPageId} />                
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.onClickCloseHandle} color="primary">No</Button>
                        <Button type="submit" color="primary">Si</Button>
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
              variant="error"
              message={this.state.message}
          />
          </Snackbar>
        </div>      
      </div>
    );
  }
}

Covers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Covers);