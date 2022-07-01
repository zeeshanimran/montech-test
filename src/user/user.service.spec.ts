import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '../crypto/crypto.module';
import { User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';

const user = {
  firstName: 'Author',
  lastName: 'Employee',
  email: 'employeeunique@montech.com',
  role: UserRole.AUTHOR,
  password: '123456789',
};

let userId;

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'montech',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        forwardRef(() => CryptoModule),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create user', async () => {
    try {
      const result = await service.create(user);
      delete user.password;
      delete result.id;
      expect(result).toEqual(user);
    } catch (error) {
      expect(error.message).toBe('Email already exists.');
    }
  });

  it('should findAll users', async () => {
    const data = await service.findAll();
    const length = data.length ? true : false;
    expect(length).toEqual(true);
  });

  it('should find one user', async () => {
    const data = await service.findOne(user.email);
    delete data.passwordHash;
    delete data.passwordSalt;
    delete user.password;
    const { id, ...res } = data;
    userId = id;
    expect(res).toEqual(user);
  });

  it('should get user by id', async () => {
    const data = await service.getUserById(userId);
    delete data.passwordHash;
    delete data.passwordSalt;
    delete data.id;
    delete user.password;
    expect(data).toEqual(user);
  });

  it('should delete the user by id', async () => {
    const data = await service.remove(userId);
    expect(data).toBe(`This user is deleted successfully`);
  });
});
