import { useState } from "react"
import "./App.css"

function App() {
  const MY_USER_ID = "userId1"
  const [headline, setHeadline] = useState("This is The Shop")
  const [shopActive, setActive] = useState(false)
  const [products, setProducts] = useState([])
  const [favourites, setFavourites] = useState([''])
  const [myCart, updateCart] = useState([])
  // const [count, setCount] = useState(0)

  function exit() {
    document.querySelector("#homeButton")?.remove()
    document.querySelector("#openButton")?.remove()
    document.querySelector("#getProducts")?.remove()
    document.querySelector("#productList")?.remove()
    setHeadline("Goodbye!")
  }

  function addToCart(productId: string) {
    alert(`Added ${productId} to Cart.`)
  }

  async function removeFromFavourites(productId: string) {
    await fetch(`http://localhost:3000/users/${MY_USER_ID}/favourites/${productId}`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
    fetchFavourites()
  }

  async function addToFavourites(productId: string) {
    await fetch(`http://localhost:3000/users/${MY_USER_ID}/favourites`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        product_id: productId,
      }),
    })
    fetchFavourites()
  }

  async function fetchFavourites() {
    console.log("Fetching favourites.")
    const result = await fetch(
      `http://localhost:3000/users/${MY_USER_ID}/favourites`
    )
    const body = await result.json()
    setFavourites(body)
  }

  return (
    <>
      <h1>{headline}</h1>
      <div className="card" id="openButton">
        <button
          onClick={() => {
            document.querySelector("#openButton")?.remove()
            setHeadline("Shop 'til you drop!")
            setActive(true)
          }}
        >
          Open The Shop
        </button>
      </div>
      <div className="card" id="getProducts">
        <FetchProducts />
      </div>
      <div id="productList">
        <ProductList />
      </div>
      <div className="card" id="homeButton">
        <button onClick={exit}>Sorry, I'm broke.</button>
      </div>
    </>
  )

  function FetchProducts() {
    return shopActive ? (
      <button
        onClick={async () => {
          console.log("Fetching products.")
          const result = await fetch("http://localhost:3000/products")
          const body = await result.json()
          setProducts(body)
        }}
      >
        Get All The Fancy Products
      </button>
    ) : (
      <></>
    )
  }

  function ProductList() {
    return shopActive ? (
      <table>
        <thead>
          <tr>
            <th>ProductName</th>
            <th>Price</th>
            <th>I like?</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const like = favourites.includes((product as any).id)
            return (
              <tr>
                <td>{(product as any).name}</td>
                <td>{(product as any).price} Euro</td>
                <td>
                  {like
                    ? "YES"
                    : "Not Really"}
                </td>
                <td>
                  {!like ? <button
                    onClick={() => {
                      addToFavourites((product as any).id)
                    }}
                  >
                    Like this!
                  </button> : <button
                    onClick={() => {
                      removeFromFavourites((product as any).id)
                    }}
                  >
                    Dislike this!
                  </button>}
                </td>
                <td>
                  <button
                    onClick={() => {
                      addToCart((product as any).id)
                    }}
                  >
                    Buy this!
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    ) : (
      <></>
    )
  }

  function ShoppingCart() {}
}

export default App
