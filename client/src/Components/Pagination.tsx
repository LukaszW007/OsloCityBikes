import React from 'react';

interface PaginationProps {
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
    paginate: any,
}
export const Pagination = (props: PaginationProps) => {
    const { currentPage, itemsPerPage, totalItems, paginate } = props;
    const pageNumbers: any[] = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
          <ul className='flex justify-items-center flex-wrap justify-center'>
            {pageNumbers.map(number => (
                <li key={number} className={currentPage === number ? "bg-custom-blue border-red-300 text-red-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium" : "bg-white border-gray-300 text-gray-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"}>
                    <a onClick={() => paginate(number)} href='!#' className='page-link'>
                      {number}
                    </a>
                  </li>
                ))}
          </ul>
        </nav>
    );
};
