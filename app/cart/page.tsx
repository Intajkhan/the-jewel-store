'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../utils/api'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const { data: products } = useQuery({
    queryKey: ['products', cart.map(item => item.id)],
    queryFn: () => getProducts({ include: cart.map(item => item.id).join(',') })
  })

  const updateQuantity = (productId: number, newQuantity: number) => {
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (productId: number) => {
    const updatedCart = cart.filter(item => item.id !== productId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const totalPrice = cart.reduce((total, item) => {
    const product = products?.find(p => p.id === item.id)
    return total + (parseFloat(product?.price || '0') * item.quantity)
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cart.map(item => {
              const product = products?.find(p => p.id === item.id)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-4 border-b py-4"
                >
                  <Image
                    src={product?.images[0]?.src || '/placeholder.svg'}
                    alt={product?.name || ''}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product?.name}</h3>
                    <p className="text-sm text-muted-foreground">{product?.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-20"
                    />
                    <Button variant="outline" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
          <div>
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}