import { CartItem } from "@entities/cartItem/cartItem.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "login", type: "varchar", nullable: true })
  login: string;

  @Column({ name: "email", type: "varchar", unique: true })
  email: string;

  @Column({ name: "password", type: "varchar" })
  password: string;

  @Column({ name: "name_first", type: "varchar", nullable: true })
  nameFirst: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user, {
    onDelete: "CASCADE",
  })
  cart: CartItem[];
}
