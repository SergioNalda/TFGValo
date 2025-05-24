import { Pipe, PipeTransform } from '@angular/core';
import { Mira } from '../models/mira';

@Pipe({
  name: 'filterByTipo',
  standalone: true,
})
export class FilterByTipoPipe implements PipeTransform {
  transform(miras: Mira[], tipo: string): Mira[] {
    if (!miras || !tipo || tipo === 'all') {
      return miras;
    }

    return miras.filter(mira => mira.tipo === tipo);
  }
}
