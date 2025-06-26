import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from './database.config';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(databaseConfig.KEY)
    private configService: ConfigType<typeof databaseConfig>,
  ) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const config = this.configService;

    return {
      type: config.type, // type of our database
      host: config.host, // database host
      port: config.port, // database port
      username: config.username, // username
      password: config.password, // user password
      database: config.database, // name of our database,
      autoLoadEntities: true, // models will be loaded automatically
      synchronize: config.synchronize, // your entities will be synced with the database(recommended: disable in prod)
    };
  }
}
