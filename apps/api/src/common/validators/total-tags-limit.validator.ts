import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface TagsDto {
  tagIds?: string[];
  tagNames?: string[];
}

@ValidatorConstraint({ name: 'totalTagsLimit', async: false })
export class TotalTagsLimitConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const object = args.object as TagsDto;
    const tagIdsCount = object.tagIds?.length ?? 0;
    const tagNamesCount = object.tagNames?.length ?? 0;
    return tagIdsCount + tagNamesCount <= 5;
  }

  defaultMessage(): string {
    return 'Total number of tags (tagIds + tagNames) must not exceed 5';
  }
}
