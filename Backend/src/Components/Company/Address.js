import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

function Addresses(props)
{
    const { classes, state } = props;

    return(
        <Paper className={classes.root} elevation={1}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" className={classes.title}>
                Direcciones
                </Typography>
                <div className={classes.demo}>
                <List dense={true}>
                    {state.addresses.map(row => {
                        return(
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    {row.Address}
                                </ListItemText>
                                <ListItemSecondaryAction>
                                <IconButton aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
                                </ListItemSecondaryAction>
                                <Divider />
                            </ListItem>
                        );
                    })}
                </List>
                </div>
            </Grid>
        </Paper>
    ); 
}

export default Addresses;