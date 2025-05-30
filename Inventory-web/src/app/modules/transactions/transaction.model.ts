import { Product } from "../products/product.model";

export interface Transaction {
    transactionID: number;
    date: Date;
    transactionType: string;
    productID: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    details?: string;
    product?: Product;
}
