// app/lib/wordpress.ts
import axios from 'axios';

const WORDPRESS_API_URL = 'https://thejeweljaipur.com/wp-json';
const WC_API_URL = `${WORDPRESS_API_URL}/wc/v3`;

const consumer_key = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const consumer_secret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

export const wooCommerceApi = axios.create({
  baseURL: WC_API_URL,
  params: {
    consumer_key,
    consumer_secret,
  },
});

export async function getProducts(params?: Record<string, any>) {
  try {
    const { data } = await wooCommerceApi.get('/products', { params });
    return data; // Returns plain data for server-side usage
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    const { data } = await wooCommerceApi.get('/products/categories');
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getProduct(id: number) {
  try {
    const { data } = await wooCommerceApi.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}
