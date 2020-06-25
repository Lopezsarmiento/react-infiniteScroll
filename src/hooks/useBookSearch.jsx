import React, { useEffect, useState } from "react";
import axios from "axios";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    async function fetchData() {
      try {
        const response = await axios({
          method: "GET",
          url: "http://openlibrary.org/search.json",
          params: { q: query, page: pageNumber },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        console.log(response);
        setBooks((prevBooks) => {
          // Set() removes duplicates
          return [
            ...new Set([
              ...prevBooks,
              ...response.data.docs.map((b) => b.title),
            ]),
          ];
        });
        setHasMore(response.data.docs.length > 0);
        setLoading(false);
      } catch (err) {
        // disregard cancel request errors
        if (axios.isCancel(err)) return;
        setError(true);
      }
    }

    fetchData();

    // cancel old request after new request
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
