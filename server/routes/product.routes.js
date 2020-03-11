import express from "express"
import productCtrl from "../controllers/product.controller"
import authCtrl from "../controllers/auth.controller"
import shopCtrl from "../controllers/shop.controller"

const router = express.Router()

router.param("shopId", shopCtrl.shopByID)
router.param("productId", productCtrl.productByID)

router.route("/api/products/by/:shopId")
  .post(
    authCtrl.requireSignin, 
    shopCtrl.isOwner, 
    productCtrl.create
  )
  .get(productCtrl.listByShop)

router.route("/api/products/latest")
  .get(productCtrl.listLatest)

router.route("/api/products/related/:productId")
  .get(productCtrl.listRelated)

router.route("/api/products/related/:productId")
  .get(productCtrl.listRelated)

router.route("/api/product/:shopId/:productId")
  .put(
    authCtrl.requireSignin, 
    shopCtrl.isOwner, 
    productCtrl.update
  )
  .delete(
    authCtrl.requireSignin, 
    shopCtrl.isOwner, 
    productCtrl.remove
  )

router.route("/api/products/categories")
  .get(productCtrl.listCategories)

router.route("/api/products")
  .get(productCtrl.list)

export default router