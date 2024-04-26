import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "title", type: "varchar", nullable: true })
  title: string;

  @Column({ name: "description", type: "varchar", nullable: true })
  description: string;

  @Column({ name: "image", type: "varchar", nullable: true })
  image: string;
}
