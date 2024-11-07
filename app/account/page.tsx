'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../../utils/api'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Load user from localStorage or your auth system
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const { data: orders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: getOrders,
    enabled: !!user
  })

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account</h1>
        <p>Please log in to view your account.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}</h1>
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
          {orders?.map((order: any) => (
            <Card key={order.id} className="mb-4">
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>Placed on {new Date(order.date_created).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Status: {order.status}</p>
                <p>Total: {order.total}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href={`/order/${order.id}`}>View Order</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="addresses">
          <h2 className="text-2xl font-semibold mb-4">Your Addresses</h2>
          {/* Add address management here */}
        </TabsContent>
        <TabsContent value="wishlist">
          <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
          {/* Add wishlist management here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}