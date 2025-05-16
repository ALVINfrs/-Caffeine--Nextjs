"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag, ArrowLeft, Printer, Home } from "lucide-react";
import Link from "next/link";

interface TransactionData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
}

export default function TransactionSuccessPage() {
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get transaction data from sessionStorage
    const storedData = sessionStorage.getItem("transactionData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setTransactionData(parsedData);
        console.log("Transaction data loaded:", parsedData);
        if (parsedData.items) {
          parsedData.items.forEach((item: any, index: number) => {
            console.log(`Item ${index} image:`, item.image);
          });
        }
      } catch (error) {
        console.error("Error parsing transaction data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
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
    if (!method) return "";
    const methods: Record<string, string> = {
      bank: "Transfer Bank",
      cod: "Bayar di Tempat (COD)",
      ovo: "OVO",
      gopay: "GoPay",
      dana: "DANA",
    };

    return methods[method] || method;
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">No Transaction Data Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find any transaction data. This might happen if you
            accessed this page directly or your session has expired.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            <Home size={18} className="mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden print:shadow-none">
        <div className="bg-green-600 text-white p-6 print:bg-white print:text-black print:border-b print:border-gray-200">
          <div className="flex items-center justify-center mb-4 print:hidden">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center">
            Transaksi Berhasil!
          </h1>
          <p className="text-center mt-2 text-green-100 dark:text-green-200 print:text-gray-600">
            Pesanan Anda telah berhasil diproses dan sedang disiapkan
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold dark:text-white">
                Order #{transactionData.orderNumber}
              </h2>
              <p className="text-sm text-gray-500">
                {formatDate(transactionData.orderDate)}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 text-sm"
              >
                <Printer size={16} className="mr-1" />
                Print Receipt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Shipping Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Name:</span>{" "}
                  {transactionData.customerName}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Email:</span>{" "}
                  {transactionData.email}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Phone:</span>{" "}
                  {transactionData.phone}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Address:</span>{" "}
                  {transactionData.address}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Payment Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Payment Method:</span>{" "}
                  {getPaymentMethodName(transactionData.paymentMethod)}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Subtotal:</span> Rp.{" "}
                  {transactionData.subtotal.toLocaleString()}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Shipping:</span> Rp.{" "}
                  {transactionData.shipping.toLocaleString()}
                </p>
                <p className="text-gray-800 dark:text-gray-200 font-bold">
                  <span className="font-medium">Total:</span> Rp.{" "}
                  {transactionData.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Order Items
          </h3>
          <div className="border rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactionData.items.map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden">
                            {/* Use standard img tag instead of Next.js Image */}
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                        Rp. {item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                        Rp. {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center print:hidden">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 mb-4 sm:mb-0"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            <Link
              href="/#menu"
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded"
            >
              <ShoppingBag size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 print:hidden">
        <p>
          &copy; {new Date().getFullYear()} &lt;Caffeine/&gt; - All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
