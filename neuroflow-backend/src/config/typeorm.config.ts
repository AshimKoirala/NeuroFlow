import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const TypeOrmConfig: TypeOrmModuleOptions ={
      type: 'postgres',
      host: 'localhost',     // or Docker container IP if remote
      port: 5432,
      username: 'neurouser',
      password: 'neuro',
      database: 'neuroflow',
      autoLoadEntities: true,
      synchronize: true, // For dev only, auto creates tables
};

