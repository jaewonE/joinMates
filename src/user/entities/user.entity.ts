import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ChatRoom } from 'src/chatRoom/entities/chatRoom.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity('User')
export class User extends CoreEntity {
  @CreateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String)
  @IsString()
  password: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  coverImg?: string;

  @ManyToMany(() => User, (user: User) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user: User) => user.followers)
  following: User[];

  @ManyToMany(() => ChatRoom, (chatRoom: ChatRoom) => chatRoom.users)
  @JoinTable()
  @Field(() => [ChatRoom])
  @IsArray()
  rooms: ChatRoom[];

  @ManyToOne(() => ChatRoom, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => ChatRoom, { nullable: true })
  @IsOptional()
  lastChatRoom?: ChatRoom;
}
