import { TopicEntity } from 'src/topic/entity/topic.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lesson')
export class LessonEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid_lesson: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  resource_url: string;

  @ManyToOne(() => TopicEntity, (topic) => topic.lessons, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'topic_uuid' })
  topic: TopicEntity;
}
