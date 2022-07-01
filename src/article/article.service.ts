import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleStatus } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    try {
      const { title, data, isPublished } = createArticleDto;
      const article = new Article();
      article.title = title;
      article.data = data;
      article.isPublished = isPublished;
      const result = await this.articlesRepository.save(article);
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(user: User) {
    try {
      const articles = await this.articlesRepository.find();
      if (user.role === UserRole.EDITOR) {
        return articles.filter(
          (article) =>
            article.isPublished && article.status === ArticleStatus.PENDING,
        );
      }
      return articles;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    try {
      const article = await this.articlesRepository.findOneBy({ id });
      if (!article) {
        throw new HttpException('article not found', HttpStatus.BAD_REQUEST);
      }
      const { title, data, isPublished } = updateArticleDto;
      article.title = title;
      article.data = data;
      article.isPublished = isPublished;
      article.status = ArticleStatus.PENDING;
      const result = await this.articlesRepository.save(article);
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStatus(
    id: string,
    updateArticleStatusDto: UpdateArticleStatusDto,
  ) {
    try {
      const article = await this.articlesRepository.findOneBy({ id });
      if (!article) {
        throw new HttpException('article not found', HttpStatus.BAD_REQUEST);
      }
      const { status } = updateArticleStatusDto;
      article.status = status;
      const result = await this.articlesRepository.save(article);
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      const article = await this.articlesRepository.findOneBy({ id });
      if (!article) {
        throw new HttpException('article not found', HttpStatus.BAD_REQUEST);
      }
      await this.articlesRepository.remove(article);
      return `This article is deleted successfully`;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
