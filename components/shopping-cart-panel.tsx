"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import CheckoutModal from "./checkout-modal"

interface ShoppingCartPanelProps {
  isOpen: boolean
}

export default function ShoppingCartPanel({ isOpen }: ShoppingCartPanelProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart()
  const { toast } = useToast()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  const handleClearCart = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      clearCart()
      toast({
        title: "Keranjang Kosong",
        description: "Keranjang belanja telah dikosongkan",
      })
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tidak ada produk di keranjang belanja",
        variant: "destructive",
      })
      return
    }

    setIsCheckoutModalOpen(true)
  }

  return (
    <>
      <div
        className={`shopping-cart absolute top-full right-0 w-full md:w-3/4 lg:w-1/2 bg-black bg-opacity-90 p-4 rounded-b-lg transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        } max-h-[80vh] overflow-y-auto`}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Keranjang Belanja</h2>

        <div className="cart-items space-y-4">
          {cart.length === 0 ? (
            <div className="empty-cart text-center py-8">
              <p>Keranjang belanja kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="cart-item-detail">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-300">Rp. {item.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="cart-item-quantity flex items-center space-x-2">
                    <button
                      className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full hover:bg-amber-700 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full hover:bg-amber-700 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price whitespace-nowrap">
                    Rp. {(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button
                    className="cart-item-remove text-red-500 hover:text-red-400 transition-colors"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-total mt-6 text-right">
          <p className="text-lg font-semibold">
            Total: Rp. <span id="cart-total-price">{calculateTotal().toLocaleString()}</span>
          </p>
        </div>

        <div className="cart-buttons flex justify-end space-x-4 mt-4">
          <button
            id="clear-cart"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={handleClearCart}
          >
            Bersihkan
          </button>
          <button
            id="checkout-button"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} />
    </>
  )
}
