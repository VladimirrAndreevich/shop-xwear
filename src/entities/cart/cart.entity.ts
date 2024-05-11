import { CartItem } from "@entities/cartItem/cartItem.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", type: "int", nullable: false })
  userId: number;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];

  // @Column({
  //   name: "total_amount",
  //   type: "decimal",
  //   nullable: false,
  // })
  // totalAmount: number;
}
