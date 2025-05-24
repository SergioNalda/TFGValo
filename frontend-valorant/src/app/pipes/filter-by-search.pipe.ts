import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySearch',
  standalone: true
})
export class FilterBySearchPipe implements PipeTransform {
  transform(miras: any[], searchText: string): any[] {
    if (!miras || !searchText) return miras;
    return miras.filter(mira =>
      mira.nombre.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
