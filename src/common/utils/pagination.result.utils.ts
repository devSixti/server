
interface PaginationResult {
    currentCount: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface CreatePaginatorProps {
    currentCount: number;
    currentPage: number;
    totalItems: number;
    pageSize: number;
}

export const paginationResults = ({ currentCount, totalItems, currentPage, pageSize }: CreatePaginatorProps): PaginationResult => {
    return {
        currentCount,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage,
        pageSize,

    };
};