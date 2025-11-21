import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

import { RoleUserEntity } from './role_user.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid_user: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  confirmationToken: string | null;

  @OneToMany(() => RoleUserEntity, (userRole) => userRole.user)
  user_role: RoleUserEntity[];
}
