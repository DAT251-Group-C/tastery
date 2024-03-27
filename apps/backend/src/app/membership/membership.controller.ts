import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MembershipService } from './membership.service';

@ApiTags('Memberships')
@Controller('memberships')
@UseInterceptors(ClassSerializerInterceptor)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}
}
