import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";

import { User } from "./user.entity";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { CartItem } from "@entities/cartItem/cartItem.entity";
// import { UpdateUserDto } from "./dto/updateUser.dto";
// import { RegisterUserDto } from "./dto/registerUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  availableFields = ["nameFirst", "email", "login"];

  // Filter body's fields from available fields list
  private filterFields(body: { [k: string]: any }) {
    const filteredBody: { [k: string]: any } = {};

    Object.keys(body).filter((key) => {
      if (this.availableFields.includes(key)) {
        filteredBody[key] = body[key];
      }
    });

    return filteredBody;
  }

  async createOne(userData: RegisterUserDto) {
    const salt = await genSalt(10);

    const hashedPassword = await hash(userData.password, salt);

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      cart: [],
    });

    return await this.userRepository.save(newUser);
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async getOneById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: this.availableFields as any,
    });
  }

  async deleteOne(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateOneData(id: number, body: UpdateUserDto) {
    return await this.userRepository.update({ id }, this.filterFields(body));
  }

  async getUserByLoginOrEmail(loginOrEmail: string) {
    return await this.userRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async getUserCart(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        cart: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.cart;
  }

  // async addItemCart(userId: number, item: CartItem) {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });

  //   if (!user.cart) {
  //     user.cart = [];
  //   }

  //   user.cart.push(item);

  //   await this.cartItemRepository.create(item);
  //   console.log(user.cart);

  //   return await this.userRepository.create(user);
  // }

  // async addItemCart(userId: number, item: CartItem) {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });

  //   if (!user.cart) {
  //     user.cart = [];
  //   }

  //   user.cart.push(item);

  //   const newItem = await this.cartItemRepository.create(item);
  //   await this.cartItemRepository.save(newItem);

  //   return await this.userRepository.update({ id: userId }, { cart: user.car });
  // }
}
