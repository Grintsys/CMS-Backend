import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import green from '@material-ui/core/colors/green';

import Address from './Address'
import Information from './Information';
import Phones from './Phones';


function TabContainer(props) {
    const { children, dir } = props;
  
    return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
    );
  }

  TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
  };

  const styles = theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 700,
      position: 'relative',
      minHeight: 400,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    },
    fabGreen: {
      color: theme.palette.common.white,
      backgroundColor: green[500],
    },
  });
  
  class FloatingActionButtonZoom extends React.Component {
    state = {
      value: 0,
    };
  
    handleChange = (event, value) => {
      this.setState({ value });
    };
  
    handleChangeIndex = index => {
      this.setState({ value: index });
    };
  
    render() {
      const { classes, theme, state, onClickEditSubmitHandler, handleChange } = this.props;
      const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
      };
  
      const fabs = [
        {
          color: 'secondary',
          className: classes.fab,
          icon: <EditIcon />,
        },
        {
            color: 'primary',
            className: classes.fab,
            icon: <AddIcon />,
          },
        {
          color: 'inherit',
          className: classNames(classes.fab, classes.fabGreen),
          icon: <UpIcon />,
        },
      ];


  
      return (
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              fullWidth
            >
              <Tab label="Informacion" />
              <Tab label="Direcciones" />
              <Tab label="Telefonos" />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <Information state={state} onClickEditSubmitHandler={onClickEditSubmitHandler} handleChange={handleChange} />
            <Address state={state} classes={classes} />
            <Phones state={state} classes={classes} />
          </SwipeableViews>
            {fabs.map((fab, index) => (
                <Zoom
                    key={fab.color}
                    in={this.state.value === index}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${this.state.value === index ? transitionDuration.exit : 0}ms`,
                    }}
                    unmountOnExit
                >
                <Button variant="fab" className={fab.className} color={fab.color}>
                    {fab.icon}
                </Button>
                </Zoom>
            ))}
        </div>
      );
    }
  }
  
  FloatingActionButtonZoom.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles, { withTheme: true })(FloatingActionButtonZoom);