import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoggerInterceptor } from '../../interceptor/logger.interceptor';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionGroupResponse } from './dto/create-permission-group.response';
import { ListPermissionGroupResponse } from './dto/list-permission-group.response';
import { QueryPermissionGroupDto } from './dto/query-permission-group.dto';
import { PermissionGroupService } from './permission-group.service';

@Controller('permission-group')
@ApiTags('permission-group')
@UseInterceptors(new LoggerInterceptor(PermissionGroupController.name))
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOkResponse({
    type: [ListPermissionGroupResponse],
  })
  public async list(
    @Query(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        transform: true,
      }),
    )
    queryPermissionGroupDto: QueryPermissionGroupDto,
  ): Promise<ListPermissionGroupResponse[]> {
    return this.permissionGroupService.list(queryPermissionGroupDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiCreatedResponse({
    type: CreatePermissionGroupResponse,
  })
  public async create(
    @Body(ValidationPipe) createPermissionGroupDto: CreatePermissionGroupDto,
  ): Promise<CreatePermissionGroupResponse> {
    return this.permissionGroupService.create(createPermissionGroupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':groupId')
  @ApiOkResponse({
    type: Boolean,
  })
  public async delete(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<boolean> {
    return this.permissionGroupService.delete(groupId);
  }
}
