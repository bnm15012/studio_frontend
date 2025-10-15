import { createCrud } from "./create_crud";

export const clientCruds = createCrud({ route: "clients", idKey: "clientId" });

export const expenseCruds = createCrud({ route: "expenses", idKey: "expenseId" });

export const enquiryCruds = createCrud({ route: "enquiries", idKey: "enquiryId" });

export const paymentCruds = createCrud({ route: "payments", idKey: "paymentId" });

export const genericTemplateCruds = createCrud({ route: "genericTemplate" });
