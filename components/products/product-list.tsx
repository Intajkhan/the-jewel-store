'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/app/lib/wordpress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductList() {
  const [filters, setFilters] = useState({
    category: '',
    stock_status: '',
    search: '',
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }

  return (
    <div className="container mx-auto p-4">
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="bangles">Bangles</SelectItem>
            <SelectItem value="earrings">Earrings</SelectItem>
            <SelectItem value="necklaces">Necklaces</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.stock_status}
          onValueChange={(value) => setFilters({ ...filters, stock_status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stock</SelectItem>
            <SelectItem value="instock">In Stock</SelectItem>
            <SelectItem value="outofstock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product: any) => (
            <Card key={product.id} className="overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-square relative">
                  <Image
                    src={product.images[0]?.src || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.stock_status === 'outofstock' && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {formatPrice(parseFloat(product.price))}
                    </span>
                    {product.regular_price !== product.price && (
                      <span className="text-sm line-through text-muted-foreground">
                        {formatPrice(parseFloat(product.regular_price))}
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" disabled={product.stock_status === 'outofstock'}>
                      {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}