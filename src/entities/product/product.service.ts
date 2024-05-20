import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { E_Type } from "./product.enum";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOne(productData: any) {
    const newProduct = this.productRepository.create({
      ...productData,
    });
    return await this.productRepository.save(newProduct);
  }

  async getAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: {
        id: "ASC",
      },
    });
  }

  async getAllFavorites(): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        isFavorite: true,
      },
    });
  }

  async getAllByType(type: E_Type): Promise<[Product[], number]> {
    return await this.productRepository.findAndCount({
      where: {
        type,
      },
    });
  }

  async getOneData(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async updateProductData(id: number, body: any) {
    return await this.productRepository.update({ id }, body);
  }

  async deleteProduct(id: number) {
    return await this.productRepository.delete(id);
  }
}
