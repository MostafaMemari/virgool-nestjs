import { PaginationDto } from '../dtos/pagination.dto';

export function paginationSolver(paginationDto: PaginationDto) {
  let { page = 1, limit = 10 } = paginationDto;
  if (page < 1) page = 1;

  if (!limit || limit <= 0) limit = 10;

  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
  };
}

export function paginationGenerator(count: number = 0, page: number = 1, limit: number = 10) {
  if (limit <= 0) limit = 10;
  if (page < 1) page = 1;

  return {
    totalCount: count,
    page: +page,
    limit: +limit,
    pageCount: Math.ceil(count / limit),
  };
}
