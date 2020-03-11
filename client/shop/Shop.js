import React, { useState, useEffect } from "react"

import { makeStyles } from "@material-ui/core/styles"
import { 
  Card, 
  Typography,
  Avatar,
  Grid
}
from "@material-ui/core"

import { read } from "./api-shop.js"
import Products from "./../product/Products"
import { listByShop } from "./../product/api-product.js"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  }
}))

const Shop = ({ match }) => {

  const classes = useStyles()
  const [shop, setShop] = useState("")
  const [products, setProducts] = useState([])
  const [error, setError] = useState("")
  const logoUrl = shop._id  ? 
  `/api/shops/logo/${shop._id}?${new Date().getTime()}` : 
  "/api/shops/defaultphoto"

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: match.params.shopId
    }, signal).then( data => {

      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }

    })

    read({
      shopId: match.params.shopId
    }, signal).then( data => {

      if (data.error) {
        setError(data.error)
      } else {
        setShop(data)
      }

    })

    return () => {
      abortController.abort()
    }

  }, [match.params.shopId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: match.params.shopId
    }, signal).then( data => {

      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }

    })

    return () => {
      abortController.abort()
    }

  }, [match.params.shopId])

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={4} sm={4}>
          <Card>
            <CardContent>
              <Typography type="headline" component="h2">
                {shop.name}
              </Typography>
              <br />

              <Avatar src={logoUrl} />
              <br />

              <Typography type="subheading" component="h2">
                {shop.description}
              </Typography>
              <br />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={8} sm={8}>
          <Card>
            <Typography type="title" component="h2">
              Products
            </Typography>

            <Products products={products} searched={false} />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Shop