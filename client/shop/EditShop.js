import React, { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"

import { 
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
  Avatar,
  Grid
} from "@material-ui/core/Card"
import FileUpload from "@material-ui/icons/AddPhotoAlternate"
import { makeStyles } from '@material-ui/core/styles'

import auth from "./../auth/auth-helper"
import { read, update } from "./api-shop.js"
import MyProducts from "./../product/MyProducts"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  }
}))

const EditShop = ({ match }) => {

  const classes = useStyles()
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    redirect: false,
    error: "",
    id: ""
  })
  const jwt = auth.isAuthenticated()
  const logoUrl = values.id ? 
  `/api/shops/logo/${values.id}?${new Date().getTime()}` : 
  "/api/shops/defaultphoto"

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      shopId: match.params.shopId
    }, signal).then( data => {

      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ 
          ...values, 
          id: data._id, 
          name: data.name, 
          description: data.description, 
          owner: data.owner.name 
        })
      }

    })
    return () => {
      abortController.abort()
    }
  }, [])

  const handleSubmit = () => {
    let shopData = new FormData()
    values.name && shopData.append("name", values.name)
    values.description && shopData.append("description", values.description)
    values.image && shopData.append("image", values.image)
    update({
      shopId: match.params.shopId
    }, {
      t: jwt.token
    }, shopData).then( data => {

      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, "redirect": true })
      }

    })
  }

  const handleChange = name => event => {
    const value = name === "image" ? 
    event.target.files[0] : 
    event.target.value
    setValues({ ...values, [name]: value })
  }

  
  if (values.redirect) {
    return (<Redirect to={"/seller/shops"} />)
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <Card>

            <CardContent>
              <Typography type="headline" component="h2">
                Edit Shop
              </Typography>
              <br />

              <Avatar src={logoUrl} />
              <br />

              <input 
                accept="image/*" 
                onChange={handleChange("image")} 
                id="icon-button-file" 
                type="file" 
              />

              <label htmlFor="icon-button-file">
                <Button variant="contained" color="default" component="span">
                  Change Logo
                  <FileUpload />
                </Button>
              </label> 

              <span>{values.image ? values.image.name : ''}</span>
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
                rows="3"
                value={values.description}
                onChange={handleChange("description")}
                margin="normal"
              />
              <br />

              <Typography type="subheading" component="h4">
                Owner: {values.owner}
              </Typography>
              <br />

              {
                values.error && (
                <Typography component="p" color="error">
                  <Icon color="error">error</Icon>
                  {values.error}
                </Typography>)
              }
            </CardContent>

            <CardActions>
              <Button 
                color="primary" 
                variant="contained" 
                onClick={handleSubmit}
              >
                Update
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6}>
          <MyProducts shopId={match.params.shopId} />
        </Grid>
      </Grid>
    </div>
  )
}

export default EditShop