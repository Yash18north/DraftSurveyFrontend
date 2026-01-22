import { useState } from "react";

const TablePagination = ({
    totalPages,
    currentPage,
    onPageChange,
    sizeofPage,
    onPageSizeChange,
    pageSizeOptions = [25, 50, 75, 100],
    moduleType }) => {
    const [inputPage, setInputPage] = useState('');

    const handleFirstPage = () => {
        onPageChange(1);
    };

    const handleLastPage = () => {
        onPageChange(totalPages);
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    const handleGoToPage = () => {
        const pageNumber = parseInt(inputPage);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
            setInputPage('');
        }
    };
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        onPageSizeChange(newSize);
    };
    const renderPageNumbers = () => {
        const visiblePages = [];
        const maxPagesToShow = 5; // Limit the number of visible page buttons
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={
                        currentPage === i
                            ? "btn btn-danger pagination-active"
                            : "btn btn-danger"
                    }
                >
                    {i}
                </button>
            );
        }

        return visiblePages;
    };

    return (
        <div className="pagination-container previous_next_btns">
            <div className="previous_next_btns">
                <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className={"first_last_btn" + (currentPage === 1 ? "disabled_btn" : '')}

                >
                    {"<<"}
                </button>
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {"<"}
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {">"}
                </button>
                <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className="first_last_btn"
                >
                    {">>"}
                </button>
            </div>
            <div className="go-to-page">
                <input
                    type="number"
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    min="1"
                    max={totalPages}
                />
                <button onClick={handleGoToPage} className="go_btn btn btn-danger pagination-active">
                    Go
                </button>
                <span className="page_numOfnum">
                    Page {currentPage} of {totalPages}
                </span>
            </div>
            {
                ['dashboard'].includes(moduleType) && (
                    <div className="page-size-dropdown">
                        <label htmlFor="pageSizeSelect">Rows per page:</label>
                        <select
                            id="pageSizeSelect"
                            value={sizeofPage}
                            onChange={handlePageSizeChange}
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                )
            }
        </div>
    );
};
export default TablePagination;