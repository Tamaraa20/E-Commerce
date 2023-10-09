import { CartItem } from "./cartItem";
import { User } from "./user";

export interface Cart {
  id: number,
  user: User,
  cartItems: CartItem[],
  ordered: boolean,
  orderedOn: string
}
