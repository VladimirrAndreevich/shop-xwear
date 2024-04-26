import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";

import { User } from "./user.entity";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
// import { UpdateUserDto } from "./dto/updateUser.dto";
// import { RegisterUserDto } from "./dto/registerUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
}
