import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/entities/user.entity';

export interface JwtPayloadInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    try {
      const userDB: User = await this.usersService
        .getUserById(payload.sub)
        .catch((e) => {
          throw new InternalServerErrorException(
            'There was an error while validating a user',
            e,
          );
        });
      if (!userDB) {
        return false;
      }
      delete userDB.passwordHash;
      delete userDB.passwordSalt;
      const ret: JwtPayloadInterface = {
        id: payload.sub,
        email: payload.email,
        firstName: userDB.firstName,
        lastName: userDB.lastName,
        role: userDB.role,
      };
      return ret;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occurs while validating user',
        e,
      );
    }
  }
}
