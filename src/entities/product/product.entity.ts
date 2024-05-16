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

  @Column({ name: "price", type: "decimal" })
  price: number;

  @Column({
    name: "price_discounted",
    type: "decimal",
    nullable: true,
  })
  priceDiscounted: number;

  @Column({ name: "main_image", type: "varchar" })
  mainImage: string;

  @Column({ name: "images", type: "varchar", array: true, nullable: true })
  images: string[];

  @Column({ name: "type", type: "enum", enum: E_Type })
  type: E_Type;

  @Column({ name: "is_favorite", default: false })
  isFavorite: boolean;
}
