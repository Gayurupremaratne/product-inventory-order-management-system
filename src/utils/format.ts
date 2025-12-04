import dayjs from 'dayjs';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('MMM DD, YYYY');
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};
