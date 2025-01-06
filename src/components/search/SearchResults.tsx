import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useState } from "react";
import { useSearchStore } from "@/store/searchStore";
import { filterResults } from "@/utils/filterResults";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { filters } = useSearchStore();

  // Apply filters to search results
  const filteredPosts = filterResults(searchResults, filters);
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      <TableContent 
        currentPosts={currentPosts}
        handleSort={() => {}}
        handleCopyCaption={() => {}}
        handleDownload={() => {}}
        formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
        truncateCaption={(caption) => caption}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalResults={filteredPosts.length}
      />
    </div>
  );
};