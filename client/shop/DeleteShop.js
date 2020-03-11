import React, { useState } from "react"
import {
  IconButton,
  Button,
  DeleteIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core"

import auth from "./../auth/auth-helper"
import { remove } from "./api-shop.js"

const DeleteShop = props => {

  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()

  const handleClick = () => {
    setOpen(true)
  }

  const deleteShop = () => {
    remove({
      shopId: props.shop._id
    }, { t: jwt.token }).then( data => {

      if (data.error) {
        console.log(data.error)
      } else {
        setOpen(false)
        props.onRemove(props.shop)
      }

    })
  }

  const handleRequestClose = () => {
    setOpen(false)
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={handleClick} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete " + props.shop.name}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop {props.shop.name}.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>

          <Button onClick={deleteShop} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}

export default DeleteShop