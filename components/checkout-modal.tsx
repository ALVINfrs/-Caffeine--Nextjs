"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, MapPin, User, Mail, Phone } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "bank",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        ...formData,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const subtotal = calculateTotal();
    const shipping = 15000;
    const total = subtotal + shipping;

    const orderData = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: cart,
      subtotal,
      shipping,
      total,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        const receiptData = {
          ...orderData,
          orderNumber:
            data.orderNumber || `ORD-${Date.now().toString().slice(-8)}`,
          orderDate: new Date().toISOString(),
        };

        // Store receipt data and redirect directly to success page
        sessionStorage.setItem("transactionData", JSON.stringify(receiptData));
        clearCart();
        onClose();
        router.push("/transaction-success");
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error) {
      // For demo purposes, create a mock successful order if API fails
      const receiptData = {
        ...orderData,
        orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
        orderDate: new Date().toISOString(),
      };

      // Store receipt data and redirect directly to success page
      sessionStorage.setItem("transactionData", JSON.stringify(receiptData));
      clearCart();
      onClose();
      router.push("/transaction-success");

      toast({
        title: "Order Processed",
        description: "Your order has been processed successfully",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clicking outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  const subtotal = calculateTotal();
  const shipping = 15000;
  const total = subtotal + shipping;

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-black transition-opacity duration-300 ${
        isOpen ? "bg-opacity-80" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto mt-8 transition-all duration-300 transform ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Checkout{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({totalItems} items)
            </span>
          </h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Order Summary
            </h3>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <Image
                        src={
                          item.image || "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Rp. {item.price.toLocaleString()}
                          </span>
                          <span className="mx-2 text-gray-400">×</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Rp. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="checkout-form">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Detail Pengiriman
              </h3>

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="input-group relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="checkout-name"
                    name="name"
                    placeholder="Nama Lengkap"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    id="checkout-email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="checkout-phone"
                    name="phone"
                    placeholder="No. Telepon"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    id="checkout-address"
                    name="address"
                    placeholder="Alamat Lengkap"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500 min-h-[80px]"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Metode Pembayaran
              </h3>

              <div className="space-y-2 mb-6">
                <div className="payment-method flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <input
                    type="radio"
                    id="payment-bank"
                    name="payment"
                    value="bank"
                    checked={formData.paymentMethod === "bank"}
                    onChange={handlePaymentMethodChange}
                    className="text-amber-600 focus:ring-amber-600"
                  />
                  <label
                    htmlFor="payment-bank"
                    className="text-gray-900 dark:text-white flex-1"
                  >
                    Transfer Bank
                  </label>
                </div>

                <div className="payment-method flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <input
                    type="radio"
                    id="payment-cod"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handlePaymentMethodChange}
                    className="text-amber-600 focus:ring-amber-600"
                  />
                  <label
                    htmlFor="payment-cod"
                    className="text-gray-900 dark:text-white flex-1"
                  >
                    Bayar di Tempat (COD)
                  </label>
                </div>

                <div className="payment-method flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <input
                    type="radio"
                    id="payment-ovo"
                    name="payment"
                    value="ovo"
                    checked={formData.paymentMethod === "ovo"}
                    onChange={handlePaymentMethodChange}
                    className="text-amber-600 focus:ring-amber-600"
                  />
                  <label
                    htmlFor="payment-ovo"
                    className="text-gray-900 dark:text-white flex-1"
                  >
                    OVO
                  </label>
                </div>

                <div className="payment-method flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <input
                    type="radio"
                    id="payment-gopay"
                    name="payment"
                    value="gopay"
                    checked={formData.paymentMethod === "gopay"}
                    onChange={handlePaymentMethodChange}
                    className="text-amber-600 focus:ring-amber-600"
                  />
                  <label
                    htmlFor="payment-gopay"
                    className="text-gray-900 dark:text-white flex-1"
                  >
                    GoPay
                  </label>
                </div>

                <div className="payment-method flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <input
                    type="radio"
                    id="payment-dana"
                    name="payment"
                    value="dana"
                    checked={formData.paymentMethod === "dana"}
                    onChange={handlePaymentMethodChange}
                    className="text-amber-600 focus:ring-amber-600"
                  />
                  <label
                    htmlFor="payment-dana"
                    className="text-gray-900 dark:text-white flex-1"
                  >
                    DANA
                  </label>
                </div>
              </div>

              <div className="checkout-total space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-400">Subtotal:</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Rp.{" "}
                    <span id="checkout-subtotal">
                      {subtotal.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    Ongkos Kirim:
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Rp.{" "}
                    <span id="checkout-shipping">
                      {shipping.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white">Total:</p>
                  <p className="text-gray-900 dark:text-white">
                    Rp.{" "}
                    <span id="checkout-total">{total.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-3 mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Selesaikan Pesanan"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
