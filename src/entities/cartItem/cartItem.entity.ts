import { Product } from "@entities/product/product.entity";
import { User } from "@entities/user/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  // @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "title", type: "varchar", nullable: false })
  title: string;

  @Column({
    name: "price",
    type: "decimal",
    precision: 10,
    scale: 3,
    nullable: false,
  })
  price: number;

  @Column({ name: "quantity", type: "int", nullable: false })
  quantity: number;

  @Column({ name: "size", type: "varchar", nullable: false })
  size: string;

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "user_id" })
  user: User;
}
