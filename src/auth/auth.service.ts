import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login.response';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser (username: string, password: string) {
    const user = await this.userService.findOne(username);
    const isValid = await bcrypt.compare(password, user.password);
    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login (loginInput: LoginInput): Promise<LoginResponse> {
    const user = await this.userService.findOne(loginInput.username);
    const { password, ...result } = user;
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        username: user.username,
      }),
      user: result,
    };
  }

  async signup (loginInput: LoginInput) {
    const user = await this.userService.findOne(loginInput.username);
    if (user) {
      throw new BadRequestException('User already exists.');
    }
    const password = await bcrypt.hash(loginInput.password, 10);
    return this.userService.create({
      ...loginInput,
      password
    });
  }
}
