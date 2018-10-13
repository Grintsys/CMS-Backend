import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ListIcon from '@material-ui/icons/List';
import { Config } from './Config'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { MySnackbarContentWrapper } from './SnackBarCustom'
import Snackbar from '@material-ui/core/Snackbar'
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    //width: 200,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class ProductList extends React.Component {

  constructor(){
    super();
    this.state = {
      add: false,
      edit: false,
      remove: false,
      succes: false,
      loading: false,
      message: '',
      openMessage: false,
      showProgress: false,
      ProductId: -1,
      Name: '',
      Description: '',
      PartNumber: '',
      Qty: 0,
      Price: 0,
      SubCategoryId: 1,
      BrandId: 1, 
      File: [],
      products: [],
      brands: [],
      product_default: {
        ProductId: -1,
        Name: '',
        Description: '',
        PartNumber: '',
        Qty: 0,
        Price: 0,
        SubCategoryId: 1,
        BrandId: 1, 
        File: []
      },
    };
  }

  setProduct = (product) => {
    this.setState({
        ProductId: product.ProductId,
        Name: product.Name,
        Description: product.Description,
        PartNumber: product.PartNumber,
        Qty: product.Qty,
        Price: product.Price,
        SubCategoryId: product.SubCategoryId,
        BrandId: product.BrandId
    })
  }

  onClickAddHandler = () => {

    this.setProduct(this.state.product_default);

    this.setState({
      add: true,
      openMessage: false,
    })
  }

  onClickEditHandler = (product) => {

    this.setProduct(product);

    this.setState({
      edit: true,
      openMessage: false,
    })
  }

  onClickRemoveHandler = (product) => {

    this.setProduct(product);

    this.setState({
      remove: true,
      openMessage: false,
    })
  }

  onClickAttributeHandler = (product) => {

    this.setState({
      remove: true,
    })
  }

  onClickCloseHandle = () => {
    this.setState({
      add: false,
      edit: false,
      remove: false,
      openMessage: false
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  onClickAddSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    var data = new FormData();

    data.append('Name', this.state.Name);
    data.append('Description', this.state.Description);
    data.append('PartNumber', this.state.PartNumber);
    data.append('SubCategoryId', this.state.SubCategoryId);
    data.append('BrandId', this.state.BrandId);
    data.append('Price', this.state.Price);
    data.append('Qty', this.state.Qty);
    data.append('file', this.state.File);
    
    axios({
        method: 'POST',
        url: Config.API + 'product/add',
        data: data,
        config: { 
            headers: {'Content-Type': 'multipart/form-data' }
          },
      })
   .then( res => {
        //TODO add dom object to grid list
        this.setState({
          success: res.data.success,
          message: res.data.message,  
          add: false,
          openMessage: true,
          loading: false,
          product: this.state.product_default,
      });
   })
   .catch(function (error) {
        console.log(error);
   });

   this.getProductList();
  }

  onClickEditSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    //debugger;
    var data = new FormData();

    data.append('ProductId', this.state.ProductId)
    data.append('Name', this.state.Name);
    data.append('Description', this.state.Description);
    data.append('PartNumber', this.state.PartNumber);
    data.append('SubCategoryId', this.state.SubCategoryId);
    data.append('BrandId', this.state.BrandId);
    data.append('Price', this.state.Price);
    data.append('Qty', this.state.Qty);
    data.append('file', this.state.File);
    
    axios({
        method: 'POST',
        url: Config.API + 'product/edit',
        data: data,
        config: { 
            headers: {'Content-Type': 'multipart/form-data' }
          },
      })
   .then(res => {
      console.log(res);
      this.setState({
          success: res.data.success,
          message: res.data.message,  
          openMessage: true,
          edit: false,
          loading: false
      });
    })
    .catch(function (error) {
        console.log(error);
    });

    this.getProductList();
  }

  onClickRemoveSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    var url = `${Config.API}product/remove/${this.state.ProductId}`;

    axios.get(url)
    .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,  
          remove: false,
          openMessage: true,
          loading: false,
      });
    })
    .catch(function (error) {
       console.log(error);
    });

    this.getProductList();
  }

  getBrandList = () => {
    fetch(Config.API+'brand/all')
    .then(result => {
        return result.json();
    })
    .then(data => {
      this.setState({
        brands : data.data
      });
    })
  }

  getProductAttributesList = () => {
    fetch(Config.API+'brand/all')
    .then(result => {
        return result.json();
    })
    .then(data => {
      this.setState({
        brands : data.data
      });
    })
  }

  getProductList = () => {
    const { classes } = this.props;
    fetch(Config.API+'product/all?limit=1000')
    .then(result => {
        return result.json();
    })
    .then(data => {
        let products = data.data.map((product) => {
            var p = product.ProductId;
            return (
                <Card key={p} className={classes.card}>
                    <CardMedia
                      className={classes.media}
                      image={Config.API+product.ImageUrl}
                      title={product.Name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="headline" component="h2">
                        {product.Name}
                      </Typography>
                      <Typography component="p">
                        {product.PartNumber}: {product.Description}
                      </Typography>
                      <Typography component="p">
                        {"Marca: "+product.Brand}
                      </Typography>
                    </CardContent>
                  <CardActions>
                      <Button size="small" color="secondary" onClick={() => this.onClickRemoveHandler(product)} >
                        <DeleteIcon />
                      </Button>
                      <Button size="small" color="primary" onClick={() => this.onClickEditHandler(product)} >
                        <EditIcon />
                      </Button>
                      <Link to={`/values/${p}`}>
                        <Button size="small" color="primary" onClick={() => this.onClickAttributeHandler(product)} >
                          <ListIcon />
                        </Button>
                      </Link>
                  </CardActions>
                </Card>
              )
        })
        
        this.setState({ products: products })
    })
  }

  componentDidMount(){
      this.getBrandList();
      this.getProductList();
  }

  render(){
      const { loading } = this.state;
      const { classes } = this.props;
      return (
        <div className={classes.root}>
            {this.state.products}
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
                  <DialogTitle id="form-dialog-title">Agregar Producto</DialogTitle>
                    <form onSubmit={this.onClickAddSubmitHandler}>
                      <DialogContent> 
                        <TextField autoFocus margin="dense" required name="Name" label="Nombre" type="text" value={this.state.Name} onChange={this.handleInputChange} className={classes.textField} fullWidth />
                        <TextField autoFocus margin="dense" required name="Description" label="Descripcion de producto" value={this.state.Description} onChange={this.handleInputChange} multiline className={classes.textField} fullWidth />     
                        <TextField autoFocus margin="dense" required name="PartNumber" label="No Parte" type="text" value={this.state.PartNumber} onChange={this.handleInputChange} className={classes.textField} fullWidth /> 
                        <TextField id="BrandId"
                                   select
                                   label="Select"
                                   margin="dense"
                                   fullWidth
                                   className={classes.textField}
                                   value={this.state.BrandId}
                                   onChange={this.handleChange('BrandId')}
                                   SelectProps={{
                                      MenuProps: {
                                        native: true,
                                        className: classes.menu,
                                      },
                                    }}
                                    helperText="Selecciona una marca"
                                    margin="normal"
                                  >
                                    {this.state.brands.map(option => (
                                      <MenuItem key={option.BrandId} value={option.BrandId}>
                                        {option.Name}
                                      </MenuItem>
                                    ))}
                          </TextField>   
         
                        <TextField autoFocus margin="dense" required name="File" label="Imagen" type="file" onChange={this.handleInputChange} className={classes.textField} fullWidth />
                      </DialogContent>
                      {loading && <LinearProgress />}
                      <DialogActions>
                        <Button onClick={this.onClickCloseHandle} color="primary">Cancelar</Button>
                        <Button type="submit" color="primary">Guardar</Button>
                      </DialogActions>
                    </form>
              </Dialog>
              <Dialog
                open={this.state.edit}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Editar producto</DialogTitle>
                    <form onSubmit={this.onClickEditSubmitHandler}>
                      <DialogContent> 
                        <TextField autoFocus margin="dense" required name="Name" label="Nombre" type="text" value={this.state.Name} onChange={this.handleInputChange} className={classes.textField} fullWidth />
                        <TextField autoFocus margin="dense" required name="Description" margin="normal" label="Descripcion de producto" value={this.state.Description} onChange={this.handleInputChange} multiline className={classes.textField} fullWidth />     
                        <TextField autoFocus margin="dense" required name="Partnumber" label="No Parte" type="text" value={this.state.PartNumber} onChange={this.handleInputChange} className={classes.textField} fullWidth />
                        <TextField autoFocus margin="dense" required name="Qty" label="Cantidad" type="number"  value={this.state.Qty} onChange={this.handleInputChange} className={classes.textField} fullWidth />
                        <TextField autoFocus margin="dense" required name="Price" label="Precio" type="number" value={this.state.Price} onChange={this.handleInputChange} className={classes.textField} fullWidth />    
                        <TextField id="BrandId"
                                   select
                                   label="Select"
                                   margin="dense"
                                   fullWidth
                                   className={classes.textField}
                                   value={this.state.BrandId}
                                   onChange={this.handleChange('BrandId')}
                                   SelectProps={{
                                      MenuProps: {
                                        native: true,
                                        className: classes.menu,
                                      },
                                    }}
                                    helperText="Selecciona una marca"
                                    margin="normal"
                                  >
                                    {this.state.brands.map(option => (
                                      <MenuItem key={option.BrandId} value={option.BrandId}>
                                        {option.Name}
                                      </MenuItem>
                                    ))}
                          </TextField>    
                        <TextField autoFocus margin="dense" name="File" label="Imagen" type="file" onChange={this.handleInputChange} className={classes.textField} fullWidth />
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
                  variant={!this.state.success ? "error" : "success" }
                  message={this.state.message}
              />
              </Snackbar>
            </div>  
        </div>
      );
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductList);