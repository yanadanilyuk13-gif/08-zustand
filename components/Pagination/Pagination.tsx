'use client';

import ReactPaginateModule from 'react-paginate';
import type { ComponentType } from 'react';
import type { ReactPaginateProps } from 'react-paginate';

import css from './Pagination.module.css';

type PaginationModule =
  | ComponentType<ReactPaginateProps>
  | {
      default: ComponentType<ReactPaginateProps>;
    };

const paginationModule = ReactPaginateModule as unknown as PaginationModule;

const ReactPaginate = 'default' in paginationModule ? paginationModule.default : paginationModule;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
