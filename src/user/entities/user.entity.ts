import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  EDITOR = 'editor',
  AUTHOR = 'author',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ length: 512 })
  @Exclude()
  passwordHash: string;

  @Column({ length: 64 })
  @Exclude()
  passwordSalt: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AUTHOR,
  })
  role: UserRole;
}
