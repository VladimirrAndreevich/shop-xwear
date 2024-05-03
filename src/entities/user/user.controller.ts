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
} from "@nestjs/common";

import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { compare } from "bcrypt";
import { ForbiddenException } from "@helpers/exceptions";
import { JwtService } from "@services/jwt/jwt.service";
import { JwtAuthGuard } from "@services/jwt/jwt-auth.guard";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto) {
    await this.userService.createOne(body);
    return { status: "ok", data: null };
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

    const jwt = await this.jwtService.setSession({
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
