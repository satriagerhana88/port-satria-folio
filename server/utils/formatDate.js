function formatDateToIndo(date) {
  return date ? format(new Date(date), 'd MMMM yyyy', { locale: localeID }) : null;
}
