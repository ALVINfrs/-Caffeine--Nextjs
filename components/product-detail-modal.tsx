"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Star, Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
}

interface ProductDetailModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.name} has been added to your cart`,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 scale-in">
      <div className="relative dark:bg-gray-900 light:bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl">
        <button
          className="absolute top-4 right-4 p-2 dark:bg-gray-800 light:bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors z-10"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="relative h-64 md:h-full min-h-[250px] rounded-lg overflow-hidden shadow-md">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          <div className="product-detail-info">
            <h2 className="text-2xl font-bold mb-2 dark:text-white light:text-gray-900">{product.name}</h2>
            <p className="text-sm dark:text-gray-400 light:text-gray-600 mb-3">Kategori: {product.category}</p>

            <div className="stars flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="text-amber-500 fill-current" />
              ))}
            </div>

            <p className="text-xl font-bold text-amber-600 dark:text-amber-500 mb-4">
              Rp. {product.price.toLocaleString()}
            </p>

            <div className="mb-6">
              <p className="dark:text-gray-300 light:text-gray-700">{product.description}</p>
            </div>

            <div className="product-quantity flex items-center space-x-4 mb-6">
              <span className="dark:text-gray-400 light:text-gray-700">Quantity:</span>
              <div className="flex items-center">
                <button
                  className="w-8 h-8 flex items-center justify-center dark:bg-gray-800 light:bg-gray-100 rounded-l-md hover:bg-amber-600 hover:text-white transition-colors"
                  onClick={handleDecrease}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  readOnly
                  className="w-12 h-8 dark:bg-gray-700 light:bg-gray-50 text-center border-0 focus:outline-none dark:text-white light:text-gray-900"
                />
                <button
                  className="w-8 h-8 flex items-center justify-center dark:bg-gray-800 light:bg-gray-100 rounded-r-md hover:bg-amber-600 hover:text-white transition-colors"
                  onClick={handleIncrease}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 dark:from-amber-600 dark:to-amber-500 dark:hover:from-amber-700 dark:hover:to-amber-600 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              onClick={handleAddToCart}
            >
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
