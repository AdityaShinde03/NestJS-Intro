import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';

@Module({
  imports:[forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService, HashingProvider, BcryptProvider],
  exports:[AuthService]
})
export class AuthModule {}
