# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

---

## API Primary Key Reference

**ALWAYS derive the primary key from `src/Pages/Management/<Entity>/<Entity>.jsx` → `FIELD_META.primary` in the web codebase. Never guess or invent field names.**

Audited 2025-07 against `src/api/all.api.js` and each web screen's `FIELD_META`:

| Entity | Correct primary key | Web `FIELD_META` / `idKey` | Notes |
|---|---|---|---|
| Booking | `id` | `primary: "id"` (no `idKey` in `bookingCruds` → defaults to `"id"`) | Mobile was wrongly using `bookingId` — **FIXED** |
| Expense | `expenseId` | `primary: "expenseId"`, `idKey: "expenseId"` | OK |
| Enquiry | `enquiryId` | `primary: "enquiryId"`, `idKey: "enquiryId"` | OK |
| Client | `clientId` | `primary: "clientId"`, `idKey: "clientId"` | OK |
| Payment | `id` | `primary: "id"` (no `idKey` → defaults to `"id"`) | Mobile uses `paymentId ?? id` fallback — OK |
| Generic Template | `id` | `primary: "id"` (no `idKey` → defaults to `"id"`) | Mobile was wrongly using `templateId` — **FIXED** |
| Student | `studentId` | `idKey: "studentId"` | OK |
| Instructor | `instructorId` | `idKey: "instructorId"` | OK |
| Activity | `activityId` | (inferred from route) | OK |
| Student Activity | `assignmentId` | `idKey: "assignmentId"` | OK |
| Instructor Activity | `assignmentId` | `idKey: "assignmentId"` | OK |
| Branch | `branchId` | `idKey: "branchId"` | OK |

**Root/branch param:** every `getAll` endpoint takes the branch ID as a path segment (`/route/getAll/{branchId}`), **not** a query param, unless noted otherwise.

---

## API Endpoints — Verified Against Web

| Screen | Fetch | Add | Update | Delete |
|---|---|---|---|---|
| Bookings | `GET /booking/getAll/{branchId}` | `POST /booking/add` | `PUT /booking/update/{id}` | `DELETE /booking/delete/{id}` |
| Expenses | `GET /expenses/getAll/{branchId}` | `POST /expenses/add` | `PUT /expenses/update/{expenseId}` | `DELETE /expenses/delete/{expenseId}` |
| Payments | `GET /payments/getAll/{branchId}` | `POST /payments/add` | `PUT /payments/update/{id}` | `DELETE /payments/delete/{id}` |
| Enquiry | `GET /enquiries/getAll/{branchId}` | `POST /enquiries/add` | `PUT /enquiries/update/{enquiryId}` | `DELETE /enquiries/delete/{enquiryId}` |
| Clients | `GET /clients/getAll/{branchId}` | `POST /clients/add` | `PUT /clients/update/{clientId}` | `DELETE /clients/delete/{clientId}` |
| Templates | `GET /genericTemplate/getAll/{studioId}` | `POST /genericTemplate/add` | `PUT /genericTemplate/update/{id}` | `DELETE /genericTemplate/delete/{id}` |
| Students | `GET /students/getAll/{branchId}` | `POST /students/add` | `PUT /students/update/{studentId}` | `DELETE /students/delete/{studentId}` |
| Instructors | `GET /instructors/getAll/{branchId}` | `POST /instructors/add` | `PUT /instructors/update/{instructorId}` | `DELETE /instructors/delete/{instructorId}` |
| Activities | `GET /activities/getAll/{branchId}` | `POST /activities/add` | `PUT /activities/update/{activityId}` | `DELETE /activities/delete/{activityId}` |
| Student Activities | `GET /studentActivities/getAll/{studentId}` | `POST /studentActivities/add` | `PUT /studentActivities/update/{assignmentId}` | `DELETE /studentActivities/delete/{assignmentId}` |
