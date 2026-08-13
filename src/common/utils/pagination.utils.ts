export class PaginationUtil {

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static getPaginationResponse(
    data: any[],
    total: number,
    page: number,
    limit: number,
  ) {

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}