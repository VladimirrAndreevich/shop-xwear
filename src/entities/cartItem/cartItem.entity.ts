import { Cart } from "@entities/cart/cart.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({
    name: "price",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({ name: "quantity", type: "int", nullable: false })
  quantity: number;

  @Column({ name: "size", type: "varchar", nullable: false })
  size: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;
}
