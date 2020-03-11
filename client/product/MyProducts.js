import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { makeStyles } from "@material-ui/core/styles"
import { 
  Button,
  Card,
  CardMedia,
  IconButton,
  Icon,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography,
  Divider
} from "@material-ui/core"
import Edit from "@material-ui/icons/Edit"

import { listByShop } from "./../product/api-product.js"
import DeleteProduct from "./../product/DeleteProduct"

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: "1.2em"
  }
}))

const MyProducts = (props) => {

  const classes = useStyles()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: props.shopId
    }, signal).then((data) => {

      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }

    })
    return () => {
      abortController.abort()
    }
  }, [])

  const removeProduct = product => {
    const updatedProducts = [...products]
    const index = updatedProducts.indexOf(product)
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  return (
    <Card>
      <Typography type="title" className={classes.title}>
        Products

        <span>
          <Link to={"/seller/" + props.shopId + "/products/new"}>
            <Button color="primary" variant="contained">
              <Icon>add_box</Icon>
              New Product
            </Button>
          </Link>
        </span>
      </Typography>

      <List dense>
        {products.map((product, i) => {
          return ( 
            <span key={i}>
              <ListItem>
                <CardMedia
                  image={"/api/product/image/" + product._id + "?" + new Date().getTime()}
                  title={product.name}
                />

                <div>
                  <Typography type="headline" component="h2" color="primary">
                    {product.name}
                  </Typography>

                  <Typography type="subheading" component="h4">
                    Quantity: {product.quantity} | Price: ${product.price}
                  </Typography>
                </div>

                <ListItemSecondaryAction>
                  <Link to={"/seller/" + product.shop._id + "/" + product._id + "/edit"}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit />
                    </IconButton>
                  </Link>

                  <DeleteProduct
                    product={product}
                    shopId={props.shopId}
                    onRemove={removeProduct} 
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </span>
          )}
        )}
      </List>
    </Card>
  )
}

export default MyProducts

