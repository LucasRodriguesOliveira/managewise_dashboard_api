import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { CreateUserTypeResponse } from './dto/create-user-type.response';
import { ListUserTypeResponse } from './dto/list-user-type.response';
import { QueryUserTypeDto } from './dto/query-user-type.dto';
import { RemoveUserTypeResponse } from './dto/remove-user-type.response';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UpdateUserTypeResponse } from './dto/update-user-type.response';

@Injectable()
export class UserTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    description,
  }: CreateUserTypeDto): Promise<CreateUserTypeResponse> {
    const userType = await this.prisma.userType.create({
      data: { description },
    });

    return CreateUserTypeResponse.from(userType);
  }

  async list({
    description,
    includeDeleted,
  }: QueryUserTypeDto): Promise<ListUserTypeResponse[]> {
    let deletedAt: Date;

    if (!includeDeleted) {
      deletedAt = null;
    }

    const userTypes = await this.prisma.userType.findMany({
      where: { description, deletedAt },
    });

    return ListUserTypeResponse.from(userTypes);
  }

  async update(
    userTypeId: number,
    updateUseTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponse> {
    const isDeleted = await this.checkIsDeleted(userTypeId);

    if (isDeleted) {
      throw new BadRequestException('Cannot update excluded User Type');
    }

    const userType = await this.prisma.userType.update({
      data: updateUseTypeDto,
      where: { id: userTypeId },
    });

    return UpdateUserTypeResponse.from(userType);
  }

  async remove(userTypeId: number): Promise<RemoveUserTypeResponse> {
    const userType = await this.prisma.userType.update({
      where: { id: userTypeId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return RemoveUserTypeResponse.from(userType);
  }

  private async checkIsDeleted(userTypeId: number): Promise<boolean> {
    const userType = await this.prisma.userType.findFirstOrThrow({
      where: { id: userTypeId },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    return !!userType.deletedAt;
  }
}
