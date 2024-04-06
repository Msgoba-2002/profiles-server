import { Controller, Get, Query } from '@nestjs/common';
import { ProtoProfileService } from './proto-profile.service';

@Controller('protoprofile')
export class ProtoProfileController {
  constructor(private readonly protoProfileService: ProtoProfileService) {}

  @Get()
  async getProtoProfile(@Query() query: { email: string }) {
    const { email } = query;
    return this.protoProfileService.fetchProtoProfile(email);
  }
}
