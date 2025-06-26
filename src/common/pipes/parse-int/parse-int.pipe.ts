import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      throw new BadRequestException(`${value} is not a valid integer`);
    }
    return intValue;
  }
}
