export function getTime(time: number): string {
  let hr = (new Date(time).getHours() + 24) % 24;
  let mins = new Date(time).getMinutes();
  let displayMin = mins.toString();
  if (mins < 10) {
    displayMin = '0' + mins.toString();
  }

  let mid = 'AM';
  if (hr === 0) {
    hr = 12;
  } else if (hr > 12) {
    hr %= 12;
    mid = 'PM';
  }
  return hr + ':' + displayMin + ' ' + mid;
}

export function getFullDate(time: number): string {
  let day = new Date(time).getDate();
  let month = new Date(time).getMonth() + 1;
  let year = new Date(time).getFullYear();

  return `${day}-${month < 10 ? '0' + month.toString() : month}-${year}`;
}

export const monthFilterTh = (month: number): string => {
  switch (month + 1) {
    case 1:
      return 'ม.ค.';
    case 2:
      return 'ก.พ.';
    case 3:
      return 'มี.ค.';
    case 4:
      return 'เม.ย.';
    case 5:
      return 'พ.ค.';
    case 6:
      return 'มิ.ย.';
    case 7:
      return 'มิ.ย.';
    case 8:
      return 'มิ.ย.';
    case 9:
      return 'มิ.ย.';
    case 10:
      return 'มิ.ย.';
    case 11:
      return 'มิ.ย.';
    case 12:
      return 'มิ.ย.';
    default:
      return '';
  }
};

export const getChatDate = (time: Date) => {
  const day = time.getDate();
  const month = monthFilterTh(time.getMonth());
  const year = time.getFullYear() + 543;
  return (
    day.toString() +
    ' ' +
    month.toString() +
    ' ' +
    year.toString().substr(2, year.toString().length - 1)
  );
};
