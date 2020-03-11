import React from "react"
import { Link } from "react-router-dom"

import { makeStyles } from "@material-ui/core/styles"
import { 
  Paper,
  Typography,
  IconButton,
  Icon,
  Divider,
  Card,
  CardContent,
  CardMedia
} from "@material-ui/core"
import ViewIcon from "@material-ui/icons/Visibility"

import AddToCart from "./../cart/AddToCart"

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    paddingBottom: 24,
    backgroundColor: "#80808024"
  }),
}))

const Suggestions = (props) => {

  const classes = useStyles()

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title">
          {props.title}
        </Typography>

        {props.products.map((item, i) => {
          return (
            <span key={i}>
              <Card>
                <CardMedia
                  image={"/api/product/image/" + item._id}
                  title={item.name}
                />

                <div>
                  <CardContent>
                    <Link to={"/product/" + item._id}>
                      <Typography variant="h3" component="h3" color="primary">
                        {item.name}
                      </Typography>
                    </Link>

                    <Link to={"/shops/" + item.shop._id}>
                      <Typography type="subheading">
                        <Icon>shopping_basket</Icon> 
                        {item.shop.name}
                      </Typography>
                    </Link>

                    <Typography component="p">
                      Added on {(new Date(item.created)).toDateString()}
                    </Typography>
                  </CardContent>

                  <div>
                    <Typography type="subheading" component="h3" color="primary">
                      $ {item.price}
                    </Typography>

                    <span>
                      <Link to={"/product/" + item._id}>
                        <IconButton color="secondary" dense="dense">
                          <ViewIcon />
                        </IconButton>
                      </Link>

                      <AddToCart item={item} />
                    </span>
                  </div>
                </div>
              </Card>

              <Divider />
            </span>
          )})
        }
      </Paper>
    </div>
  )
}

export default Suggestions