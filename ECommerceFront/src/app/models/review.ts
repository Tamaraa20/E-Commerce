import { Product } from "./product";
import { User } from "./user";

export interface Review {
  id: number,
  user: User,
  product: Product,
  value: string,
  createdAt: string
}
