import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionResponse } from './dto/create-permission.response';
import { ListPermissionResponse } from './dto/list-permission.response';
import { QueryListPermissionDto } from './dto/query-list-permission.dto';
import { RemovePermissionResponse } from './dto/remove-permission.response';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission.response';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  public async create({
    description,
  }: CreatePermissionDto): Promise<CreatePermissionResponse> {
    const permission = await this.prisma.permission.create({
      data: { description },
    });

    return CreatePermissionResponse.from(permission);
  }

  public async list({
    description,
    includeExcluded,
  }: QueryListPermissionDto): Promise<ListPermissionResponse[]> {
    let deletedAt: Date;

    if (!includeExcluded) {
      deletedAt = null;
    }

    const permissions = await this.prisma.permission.findMany({
      where: {
        deletedAt,
        description,
      },
    });

    return ListPermissionResponse.from(permissions);
  }

  async update(
    permissionId: number,
    updateUseTypeDto: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    const isDeleted = await this.checkIsDeleted(permissionId);

    if (isDeleted) {
      throw new BadRequestException('Cannot update excluded Permission');
    }

    const permission = await this.prisma.permission.update({
      data: updateUseTypeDto,
      where: { id: permissionId },
    });

    return UpdatePermissionResponse.from(permission);
  }

  async remove(permissionId: number): Promise<RemovePermissionResponse> {
    const permission = await this.prisma.permission.update({
      where: { id: permissionId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return RemovePermissionResponse.from(permission);
  }

  private async checkIsDeleted(permissionId: number): Promise<boolean> {
    const permission = await this.prisma.permission.findFirstOrThrow({
      where: { id: permissionId },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    return !!permission.deletedAt;
  }
}
