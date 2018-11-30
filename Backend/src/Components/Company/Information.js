import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


function Information(props){

    const { classes, state, handleChange, onClickEditSubmitHandler} = props;

    return (
            <Paper elevation={1}>
                <Typography component="p">
                <form onSubmit={onClickEditSubmitHandler}>
                    <DialogContent>     
                        <TextField id="id" name="id" type="hidden" value={state.id} />                                   
                        <TextField margin="dense" id="name" name="name" value={state.name} onChange={handleChange('name')} label="Nombre" type="text" fullWidth />
                        <TextField margin="dense" id="email" name="email" value={state.email} onChange={handleChange('email')} label="Email" type="text" fullWidth />
                        <TextField margin="dense" id="rtn" name="rtn" value={state.rtn} onChange={handleChange('rtn')} label="RTN" type="text" fullWidth />  
                    </DialogContent>
                        {state.loading && <LinearProgress />}
                    <Divider />
                    <DialogActions>
                        <Button type="submit" color="primary">Salvar</Button>
                    </DialogActions>
                </form>
                </Typography>
            </Paper>
    )
}

export default Information;