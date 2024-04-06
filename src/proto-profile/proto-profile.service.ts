import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProtoProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchProtoProfile(email: string) {
    return this.prisma.proto_Profile.findUnique({
      where: { email },
    });
  }
}
