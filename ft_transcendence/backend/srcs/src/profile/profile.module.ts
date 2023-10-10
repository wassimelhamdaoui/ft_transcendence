import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { HistoryModule } from './history/history.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UserModule, FriendModule, HistoryModule],
})
export class ProfileModule {}
