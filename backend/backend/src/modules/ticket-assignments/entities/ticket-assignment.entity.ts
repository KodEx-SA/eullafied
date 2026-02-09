import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_assignments')
export class TicketAssignment extends BaseEntity {
  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by_id' })
  assignedBy: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  unassignedAt: Date;
}
