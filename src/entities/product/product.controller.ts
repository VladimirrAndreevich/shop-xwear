import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create product
  @Post("/")
  async createProduct(@Req() req: Request, @Res() res: Response) {
    await this.productService.createOne(req.body);

    return res.send({
      status: "ok",
    });
  }

  // Get all products
  @Get("/")
  async getAllProducts(@Res() res: Response) {
    const products = await this.productService.getAll();

    return res.send({
      status: "ok",
      products,
    });
  }
}
