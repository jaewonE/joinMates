import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@InputType('ChatRoomInputType', { isAbstract: true })
@ObjectType()
@Entity('ChatRoom')
export class ChatRoom extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column()
  @Field(() => Int)
  @IsInt()
  createrId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  coverImg?: string;

  @ManyToMany(() => User, (user: User) => user.rooms)
  @Field(() => [User])
  @IsArray()
  users: User[];

  @OneToMany(() => Chat, (chat: Chat) => chat.room)
  @Field(() => [Chat])
  @IsArray()
  chat: Chat[];
}
