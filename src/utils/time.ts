export function getMonths(): any {
  const months = [
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

  return months;
}

export function getYearInNum(date: Date): number {
  return new Date(date).getFullYear();
}

export function getMonthStr(date: Date): string {
  return getMonths()[new Date(date).getMonth()];
}
