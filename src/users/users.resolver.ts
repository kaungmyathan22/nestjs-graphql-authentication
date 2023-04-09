import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll () {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne (@Args('username') username: string) {
    return this.usersService.findOne(username);
  }

}
