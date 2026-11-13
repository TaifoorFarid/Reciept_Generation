# Prime View Cooperative Housing Society — Payment Receipt Generator

A specialized, print-ready digital voucher & payment receipt generator for **Prime View Cooperative Housing Society**, built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## 📋 Exact Layout & Specifications

This application matches the official society payment receipt with the requested modifications:

### 1. Header & Letterhead
- **Emblem & KP Co-operative Logo**: Extracted high-resolution emblems on both sides.
- **Letterhead Information**: Full society name, Head Office address, Site Office address, and official contact phone numbers.
- **Copy Selector**: Switch between `MEMBER COPY`, `OFFICE COPY`, and `BANK COPY`.
- **Title Ribbon**: `PAYMENT RECEIPT` banner with gold divider accents.

### 2. Form Sections & Fields
- **RECEIPT DETAILS**:
  - `Receipt No.` (e.g. `PV-SLIP-2026-5370`)
  - `Receipt Date` (e.g. `13/11/2026` with calendar icon)
- **PAYMENT RECEIVED IN**:
  - Checkboxes: `Cash`, `Bank`, `Cheque`
  - `Bank Name`
  - `Account Name` *(Changed from "Transaction / Reference No" as requested)*
  - `Deposit Date`
- **MEMBER DETAILS**:
  - `Name`
  - `Father's / Husband's Name`
  - `CNIC No.`
  - *(Note: `Membership No.` has been completely removed as requested)*
- **PROPERTY DETAILS**:
  - `Plot No.`
  - `Block`
  - `Plot Size` (with `Marla ()` unit)
  - `Plot Type` (`Residential`, `Commercial`, `Farm Houses`)
- **PAYMENT DETAILS**:
  - **Payment Category**: Checkboxes for `Installment`, `Full settlement`, `Booking`, `Transfer Fee`, `Down Payment`, `Other`, with `Other Specify` field.
  - **Membership Plan**: Checkboxes for `Full Payment`, `Installments`, and **`Token Fee`** *(Added as requested)*, with `On Account Of` field.
  - **Amount Received**: Numeric field with `PKR [ ... ] /-` box.
  - **IN WORDS (Auto-Generated)**: Real-time automatic conversion of numbers to English words (e.g., `50000` ➔ `"Fifty Thousand Rupees Only"`).
- **Official Signatures**: Signature lines for Member/Depositor, Cashier/Accountant, and Treasurer/Secretary.
- **Footer (Preserved Intact)**: Complete official Head Office & Site Office details.

### 3. Removed Sections (As requested)
- ❌ `SPECIAL INSTRUCTIONS` — Removed
- ❌ `SECURITY HASH` — Removed
- ❌ `RECEIPT VERIFICATION` — Removed

---

## 🚀 How to Run

### 1. In your terminal:
```bash
cd "c:\Users\Dell\OneDrive\Desktop\Token_Recipt"
npm run dev
```

### 2. Open in your browser:
Visit **`http://localhost:5173`**.

### 3. Printing:
Click **"Print Receipt"** (or press `Ctrl + P`). The receipt prints with clean margins formatted for A4 standard voucher paper without any UI toolbars.
