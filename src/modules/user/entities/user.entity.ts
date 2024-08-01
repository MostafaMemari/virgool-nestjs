import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { OtpEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  new_email: string | null;

  @Column({ nullable: true })
  verify_email: boolean;

  @Column({ type: 'varchar', nullable: true })
  new_phone: string | null;

  @Column({ nullable: true })
  verify_phone: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

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
}
