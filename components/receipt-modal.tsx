"use client"

import { X, Printer } from "lucide-react"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receiptData: any
}

export default function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  if (!isOpen || !receiptData) return null

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      bank: "Transfer Bank",
      cod: "Bayar di Tempat (COD)",
      ovo: "OVO",
      gopay: "GoPay",
      dana: "DANA",
    }

    return methods[method] || method
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 scale-in print:bg-white print:bg-opacity-100">
      <div className="relative bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto print:bg-white print:text-black print:max-w-full print:max-h-full print:overflow-visible">
        <button
          className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors z-10 print:hidden"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="p-8 print:p-4">
          <div className="receipt-header text-center mb-8 print:mb-4">
            <h2 className="text-2xl font-bold">&lt;Caffeine/&gt;</h2>
            <p className="text-lg">Struk Pembayaran</p>
            <p className="text-sm text-gray-400 print:text-gray-600">
              Tanggal: <span id="receipt-date">{formatDate(receiptData.orderDate)}</span>
            </p>
            <p className="text-sm text-gray-400 print:text-gray-600">
              No. Pesanan: <span id="receipt-order-id">{receiptData.orderNumber}</span>
            </p>
          </div>

          <div className="receipt-customer mb-6 print:mb-4 bg-gray-800 p-4 rounded-lg print:bg-gray-100 print:text-black">
            <h3 className="text-lg font-semibold mb-2">Detail Pelanggan</h3>
            <p>
              Nama: <span id="receipt-customer-name">{receiptData.customerName}</span>
            </p>
            <p>
              Email: <span id="receipt-customer-email">{receiptData.email}</span>
            </p>
            <p>
              Telepon: <span id="receipt-customer-phone">{receiptData.phone}</span>
            </p>
            <p>
              Alamat: <span id="receipt-customer-address">{receiptData.address}</span>
            </p>
          </div>

          <div className="receipt-items mb-6 print:mb-4">
            <h3 className="text-lg font-semibold mb-2">Pesanan</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-800 print:bg-gray-200 print:text-black">
                <tr>
                  <th className="p-2 text-left">Produk</th>
                  <th className="p-2 text-right">Harga</th>
                  <th className="p-2 text-right">Jumlah</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody id="receipt-items-table">
                {receiptData.items.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-700 print:border-gray-300">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">Rp. {item.price.toLocaleString()}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">Rp. {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-total mb-6 print:mb-4 space-y-1">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>
                Rp. <span id="receipt-subtotal">{receiptData.subtotal.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex justify-between">
              <p>Ongkos Kirim:</p>
              <p>
                Rp. <span id="receipt-shipping">{receiptData.shipping.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-700 print:border-gray-300">
              <p>Total:</p>
              <p>
                Rp. <span id="receipt-total">{receiptData.total.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="receipt-footer text-center">
            <p className="mb-2">
              Metode Pembayaran:{" "}
              <span id="receipt-payment-method">{getPaymentMethodName(receiptData.paymentMethod)}</span>
            </p>
            <p className="text-sm text-gray-400 print:text-gray-600 mb-6 print:mb-4 max-w-2xl mx-auto">
              Thanks udah checkout di <span className="text-amber-500 print:text-amber-600">&lt;Caffeine/&gt;</span>
              —ngoding dari JS, Python, Go, Rust, sampai Bash. Pake React, Laravel, Spring, Django, sampai Next.js? Gas!
              Minum kopi, non-kopi kayak matcha & coklat, makan western & Indonesian food, snack ringan, sampai Indomie.
              Semuanya bisa sambil ngopi. Satu commit, satu bug fix, satu kopi. Keep pushing, dev! 🚀
            </p>

            <button
              id="print-receipt"
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors print:hidden"
              onClick={handlePrint}
            >
              <Printer size={18} className="mr-2" />
              Cetak Struk
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
