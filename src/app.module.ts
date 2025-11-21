import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { UserEntity } from './user/entity/user.entity';
import { RoleEntity } from './user/entity/role.entity';
import { RoleUserEntity } from './user/entity/role_user.entity';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { TopicModule } from './topic/topic.module';
import { LessonModule } from './lesson/lesson.module';

export const APP_DATA_SOURCE_OPTIONS: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [UserEntity, RoleEntity, RoleUserEntity],
  synchronize: true,
  migrations: [__dirname + '/user/entity/1716928800000-SeedRoles.ts'],
  migrationsTableName: 'migrations_seeders',
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...APP_DATA_SOURCE_OPTIONS,
      autoLoadEntities: true,
    }),
    UserModule,
    EmailModule,
    AuthModule,
    AdminModule,
    CourseModule,
    TopicModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
