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
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { ProductService } from "./product.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { getMulterOptions, renameUploadedFile } from "@helpers/fileUploader";
import { PRODUCTS_IMAGES_FOLDER_PATH } from "@consts/storagePaths";
import { E_Type } from "./product.enum";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor("mainImage", getMulterOptions("images/products")),
  )
  async createProduct(
    @Body() body: any,
    @UploadedFile() mainImage: Express.Multer.File,
  ) {
    const renamedFilename = renameUploadedFile(
      mainImage.filename,
      PRODUCTS_IMAGES_FOLDER_PATH,
    );

    const newProduct = {
      ...body,
      price: +body.price,
      isFavorite: body.isFavorite === "true" ? true : false,
      mainImage: renamedFilename,
    };
    console.log(newProduct);

    await this.productService.createOne(newProduct);
    return { status: "ok" };
  }

  @Post("/test")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor("images", 5, getMulterOptions("images/products")),
  )
  async createProductTest(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const renamedFilenamesImages: string[] = [];
    images.map((item) => {
      const renamedFilename = renameUploadedFile(
        item.filename,
        PRODUCTS_IMAGES_FOLDER_PATH,
      );
      renamedFilenamesImages.push(renamedFilename);
    });

    const newProduct = {
      ...body,
      price: +body.price,
      isFavorite: body.isFavorite === "true" ? true : false,
      mainImage: renamedFilenamesImages[0],
      images: renamedFilenamesImages.slice(1),
    };
    console.log(renamedFilenamesImages);

    await this.productService.createOne(newProduct);
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
