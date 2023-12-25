import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionGroupResponse } from './dto/create-permission-group.response';
import { ListPermissionGroupResponse } from './dto/list-permission-group.response';
import { QueryPermissionGroupDto } from './dto/query-permission-group.dto';

@Injectable()
export class PermissionGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    query: QueryPermissionGroupDto,
  ): Promise<ListPermissionGroupResponse[]> {
    const groups = await this.prisma.userTypePermission.findMany({
      ...(query?.userTypeId ? { where: { userTypeId: query.userTypeId } } : {}),
      include: {
        permission: true,
        userType: true,
      },
    });

    return groups.map((group) => ListPermissionGroupResponse.from(group));
  }

  async create({
    permissionId,
    userTypeId,
  }: CreatePermissionGroupDto): Promise<CreatePermissionGroupResponse> {
    return this.prisma.userTypePermission.create({
      data: {
        userTypeId,
        permissionId,
      },
    });
  }

  async delete(groupId: number): Promise<boolean> {
    const { id } = await this.prisma.userTypePermission.delete({
      where: {
        id: groupId,
      },
    });

    return !!id;
  }
}
