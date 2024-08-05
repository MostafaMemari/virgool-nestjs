import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';
import { OtpEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { BlogLikesEntity } from 'src/modules/blog/entities/like.entity';
import { BlogBookmarkEntity } from 'src/modules/blog/entities/bookmark.entity';
import { BlogCommentEntity } from 'src/modules/blog/entities/comment.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  new_email: string | null;
  @Column({ nullable: true })
  verify_email: boolean;

  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ type: 'varchar', nullable: true })
  new_phone: string | null;
  @Column({ nullable: true })
  verify_phone: boolean;

  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;

  @Column({ nullable: true })
  profileId: number;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @OneToMany(() => BlogLikesEntity, (like) => like.user)
  blog_likes: BlogLikesEntity[];

  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
  blog_bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => ImageEntity, (image) => image.user)
  images: ImageEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.user)
  blog_comments: BlogCommentEntity[];

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
