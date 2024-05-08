import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';

export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports =
      options.driver === 'orm'
        ? [
            TypeOrmModule.forRoot({
              type: 'postgres',
              host: process.env.POSTGRES_HOST,
              port: +process.env.POSTGRES_PORT,
              username: process.env.POSTGRES_USERNAME,
              password: process.env.POSTGRES_PASS,
              autoLoadEntities: true,
              synchronize: true,
            }),
          ]
        : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
