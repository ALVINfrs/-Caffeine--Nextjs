"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, MapPin, User, Mail, Phone } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import ReceiptModal from "./receipt-modal";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "bank",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

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
        setReceiptData({
          ...orderData,
          orderNumber: data.orderNumber,
          orderDate: new Date().toISOString(),
        });

        onClose();
        setIsReceiptModalOpen(true);
        clearCart();
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const subtotal = calculateTotal();
  const shipping = 15000;
  const total = subtotal + shipping;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 scale-in">
        <div className="relative bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
          <button
            className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors z-10"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="checkout-items space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <h3 className="text-xl font-semibold mb-2">Pesanan Anda</h3>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="checkout-item flex items-center space-x-3 bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="checkout-item-detail flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-400">
                        {item.quantity} x Rp. {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="checkout-item-total whitespace-nowrap font-semibold">
                      Rp. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-form">
                <h3 className="text-xl font-semibold mb-4">
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
                      className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                      className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                      className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                      className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 min-h-[80px]"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="payment-options">
                    <h4 className="text-lg font-medium mb-2">
                      Metode Pembayaran
                    </h4>

                    <div className="space-y-2">
                      <div className="payment-method flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                        <input
                          type="radio"
                          id="payment-bank"
                          name="payment"
                          value="bank"
                          checked={formData.paymentMethod === "bank"}
                          onChange={handlePaymentMethodChange}
                          className="text-amber-600 focus:ring-amber-600"
                        />
                        <label htmlFor="payment-bank">Transfer Bank</label>
                      </div>

                      <div className="payment-method flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                        <input
                          type="radio"
                          id="payment-cod"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handlePaymentMethodChange}
                          className="text-amber-600 focus:ring-amber-600"
                        />
                        <label htmlFor="payment-cod">
                          Bayar di Tempat (COD)
                        </label>
                      </div>

                      <div className="payment-method flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                        <input
                          type="radio"
                          id="payment-ovo"
                          name="payment"
                          value="ovo"
                          checked={formData.paymentMethod === "ovo"}
                          onChange={handlePaymentMethodChange}
                          className="text-amber-600 focus:ring-amber-600"
                        />
                        <label htmlFor="payment-ovo">OVO</label>
                      </div>

                      <div className="payment-method flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                        <input
                          type="radio"
                          id="payment-gopay"
                          name="payment"
                          value="gopay"
                          checked={formData.paymentMethod === "gopay"}
                          onChange={handlePaymentMethodChange}
                          className="text-amber-600 focus:ring-amber-600"
                        />
                        <label htmlFor="payment-gopay">GoPay</label>
                      </div>

                      <div className="payment-method flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                        <input
                          type="radio"
                          id="payment-dana"
                          name="payment"
                          value="dana"
                          checked={formData.paymentMethod === "dana"}
                          onChange={handlePaymentMethodChange}
                          className="text-amber-600 focus:ring-amber-600"
                        />
                        <label htmlFor="payment-dana">DANA</label>
                      </div>
                    </div>
                  </div>

                  <div className="checkout-total mt-6 space-y-1">
                    <div className="flex justify-between">
                      <p>Subtotal:</p>
                      <p>
                        Rp.{" "}
                        <span id="checkout-subtotal">
                          {subtotal.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Ongkos Kirim:</p>
                      <p>
                        Rp.{" "}
                        <span id="checkout-shipping">
                          {shipping.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-700">
                      <p>Total:</p>
                      <p>
                        Rp.{" "}
                        <span id="checkout-total">
                          {total.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors transform hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {receiptData && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receiptData={receiptData}
        />
      )}
    </>
  );
}
