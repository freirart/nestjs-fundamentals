import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(`${process.env.DB_PORT}`, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'pass123',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
}));

/*
@Module({
  imports: [ConfigModule.forFeature(databaseConfig)], // 👈
})

// ...

constructor(
  @Inject(databaseConfig.KEY)
  private databaseConfiguration: ConfigType<typeof databaseConfig>,
) {
  // Now strongly typed, and able to access properties via:
  console.log(databaseConfiguration.host);
}
*/
