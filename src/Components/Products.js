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
import { Config } from './Config'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import axios from 'axios';

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
});

class ProductList extends React.Component {

  constructor(){
    super();
    this.state = {
      add: false,
      edit: false,
      remove: false,
      products: [],
      product: {
        ProductId: -1,
        Name: '',
        Description: '',
        PartNumber: '',
        Qty: 0,
        Price: 0,
        SubCategory: 1,
        BrandId: 1, 
        File: []
      },
      product_default: {
        ProductId: -1,
        Name: '',
        Description: '',
        PartNumber: '',
        Qty: 0,
        Price: 0,
        SubCategory: 1,
        BrandId: 1, 
        File: []
      },
    };
  }

  onClickAddHandler = () => {
    this.setState({
      add: true,
    })
  }

  onClickEditHandler = (product) => {
    this.setState({
      edit: true,
      product: product
    })
  }

  onClickRemoveHandler = (product) => {
    let p = this.state.product;
    p.ProductId = product.ProductId;

    this.setState({
      remove: true,
      product: p,
    })
  }

  onClickCloseHandle = () => {
    this.setState({
      add: false,
      edit: false,
      remove: false
    })
  }

  onProductIdChangeHandle = (event) => {
      let p = this.state.product;
      p.ProductId = event.target.value;
      this.setState({
        product: p,
      })
  }

  onProductNameChangeHandle = (event) => {
    let p = this.state.product;
    p.Name = event.target.value;
    this.setState({
      product: p,
    })
  }

  onProductDescriptionChangeHandle = (event) => {
    let p = this.state.product;
    p.Description = event.target.value;
    this.setState({
      product: p,
    })
  }

  onProductPartNumberChangeHandle = (event) => {
    let p = this.state.product;
    p.PartNumber = event.target.value;
    this.setState({
      product: p,
    })
  }

  onProductQuantityChangeHandle = (event) => {
    let p = this.state.product;
    p.Qty = event.target.value;
    this.setState({
      product: p,
    })
  }

  onProductPriceChangeHandle = (event) => {
    let p = this.state.product;
    p.Price = event.target.value;
    this.setState({
      product: p,
    })
  }

  onProductFileChangeHandle = (event) => {
    let p = this.state.product;
    p.File = event.target.files[0];
    this.setState({
      product: p,
    })
  }

  onClickAddSubmitHandler = (event) => {

    event.preventDefault();

    var data = new FormData();
    let p = this.state.product;
    console.log(p);

    data.append('Name', p.Name);
    data.append('Description', p.Description);
    data.append('PartNumber', p.PartNumber);
    data.append('SubCategoryId', p.SubCategoryId);
    data.append('BrandId', p.BrandId);
    data.append('Price', p.Price);
    data.append('Qty', p.Qty);
    data.append('file', p.File);
    
    axios({
        method: 'POST',
        url: Config.API + 'product/add',
        data: data,
        config: { 
            headers: {'Content-Type': 'multipart/form-data' }
          },
      })
   .then(function (response) {
        //TODO add dom object to grid list
        console.log(response);
   })
   .catch(function (error) {
        console.log(error);
   });

   this.setState({ add: false, product: this.state.product_default });
  }

  onClickEditSubmitHandler = (event) => {
    event.preventDefault();

    var data = new FormData();
    let p = this.state.product;

    data.append('ProductId', p.ProductId)
    data.append('Name', p.Name);
    data.append('Description', p.Description);
    data.append('PartNumber', p.PartNumber);
    data.append('SubCategoryId', p.SubCategoryId);
    data.append('BrandId', p.BrandId);
    data.append('Price', p.Price);
    data.append('Qty', p.Qty);
    data.append('file', p.File);
    
    axios({
        method: 'POST',
        url: Config.API + 'product/edit',
        data: data,
        config: { 
            headers: {'Content-Type': 'multipart/form-data' }
          },
      })
   .then(function (response) {
        //TODO add dom object to grid list
        console.log(response);
   })
   .catch(function (error) {
        console.log(error);
   });
  }

  onClickRemoveSubmitHandler = (event) => {
    event.preventDefault();

    var p = this.state.product;
    var url = `${Config.API}product/remove/${p.ProductId}`;
    console.log(url);
    axios.get(url)
    .then(function (response) {
      //TODO remove dom object to grid list
      console.log(response);
    })
    .catch(function (error) {
       console.log(error);
    });

    this.setState({
      remove: false
    })
  }

  componentDidMount()
  {
    const { classes } = this.props;
    fetch(Config.API+'product/all')
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
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="secondary" onClick={() => this.onClickRemoveHandler(product)} >
                        <DeleteIcon />
                      </Button>
                      <Button size="small" color="primary" onClick={() => this.onClickEditHandler(product)} >
                        <EditIcon />
                      </Button>
                    </CardActions>
                </Card>
              )
        })
            this.setState({ products: products })
        })
  }

  render(){
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
                        <TextField autoFocus margin="dense" id="name" name="name" label="Nombre" type="text" value={this.state.product.Name} onChange={this.onProductNameChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" id="descripcion" name="description" label="Descripcion de producto" required value={this.state.product.Description} onChange={this.onProductDescriptionChangeHandle} multiline fullWidth />     
                        <TextField autoFocus margin="dense" id="partnumber" name="partnumber" label="No Parte" type="text" value={this.state.product.PartNumber} onChange={this.onProductPartNumberChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" id="qty" name="qty" label="Cantidad" type="number"  value={this.state.product.Qty} onChange={this.onProductQuantityChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" id="price" name="price" label="Precio" type="number" value={this.state.product.Price} onChange={this.onProductPriceChangeHandle} fullWidth />     
                        <TextField autoFocus margin="dense" id="file" name="file" label="Imagen" type="file" onChange={this.onProductFileChangeHandle} fullWidth />
                      </DialogContent>
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
                        <TextField autoFocus margin="dense" id="name" name="name" label="Nombre" type="text" value={this.state.product.Name} onChange={this.onProductNameChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" id="descripcion" name="description" margin="normal" label="Descripcion de producto" required value={this.state.product.Description} onChange={this.onProductDescriptionChangeHandle} multiline fullWidth />     
                        <TextField autoFocus margin="dense" id="partnumber" name="partnumber" label="No Parte" type="text" value={this.state.product.PartNumber} onChange={this.onProductPartNumberChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" id="qty" name="qty" label="Cantidad" type="number"  value={this.state.product.Qty} onChange={this.onProductQuantityChangeHandle} fullWidth />
                        <TextField autoFocus margin="dense" id="price" name="price" label="Precio" type="number" value={this.state.product.Price} onChange={this.onProductPriceChangeHandle} fullWidth />     
                        <TextField autoFocus margin="dense" id="file" name="file" label="Imagen" type="file" onChange={this.onProductFileChangeHandle} fullWidth />
                      </DialogContent>
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
                        Esta seguro que desea eliminar el producto con ID: {this.state.product.ProductId}
                      </DialogContentText>
                        <TextField id="id" name="id" type="hidden" value={this.state.product.ProductId} />                
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.onClickCloseHandle} color="primary">Cancelar</Button>
                        <Button type="submit" color="primary">Guardar</Button>
                      </DialogActions>
                    </form>
              </Dialog>
            </div>
        </div>
      );
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductList);