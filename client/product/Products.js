import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { 
  Card,
  CardHeader,
  CardMedia,
  Typography,
  Icon,
  Grid
} from "@material-ui/core/Card"
import { makeStyles } from "@material-ui/core/styles"

import { read, listRelated } from "./api-product.js"
import Suggestions from "./../product/Suggestions"
import AddToCart from "./../cart/AddToCart"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30
  }
}))

const Product = ({ match }) => {

  const classes = useStyles()
  const [product, setProduct] = useState({ shop: {} })
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState("")
  const imageUrl = product._id ?
  `/api/product/image/${product._id}?${new Date().getTime()}` :
  "/api/product/defaultphoto"

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read(
      { productId: match.params.productId }, 
      signal
    )
      .then( data => {

        if (data.error) {
          setError(data.error)
        } else {
          setProduct(data)
        }

      })
    return () => {
      abortController.abort()
    }
  }, [match.params.productId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listRelated({
      productId: match.params.productId
    }, signal).then(data => {

      if (data.error) {
        setError(data.error)
      } else {
        setSuggestions(data)
      }

    })
    return () => {
      abortController.abort()
    }
  }, [match.params.productId])

  return (
    <div className={classes.root}>
      <Grid container spacing={10}>
        <Grid item xs={7} sm={7}>
          <Card>
            <CardHeader
              title={product.name}
              subheader={product.quantity > 0 ? "In Stock" : "Out of Stock"}
              action={
                <span>
                  <AddToCart item={product} />
                </span>
              }
            />

            <div>
              <CardMedia
                image={imageUrl}
                title={product.name}
              />

              <Typography component="p" variant="subtitle1">
                {product.description}
                <br />

                <span>$ {product.price}</span>
                <Link to={"/shops/" + product.shop._id}>
                  <span>
                    <Icon>shopping_basket</Icon> 
                    {product.shop.name}
                  </span>
                </Link>
              </Typography>
            </div>
          </Card>
        </Grid>

        {suggestions.length > 0 && (
          <Grid item xs={5} sm={5}>
            <Suggestions products={suggestions} title="Related Products" />
          </Grid>
        )}
      </Grid>
    </div>
  )
}