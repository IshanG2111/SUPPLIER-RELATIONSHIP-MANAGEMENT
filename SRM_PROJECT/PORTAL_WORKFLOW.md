# SRM Portal User Workflow Guide

Welcome to the Supplier Relationship Management (SRM) Portal! This document explains how **Administrators** and **Suppliers** interact with the portal, what documents they upload, what templates they can download, and how the split-screen verification system works.

---

## 1. High-Level Process Overview

The portal manages the lifecycle of procurement in five simple steps:

```
[Admin creates RFQ] ──> [Supplier submits Bid] ──> [Admin receives Goods] ──> [Supplier submits Invoice] ──> [Supplier uploads Compliance]
```

---

## 2. Administrator Workflows

Administrators control procurement events, logistics intake, and database auditing.

### A. RFQ Sourcing (Request for Quotations)
* **What it is**: Admins create sourcing requests specifying item quantities and target values to invite suppliers to bid.
* **How to upload**:
  1. Click **New RFQ** in the Admin Console.
  2. Drag and drop or browse a **Procurement Specification PDF** sheet.
  3. The parser extracts the **RFQ Title**, **Value**, **Deadline**, and **Category** from the document and auto-fills the form.
* **What you can download**:
  - Click **Download Sample RFQ Procurement Spec** inside the upload modal to download a template showing how the document should be structured for auto-fill parsing.

### B. Goods Receiving (GRN Log)
* **What it is**: When physical goods arrive at the warehouse, the warehouse administrator records the incoming quantities and reviews delivery quality.
* **How to upload**:
  1. Click **Record Goods Receipt** in the Admin console.
  2. Upload the **Delivery Receipt PDF** received from the logistics carrier.
  3. The system extracts the **Receipt ID**, **PO Reference Number**, **Item Name**, **Quantity Delivered**, and **Quantity Accepted** to auto-fill the form.
* **What you can download**:
  - Click **Download Sample Delivery Receipt** inside the form to download a delivery receipt template for reference.

---

## 3. Supplier Workflows

Suppliers respond to sourcing invitations, request billing payments, and maintain compliance certificates.

### A. Bid Quotation Submission
* **What it is**: Suppliers submit commercial bids (pricing, lead times, warranties) responding to open RFQs.
* **How to upload**:
  1. Open **My Bids** and click **Submit Bid**.
  2. Upload a **Bid Proposal / Quotation PDF** containing prices and terms.
  3. The parser extracts the **Target RFQ Package**, **Quoted Price**, **Delivery Lead Time**, and **Warranty Period** to populate the form.
* **What you can download**:
  - Click **Download Sample Bid Quotation** inside the modal to download a bid quotation template.

### B. Invoicing & Billing
* **What it is**: Once goods are delivered, the supplier requests payment by submitting a commercial invoice.
* **How to upload**:
  1. Go to **Invoices** and click **Submit Invoice**.
  2. Upload a **Commercial Invoice PDF**.
  3. The parser extracts the **Invoice Number**, **PO Reference**, **Invoice Amount**, **Submission Date**, and **Payment Due Date** to fill the form.
* **What you can download**:
  - Click **Download Sample Invoice** inside the modal to download an invoice template.

### C. Compliance Certificate Registry
* **What it is**: Suppliers maintain certification status (ISO Quality standard, Tax W-9 forms, Liability Insurance policies) to remain eligible for bidding.
* **How to upload**:
  1. Go to **Profile** and click **Choose PDF File** under the Compliance Documents section.
  2. Upload an **ISO Certificate**, **Tax Certificate**, or **Insurance PDF**.
  3. The system parses the certificate text to extract the **Certificate ID**, **Issuer / Authority**, **Compliance Type**, and **Expiry Date**.
* **What you can download**:
  - Click **Download Sample Compliance Certificate** to view a valid ISO 9001:2015 template.

---

## 4. Side-by-Side Verification Screen

To prevent parsing errors or database mismatches, the portal features a **Side-by-Side Verification View** inside every upload modal, designed to support spacious layouts across different desktop viewports:

1. **Comfortable Standard Sizing (No PDF Loaded)**:
   - Modals containing standard input forms (RFQ Sourcing, Bid Proposals, Invoices, Compliance Profile) are configured to `lg` width (`max-w-3xl`) to ensure fields are clean and readable.
   - Complex interfaces containing itemized tables (such as the Goods Receiving grid editor) default to `xl` width (`max-w-5xl`) to prevent horizontal data squishing.
2. **Dynamic Split-Screen Expansion (PDF Loaded)**:
   - When a PDF is chosen, the modal dynamically expands to `xxl` size (`max-w-7xl`, approximately 1280px wide).
   - This side-by-side grid features a **Left Column** containing the editable form inputs (allowing manual corrections of parsed data) and a **Right Column** with a live PDF viewer rendering the document.
3. **Cross-Verification**:
   - The expanded `xxl` width ensures both columns are fully readable side-by-side in a single window without clipping, squishing, or excessive scrolling.
4. **Permanent Storage Sync**:
   - Saving from either view commits verified data directly to the local MySQL server and offline storage.

---

## 5. Storage Registry (Where is data saved?)

Whenever you hit save in a verification modal:
- **MySQL Database**: The data is sent via RESTful PHP APIs to the local MySQL database server (`srm_portal`). This ensures the records persist across browser reloads, user sessions, and database queries.
- **LocalStorage**: A copy is kept in the browser's local cache. If the MySQL server goes offline, the portal will fallback to local storage so you do not lose functionality.
- **PDF File Safety**: The actual PDF file is parsed **locally in the browser memory** using `pdf.js`. The raw file is never uploaded to external servers or third-party AI APIs, preserving full document privacy.
