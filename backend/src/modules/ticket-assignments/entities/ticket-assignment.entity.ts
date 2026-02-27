import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_assignments')
export class TicketAssignment extends BaseEntity {
<<<<<<< HEAD
  @ManyToOne(() => Ticket, { eager: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @ManyToOne(() => User, { eager: true })
=======
  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @ManyToOne(() => User)
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  @JoinColumn({ name: 'assigned_by_id' })
  assignedBy: User;

  @Column({ type: 'text', nullable: true })
<<<<<<< HEAD
  notes?: string;

  @Column({ type: 'datetime', nullable: true })
  unassignedAt?: Date;
}
=======
  notes: string;

  @Column({ nullable: true })
  unassignedAt: Date;
}
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
