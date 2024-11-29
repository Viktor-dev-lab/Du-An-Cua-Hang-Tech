module.exports =  (objectPagination,req,countProducts) => {
    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * (objectPagination.limitPage); // Công thức phân trang

    const totalPage = Math.ceil(countProducts / objectPagination.limitPage); // Tính tổng trang
    objectPagination.totalPage = totalPage; // Thêm vào object
    return objectPagination;
}