import formidable from "formidable"
import fs from "fs"

import Shop from "./../models/user.model"

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {

    if (err) {
      res.status(400).json({
        message: "Image could not be uploaded"
      })
    }

    let shop = new Shop(fields)
    shop.owner = req.profile

    if (files.image) {
      shop.image.data = fs.readFileSync(files.image.path)
      shop.image.contentType = files.image.type
    }

    shop.save((err, result) => {

      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }

      res.status(200).json(result)
    })
  })
}

const list = (req, res) => {
  Shop.find((err, shops) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.json(shops)
  })
}

const listByOwner = (req, res) => {

  Shop.find({ owner: req.profile._id }, (err, shops) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.json(shops)
  }).populate("owner", "_id name")
}

const shopByID = (req, res, next, id) => {
  Shop.findById(id).populate("owner", "_id name").exec(
    (err, shop) => {

      if (err || !shop) {
        return res.status("400").json({
          error: "Shop not found"
        })
      }

    req.shop = shop
    next()
  })
}

const read = (req, res) => {
  return res.json(req.shop)
}

const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id ==
    req.auth._id

  if (!isOwner) {
    return res.status("403").json({
      error: "User is not authorized"
    })
  }

  next()
}

const update = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {

    if (err) {
      res.status(400).json({
        message: "Photo could not be uploaded"
      })
    }

    let shop = req.shop
    shop = _.extend(shop, fields)
    shop.updated = Date.now()

    if (files.image) {
      shop.image.data = fs.readFileSync(files.image.path)
      shop.image.contentType = files.image.type
    }
    
    shop.save( err => {

      if (err) {
        return res.status(400).send({
          error: errorHandler.getErrorMessage(err)
        })
      }

      return res.json(shop)
    })
  })
}

const remove = (req, res, next) => {
  let shop = req.shop
  shop.remove((err, deletedShop) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.json(deletedShop)
  })
}

export { 
  create,
  list,
  listByOwner,
  shopByID,
  read,
  isOwner,
  update,
  remove
}

