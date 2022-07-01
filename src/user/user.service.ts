import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | any> {
    const { firstName, lastName, email, password, role } = createUserDto;
    const user = new User();
    let result;
    try {
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName ? lastName : null;
      const hashSalt = this.cryptoService.hashPassword(password);
      user.passwordHash = hashSalt.hash;
      user.passwordSalt = hashSalt.salt;
      if (role) {
        user.role = role;
      }
      result = await this.usersRepository.save(user);
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new HttpException(
          'Email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Somthing went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    delete result.passwordHash;
    delete result.passwordSalt;
    return result;
  }

  async findAll() {
    try {
      const users: any = await this.usersRepository.find();
      return users.map((user) => {
        delete user.passwordHash;
        delete user.passwordSalt;
        return user;
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const result: any = await this.usersRepository.findOneBy({ email });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getUserById(id: string): Promise<User | any> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      delete user.passwordHash;
      delete user.passwordSalt;
      return user;
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
      }
      await this.usersRepository.remove(user);
      return `This user is deleted successfully`;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
