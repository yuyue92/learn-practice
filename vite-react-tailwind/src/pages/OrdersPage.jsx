import React, { useEffect, useState } from "react";
import OrderForm from "./OrderForm";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setFilteredOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const result = orders.filter(
      (o) =>
        o.name.toLowerCase().includes(value.toLowerCase()) ||
        String(o.id).includes(value)
    );
    setFilteredOrders(result);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sorted = [...filteredOrders].sort((a, b) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredOrders(sorted);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("确认删除该订单吗？")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  const startIndex = (currentPage - 1) * pageSize;
  const pageData = filteredOrders.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">订单管理</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="搜索订单..."
          value={search}
          onChange={handleSearch}
          className="border rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={() => setEditingOrder({})}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          新增订单
        </button>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="p-2 cursor-pointer border"
                onClick={() => handleSort("id")}
              >
                ID
              </th>
              <th
                className="p-2 cursor-pointer border"
                onClick={() => handleSort("name")}
              >
                名称
              </th>
              <th
                className="p-2 cursor-pointer border"
                onClick={() => handleSort("price")}
              >
                价格
              </th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.name}</td>
                <td className="p-2 border">{order.price}</td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    onClick={() => setEditingOrder(order)}
                  >
                    编辑
                  </button>
                  <button
                    className="bg-red-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(order.id)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 分页 */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              i + 1 === currentPage ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 编辑/新增弹框 */}
      {editingOrder && (
        <OrderForm
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={() => {
            setEditingOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;
