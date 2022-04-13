import React, { useMemo, FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../db';

const List = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const keyword = new URLSearchParams(search).get('keyword');

  const [searchInputText, setSearchInputText] = useState(keyword);

  const list = useMemo(() => {
    return db.filter((item) => item.title.includes(keyword) || item.content.includes(keyword));
  }, [keyword]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`/?keyword=${searchInputText}`);
  };

  return (
    <div id="list">
      <header>
        <h1 className="title">리스트</h1>
      </header>
      <form onSubmit={onSubmit}>
        <div className="search">
          <div className="search-bar">
            <button className="search-btn">
              <i className="search-icon">🍕</i>
            </button>
            <input
              name="keyword"
              className="search-input"
              type="text"
              value={searchInputText}
              onChange={(e) => setSearchInputText(e.currentTarget.value)}
            />
          </div>
          {keyword && (
            <div className="search-result">
              <span className="search-keyword">{keyword}</span>
              <span className="result-text">검색결과 {list.length}건</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default List;
