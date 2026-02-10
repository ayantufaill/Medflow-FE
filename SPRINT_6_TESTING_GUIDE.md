# Sprint 6 - Testing Guide (Line by Line)

Yeh guide aapko batayega ke Sprint 6 ke saare features kaise test karne hain.

## 📋 Prerequisites
1. **Login karein** - Admin ya Billing role ke saath
2. **Sidebar me dekhein** - Ab 3 naye menu items dikhenge:
   - Claims
   - ERA/EOB
   - Authorizations

---

## 1️⃣ CLAIMS MANAGEMENT

### A. Claims List Page
**URL:** `http://localhost:5173/claims`  
**Sidebar:** Left menu me "Claims" click karein

**Kya test karein:**
1. ✅ **Page load** - Saare claims list me dikhne chahiye
2. ✅ **Search** - Top me search box me claim number ya patient name type karein
3. ✅ **Status Filter** - Dropdown se status filter karein (draft, submitted, pending, paid, denied)
4. ✅ **Date Range** - Start date aur end date select karein
5. ✅ **Pagination** - Bottom me page numbers click karein
6. ✅ **View Denied Claims** - Top right me "View Denied Claims" button click karein
7. ✅ **Actions Menu** - Har claim ke right side me 3 dots (⋮) click karein:
   - View Details
   - Edit (agar draft/pending status hai)
   - Delete (agar draft status hai)

### B. View Claim Page
**URL:** `http://localhost:5173/claims/{claimId}`  
**Access:** Claims list se kisi claim par click karein ya "View Details" select karein

**Kya test karein:**
1. ✅ **Claim Information** - Claim number, service date, billed amount, paid amount
2. ✅ **Status Chip** - Top right me status color-coded chip
3. ✅ **Validate Claim Button** (Agar status = draft):
   - "Validate Claim" button click karein
   - Dialog me errors/warnings dekhein
   - Agar errors hain to fix karein
4. ✅ **Submit Claim Button** (Agar status = draft aur validation pass):
   - "Submit Claim" button click karein
   - Confirmation dialog me "OK" click karein
   - Status "submitted" ho jana chahiye
5. ✅ **Status Timeline** - Right side me status history timeline
6. ✅ **Documents Section** - Attach documents button (agar available hai)
7. ✅ **Patient & Provider Info** - Patient name, provider name

### C. Denied Claims Page
**URL:** `http://localhost:5173/claims/denied`  
**Access:** Claims list page se "View Denied Claims" button ya sidebar se direct

**Kya test karein:**
1. ✅ **Denied Claims List** - Sirf denied claims dikhne chahiye
2. ✅ **Denial Reason Filter** - Dropdown se denial reason filter karein
3. ✅ **Search** - Claim number ya patient name se search karein
4. ✅ **Date Range** - Start/end date filter
5. ✅ **Actions Menu** - 3 dots click karein:
   - View Details
   - Resubmit Claim

### D. Resubmit Claim Page
**URL:** `http://localhost:5173/claims/{claimId}/resubmit`  
**Access:** Denied claims page se "Resubmit Claim" select karein

**Kya test karein:**
1. ✅ **Workflow Type** - Radio buttons:
   - Correction (default)
   - Appeal
2. ✅ **Correction Notes** - Text field me notes add karein
3. ✅ **Corrected Fields** - Agar correction select kiya to fields fill karein
4. ✅ **Appeal Reason** - Agar appeal select kiya to reason add karein
5. ✅ **Resubmit Button** - Form submit karein

### E. Secondary Claims Page
**URL:** `http://localhost:5173/claims/secondary`  
**Access:** Claims list page se ya direct URL

**Kya test karein:**
1. ✅ **Summary Cards** - Top me 4 cards:
   - Total Secondary Claims
   - Total Claim Amount
   - Total Paid
   - Pending Amount
2. ✅ **Secondary Claims List** - Table me secondary insurance claims
3. ✅ **Primary/Secondary Insurance** - Columns me dono insurance companies dikhni chahiye
4. ✅ **Filters** - Search, status, date range filters

