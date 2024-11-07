// pages/products.tsx
import MyClientComponent from '../components/MyClientComponent';

export async function getStaticProps() {
  // Commenting out the original API call for testing purposes
  // let products = await getProducts();

  // Use a static, simple array to test
  const products = [
    { id: 1, name: "Test Product", description: "This is a test product" },
    { id: 2, name: "Another Product", description: "This is another test product" }
  ];

  return {
    props: {
      products,
    },
    revalidate: 10,
  };
}

const ProductsPage = ({ products }) => (
  <div>
    <h1>Products</h1>
    <MyClientComponent products={products} />
  </div>
);

export default ProductsPage;
