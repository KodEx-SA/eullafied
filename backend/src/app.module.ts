import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/env.validation';
import { getDatabaseConfig } from './config/database.config';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { UsersModule } from './modules/users/users.module';
<<<<<<< HEAD
import { TicketsModule } from './modules/tickets/tickets.module';
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03

@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL') ?? 60,
            limit: configService.get<number>('THROTTLE_LIMIT') ?? 10,
          },
        ],
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    RolesModule,
    DepartmentsModule,
    UsersModule,
<<<<<<< HEAD
    TicketsModule,
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
