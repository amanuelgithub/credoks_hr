import { Controller, Logger, Param, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { Employee } from '../entities/employee.entity';
import { EmployeesService } from '../services/employees.service';
import { TasksService } from '../services/NotificationsService';

export interface MessageEvent {
  data: string | object;
  // id?: string;
  // type?: string;
  // retry?: number;
}

@Controller('notifications')
export class NotificationsController {
  private logger: Logger;
  // private schduleRegistry: SchedulerRegistry,

  constructor(
    private readonly tasksService: TasksService,
    private readonly employeesService: EmployeesService,
  ) {
    this.logger = new Logger();
  }

  // @UseGuards(AtGuard)
  @Sse('/probation-completed/:companyId')
  getEmployeesWithProbationTimeCompleted(
    @Param('companyId') companyId: string,
  ): Observable<MessageEvent> {
    let emp: Employee[] = [];

    this.tasksService
      .getEmployeesWithProbationTimeCompleted(companyId)
      .then((result) => {
        emp = [...result];
      });

    for (let index = 0; index < emp.length; index++) {
      this.logger.debug(
        'Employee With Probation Time completed: ',
        emp[index].employmentStatus,
      );
    }
    this.logger.debug('end');

    // return interval(24 * 60 * 60).pipe(map((_) => ({ data: { emp } })));
    return interval(2000).pipe(map((_) => ({ data: { emp } })));
  }
}
