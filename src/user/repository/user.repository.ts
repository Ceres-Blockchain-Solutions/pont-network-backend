import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return (await this.userModel.create(createUserDto)).save();
  }

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (!users) {
      throw new NotFoundException(`Users not found`);
    }
    return users.map((ship) =>
      ship.toObject({
        transform(doc, ret) {
          delete ret.__v;
          delete ret._id;
          // delete ret.$__;
          // delete ret.$isNew;
        },
      }),
    );
  }
}
