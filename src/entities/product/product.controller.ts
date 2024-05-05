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
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { ProductService } from "./product.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { getMulterOptions, renameUploadedFile } from "@helpers/fileUploader";
import { PRODUCTS_IMAGES_FOLDER_PATH } from "@consts/storagePaths";
import { E_Type } from "./product.enum";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/")
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor("image", getMulterOptions("images/products")),
  )
  async createProduct(
    @Body() body: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const renamedFilename = renameUploadedFile(
      image.filename,
      PRODUCTS_IMAGES_FOLDER_PATH,
    );
    await this.productService.createOne({
      ...body,
      isFavorite: body.isFavorite === "true" ? true : false,
      image: renamedFilename,
    });
    return { status: "ok" };
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

  @Get("/favorites")
  @HttpCode(HttpStatus.OK)
  async getAllFavoritesProducts(@Res() res: Response) {
    const products = await this.productService.getAllFavorites();

    return res.send({
      status: "ok",
      data: products,
    });
  }

  @Get("/by-type?")
  @HttpCode(HttpStatus.OK)
  async getAllProductsByType(
    @Query("type") type: E_Type,
    @Res() res: Response,
  ) {
    const products = await this.productService.getAllByType(type);

    return res.send({
      status: "ok",
      data: {
        products: products[0],
        amount: products[1],
      },
    });
  }

  // @Get("/favorites")
  // @HttpCode(HttpStatus.OK)
  // async getAllProducts(@Res() res: Response) {
  //   const products = await this.productService.getAll();

  //   return res.send({
  //     status: "ok",
  //     data: products,
  //   });
  // }

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
