import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateCommentDto } from '../dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { IsNull, Repository } from 'typeorm';
import { BlogCommentEntity } from '../entities/comment.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { BadRequestMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogCommentEntity) private blogCommentRepository: Repository<BlogCommentEntity>,
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,

    @Inject(REQUEST) private request: Request,

    @Inject(forwardRef(() => BlogService)) private blogService: BlogService,
  ) {}

  async create(commentDto: CreateCommentDto) {
    const { parentId, text, blogId } = commentDto;
    const { id: userId } = this.request.user;
    await this.blogService.checkExistBlogById(blogId);

    let parent: BlogCommentEntity | null = null;
    if (parentId && !isNaN(parentId)) parent = await this.blogCommentRepository.findOneBy({ id: +parentId });

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

  async find(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {},
      relations: {
        blog: true,
        user: { profile: true },
      },
      select: {
        blog: {
          title: true,
        },
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      comments,
    };
  }

  async findCommentsOfBlog(blogId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {
        blogId,
        parentId: IsNull(),
      },
      relations: {
        user: { profile: true },
        children: {
          user: { profile: true },
          children: {
            user: { profile: true },
          },
        },
      },
      select: {
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
        children: {
          text: true,
          created_at: true,
          parentId: true,
          user: {
            username: true,
            profile: {
              nick_name: true,
            },
          },
          children: {
            text: true,
            created_at: true,
            parentId: true,
            user: {
              username: true,
              profile: {
                nick_name: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    // const [comments, count] = await this.blogCommentRepository
    //   .createQueryBuilder('comments')
    //   .leftJoinAndSelect('comments.blog', 'blog')
    //   .leftJoinAndSelect('comments.user', 'user')
    //   .leftJoinAndSelect('user.profile', 'profile')
    //   .leftJoinAndSelect('comments.children', 'child1', 'child1.accepted = :accepted', { accepted: true })
    //   .leftJoinAndSelect('child1.user', 'child1User')
    //   .leftJoinAndSelect('child1User.profile', 'child1UserProfile')
    //   .leftJoinAndSelect('child1.children', 'child2', 'child2.accepted = :accepted', { accepted: true })
    //   .leftJoinAndSelect('child2.user', 'child2User')
    //   .leftJoinAndSelect('child2User.profile', 'child2UserProfile')
    //   .where('comments.blogId = :blogId AND comments.accepted = :accepted ', { blogId, accepted: true })
    //   .andWhere('comments.parent IS NULL')
    //   .select([
    //     'comments',
    //     'blog.id',
    //     'blog.title',
    //     'user.username',
    //     'profile.nick_name',
    //     'profile.image_profile',
    //     'child1.text',
    // 'child1.created_at',
    //     'child1.id',
    //     'child1.accepted',
    //     'child1User.username',
    //     'child1UserProfile.nick_name',
    //     'child1UserProfile.image_profile',
    //     'child2.text',
    // 'child2.created_at',
    //     'child2.id',
    //     'child2.accepted',
    //     'child2User.username',
    //     'child2UserProfile.nick_name',
    //     'child2UserProfile.image_profile',
    //   ])
    //   .orderBy('comments.id', 'DESC')
    //   .skip(skip)
    //   .take(limit)
    //   .getManyAndCount();
    return {
      pagination: paginationGenerator(count, page, limit),
      comments,
    };
  }

  async accept(id: number) {
    const comment = await this.checkExistById(id);
    if (comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyAccepted);
    comment.accepted = true;
    await this.blogCommentRepository.save(comment);
    return {
      message: PublicMessage.Updated,
    };
  }
  async reject(id: number) {
    const comment = await this.checkExistById(id);
    if (!comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyRejected);
    comment.accepted = false;
    await this.blogCommentRepository.save(comment);
    return {
      message: PublicMessage.Updated,
    };
  }

  async checkExistById(id: number) {
    const comment = await this.blogCommentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException(NotFoundMessage.NotFound);
    return comment;
  }
}
