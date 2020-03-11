import React, { useState } from "react"

import { makeStyles } from "@material-ui/core/styles"
import { 
  Card,
  Divider,
  MenuItem,
  TextField,
  Button,

} from '@material-ui/core/Card'
import SearchIcon from "@material-ui/icons/Search"

import { list } from "./api-product.js"
import Products from "./Products"

const useStyles = makeStyles(theme => ({
  card: {
    margin: "auto",
    textAlign: "center",
    paddingTop: 10,
    backgroundColor: "#80808024"
  }
}))

const Search = (props) => {

  const classes = useStyles()
  const [values, setValues] = useState({
    category: "",
    search: "",
    results: [],
    searched: false
  })

  const handleChange = name => event => {
    setValues({
      ...values, [name]: event.target.value,
    })
  }

  const search = () => {

    if (values.search) {
      list({
        search: values.search || undefined, category: values.category
      }).then(  data => {

        if (data.error) {
          console.log(data.error)
        } else {
          setValues({
            ...values, 
            results: data, 
            searched: true 
          })
        }

      })
    }
  }

  const enterKey = (event) => {

    if (event.keyCode == 13) {
      event.preventDefault()
      search()
    }

  }

  return (
    <div>
      <Card className={classes.card}>
        <TextField
          id="select-category"
          select
          label="Select category"
          value={values.category}
          onChange={handleChange("category")}
          margin="normal"
        >
          <MenuItem value="All">
            All
          </MenuItem>

          {props.categories.map(  option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="search"
          label="Search products"
          type="search"
          onKeyDown={enterKey}
          onChange={handleChange("search")}
          margin="normal"
        />

        <Button 
          variant="contained" 
          color={'primary'}
          onClick={search}
        >
          <SearchIcon />
        </Button>
        <Divider />

        <Products products={values.results} searched={values.searched} />
      </Card>
    </div>
  )
}

export default Search