---

## 2️⃣ ERA/EOB PROCESSING

### A. ERA List Page
**URL:** `http://localhost:5173/era`  
**Sidebar:** Left menu me "ERA/EOB" click karein

**Kya test karein:**
1. ✅ **ERA Records List** - Saare imported ERA files dikhne chahiye
2. ✅ **File Information** - File name, import date, total records
3. ✅ **Status Chips** - Status (imported, processing, processed, error)
4. ✅ **Matched/Unmatched Count** - Numbers dikhne chahiye
5. ✅ **Search** - File name ya claim number se search
6. ✅ **Status Filter** - Dropdown se status filter
7. ✅ **Date Range** - Start/end date filter
8. ✅ **Actions Menu** - 3 dots click karein:
   - View Details
   - Auto-Post Payments (agar processed status hai)
9. ✅ **Import ERA File Button** - Top right me "Import ERA File" button
10. ✅ **Unmatched Items Button** - Top right me "Unmatched Items" button

### B. Import ERA Page
**URL:** `http://localhost:5173/era/import`  
**Access:** ERA list page se "Import ERA File" button click karein

**Kya test karein:**
1. ✅ **File Upload** - "Click to select ERA file" button click karein
2. ✅ **File Validation** - Sirf .835, .txt, .edi files accept honge
3. ✅ **File Size Check** - 10MB se zyada files reject hongi
4. ✅ **File Info Display** - Select karne ke baad file name aur size dikhega
5. ✅ **Import Button** - "Import ERA File" button click karein
6. ✅ **Import Results** - Dialog me results dikhenge:
   - Total Records
   - Matched Payments
   - Unmatched Items (agar hain)
   - Auto-Posted Payments (agar auto-post hua)
7. ✅ **View Unmatched Items** - Agar unmatched items hain to button dikhega

### C. View ERA Page
**URL:** `http://localhost:5173/era/{eraId}`  
**Access:** ERA list se kisi ERA record par click karein

**Kya test karein:**
1. ✅ **ERA File Info** - File name, import date, total records, status
2. ✅ **Payment Summary** - Total amount, matched count, unmatched count
3. ✅ **Auto-Post Button** - Agar processed status hai aur unmatched items hain
4. ✅ **View Unmatched Items** - Button click karein

### D. Unmatched ERA Items Page
**URL:** `http://localhost:5173/era/unmatched`  
**Access:** ERA list page se "Unmatched Items" button ya ERA view page se

**Kya test karein:**
1. ✅ **Unmatched Items List** - Table me unmatched payment items
2. ✅ **Item Details** - Patient name, claim/invoice number, payment date, amount
3. ✅ **Search** - Patient name, claim number, invoice number se search
4. ✅ **Date Range** - Start/end date filter
5. ✅ **Actions Menu** - 3 dots click karein:
   - Match Manually
6. ✅ **Manual Match Dialog** - Dialog me:
   - Item to match info
   - Claim dropdown (search karke select karein)
   - Invoice dropdown (search karke select karein)
   - Either claim ya invoice select karein
   - "Match Item" button click karein

---

## 3️⃣ AUTHORIZATION MANAGEMENT

### A. Authorizations List Page
**URL:** `http://localhost:5173/authorizations`  
**Sidebar:** Left menu me "Authorizations" click karein

**Kya test karein:**
1. ✅ **Authorizations List** - Saare authorization requests dikhne chahiye
2. ✅ **Authorization Info** - Auth number, patient, insurance, service code
3. ✅ **Status Chips** - Color-coded status (requested, pending, approved, denied, expired)
4. ✅ **Expiration Date** - Agar expired hai to red color me dikhega
5. ✅ **Search** - Patient name ya auth number se search
6. ✅ **Status Filter** - Dropdown se status filter
7. ✅ **Date Range** - Start/end date filter
8. ✅ **Actions Menu** - 3 dots click karein:
   - View Details
   - Print Form
