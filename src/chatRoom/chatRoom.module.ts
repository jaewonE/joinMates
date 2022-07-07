import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomResolver } from './chatRoom.resolver';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoom } from './entities/chatRoom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom])],
  providers: [ChatRoomResolver, ChatRoomService],
  exports: [],
})
export class ChatRoomModule {}
