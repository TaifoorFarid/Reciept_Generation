export const DEFAULT_STORE = {
  name: "Apex Express & Cafe",
  tagline: "Quality Service & Quick Bites",
  branch: "Central Galleria - Level 2",
  address: "450 Broadway St, Suite 100",
  phone: "+1 (555) 234-5678",
  currency: "$",
  taxRate: 8.5,
  footerNote: "Thank you for visiting! Retain this token for pickup.",
  counterName: "Counter 01",
};

export const CATEGORIES = [
  { id: "dine-in", label: "Dine-In", prefix: "D" },
  { id: "takeaway", label: "Takeaway", prefix: "T" },
  { id: "service", label: "Service / Support", prefix: "S" },
  { id: "express", label: "Express Pickup", prefix: "E" },
  { id: "billing", label: "Billing & Accounts", prefix: "B" },
];

export const QUICK_ITEMS_PRESETS = [
  { name: "Americano Coffee", price: 3.50, category: "Beverage" },
  { name: "Caramel Frappuccino", price: 5.25, category: "Beverage" },
  { name: "Artisan Croissant", price: 3.75, category: "Bakery" },
  { name: "Classic Cheeseburger", price: 9.50, category: "Food" },
  { name: "Crispy Chicken Wrap", price: 8.25, category: "Food" },
  { name: "French Fries (Large)", price: 4.00, category: "Food" },
  { name: "Consultation Fee", price: 25.00, category: "Service" },
  { name: "Express Handling", price: 5.00, category: "Service" },
];

export const INITIAL_RECEIPT = {
  tokenNo: "T-108",
  category: "takeaway",
  customerName: "Alex Rivera",
  customerPhone: "+1 (555) 492-3810",
  counterNo: "Counter 1",
  tableNo: "A-04",
  paymentMethod: "Card",
  paymentStatus: "Paid",
  discountPercent: 5,
  taxPercent: 8.5,
  notes: "Extra napkins and ketchup packets.",
  items: [
    { id: "item-1", name: "Classic Cheeseburger", qty: 2, price: 9.50 },
    { id: "item-2", name: "Caramel Frappuccino", qty: 2, price: 5.25 },
    { id: "item-3", name: "French Fries (Large)", qty: 1, price: 4.00 },
  ],
};
