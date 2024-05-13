import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';

export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports =
      options.driver === 'orm'
        ? [
            TypeOrmModule.forRoot({
              type: options.type,
              host: process.env.DATABASE_HOST,
              port: +process.env.DATABASE_PORT,
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASS,
              autoLoadEntities: true,
              synchronize: false,
            }),
          ]
        : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
