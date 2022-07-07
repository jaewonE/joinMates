import { Query, Resolver } from '@nestjs/graphql';
import { CommonService } from './common.service';

@Resolver()
export class CommonResolver {
  constructor(private readonly commonService: CommonService) {}

  @Query(() => String)
  hello() {
    return this.commonService.hello();
  }
}
