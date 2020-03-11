import formidable from "formidable"
import fs from "fs"
import extend from "lodash/extend"

import Product from "../models/product.model"
import errorHandler from "./../helpers/dbErrorHandler"

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {

    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded"
      })
    }

    let product = new Product(fields)
    product.shop = req.shop

    if (files.image) {
      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }

    try {
      let result = await product.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

  })
}

const listByShop = async (req, res) => {

  try {
    let products = await Product.find(
      { shop: req.shop._id }
    )
      .populate("shop", "_id name").select("-image")
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

const listLatest = async (req, res) => {
  
  try {
    let products = await Product.find({})
      .sort("-created")
      .limit(5)
      .populate("shop", "_id name")
      .exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

const productByID = async (req, res, next, id) => {

  try {
    let product = await Product.findById(id)
      .populate("shop", "_id name")
      .exec()

    if (!product) {
      return res.status(400).json({
        error: "Product not found"
      })
    }

    req.product = product
    next()
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve product"
    })
  }
}

const listRelated = async (req, res) => {

  try {
    let products = await Product.find(
      { "_id": { "$ne": req.product }, "category": req.product.category }
    ).limit(5)
      .populate("shop", "_id name").exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

const read = (req, res) => {
  req.product.image = undefined
  return res.json(req.product)
}

const listCategories = async (req, res) => {

  try {
    let products = await Product.distinct("category", {})
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

const list = async (req, res) => {
  const query = {}

  if (req.query.search) {
    query.name = { '$regex': req.query.search, '$options': "i" }
  }

  if (req.query.category && req.query.category != "All") {
    query.category = req.query.category
  }

  try {
    let products = await Product.find(query)
      .populate("shop", "_id name")
      .select("-image")
      .exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

export {
  create,
  listByShop,
  listLatest,
  productByID,
  listRelated,
  read,
  listCategories,
  list
}