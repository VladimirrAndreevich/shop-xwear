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
} from "@nestjs/common";

import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto) {
    await this.userService.createOne(body);
    return { status: "ok" };
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
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
