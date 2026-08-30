import { useEffect, useState } from 'react'

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
  }, [])

  return (
    <main>
      <h1>Our Products</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </main>
  )
}

export default App