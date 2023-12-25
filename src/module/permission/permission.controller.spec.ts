import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Permission, UserTypePermission } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionResponse } from './dto/create-permission.response';
import { ListPermissionResponse } from './dto/list-permission.response';
import { QueryListPermissionDto } from './dto/query-list-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission.response';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

describe('PermissionController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;
  const prisma = {
    permission: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findFirstOrThrow: jest.fn(),
    },
    userTypePermission: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        PermissionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    permissionService = moduleRef.get<PermissionService>(PermissionService);
    permissionController =
      moduleRef.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(permissionService).toBeDefined();
    expect(permissionController).toBeDefined();
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

    it('should create a new user type', async () => {
      const result = await permissionController.create(createPermissionDto);

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

    it('should return a list of all user types in the system', async () => {
      const result = await permissionController.list(queryPermissionDto);

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

    describe('Success', () => {
      beforeEach(() => {
        prisma.permission.update.mockResolvedValueOnce({
          ...permission,
          description: updatePermissionDto.description,
        });
        prisma.permission.findFirstOrThrow.mockResolvedValueOnce(permission);
      });

      it('should update the user type description', async () => {
        const result = await permissionController.update(
          permission.id,
          updatePermissionDto,
        );

        expect(result).toStrictEqual(updatePermissionResponse);
        expect(prisma.permission.update).toHaveBeenCalledWith<
          [{ where: { id: number }; data: UpdatePermissionDto }]
        >({ data: updatePermissionDto, where: { id: permission.id } });
      });
    });

    describe('Fail', () => {
      describe('Prisma Error - Not Found', () => {
        beforeEach(() => {
          prisma.permission.findFirstOrThrow.mockRejectedValueOnce(
            new PrismaClientKnownRequestError('No Permission found', {
              code: 'P2025',
              clientVersion: '1',
            }),
          );
        });

        it('should throw an error for not findind the specified user type', async () => {
          expect(() =>
            permissionController.update(permission.id, updatePermissionDto),
          ).rejects.toThrow(new NotFoundException('No Permission found'));
        });
      });

      describe('Other Errors', () => {
        beforeEach(() => {
          prisma.permission.findFirstOrThrow.mockResolvedValueOnce(permission);
          prisma.permission.update.mockRejectedValueOnce(new Error());
        });

        it('should throw an error for not findind the specified user type', async () => {
          expect(() =>
            permissionController.update(permission.id, updatePermissionDto),
          ).rejects.toThrow(
            new InternalServerErrorException('An unexpected error occurred!'),
          );
        });
      });
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

    describe('Success', () => {
      beforeEach(() => {
        prisma.userTypePermission.findFirst.mockResolvedValueOnce({});
      });

      it('should remove a user type by adding a date to deletedAt field', async () => {
        const result = await permissionController.remove(permission.id);

        expect(result.deletedAt).not.toBeNull();
        expect(result.deletedAt).not.toBeUndefined();
        expect(prisma.permission.update).toHaveBeenCalled();
      });
    });

    describe('Fail', () => {
      const permissionGroup: UserTypePermission = {
        id: randomInt(100),
        userTypeId: randomInt(100),
        permissionId: permission.id,
      };

      beforeEach(() => {
        prisma.userTypePermission.findFirst.mockResolvedValueOnce(
          permissionGroup,
        );
      });

      it('should throw an error', async () => {
        expect(() =>
          permissionController.remove(permission.id),
        ).rejects.toThrow(ForbiddenException);
      });
    });
  });
});
