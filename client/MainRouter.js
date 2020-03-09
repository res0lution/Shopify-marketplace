import React from "react"
import { Route, Switch } from "react-router-dom"

import Home from "./core/Home"
import Users from "./user/Users"
import SignUp from "./user/SignUp"
import SignIn from "./auth/SingIn"
import Profile from "./user/Profile"
import EditProfile from "./user/EditProfile"
import PrivateRoute from "./auth/PrivateRoute"
import Menu from "./core/Menu"
import NewShop from "./shop/NewShop"
import Shops from "./shop/Shops"
import MyShops from "./shop/MyShops"

const MainRouter = () => {

  return (
    <div>
      <Menu />

      <Switch>
        <PrivateRoute path="/seller/shop/new" component={NewShop} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <PrivateRoute path="/seller/shops" component={MyShops} />
        <Route path="/shops/all" component={Shops} />
        <Route path="/user/:userId" component={Profile} />
        <Route path="/users" component={Users} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  )
}

export default MainRouter