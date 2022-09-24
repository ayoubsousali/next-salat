export default function arabicName(name) {
  switch (name) {
    case 'Fajr':
      return 'الفجر';
    case 'Chorouq':
      return 'الشروق';
    case 'Dhuhr':
      return 'الظهر';
    case 'Asr':
      return 'العصر';
    case 'Maghrib':
      return 'المغرب';
    case 'Ishae':
      return 'العشاء';

    default:
      return '';
  }
}
