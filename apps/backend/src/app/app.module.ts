import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../common/config/app-conf';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import entities from '../entities';
import { HealthModule } from './health/health.module';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    HealthModule,
    UserModule,
    RecipeModule,
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
  providers: [ConfigService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