9. ✅ **Request Authorization Button** - Top right me "Request Authorization" button

### B. Create Authorization Page
**URL:** `http://localhost:5173/authorizations/new`  
**Access:** Authorizations list page se "Request Authorization" button click karein

**Kya test karein:**
1. ✅ **Patient Selection** - Autocomplete me patient search karein
   - Patient select karne par insurance auto-fill ho jayega (agar primary insurance hai)
2. ✅ **Insurance Company** - Dropdown se insurance company select karein
3. ✅ **Service Code (CPT)** - Text field me CPT code (e.g., 99213)
4. ✅ **Procedure Code** - Text field me procedure code (optional)
5. ✅ **Service Description** - Text area me description
6. ✅ **Requested Date** - Date picker se date select karein (required)
7. ✅ **Expected Service Date** - Date picker se future date (optional)
8. ✅ **Units** - Number field (default: 1)
9. ✅ **Notes** - Text area me additional notes
10. ✅ **Request Authorization Button** - Form submit karein

### C. View Authorization Page
**URL:** `http://localhost:5173/authorizations/{authorizationId}`  
**Access:** Authorizations list se kisi authorization par click karein

**Kya test karein:**
1. ✅ **Authorization Info** - Auth number, status, requested date, approved date (agar hai)
2. ✅ **Expiration Warning** - Agar expired hai to yellow alert dikhega
3. ✅ **Denial Alert** - Agar denied hai to red alert with reason
4. ✅ **Status Chip** - Top right me color-coded status
5. ✅ **Print Form Button** - Top right me "Print Form" button
   - Click karne par PDF download hoga
6. ✅ **Patient Information** - Patient name
7. ✅ **Service Information** - Service code, procedure code, description, units
8. ✅ **Insurance Information** - Insurance company name
9. ✅ **Notes** - Agar notes hain to dikhenge
10. ✅ **Status Timeline** - Right side me status history with timeline

---

## 🔍 Quick Test Checklist

### Claims Module
- [ ] Claims list page loads
- [ ] Search works
- [ ] Filters work (status, date range)
- [ ] View claim details
- [ ] Validate claim (draft status)
- [ ] Submit claim (after validation)
- [ ] View denied claims
- [ ] Resubmit denied claim
- [ ] View secondary claims

### ERA Module
- [ ] ERA list page loads
- [ ] Import ERA file (test with sample file)
- [ ] View ERA details
- [ ] View unmatched items
- [ ] Manual match unmatched item
- [ ] Auto-post payments

### Authorization Module
- [ ] Authorizations list page loads
- [ ] Create new authorization
- [ ] View authorization details
- [ ] Print authorization form (PDF download)
- [ ] Status timeline shows correctly

---

## 🚨 Common Issues & Solutions

### Issue 1: "Page not found" error
**Solution:** Check karein ke aap Admin ya Billing role se login hain

### Issue 2: Sidebar me menu items nahi dikh rahe
**Solution:** 
1. Browser refresh karein (Ctrl+R / Cmd+R)
2. Logout/login karein
3. Check karein ke aapke role me Admin/Billing/Front Desk hai

### Issue 3: Validation errors
**Solution:** 
- Claim validation me errors dikhenge - unhe fix karein
- Required fields fill karein

### Issue 4: No data showing
**Solution:**
- Backend API check karein
- Network tab me API calls verify karein
- Console me errors check karein

---

## 📝 Notes

1. **Role Requirements:**
   - Claims: Admin, Billing
   - ERA: Admin, Billing
   - Authorizations: Admin, Billing, Front Desk

2. **Test Data:**
   - Pehle invoices create karein (claims invoices se banenge)
   - Patients aur insurance companies pehle se honi chahiye

3. **File Upload:**
   - ERA files ke liye sample .835, .txt, ya .edi files use karein
   - Max file size: 10MB

---

**Happy Testing! 🎉**

Agar koi issue aaye to console errors check karein aur backend API verify karein.
