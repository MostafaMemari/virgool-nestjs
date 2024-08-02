import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
