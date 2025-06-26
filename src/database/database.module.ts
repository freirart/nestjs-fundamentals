import { type DynamicModule, Module } from '@nestjs/common';
import { DataSource, type DataSourceOptions } from 'typeorm';

@Module({})
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
