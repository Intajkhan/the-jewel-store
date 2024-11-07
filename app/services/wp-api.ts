import axios from 'axios'
import { getProducts, getCategories } from './lib/wordpress'

const API_URL = 'https://thejeweljaipur.com/wp-json/wc/v3'

const consumer_key = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY
const consumer_secret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET

export const wpApi = axios.create({
  baseURL: API_URL,
  params: {
    consumer_key,
    consumer_secret,
  },
})

export const getProducts = async (params?: Record<string, any>) => {
  const { data } = await wpApi.get('/products', { params })
  return data
}

export const getCategories = async () => {
  const { data } = await wpApi.get('/products/categories')
  return data
}

export const getProduct = async (id: number) => {
  const { data } = await wpApi.get(`/products/${id}`)
  return data
}