import React, { useState } from "react"
import { Redirect } from "react-router-dom"

import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import AddCartIcon from "@material-ui/icons/AddShoppingCart"
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart'

import cart from "./cart-helper.js"

const useStyles = makeStyles(theme => ({

}))

const AddToCart = (props) => {

  const classes = useStyles()
  const [redirect, setRedirect] = useState(false)

  const addToCart = () => {
    cart.addItem(props.item, () => {
      setRedirect({ redirect: true })
    })
  }

  if (redirect) {
    return (<Redirect to={"/cart"} />)
  }

  return (
    <span>
      {props.item.quantity >= 0 ? (
        <IconButton color="secondary" dense="dense" onClick={addToCart}>
          <AddCartIcon />
        </IconButton>
      ) : (
        <IconButton disabled={true} color="secondary" dense="dense">
          <DisabledCartIcon />
        </IconButton>
      )}
    </span>
  )
}

export default AddToCart