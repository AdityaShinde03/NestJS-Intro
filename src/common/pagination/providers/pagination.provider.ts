import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginatedQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    let results = await repository.find({
      skip: (paginatedQuery.page - 1) * paginatedQuery.limit,
      take: paginatedQuery.limit,
    });

    /**
     * Create the request URLS
     */
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newURL = new URL(this.request.url, baseURL);

    console.log(newURL);

    /**
     * Calculating page number
     */

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginatedQuery.limit);
    const nextPage =
      paginatedQuery.page === totalPages
        ? paginatedQuery.page
        : paginatedQuery.page + 1;
    const previousPage =
      paginatedQuery.page === 1 ? paginatedQuery.page : paginatedQuery.page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginatedQuery.limit,
        totalItems: totalItems,
        currentPage: paginatedQuery.page,
        totalPages: totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginatedQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginatedQuery.limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${paginatedQuery.limit}&page=${paginatedQuery.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginatedQuery.limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${paginatedQuery.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
