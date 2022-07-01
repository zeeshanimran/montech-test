import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../crypto/crypto.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async validateUser(email: string, password: string): Promise<any> {
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const user = await this.usersService.findOne(email).catch(() => {
      throw new UnauthorizedException();
    });
    if (!user) {
      return null;
    }
    const isMatch = this.cryptoService.validatePassword(password, {
      hash: user.passwordHash,
      salt: user.passwordSalt,
    });
    if (user && isMatch) {
      delete user.passwordHash;
      delete user.passwordSalt;
      return user;
    }
    return null;
  }

  async decodeTokenAndVerifyUser(token: string) {
    try {
      const user: any = await this.jwtService.decode(
        token.replace('Bearer ', ''),
      );
      if (user) {
        const { sub } = user;
        return await this.usersService.getUserById(sub);
      }
    } catch (e) {
      this.logger.error(
        `There was an error decoding and verifying user ${token}`,
        e,
      );
      throw e;
    }
    throw new BadRequestException(`There was an error decoding JWT ${token}`);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return { ...user, access_token: this.jwtService.sign(payload) };
  }
}
