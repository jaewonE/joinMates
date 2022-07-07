import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';
import { ChatRoom } from 'src/chatRoom/entities/chatRoom.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum ChatType {
  String = 'String',
}
registerEnumType(ChatType, { name: 'ChatType' });

@InputType('ChatInputType', { isAbstract: true })
@ObjectType()
@Entity('Chat')
export class Chat extends CoreEntity {
  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Column({ type: 'enum', enum: ChatType, default: ChatType.String })
  @Field(() => ChatType)
  @IsEnum(ChatType)
  status: ChatType;

  @Column()
  @Field(() => String)
  @IsDefined()
  content: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @Field(() => User, { nullable: true })
  @IsOptional()
  sender?: User;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @Field(() => ChatRoom)
  @IsDefined()
  room: ChatRoom;
}
