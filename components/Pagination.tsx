import React, { useState } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
    totalItems: number;
    limit: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const MyPagination = ({ totalItems, limit, currentPage, setCurrentPage }: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / limit);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
    }

    return (
        <Pagination>
            <PaginationContent>
                {currentPage > 1 && <PaginationItem>
                    <PaginationPrevious href="#" onClick={handlePrevPage} />
                </PaginationItem>}
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink href="#" onClick={() => handlePageChange(page)} isActive={currentPage === page}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {pages.length > 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href="#" onClick={handleNextPage} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default MyPagination