import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shrinkMessage'
})
export class ShrinkMessagePipe implements PipeTransform {

  transform(message: string, wordsLimit: number = 100): string {
    // console.log(message.length > 50 ? message.substring(0, 50) + '...' : message);

    return message?.length > wordsLimit ? message.substring(0, wordsLimit) + '...' : message;
  }

}
