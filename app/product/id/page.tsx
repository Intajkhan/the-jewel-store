'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../../utils/api'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductPage() {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id))
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading product</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <Image
              src={product.images[selectedImage]?.src || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {product.images.map((image: any, index: number) => (
              <motion.button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-20 h-20 rounded-md overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image.src}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">{product.price}</p>
          <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          <div className="flex space-x-4 mb-6">
            <Button className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="list-disc list-inside">
              <li>SKU: {product.sku}</li>
              <li>Categories: {product.categories.map((cat: any) => cat.name).join(', ')}</li>
              {product.attributes.map((attr: any) => (
                <li key={attr.id}>
                  {attr.name}: {attr.options.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}