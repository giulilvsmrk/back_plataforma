import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('role_user')
export class RoleUserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid_role_user: string;

  @ManyToOne(() => UserEntity, (user) => user.user_role)
  @JoinColumn({ name: 'uuid_user' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.user_role)
  @JoinColumn({ name: 'uuid_role' })
  role: RoleEntity;
}
