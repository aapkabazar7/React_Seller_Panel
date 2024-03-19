import React from 'react';

const Pagination2 = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevClick = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    const renderPageButtons = () => {
        const buttons = [];
        const startPage = Math.max(currentPage - 2, 1);
        const endPage = Math.min(currentPage + 2, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    style={{ flex: 1 }}
                    onClick={() => handlePageClick(i)}
                    className={i === currentPage ? 'currentPage' : ''}
                >
                    {i === currentPage ? `${i} of ${totalPages}` : i}
                </button>
            );
        }

        return buttons;
    };

    return (
        <>
            <Pagination count={10} shape="rounded" />
            <Pagination count={10} variant="outlined" shape="rounded" /></>
    );
};

export default Pagination2;
