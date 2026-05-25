import { MatPaginatorIntl } from '@angular/material/paginator';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos:'; // Marked with 'override'/ Cambia este texto por el que desees
}
