import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";

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
    return await this.productRepository.find();
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
