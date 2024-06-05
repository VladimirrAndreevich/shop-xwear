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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { ProductService } from "./product.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { getMulterOptions, renameUploadedFile } from "@helpers/fileUploader";
import { PRODUCTS_IMAGES_FOLDER_PATH } from "@consts/storagePaths";
import { E_Type } from "./product.enum";
import { RoleGuard } from "@guards/role.guard";
import { E_Role } from "@entities/role/role.enum";
import { FilterBodyReq } from "./types";

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
    // console.log(newProduct);

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
    // console.log(renamedFilenamesImages);

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

  @Post("/by-type?")
  @HttpCode(HttpStatus.OK)
  async getAllProductsByTypeFilter(
    @Query("type") type: E_Type,
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Res() res: Response,
    @Body() body: FilterBodyReq,
  ) {
    const products = await this.productService.getAllByTypeAndFilter(
      type,
      body,
      skip,
      take,
    );

    console.log(`skip: ${skip} take: ${take}`);

    return res.send({
      status: "ok",
      data: {
        products: products,
        amount: products.length,
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
  @UseGuards(RoleGuard(E_Role.SuperAdmin))
  async updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    this.productService.updateProductData(id, body);
    return { status: "ok" };
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard(E_Role.SuperAdmin))
  async deleteProduct(@Param("id", ParseIntPipe) id: number) {
    this.productService.deleteProduct(id);
    return { status: "ok" };
  }
}
