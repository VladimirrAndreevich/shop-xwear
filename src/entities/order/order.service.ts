import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { E_OrderStatus } from "./order.enum";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOne(order: CreateOrderDto, userId: number) {
    const newOrder = {
      ...order,
      user: { id: userId },
      status: E_OrderStatus.created,
    };

    return await this.orderRepository.save(newOrder);
  }

  async getAllOrders(userId: number) {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: {
        cart: true,
      },
    });
  }
}
