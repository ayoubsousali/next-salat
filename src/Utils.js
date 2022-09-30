export default function arabicName(name) {
  switch (name) {
    case 'Fajr':
      return 'الفجر';
    case 'Sunrise':
    case 'Chorouq':
      return 'الشروق';
    case 'Dhuhr':
      return 'الظهر';
    case 'Asr':
      return 'العصر';
    case 'Maghrib':
      return 'المغرب';
    case 'Isha':
    case 'Ishae':
      return 'العشاء';

    default:
      return '';
  }
}
