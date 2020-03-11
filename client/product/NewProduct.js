import React, { useState } from "react"
import { Link, Redirect } from "react-router-dom"

import { 
  Card, 
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import FileUpload from "@material-ui/icons/AddPhotoAlternate"

import auth from "./../auth/auth-helper"
import { create } from "./api-product.js"

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  }
}))

const NewProduct = ({ match }) => {

  const classes = useStyles()
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    quantity: "",
    price: "",
    redirect: false,
    error: ""
  })
  const jwt = auth.isAuthenticated()

  const handleChange = name => event => {
    const value = name === "image" ? 
    event.target.files[0] : 
    event.target.value
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = () => {
    let productData = new FormData()
    values.name && productData.append("name", values.name)
    values.description && productData.append("description", values.description)
    values.image && productData.append("image", values.image)
    values.category && productData.append("category", values.category)
    values.quantity && productData.append("quantity", values.quantity)
    values.price && productData.append("price", values.price)

    create({
      shopId: match.params.shopId
    }, {
      t: jwt.token
    }, productData).then( data => {

      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: "", redirect: true })
      }

    })
  }

  if (values.redirect) {
    return (
      <Redirect to={"/seller/shop/edit/" + match.params.shopId} />
    )
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2">
            New Product
          </Typography>
          <br />

          <input 
            accept="image/*" 
            onChange={handleChange("image")} 
            id="icon-button-file" 
            type="file" 
          />

          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Photo
              <FileUpload />
            </Button>
          </label> 

          <span>
            {values.image ? values.image.name : ""}
          </span>
          <br />

          <TextField 
            id="name" 
            label="Name" 
            value={values.name} 
            onChange={handleChange("name")} 
            margin="normal" 
          />
          <br />

          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange("description")}
            margin="normal"
          />
          <br />

          <TextField 
            id="category" 
            label="Category" 
            value={values.category} 
            onChange={handleChange("category")} 
            margin="normal" 
          />
          <br />

          <TextField 
            id="quantity" 
            label="Quantity" 
            value={values.quantity} 
            onChange={handleChange("quantity")} 
            type="number" 
            margin="normal" 
          />
          <br />

          <TextField 
            id="price" 
            label="Price" 
            value={values.price} 
            onChange={handleChange("price")} 
            type="number" 
            margin="normal" 
          />
          <br />

          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error">error</Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>

        <CardActions>
          <Button 
            color="primary" 
            variant="contained" 
            onClick={handleSubmit} 
          >
            Submit
          </Button>

          <Link to={"/seller/shop/edit/" + match.params.shopId}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}

export default NewProduct