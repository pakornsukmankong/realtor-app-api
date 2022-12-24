import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './user/auth/auth.controller';
import { AuthService } from './user/auth/auth.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeController } from './home/home.controller';
import { HomeService } from './home/home.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [AppController, AuthController, HomeController],
  providers: [
    AppService,
    AuthService,
    HomeService,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
