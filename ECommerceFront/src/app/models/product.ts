import { Category } from "./category";
import { Offer } from "./offer";

export interface Product {
  productId: number,
  title: string,
  description: string,
  productCategory: Category,
  offer: Offer,
  price: number,
  quantity: number,
  imageName: string
}
