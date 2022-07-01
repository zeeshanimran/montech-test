import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ArticleController } from './article.controller';
import { ArticleModule } from './article.module';
import { ArticleService } from './article.service';
import { Article, ArticleStatus } from './entities/article.entity';
import { UserModule } from '../user/user.module';

const createArticleDto = {
  title: 'Current political situation',
  data: 'A significant disadvantage of soft deletes is that we always need to keep them in mind when performing various queries. If we use Object-Relational Mapping such as TypeORM, it makes our work a bit easier. However, we still need to be aware of the additional effort PostgreSQL needs to make to filter out records where is_deleted equals true.\n    Even if we expect is_deleted to be false in most of our queries, this might not always be the case. A significant advantage of the soft deletes is the fact that we can still fetch the deleted records. This might come in handy when we want to generate some report, for example. Thanks to soft deletes, we can include all of the records.',
  isPublished: true,
};

const updatedArticleDto = {
  title: 'Update Current political situation',
  data: 'A significant disadvantage of soft deletes is that we always need to keep them in mind when performing various queries. If we use Object-Relational Mapping such as TypeORM, it makes our work a bit easier. However, we still need to be aware of the additional effort PostgreSQL needs to make to filter out records where is_deleted equals true.\n    Even if we expect is_deleted to be false in most of our queries, this might not always be the case. A significant advantage of the soft deletes is the fact that we can still fetch the deleted records. This might come in handy when we want to generate some report, for example. Thanks to soft deletes, we can include all of the records.',
  isPublished: true,
};
let createdArticleId, updatedArticle;

const mockedArticle: Article = {
  title: 'Current political situation',
  data: 'A significant disadvantage of soft deletes is that we always need to keep them in mind when performing various queries. If we use Object-Relational Mapping such as TypeORM, it makes our work a bit easier. However, we still need to be aware of the additional effort PostgreSQL needs to make to filter out records where is_deleted equals true.\n    Even if we expect is_deleted to be false in most of our queries, this might not always be the case. A significant advantage of the soft deletes is the fact that we can still fetch the deleted records. This might come in handy when we want to generate some report, for example. Thanks to soft deletes, we can include all of the records.',
  isPublished: true,
  id: '012a8014-1f8b-42b9-ba3a-1285b807b8f9',
  status: ArticleStatus.PENDING,
};

const user: User | any = {
  id: '1fa44317-0fb1-46de-b187-4347af31d110',
  email: 'employee@montech.com',
  firstName: 'Employee',
  lastName: null,
  role: 'author',
};

describe('ArticleService', () => {
  let service: ArticleService;
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
        ArticleModule,
        UserModule,
        TypeOrmModule.forFeature([Article]),
      ],
      controllers: [ArticleController],
      providers: [ArticleService],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should create article', async () => {
    const data = await service.create(createArticleDto);
    createdArticleId = data.id;
    data.id = mockedArticle.id;
    expect(data).toEqual(mockedArticle);
  });

  it('should findAll article', async () => {
    const data = await service.findAll(user);
    const length = data.length ? true : false;
    expect(length).toEqual(true);
  });

  it('should update article', async () => {
    const data = await service.update(createdArticleId, updatedArticleDto);
    updatedArticle = {
      ...updatedArticleDto,
      id: createdArticleId,
      status: 'pending',
    };
    expect(data).toEqual(updatedArticle);
  });

  it('should updateStatus article', async () => {
    updatedArticle = { ...updatedArticle, status: 'approved' };
    const data = await service.updateStatus(createdArticleId, updatedArticle);
    expect(data).toEqual(updatedArticle);
  });

  it('should delete article', async () => {
    const data = await service.remove(createdArticleId);
    expect(data).toBe('This article is deleted successfully');
  });
});
