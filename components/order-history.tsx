"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ReceiptModal from "./receipt-modal";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/orders/user/orders",
          {
            credentials: "include", // ⬅️ penting biar cookie session ikut dikirim
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load order history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const viewOrderReceipt = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}`,
        {
          credentials: "include", // ⬅️ WAJIB agar session cookie ikut dikirim
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();

      setSelectedOrder({
        orderNumber: data.order.order_number,
        orderDate: data.order.order_date,
        customerName: data.order.customer_name,
        email: data.order.email,
        phone: data.order.phone,
        address: data.order.address,
        items: data.items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: data.order.subtotal,
        shipping: data.order.shipping_fee,
        total: data.order.total,
        paymentMethod: data.order.payment_method,
      });

      setIsReceiptModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load order details",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="text-red-500 text-center py-4">
          <p>Failed to load order history</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="empty-orders text-center py-4">
          <p>Belum ada riwayat pesanan</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="orders-container space-y-4" id="ordersContainer">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="order bg-gray-700 rounded-lg overflow-hidden"
            >
              <div className="order-header p-3 bg-gray-900 flex justify-between items-center">
                <h4 className="font-medium">Order #{order.order_number}</h4>
                <p className="order-date text-sm text-gray-400">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
                <p
                  className={`order-status text-sm px-2 py-1 rounded-full ${
                    order.status === "completed"
                      ? "bg-green-900 text-green-300"
                      : order.status === "processing"
                      ? "bg-blue-900 text-blue-300"
                      : order.status === "cancelled"
                      ? "bg-red-900 text-red-300"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {order.status}
                </p>
              </div>

              <div className="order-summary p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="order-image w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center">
                    <span className="text-2xl">☕</span>
                  </div>
                  <p>
                    {order.item_count} item(s) - Total: Rp.{" "}
                    {order.total.toLocaleString()}
                  </p>
                </div>
                <button
                  className="btn view-receipt px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors text-sm"
                  onClick={() => viewOrderReceipt(order.id)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receiptData={selectedOrder}
        />
      )}
    </>
  );
}
