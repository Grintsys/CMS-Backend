import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CategoryList from '@material-ui/icons/FormatListBulleted'
import CoverList from '@material-ui/icons/ImageAspectRatio'
import FavIcon from '@material-ui/icons/Favorite'
import ProductList from '@material-ui/icons/FileUpload'
import StarIcon from '@material-ui/icons/Star';
import Categories from './CategoryList'
import Products from './Products'
import ProductAtributes from './Atributes'
import Covers from './Covers'
import Brands from './Brands'
import { Redirect } from 'react-router-dom';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    height: '100%'
  },
  flex: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    //color: theme.palette.text.secondary,
    padding: theme.spacing.unit * 1,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

class ClippedDrawer extends Component {

  constructor(){
    super();
    this.state = {
      loggedIn: sessionStorage.getItem('loggedin') === 'true',
      content: <Products />,
    }
  }


  handleCategoryClick = () => { 
    this.setState(() => ({
      content: <Categories />,
    }))
  }

  handleProductsClick = () => {
    this.setState(() => ({
      content: <Products />
    }))
  }

  handleCoversClick = () => {
    this.setState({
      content: <Covers />
    })
  }

  handleBrandsClick = () => {
    this.setState({
      content: <Brands />
    })
  }

  handleProductAttributesClick = () => {
    this.setState({
      content: <ProductAtributes />
    })
  }

  handleLogOutClick = () =>{
    console.log("logout");
    sessionStorage.setItem('loggedin', false);
    this.setState({
      loggedIn: false
    });
  }

  render() {
    const { classes } = this.props;

    if(this.state.loggedIn === false){
      return <Redirect to='/login'/>;
    }

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Inplas
            </Typography>
            <Button color="inherit" onClick={this.handleLogOutClick}>LogOut</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem button onClick={this.handleCategoryClick}>
              <ListItemIcon>
                <CategoryList />
              </ListItemIcon>
              <ListItemText primary="Categorias" />
            </ListItem>
            <ListItem button onClick={this.handleBrandsClick}>
              <ListItemIcon>
                <FavIcon />
              </ListItemIcon>
              <ListItemText primary="Marcas" />
            </ListItem>
            <ListItem button onClick={this.handleProductsClick}>
              <ListItemIcon>
                <ProductList />
              </ListItemIcon>
              <ListItemText primary="Productos" />
            </ListItem>
            <ListItem button onClick={this.handleProductAttributesClick}>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Atributos" />
            </ListItem>
            <ListItem button onClick={this.handleCoversClick}>
              <ListItemIcon>
                <CoverList />
              </ListItemIcon>
              <ListItemText primary="Portada" />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
            { this.state.content }
        </main>
      </div>
    )
  }
}

ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);