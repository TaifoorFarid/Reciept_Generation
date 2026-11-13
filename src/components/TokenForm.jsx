import React from 'react';
import { Plus, Trash2, Tag, RefreshCw, Zap, Receipt, User, Phone, Layers } from 'lucide-react';
import { CATEGORIES, QUICK_ITEMS_PRESETS } from '../data/sampleData';

export default function TokenForm({ receipt, onChange, onReset, onLoadSample, store }) {
  const updateField = (field, value) => {
    onChange({ ...receipt, [field]: value });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: '',
      price: 0,
      qty: 1,
    };
    updateField('items', [...receipt.items, newItem]);
  };

  const handleQuickAdd = (preset) => {
    // Check if item already exists in list, if so increment qty
    const existingIndex = receipt.items.findIndex(
      (item) => item.name.toLowerCase() === preset.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      const updated = [...receipt.items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        qty: Number(updated[existingIndex].qty || 1) + 1,
      };
      updateField('items', updated);
    } else {
      const newItem = {
        id: `item-${Date.now()}`,
        name: preset.name,
        price: preset.price,
        qty: 1,
      };
      updateField('items', [...receipt.items, newItem]);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...receipt.items];
    updated[index] = { ...updated[index], [field]: value };
    updateField('items', updated);
  };

  const handleRemoveItem = (index) => {
    const updated = receipt.items.filter((_, idx) => idx !== index);
    updateField('items', updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Token & Bill Details</h2>
            <p className="text-xs text-slate-500">Configure customer token and order items</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            title="Load sample order"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Sample</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            title="Clear form"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Row 1: Token Number & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Token No.
          </label>
          <input
            type="text"
            value={receipt.tokenNo || ''}
            onChange={(e) => updateField('tokenNo', e.target.value)}
            className="w-full px-3 py-2 text-sm font-black rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase bg-slate-50 text-slate-900 tracking-wider"
            placeholder="e.g. T-101"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Category
          </label>
          <select
            value={receipt.category || 'takeaway'}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label} ({cat.prefix})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Counter / Desk
          </label>
          <input
            type="text"
            value={receipt.counterNo || ''}
            onChange={(e) => updateField('counterNo', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Counter 1"
          />
        </div>
      </div>

      {/* Row 2: Customer Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Customer Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={receipt.customerName || ''}
              onChange={(e) => updateField('customerName', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Guest Name"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={receipt.customerPhone || ''}
              onChange={(e) => updateField('customerPhone', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 000-0000"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Table / Ref #
          </label>
          <input
            type="text"
            value={receipt.tableNo || ''}
            onChange={(e) => updateField('tableNo', e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Table or Reference"
          />
        </div>
      </div>

      {/* Quick Add Preset Items Chips */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick Preset Items (Click to Add):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ITEMS_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickAdd(preset)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 transition"
            >
              <span>+ {preset.name}</span>
              <span className="font-bold text-slate-900">{store.currency}{preset.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Item List Management */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Bill Items ({receipt.items?.length || 0})
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Item</span>
          </button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {receipt.items && receipt.items.length > 0 ? (
            receipt.items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="Item or service name"
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-20">
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-xs text-slate-400 font-bold">{store.currency}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full pl-6 pr-2 py-1.5 text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-right font-medium"
                    />
                  </div>
                </div>

                <div className="w-16">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2 py-1.5 text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center font-bold"
                    title="Quantity"
                  />
                </div>

                <div className="w-20 text-right text-xs font-bold text-slate-800 pr-1">
                  {store.currency}{(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              No items in this receipt yet. Click above to add items.
            </div>
          )}
        </div>
      </div>

      {/* Tax, Discount, and Payment Settings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={receipt.discountPercent || 0}
            onChange={(e) => updateField('discountPercent', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Tax / VAT (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={receipt.taxPercent ?? store.taxRate}
            onChange={(e) => updateField('taxPercent', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Payment Method
          </label>
          <select
            value={receipt.paymentMethod || 'Cash'}
            onChange={(e) => updateField('paymentMethod', e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="Online / UPI">Online / UPI QR</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Payment Status
          </label>
          <select
            value={receipt.paymentStatus || 'Paid'}
            onChange={(e) => updateField('paymentStatus', e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Notes / Special Instructions */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Special Notes / Instructions
        </label>
        <textarea
          rows={2}
          value={receipt.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="e.g. Allergies, table requests, or special handling notes"
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
