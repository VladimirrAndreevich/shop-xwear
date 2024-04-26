import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/")
  @HttpCode(HttpStatus.OK)
  async createProduct(@Body() body: any, @Res() res: Response) {
    await this.productService.createOne(body);

    return res.send({
      status: "ok",
    });
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async getAllProducts(@Res() res: Response) {
    const products = await this.productService.getAll();

    return res.send({
      status: "ok",
      data: products,
    });
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param("id", ParseIntPipe) id: number) {
    const productData = await this.productService.getOneData(id);
    return { status: "ok", data: productData };
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    this.productService.updateProductData(id, body);
    return { status: "ok" };
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param("id", ParseIntPipe) id: number) {
    this.productService.deleteProduct(id);
    return { status: "ok" };
  }
}
