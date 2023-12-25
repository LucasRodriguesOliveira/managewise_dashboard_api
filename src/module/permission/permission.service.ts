import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
    const canDelete = await this.canDelete(permissionId);

    if (!canDelete) {
      throw new ForbiddenException(
        'There are items which depends on this permission. Please change the dependency before excluding',
      );
    }

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

  /**
   * check if there is any dependency associated with the
   * this user type. Return an error if exists so the user know
   * it must update de dependency to point to another item instead of
   * the current one so it can be safely deleted without cascading
   * @param permissionId user type identification to check
   */
  private async canDelete(permissionId: number): Promise<boolean> {
    // returns a list of dependecies found
    const results = await Promise.all([
      this.prisma.userTypePermission.findFirst({ where: { permissionId } }),
    ]);

    // if the list contains a truthy result, it means it does contain a dependency
    // in other words: cannot delete
    return results.every((result) => !result?.id);
  }
}
