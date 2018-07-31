import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class CategoryEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
        };
        console.log("form", props);
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSave = () => {
        console.log("saving file");
    }

    render() {
        return (
        <div>
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Editar</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nombre"
                type="text"
                fullWidth
                />
                <TextField
                autoFocus
                margin="dense"
                id="file"
                label="File"
                type="file"
                fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                Cancelar
                </Button>
                <Button onClick={this.handleClose} color="primary">
                Guardar
                </Button>
            </DialogActions>
            </Dialog>
        </div>
        );
    }
}