import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CommonResolver } from './common.resolver';
import { CommonService } from './common.service';

export const PUB_SUB = 'PUB_SUB';
const pubsub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubsub,
    },
    CommonResolver,
    CommonService,
  ],
  exports: [PUB_SUB],
})
export class CommonModule {}
