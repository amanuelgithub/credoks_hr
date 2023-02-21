export function getCurrentDate(): Date {
  return new Date();
}

export function getMonths(): any {
  return [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
}

export function getYearInNum(date: Date): number {
  return new Date(date).getFullYear();
}

export function getMonthStr(date: Date): string {
  return getMonths()[new Date(date).getMonth()];
}
