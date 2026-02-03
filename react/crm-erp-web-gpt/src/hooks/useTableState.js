import React from 'react';

export function useTableState({ pageSize = 10 } = {}) {
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState('');
  return { page, setPage, pageSize, keyword, setKeyword };
}
