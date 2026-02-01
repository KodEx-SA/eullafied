import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('staff_performance')
export class StaffPerformance extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', default: 0 })
  ticketsAssigned: number;

  @Column({ type: 'int', default: 0 })
  ticketsResolved: number;

  @Column({ type: 'int', default: 0 })
  ticketsClosed: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageResolutionTime: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  satisfactionRating: number;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;
}
