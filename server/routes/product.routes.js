import express from "express"
import productCtrl from "../controllers/product.controller"
import authCtrl from "../controllers/auth.controller"
import shopCtrl from "../controllers/shop.controller"

const router = express.Router()

router.param("shopId", shopCtrl.shopByID)

router.route("/api/products/by/:shopId")
  .post(
    authCtrl.requireSignin, 
    shopCtrl.isOwner, 
    productCtrl.create
  )
  .get(productCtrl.listByShop)

export default router