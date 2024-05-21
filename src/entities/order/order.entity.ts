import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { E_OrderStatus } from "./order.enum";
import { CartItem } from "@entities/cartItem/cartItem.entity";
import { User } from "@entities/user/user.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_first", type: "varchar" })
  nameFirst: string;

  @Column({ name: "name_second", type: "varchar" })
  nameSecond: string;

  @Column({ name: "country", type: "varchar" })
  country: string;

  @Column({ name: "address", type: "varchar" })
  address: string;

  @Column({ name: "postal_code", type: "decimal" })
  postalCode: number;

  @Column({ name: "phone_number", type: "decimal" })
  phoneNumber: number;

  @Column({ name: "status", type: "enum", enum: E_OrderStatus })
  status: E_OrderStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order)
  cart: CartItem[];

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "user_id" })
  user: User;
}
