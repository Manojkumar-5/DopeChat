import dateFormat from 'dateformat';

export const formatSeenDeliveredDate = (dateObj) => {
  const date = new Date(dateObj);
  return dateFormat(date, 'mmmm d, H:MM');
};

export const messageGroupDate = (dateObj) => {
  const date = new Date(dateObj);
  const day = date.getDate();
  const onesDigit = day % 10;
  let dayString = '';
  switch (onesDigit) {
    case 1:
      dayString = 'st';
      break;
    case 2:
      dayString = 'nd';
      break;
    case 3:
      dayString = 'rd';
      break;
    default:
      dayString = 'th';
      break;
  }
  const formattedDate = dateFormat(date, 'DDDD, mmm d');
  return `${formattedDate}${dayString}`;
};
