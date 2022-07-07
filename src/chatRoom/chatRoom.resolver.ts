import { Resolver } from '@nestjs/graphql';
import { ChatRoomService } from './chatRoom.service';

@Resolver()
export class ChatRoomResolver {
  constructor(private readonly chatRoomService: ChatRoomService) {}
}
