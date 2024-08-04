import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateCommentDto } from '../dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import { BlogCommentEntity } from '../entities/comment.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { PublicMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogCommentEntity)
    private blogCommentRepository: Repository<BlogCommentEntity>,

    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
    private blogService: BlogService,
  ) {}

  async create(commentDto: CreateCommentDto) {
    const { parentId, text, blogId } = commentDto;
    const { id: userId } = this.request.user;
    await this.blogService.checkExistBlogById(blogId);

    let parent: BlogCommentEntity | null = null;
    if (parentId && !isNaN(parentId))
      parent = await this.blogCommentRepository.findOneBy({ id: +parentId });

    await this.blogCommentRepository.insert({
      text,
      accepted: true,
      blogId,
      parentId: parent ? parentId : null,
      userId,
    });

    return {
      message: PublicMessage.CreatedComment,
    };
  }
}
