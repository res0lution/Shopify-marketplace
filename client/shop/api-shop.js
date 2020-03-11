const create = async (params, credentials, shop) => {

  try {
    let response = await fetch("/api/shops/by/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t
      },
      body: shop
    });
    return response.json()
  } catch (err) {
    console.log(err)
  }

}

const list = async () => {

  try {
    const response = await fetch("/api/shops", {
      method: "GET",
    })
    return response.json()
  }
  catch (err) {
    return console.log(err)
  }

}

const listByOwner = async (params, credentials, signal) => {

  try {
    let response = await fetch("/api/shops/by/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + credentials.t
      }
    })
    return response.json()
  } catch (err) {
    console.log(err)
  }

}

const read = (params, credentials) => {
  return fetch("/api/shop/" + params.shopId, {
    method: "GET"
  }).then( response => {
    return response.json()
  }).catch( err => console.log(err))
}

const update = (params, credentials, shop) => {
  return fetch("/api/shops/" + params.shopId, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + credentials.t
    },
    body: shop
  }).then( response => {
    return response.json()
  }).catch( err => {
    console.log(err)
  })
}

const remove = (params, credentials) => {
  return fetch("/api/shops/" + params.shopId, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + credentials.t
    }
  }).then( response => {
    return response.json()
  }).catch( err => {
    console.log(err)
  })
}

export { 
  create,
  list,
  listByOwner,
  read,
  update,
  remove
}
