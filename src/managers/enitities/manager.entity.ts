import { Employee, IEmployee } from 'src/employees/entities/employee.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Manager implements IManager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Employee, (employee) => employee.manager, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  employee: Employee;
}

export interface IManager {
  id: string;
  employee: IEmployee;
}
