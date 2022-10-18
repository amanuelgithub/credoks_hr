import { Employee, IEmployee } from 'src/employees/entities/employee.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hr implements IHR {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Employee, (employee) => employee.hr, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  employee: Employee;
}

export interface IHR {
  id: string;
  employee: IEmployee;
}
