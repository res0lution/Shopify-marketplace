const create = async (params, credentials, shop) => {

  try {
    let response = await fetch("/api/shops/by/" + params.userId, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + credentials.t
      },
      body: shop
    })
    return await response.json()
  }
  catch (err) {
    return console.log(err)
  }

}

export { create }