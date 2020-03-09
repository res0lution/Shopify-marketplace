import React, { useState } from "react"
import { Link, Redirect } from "react-router-dom";

import { 
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon
} from "@material-ui/core/"
import FileUpload from "@material-ui/icons/AddPhotoAlternate"

import auth from "./../auth/auth-helper"
import { makeStyles } from "@material-ui/core/styles"
import { create } from "./api-shop.js"


const useStyles = makeStyles(theme => ({
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: "1em"
  }
}))

const NewShop = () => {

  const classes = useStyles()
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    redirect: false,
    error: ""
  })
  const jwt = auth.isAuthenticated()

  const handleChange = name => event => {
    const value = name === "image" ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = () => {
    let shopData = new FormData()
    values.name && shopData.append("name", values.name)
    values.description && shopData.append("description", values.description)
    values.image && shopData.append("image", values.image)
    create(
      { userId: jwt.user._id  },
      { t: jwt.token  },
      shopData
    ).then( data => {

      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: "", redirect: true })
      }

    })
  }

  if (values.redirect) {
    return <Redirect to={"/seller/shops"} />
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography 
            type="headline" 
            component="h2" 
            className={classes.title}
          >
            New Shop
          </Typography>
          <br />

          <input
            accept="image/*"
            onChange={handleChange("image")}
            id="icon-button-file"
            type="file"
          />

          <label htmlFor="icon-button-file">
            <Button 
              variant="contained" 
              color="secondary" 
              component="span"
            >
              Upload Logo
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
            className={classes.textField}
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

          {values.error && (
            <Typography component="p" color="error">
              <Icon 
                color="error" 
                className={classes.error}
              >
                error
              </Icon>
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

          <Link to="/seller/shops">
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}

export default NewShop
