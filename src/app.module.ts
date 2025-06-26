import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import databaseConfig, { validationSchema } from './database/database.config';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      validationSchema,
    }),
    DatabaseModule,
    CharactersModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      imports: [ConfigModule.forFeature(databaseConfig)],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
