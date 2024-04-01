import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MembershipRoleGuard } from '../../common/guards/membership-role/membership-role.guard';
import { MembershipRoles } from '../../common/guards/membership-role/membership-roles.decorator';
import { Credential } from '../../common/models';
import { MembershipRole } from '../../common/models/membership.model';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@ApiTags('Credentials')
@Controller('projects/:projectId/credentials')
@UseInterceptors(ClassSerializerInterceptor)
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Get()
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiBearerAuth()
  @ApiOkResponsePaginated(Credential)
  public getCredentials(@Param('projectId') projectId: string, @Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Credential>> {
    return lastValueFrom(
      this.credentialService.getCredentials(projectId, pageOptionsDto).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Post()
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiBody({ type: CreateCredentialDto })
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @ApiOkResponse({ type: Credential })
  public createCredential(@Param('projectId') projectId: string, @Body() body: CreateCredentialDto): Promise<Credential> {
    return lastValueFrom(
      this.credentialService.createCredential(projectId, body).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Patch(':credentialId')
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiParam({ name: 'credentialId', format: 'uuid' })
  @ApiBody({ type: UpdateCredentialDto })
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateCredential(@Param('credentialId') credentialId: string, @Body() body: UpdateCredentialDto): Promise<UpdateResult> {
    return lastValueFrom(
      this.credentialService.updateCredential(credentialId, body).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Delete(':credentialId')
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiParam({ name: 'credentialId', format: 'uuid' })
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteCredential(@Param('credentialId') credentialId: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.credentialService.deleteCredential(credentialId).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
