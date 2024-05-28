import { formatDistanceToNowStrict } from 'date-fns';
import { sq } from 'date-fns/locale';

export function getCustomTimeFormat(date: Date | number | string): string {
  const options = {
    locale: {
      ...sq,
      formatDistance: (unit: string, count: number) => {
        switch (true) {
          case unit === 'xDays':
            return `${count}d`;
          case unit === 'xHours':
            return `${count}h`;
          case unit === 'xMinutes':
            return `${count}m`;
          case unit === 'xSeconds':
            return `${count}s`;
          case unit === 'xMonths':
            return `${count}mo`;
          case unit === 'xYears':
            return `${count}y`;
        }
        return `%d hours`;
      },
    },
  };
  return formatDistanceToNowStrict(date, options);
}
