import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { TicketStatus, TicketPriority } from '../../../shared/enums';

@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({ length: 100, nullable: true })
  category: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

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
