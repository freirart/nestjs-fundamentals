import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { CommonModule } from './common/common.module';
import databaseConfig, { validationSchema } from './database/database.config';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { RecruitmentModule } from './recruitment/recruitment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema,
    }),
    DatabaseModule,
    CommonModule,
    CharactersModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      imports: [ConfigModule.forFeature(databaseConfig)],
    }),
    RecruitmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
