import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { makeStyles } from "@material-ui/core/styles"
import { 
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider
} from "@material-ui/core"

import { list } from "./api-shop.js"


const useStyles = makeStyles(theme => ({
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
    textAlign: "center",
    fontSize: "1.2em"
  }
}))

const Shops = () => {

  const classes = useStyles()
  const [shops, setShops] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then( data => {

      if (data.error) {
        console.log(data.error)
      } else {
        setShops(data)
      }

    })

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <div>
      <Paper elevation={4}>
        <Typography type="title" className={classes.title}>
          All Shops
        </Typography>

        <List dense>
          {shops.map((shop, i) => {
            return (
              <Link to={"/shops/" + shop._id} key={i}>
              <Divider />

              <ListItem button>
                <ListItemAvatar>
                  <Avatar src={'/api/shops/logo/' + shop._id + "?" + new Date().getTime()} />
                </ListItemAvatar>

                <div className={classes.details}>
                  <Typography type="headline" component="h2" color="primary">
                    {shop.name}
                  </Typography>

                  <Typography type="subheading" component="h4">
                    {shop.description}
                  </Typography>
                </div>
              </ListItem>
              <Divider />
            </Link>
            )})}
        </List>
      </Paper>
    </div>
  )
}

export default Shops