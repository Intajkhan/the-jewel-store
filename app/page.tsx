'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts, getCategories } from '../utils/api'
import { ShoppingCart, Search, User, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const { data: products } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => getProducts(selectedCategory ? { category: selectedCategory } : {})
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">The Jewel</span>
          </Link>
          <div className="flex items-center ml-auto space-x-4">
            <button>
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories?.map((category: any) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-primary text-primary-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((product: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/product/${product.id}`} className="block border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square relative mb-2 overflow-hidden rounded-md">
                    <Image
                      src={product.images[0]?.src || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="flex justify-around p-2">
          <Link href="/" className="flex flex-col items-center">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center">
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">Cart</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center">
            <User className="h-5 w-5" />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}