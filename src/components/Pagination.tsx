import React, { useEffect, useState } from 'react'

interface PaginationProps {
    onPageChange: (selected: number) => void
    pageCount: number
}

const Pagination: React.FC<PaginationProps> = ({ onPageChange, pageCount }) => {
    const [page, setPage] = useState(1)
    
    useEffect(() => {
        if (page > pageCount) {
            setPage(pageCount)
            onPageChange(pageCount)
        }
    }, [onPageChange, page, pageCount])
    
    const updatePage = (pageNumber: number) => {
        setPage(pageNumber)
        onPageChange(pageNumber)
    }

    const nextPage = () => {
        if (page === pageCount) return
        updatePage(page + 1)
    }

    const prevPage = () => {
        if (page === 1) return
        updatePage(page - 1)
    }

    const renderPage = (pageNumber: number) => (
        <button
            onClick={() => updatePage(pageNumber)}
            className={`pagination__page ${pageNumber === page ? 'pagination__page--active' : ''}`}
            key={pageNumber}
        >
            {pageNumber}
        </button>
    )

    const renderMiddlePages = () => {
        if (pageCount > 7) {
            if (page < 5) {
                return (
                    <>
                        {[2, 3, 4, 5].map(renderPage)}
                        <span>...</span>
                    </>
                )
            } else if (page + 4 > pageCount) {
                return (
                    <>
                        <span>...</span>
                        {[pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1].map(renderPage)}
                    </>
                )
            } else {
                return (
                    <>
                        <span>...</span>
                        {[page - 1, page, page + 1].map(renderPage)}
                        <span>...</span>
                    </>
                )
            }
        } else {
            return Array.from(Array(pageCount - 2), (e, i) => i + 2).map(renderPage)
        }
    }

    if (pageCount < 2) return null

    return (
        <div className="pagination">
            <button
                onClick={prevPage}
                disabled={page === 1}
            >←
            </button>
            {renderPage(1)}
            {renderMiddlePages()}
            {renderPage(pageCount)}
            <button
                onClick={nextPage}
                disabled={page === pageCount}
            >→
            </button>
        </div>
    );
};

export default Pagination;