import { Test, TestingModule } from '@nestjs/testing';
import { Permission } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionResponse } from './dto/create-permission.response';
import { ListPermissionResponse } from './dto/list-permission.response';
import { QueryListPermissionDto } from './dto/query-list-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission.response';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  const prisma = {
    permission: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findFirstOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    permissionService = moduleRef.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(permissionService).toBeDefined();
  });

  describe('Create', () => {
    const createPermissionDto: CreatePermissionDto = {
      description: randomBytes(10).toString('hex'),
    };

    const permission: CreatePermissionResponse = {
      id: 1,
      description: createPermissionDto.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      prisma.permission.create.mockResolvedValueOnce(permission);
    });

    it('should create a new permission', async () => {
      const result = await permissionService.create(createPermissionDto);

      expect(result).toStrictEqual(permission);
      expect(prisma.permission.create).toHaveBeenCalledWith<
        [{ data: CreatePermissionDto }]
      >({ data: createPermissionDto });
    });
  });

  describe('List', () => {
    const permissions = new Array<Permission>(10).fill(null).map(
      (_, index): Permission => ({
        id: index,
        description: randomBytes(10).toString('hex'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );

    const queryPermissionDto: QueryListPermissionDto = {};
    const listPermissionResponse = ListPermissionResponse.from(permissions);

    beforeEach(() => {
      prisma.permission.findMany.mockResolvedValueOnce(permissions);
    });

    it('should return a list of all permissions in the system', async () => {
      const result = await permissionService.list(queryPermissionDto);

      expect(result).toStrictEqual(listPermissionResponse);
      expect(result).toHaveLength(10);
      expect(prisma.permission.findMany).toHaveBeenCalledWith<
        [{ where: { deletedAt: Date | null; description: string } }]
      >({ where: { deletedAt: null, description: undefined } });
    });
  });

  describe('Update', () => {
    const permission: Permission = {
      id: 1,
      description: 'test',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const updatePermissionDto: UpdatePermissionDto = {
      description: 'New Description',
    };
    const updatePermissionResponse = UpdatePermissionResponse.from({
      ...permission,
      description: updatePermissionDto.description,
    });

    beforeEach(() => {
      prisma.permission.update.mockResolvedValueOnce({
        ...permission,
        description: updatePermissionDto.description,
      });
      prisma.permission.findFirstOrThrow.mockResolvedValueOnce(permission);
    });

    it('should update the permission description', async () => {
      const result = await permissionService.update(
        permission.id,
        updatePermissionDto,
      );

      expect(result).toStrictEqual(updatePermissionResponse);
      expect(prisma.permission.update).toHaveBeenCalledWith<
        [{ where: { id: number }; data: UpdatePermissionDto }]
      >({ data: updatePermissionDto, where: { id: permission.id } });
    });
  });

  describe('Delete', () => {
    const permission: Permission = {
      id: randomInt(100),
      description: randomBytes(10).toString('hex'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    beforeEach(() => {
      prisma.permission.update.mockResolvedValueOnce({
        ...permission,
        deletedAt: new Date(),
      });
    });

    it('should remove a permission by adding a date to deletedAt field', async () => {
      const result = await permissionService.remove(permission.id);

      expect(result.deletedAt).not.toBeNull();
      expect(result.deletedAt).not.toBeUndefined();
      expect(prisma.permission.update).toHaveBeenCalled();
    });
  });
});
