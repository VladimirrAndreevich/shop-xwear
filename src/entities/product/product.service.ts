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

  // Create new product
  public async createOne(productData: any) {
    const newProduct = this.productRepository.create({
      ...productData,
    });
    return await this.productRepository.save(newProduct);
  }

  public async getAll() {
    return await this.productRepository.find();
  }
}
