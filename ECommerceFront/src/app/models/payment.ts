import { PaymentMethod } from "./paymentMethod";
import { User } from "./user";

export interface Payment {
  id: number,
  user: User,
  paymentMethod: PaymentMethod,
  totalAmount: number,
  shipingCharges: number,
  amountReduced: number,
  amountPaid: number,
  createdAt: string

}
