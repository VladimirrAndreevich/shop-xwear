import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { E_Type } from "./product.enum";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "description", type: "varchar" })
  description: string;

  @Column({ name: "price", type: "int" })
  price: number;

  @Column({ name: "price_discounted", type: "int" })
  priceDiscounted: number;

  @Column({ name: "image", type: "varchar" })
  image: string;

  @Column({ name: "type", type: "enum", enum: E_Type })
  type: E_Type;
}
