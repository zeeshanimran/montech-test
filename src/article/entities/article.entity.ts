import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ArticleStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ length: 1024 })
  data: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: ArticleStatus;
}
