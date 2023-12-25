import { ApiProperty } from '@nestjs/swagger';
import { Permission, UserType } from '@prisma/client';

class UserTypeResponse {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: Boolean,
  })
  isActive: boolean;

  static from({ id, description, isActive }: UserType): UserTypeResponse {
    return {
      id,
      description,
      isActive,
    };
  }
}

class PermissionResponse {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: Boolean,
  })
  isActive: boolean;

  static from({ id, description, isActive }: Permission): PermissionResponse {
    return {
      id,
      description,
      isActive,
    };
  }
}

export interface IPermissionGroup {
  id: number;
  userType: UserType;
  permission: Permission;
}

export class ListPermissionGroupResponse {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: UserTypeResponse,
  })
  userType: UserTypeResponse;

  @ApiProperty({
    type: PermissionResponse,
  })
  permission: PermissionResponse;

  static from({
    id,
    userType,
    permission,
  }: IPermissionGroup): ListPermissionGroupResponse {
    return {
      id,
      userType: UserTypeResponse.from(userType),
      permission: PermissionResponse.from(permission),
    };
  }
}
