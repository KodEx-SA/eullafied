<<<<<<< HEAD
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ length: 150 })
=======
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { TicketStatus, TicketPriority } from '../../../shared/enums';

@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ length: 200 })
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
<<<<<<< HEAD
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({
    type: 'enum',
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

<<<<<<< HEAD
  // User who created the ticket
=======
  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({ length: 100, nullable: true })
  category: string;

>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

<<<<<<< HEAD
  // Department responsible
  @ManyToOne(() => Department, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
=======
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ nullable: true })
  resolvedAt: Date;

  @Column({ nullable: true })
  closedAt: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;
}
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
