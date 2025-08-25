import React, { useState } from "react";

const OrderForm = ({ order, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    id: order?.id || null,
    name: order?.name || "",
    price: order?.price || "",
    details: Array.isArray(order?.details) ? order.details : []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (index, key, value) => {
    const newDetails = [...form.details];
    newDetails[index][key] = value;
    setForm({ ...form, details: newDetails });
  };

  const addDetail = () => {
    setForm({ ...form, details: [...form.details, { detail1: "", olist1: [] }] });
  };

  const handleSubmit = async () => {
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/orders/${form.id}` : `/api/orders`;
    const payload = {
        ...form,
        price: parseFloat(form.price) || 0
    };
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow">
        <h3 className="text-xl font-bold mb-4">{form.id ? "编辑订单" : "新增订单"}</h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="订单名称"
          className="border rounded w-full mb-3 px-3 py-2"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="价格"
          className="border rounded w-full mb-3 px-3 py-2"
        />

        <h4 className="font-semibold mb-2">明细</h4>
        {form.details.map((d, i) => (
          <div key={i} className="border p-2 mb-2 rounded">
            <input
              value={d.detail1}
              onChange={(e) => handleDetailChange(i, "detail1", e.target.value)}
              placeholder="明细描述"
              className="border rounded w-full mb-2 px-2 py-1"
            />
          </div>
        ))}
        <button onClick={addDetail} className="text-blue-500 mb-3">
          + 添加明细
        </button>

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 border rounded">
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
