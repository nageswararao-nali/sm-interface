import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, handlePageChange, pageNumber }) => {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <ReactPaginate
        previousLabel={"‹ Prev"}
        nextLabel={"Next ›"}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        forcePage={pageNumber}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        containerClassName="flex items-center gap-0.5 list-none p-0 m-0 flex-wrap"
        pageClassName="flex"
        pageLinkClassName="px-2.5 py-1.5 text-xs text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        activeClassName="!flex"
        activeLinkClassName="px-2.5 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg"
        previousClassName="flex"
        previousLinkClassName="px-2.5 py-1.5 text-xs text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
        nextClassName="flex"
        nextLinkClassName="px-2.5 py-1.5 text-xs text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
        disabledClassName="opacity-40 pointer-events-none"
        breakClassName="flex"
        breakLinkClassName="px-2 py-1.5 text-xs text-gray-400"
      />
      <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">
        {pageNumber + 1}/{pageCount}
      </span>
    </div>
  );
};

export default Pagination;
