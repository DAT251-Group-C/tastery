import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../common/config/app-conf';
import entities from '../models';
import { GatewayModule } from './gateway/gateway.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    HealthModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    GatewayModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ConfigType<typeof appConfig>>('appConfig');

        if (!config) {
          throw new Error('Config not found');
        }

        return {
          type: 'postgres',
          host: config.database.host,
          port: config.database.port,
          username: config.database.user,
          password: config.database.password,
          database: config.database.database,
          entities: entities,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
