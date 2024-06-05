import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { Product } from "./product.entity";
import { E_Type } from "./product.enum";
import { FilterBodyReq } from "./types";

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

  async getAllByTypeAndFilter(
    type: E_Type,
    body: FilterBodyReq,
    skip: number | undefined,
    take: number | undefined,
  ): Promise<Product[]> {
    let additionalFilter: { price: FindOperator<number>; color?: string };
    if (body.max && body.min) {
      additionalFilter = {
        price: Between(body.min, body.max),
      };
    } else if (body.max) {
      additionalFilter = {
        price: LessThanOrEqual(body.max),
      };
    } else if (body.min) {
      additionalFilter = {
        price: MoreThanOrEqual(body.min),
      };
    }
    if (body.color) {
      additionalFilter = { ...additionalFilter, color: body.color };
    }

    return await this.productRepository.find({
      where: {
        type,
        ...additionalFilter,
      },
      skip,
      take,
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
