import React, { useState, useEffect } from "react"
import { Redirect, Link } from "react-router-dom"

import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Icon,
  Button,
  Typography,
  Divider
} from "@material-ui/core/"

import auth from "./../auth/auth-helper"
import { listByOwner } from "./api-shop.js"
import Edit from "@material-ui/icons/Edit"
/*import DeleteShop from "./DeleteShop"*/

const useStyles = makeStyles(theme => ({
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em"
  }
}))

const MyShops = () => {

  const classes = useStyles()
  const [shops, setShops] = useState([])
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByOwner({
      userId: jwt.user._id
    }, { t: jwt.token }, signal).then( data => {

      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setShops(data)
      }

    })
    return () => {
      abortController.abort()
    }
  }, [])

  const removeShop = shop => {
    const updatedShops = [...shops]
    const index = updatedShops.indexOf(shop)
    updatedShops.splice(index, 1)
    setShops(updatedShops)
  }

  if (redirectToSignin) {
    return <Redirect to='/signin' />
  }

  return (
    <div>
      <Paper elevation={4}>
        <Typography type="title">
          Your Shops

          <span>
            <Link to="/seller/shop/new">
              <Button color="primary" variant="contained">
                <Icon>add_box</Icon>  New Shop
              </Button>
            </Link>
          </span>
        </Typography>

        <List dense>
          {shops.map((shop, i) => {
            return (
              <span key={i}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar src={"/api/shops/logo/" + shop._id + "?" + new Date().getTime()} />
                  </ListItemAvatar>

                  <ListItemText primary={shop.name} secondary={shop.description} />
                    {auth.isAuthenticated().user && auth.isAuthenticated().user._id == shop.owner._id &&  (
                      <ListItemSecondaryAction>
                        <Link to={"/seller/orders/" + shop.name + "/" + shop._id}>
                          <Button aria-label="Orders" color="primary">
                            View Orders
                          </Button>
                        </Link>

                        <Link to={"/seller/shop/edit/" + shop._id}>
                          <IconButton aria-label="Edit" color="primary">
                            <Edit />
                          </IconButton>
                        </Link>

                        {/*<DeleteShop shop={shop} onRemove={removeShop} />*/}
                        </ListItemSecondaryAction>
                      )
                    }
                  </ListItem>
                <Divider />
              </span>
            )}
          )}
        </List>
      </Paper>
    </div>
  )
}

export default MyShops