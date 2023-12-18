import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerInterceptor } from '../../interceptor/logger.interceptor';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionResponse } from './dto/create-permission.response';
import { ListPermissionResponse } from './dto/list-permission.response';
import { QueryListPermissionDto } from './dto/query-list-permission.dto';
import { RemovePermissionResponse } from './dto/remove-permission.response';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission.response';
import { PermissionService } from './permission.service';

@Controller('permission')
@ApiTags('permission')
@UseInterceptors(new LoggerInterceptor(PermissionController.name))
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreatePermissionResponse,
  })
  @ApiBody({
    type: CreatePermissionDto,
  })
  public async create(
    @Body(ValidationPipe) createPermissionDto: CreatePermissionDto,
  ): Promise<CreatePermissionDto> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ListPermissionResponse,
  })
  public async list(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queryListPermissionDto: QueryListPermissionDto,
  ): Promise<ListPermissionResponse[]> {
    return this.permissionService.list(queryListPermissionDto);
  }

  @Patch(':permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdatePermissionResponse,
  })
  @ApiBadRequestResponse({
    description: 'Cannot update excluded Permission',
  })
  @ApiNotFoundResponse({
    description: 'No Permission found',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred!',
  })
  @ApiBody({
    type: UpdatePermissionDto,
  })
  public async update(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    let permission: UpdatePermissionResponse;

    try {
      permission = await this.permissionService.update(
        permissionId,
        updatePermissionDto,
      );
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(err.message);
      }

      throw new InternalServerErrorException('An unexpected error occurred!');
    }

    return permission;
  }

  @Delete(':permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RemovePermissionResponse,
  })
  public async remove(
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<RemovePermissionResponse> {
    return this.permissionService.remove(permissionId);
  }
}
