import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleUserEntity } from './role_user.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid_role: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => RoleUserEntity, (userRole) => userRole.role)
  user_role: RoleUserEntity[];
}
