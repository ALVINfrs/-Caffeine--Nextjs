"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Printer, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: any;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  receiptData,
}: ReceiptModalProps) {
  const [activeTab, setActiveTab] = useState<"success" | "receipt">("success");
  const router = useRouter();

  useEffect(() => {
    if (isOpen && receiptData) {
      console.log("Receipt data items:", receiptData.items);
      receiptData.items.forEach((item: any, index: number) => {
        console.log(`Item ${index} image:`, item.image);
      });
    }
  }, [isOpen, receiptData]);

  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      bank: "Transfer Bank",
      cod: "Bayar di Tempat (COD)",
      ovo: "OVO",
      gopay: "GoPay",
      dana: "DANA",
    };

    return methods[method] || method;
  };

  // Handle clicking outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewSuccessPage = () => {
    onClose();
    // Store receipt data in sessionStorage to access it on the success page
    sessionStorage.setItem("transactionData", JSON.stringify(receiptData));
    router.push("/transaction-success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 scale-in print:bg-white print:bg-opacity-100"
      onClick={handleBackdropClick}
    >
      <div className="relative dark:bg-gray-900 light:bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto print:bg-white print:text-black print:max-w-full print:max-h-full print:overflow-visible shadow-2xl">
        <button
          className="absolute top-4 right-4 p-2 dark:bg-gray-800 light:bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors z-10 print:hidden"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Tab Navigation */}
        <div className="flex border-b dark:border-gray-700 light:border-gray-200 print:hidden">
          <button
            className={`flex-1 py-4 font-medium text-center ${
              activeTab === "success"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-amber-600"
            }`}
            onClick={() => setActiveTab("success")}
          >
            Transaksi Sukses
          </button>
          <button
            className={`flex-1 py-4 font-medium text-center ${
              activeTab === "receipt"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-amber-600"
            }`}
            onClick={() => setActiveTab("receipt")}
          >
            Detail Struk
          </button>
        </div>

        {activeTab === "success" && (
          <div className="p-8 print:p-4 animate-fade-in">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold dark:text-white light:text-gray-900">
                Transaksi Berhasil!
              </h2>
              <p className="text-gray-500 mt-2">
                Pesanan Anda telah berhasil diproses
              </p>
              <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-md mt-4 font-medium">
                No. Pesanan: {receiptData.orderNumber}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg dark:text-white light:text-gray-900">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {receiptData.items.map((item: any, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center space-x-3 dark:bg-gray-800 light:bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="w-16 h-16 relative rounded-md overflow-hidden border dark:border-gray-700 light:border-gray-200">
                      {/* Use standard img tag instead of Next.js Image */}
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium dark:text-white light:text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm dark:text-gray-400 light:text-gray-600">
                        {item.quantity} x Rp. {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="font-semibold dark:text-white light:text-gray-900">
                      Rp. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="dark:bg-gray-800 light:bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="dark:text-gray-300 light:text-gray-700">
                    Subtotal:
                  </span>
                  <span className="dark:text-white light:text-gray-900">
                    Rp. {receiptData.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="dark:text-gray-300 light:text-gray-700">
                    Ongkos Kirim:
                  </span>
                  <span className="dark:text-white light:text-gray-900">
                    Rp. {receiptData.shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t dark:border-gray-700 light:border-gray-300">
                  <span className="dark:text-white light:text-gray-900">
                    Total:
                  </span>
                  <span className="dark:text-white light:text-gray-900">
                    Rp. {receiptData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="dark:bg-gray-800 light:bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="font-semibold mb-2 dark:text-white light:text-gray-900">
                Informasi Pengiriman
              </h3>
              <p className="dark:text-gray-300 light:text-gray-700 mb-1">
                <span className="font-medium dark:text-white light:text-gray-900">
                  Nama:
                </span>{" "}
                {receiptData.customerName}
              </p>
              <p className="dark:text-gray-300 light:text-gray-700 mb-1">
                <span className="font-medium dark:text-white light:text-gray-900">
                  Email:
                </span>{" "}
                {receiptData.email}
              </p>
              <p className="dark:text-gray-300 light:text-gray-700 mb-1">
                <span className="font-medium dark:text-white light:text-gray-900">
                  Telepon:
                </span>{" "}
                {receiptData.phone}
              </p>
              <p className="dark:text-gray-300 light:text-gray-700 mb-1">
                <span className="font-medium dark:text-white light:text-gray-900">
                  Alamat:
                </span>{" "}
                {receiptData.address}
              </p>
              <p className="dark:text-gray-300 light:text-gray-700 mb-1">
                <span className="font-medium dark:text-white light:text-gray-900">
                  Metode Pembayaran:
                </span>{" "}
                {getPaymentMethodName(receiptData.paymentMethod)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={() => setActiveTab("receipt")}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium flex items-center justify-center"
              >
                Lihat Struk <ArrowRight size={18} className="ml-2" />
              </button>
              <button
                onClick={handleViewSuccessPage}
                className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium flex items-center justify-center"
              >
                Halaman Sukses <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "receipt" && (
          <div className="p-8 print:p-4 animate-fade-in">
            <div className="receipt-header text-center mb-8 print:mb-4">
              <h2 className="text-2xl font-bold dark:text-white light:text-gray-900">
                &lt;Caffeine/&gt;
              </h2>
              <p className="text-lg dark:text-white light:text-gray-900">
                Struk Pembayaran
              </p>
              <p className="text-sm dark:text-gray-400 light:text-gray-600 print:text-gray-600">
                Tanggal:{" "}
                <span id="receipt-date">
                  {formatDate(receiptData.orderDate)}
                </span>
              </p>
              <p className="text-sm dark:text-gray-400 light:text-gray-600 print:text-gray-600">
                No. Pesanan:{" "}
                <span id="receipt-order-id">{receiptData.orderNumber}</span>
              </p>
            </div>

            <div className="receipt-customer mb-6 print:mb-4 dark:bg-gray-800 light:bg-gray-50 p-4 rounded-lg print:bg-gray-100 print:text-black">
              <h3 className="text-lg font-semibold mb-2 dark:text-white light:text-gray-900">
                Detail Pelanggan
              </h3>
              <p className="dark:text-gray-300 light:text-gray-700">
                Nama:{" "}
                <span id="receipt-customer-name">
                  {receiptData.customerName}
                </span>
              </p>
              <p className="dark:text-gray-300 light:text-gray-700">
                Email:{" "}
                <span id="receipt-customer-email">{receiptData.email}</span>
              </p>
              <p className="dark:text-gray-300 light:text-gray-700">
                Telepon:{" "}
                <span id="receipt-customer-phone">{receiptData.phone}</span>
              </p>
              <p className="dark:text-gray-300 light:text-gray-700">
                Alamat:{" "}
                <span id="receipt-customer-address">{receiptData.address}</span>
              </p>
            </div>

            <div className="receipt-items mb-6 print:mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white light:text-gray-900">
                Pesanan
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="dark:bg-gray-800 light:bg-gray-100 print:bg-gray-200 print:text-black">
                    <tr>
                      <th className="p-2 text-left dark:text-white light:text-gray-900">
                        Produk
                      </th>
                      <th className="p-2 text-right dark:text-white light:text-gray-900">
                        Harga
                      </th>
                      <th className="p-2 text-right dark:text-white light:text-gray-900">
                        Jumlah
                      </th>
                      <th className="p-2 text-right dark:text-white light:text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody id="receipt-items-table">
                    {receiptData.items.map((item: any, index: number) => (
                      <tr
                        key={`${item.id}-${index}`}
                        className="border-b dark:border-gray-700 light:border-gray-300 print:border-gray-300"
                      >
                        <td className="p-2 dark:text-white light:text-gray-900">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 relative rounded-md overflow-hidden border dark:border-gray-700 light:border-gray-200 hidden sm:block">
                              {/* Use standard img tag instead of Next.js Image */}
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-right dark:text-white light:text-gray-900">
                          Rp. {item.price.toLocaleString()}
                        </td>
                        <td className="p-2 text-right dark:text-white light:text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="p-2 text-right dark:text-white light:text-gray-900">
                          Rp. {(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="receipt-total mb-6 print:mb-4 space-y-1">
              <div className="flex justify-between">
                <p className="dark:text-white light:text-gray-900">Subtotal:</p>
                <p className="dark:text-white light:text-gray-900">
                  Rp.{" "}
                  <span id="receipt-subtotal">
                    {receiptData.subtotal.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="flex justify-between">
                <p className="dark:text-white light:text-gray-900">
                  Ongkos Kirim:
                </p>
                <p className="dark:text-white light:text-gray-900">
                  Rp.{" "}
                  <span id="receipt-shipping">
                    {receiptData.shipping.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t dark:border-gray-700 light:border-gray-300 print:border-gray-300">
                <p className="dark:text-white light:text-gray-900">Total:</p>
                <p className="dark:text-white light:text-gray-900">
                  Rp.{" "}
                  <span id="receipt-total">
                    {receiptData.total.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="receipt-footer text-center">
              <p className="mb-2 dark:text-white light:text-gray-900">
                Metode Pembayaran:{" "}
                <span id="receipt-payment-method">
                  {getPaymentMethodName(receiptData.paymentMethod)}
                </span>
              </p>
              <p className="text-sm dark:text-gray-400 light:text-gray-600 print:text-gray-600 mb-6 print:mb-4 max-w-2xl mx-auto">
                Thanks udah checkout di{" "}
                <span className="text-amber-600 dark:text-amber-500 light:text-amber-700 print:text-amber-600">
                  &lt;Caffeine/&gt;
                </span>
                —ngoding dari JS, Python, Go, Rust, sampai Bash. Pake React,
                Laravel, Spring, Django, sampai Next.js? Gas! Minum kopi,
                non-kopi kayak matcha & coklat, makan western & Indonesian food,
                snack ringan, sampai Indomie. Semuanya bisa sambil ngopi. Satu
                commit, satu bug fix, satu kopi. Keep pushing, dev! 🚀
              </p>

              <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                <button
                  id="print-receipt"
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium flex items-center justify-center"
                  onClick={handlePrint}
                >
                  <Printer size={18} className="mr-2" />
                  Cetak Struk
                </button>
                <button
                  onClick={handleViewSuccessPage}
                  className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center justify-center"
                >
                  Halaman Sukses <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
