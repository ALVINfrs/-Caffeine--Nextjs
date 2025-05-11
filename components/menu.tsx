"use client"

import { useState } from "react"
import { useProductContext } from "@/context/product-context"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import ProductDetailModal from "./product-detail-modal"
import type { Product } from "@/types"
import { useInView } from "react-intersection-observer"

export default function Menu() {
  const { products, loading, error, filteredProducts, filterProducts } = useProductContext()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const [titleRef, titleInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [descRef, descInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [filtersRef, filtersInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
    filterProducts(filter)
  }

  const handleProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setIsDetailModalOpen(true)
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  if (loading) {
    return (
      <section id="menu" className="menu py-16 dark:bg-gray-900 light:bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="menu" className="menu py-16 dark:bg-gray-900 light:bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500 text-center">
              <p className="text-xl">Failed to load products</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="menu" className="menu py-16 dark:bg-gray-900 light:bg-amber-50">
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className={`text-3xl md:text-4xl font-bold text-center mb-4 transition-opacity duration-500 dark:text-white light:text-amber-900 ${
            titleInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-amber-600 dark:text-amber-500 light:text-amber-700">&lt;Menu </span>Kami/&gt;
        </h2>

        <p
          ref={descRef}
          className={`text-center max-w-3xl mx-auto mb-10 dark:text-gray-300 light:text-gray-700 transition-opacity duration-500 delay-200 ${
            descInView ? "opacity-100" : "opacity-0"
          }`}
        >
          Nikmati ragam pilihan kopi, non-coffee, dan makanan favorit—dari espresso, matcha, sampai indomie rebus dan
          nasi goreng. Semua siap nemenin kamu ngebut project Next.js, debug Spring Boot, atau ngoding full-stack pake
          React, Laravel, Express, hingga Go dan Rust. Coding nyaman, perut kenyang, fokus pun auto optimal.
        </p>

        <div
          ref={filtersRef}
          className={`menu-filter flex flex-wrap justify-center gap-2 mb-8 transition-all duration-500 delay-300 ${
            filtersInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("all")}
          >
            Semua
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "coffee"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("coffee")}
          >
            Kopi
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "non-coffee"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("non-coffee")}
          >
            Non-Kopi
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "snack"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("snack")}
          >
            Makanan Ringan
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "main-course"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("main-course")}
          >
            Main-Course
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "dessert"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("dessert")}
          >
            Dessert
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "indonesian-food"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("indonesian-food")}
          >
            Makanan Indonesia
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "western-food"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("western-food")}
          >
            Western-Food
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-full transition-colors ${
              activeFilter === "instant-food"
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
            }`}
            onClick={() => handleFilterClick("instant-food")}
          >
            Instant Food
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-filter text-center py-12">
            <p className="text-xl dark:text-gray-400 light:text-gray-500">Tidak ada produk dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card dark:bg-gray-800 light:bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-transparent light:border-gray-100"
                style={{
                  opacity: 0,
                  animation: `simpleFadeIn 0.5s ease-out forwards ${index * 0.1}s`,
                }}
              >
                <div className="product-icons absolute top-2 right-2 flex space-x-2 z-10">
                  <button
                    className="p-2 bg-black bg-opacity-70 rounded-full hover:bg-amber-600 transition-colors"
                    onClick={() => handleProductDetail(product)}
                  >
                    <Eye size={18} className="text-white" />
                  </button>
                  <button
                    className="p-2 bg-black bg-opacity-70 rounded-full hover:bg-amber-600 transition-colors"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={18} className="text-white" />
                  </button>
                </div>

                <div className="product-image relative h-48 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="product-content p-4">
                  <h3 className="text-lg font-semibold mb-1 dark:text-white light:text-gray-800">{product.name}</h3>
                  <div className="stars flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-amber-500 fill-current" />
                    ))}
                  </div>
                  <div className="price text-amber-600 dark:text-amber-500 font-bold mb-2">
                    Rp. {product.price.toLocaleString()}
                  </div>
                  <p className="description text-sm dark:text-gray-400 light:text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </section>
  )
}
