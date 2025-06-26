import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource, type DataSourceOptions } from 'typeorm';
import databaseConfig from './database.config';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  exports: [DatabaseService],
  providers: [DatabaseService],
})
export class DatabaseModule {
  static register(options: DataSourceOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DatabaseModule,
          useFactory: () => {
            return new DataSource(options).initialize();
          },
        },
      ],
    };
  }
}
