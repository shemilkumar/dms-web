import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'epochConverter'
})
export class EpochConverterPipe implements PipeTransform {

  transform(epochTime: number, format: string = 'date-time') {
    if (format === 'date')
      return new Date(epochTime * 1000).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    else {
      const dateTime = new Date(epochTime * 1000).toLocaleString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      return dateTime
    }

  }

}
