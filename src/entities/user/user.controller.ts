import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpException,
} from "@nestjs/common";

import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { compare } from "bcrypt";
import { ForbiddenException } from "@helpers/exceptions";
import { AuthService } from "@services/auth/auth.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CartItemService } from "@entities/cartItem/cartItem.service";
import { ProductService } from "@entities/product/product.service";
import { CreateCartItemDto } from "@entities/cartItem/dto/createCartItem.dto";
import { RemoveCartItemDto } from "@entities/cartItem/dto/removeCartItem.dto";
import { RedisService } from "@services/redis/redis.service";
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly redis: RedisService,
  ) {}

  @Get("/cart")
  @UseGuards(JwtAuthGuard)
  async getUserCart(@Req() req) {
    const userId = (await this.getUserIdByToken(req)).userId;

    const userCart = await this.cartItemService.getAllCartItems(userId);
    const total = userCart?.reduce((accumulator, currentValue) => {
      return +accumulator + +currentValue.quantity;
    }, 0);
    return {
      status: "ok",
      cart: userCart,
      total,
    };
  }

  @Post("/cart/add")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Req() req,
    @Body()
    body: {
      productId: number;
      createCartItemData: CreateCartItemDto;
    },
  ) {
    const userId = (await this.getUserIdByToken(req)).userId;

    const { createCartItemData, productId } = body;
    await this.cartItemService.createOne(
      { size: createCartItemData.size },
      userId,
      productId,
    );

    return {
      status: "ok",
    };
  }

  @Post("/cart/remove")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async removeToCart(
    @Req() req,
    @Body()
    body: {
      productId: number;
      removeCartItemData: RemoveCartItemDto;
    },
  ) {
    const userId = (await this.getUserIdByToken(req)).userId;

    const { removeCartItemData, productId } = body;
    await this.cartItemService.removeOne(
      { size: removeCartItemData.size },
      userId,
      productId,
    );

    return {
      status: "ok",
    };
  }

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto) {
    const user = await this.userService.createOne(body);

    const jwt = await this.authService.setSession({
      userId: user.id,
    });

    return {
      status: "ok",
      data: {
        accessToken: jwt,
      },
    };
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserDto) {
    const { loginOrEmail, password } = body;

    const foundUser =
      await this.userService.getUserByLoginOrEmail(loginOrEmail);

    if (!foundUser) throw new ForbiddenException();

    const isPasswordMatch = await compare(
      password.toString(),
      foundUser.password,
    );

    if (!isPasswordMatch) throw new ForbiddenException();

    const jwt = await this.authService.setSession({
      userId: foundUser.id,
    });

    return { status: "ok", data: { accessToken: jwt } };
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    const users = await this.userService.getAll();
    return { status: "ok", data: users };
  }

  async getUserIdByToken(req: any) {
    const token = req.headers.authorization || "";
    if (!token.startsWith("Bearer ")) {
      throw new HttpException(
        "Invalid or missing token",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const jwtToken = token.split("Bearer ")[1];

    return await this.redis.get(jwtToken);
  }

  @Get("/check-auth")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  async checkAuth() {
    return { status: "ok" };
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param("id", ParseIntPipe) id: number) {
    const userData = await this.userService.getOneById(id);
    return { status: "ok", data: userData };
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param("id", ParseIntPipe) id: number) {
    this.userService.deleteOne(id);
    return { status: "ok" };
  }

  @Put("/:id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    this.userService.updateOneData(id, body);

    return {
      status: "ok",
    };
  }
}
