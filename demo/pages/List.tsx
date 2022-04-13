import React, { useMemo, FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListItem from '../components/ListItem';
import { db } from '../db';
import useScrollCache from '../hooks/useScrollCache';

const List = () => {
  const { search, pathname } = useLocation();
  const keyword = new URLSearchParams(search).get('keyword');
  const navigate = useNavigate();

  const { containerRef, onScroll } = useScrollCache(pathname + search);

  const [searchInputText, setSearchInputText] = useState(keyword ?? '');

  const list = useMemo(() => {
    return keyword
      ? db.filter((item) => item.title.includes(keyword) || item.content.includes(keyword))
      : db;
  }, [keyword]);

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/?keyword=${searchInputText}`);
  };

  return (
    <div ref={containerRef} id="list" onScroll={onScroll}>
      <Header title="리스트" />
      <form onSubmit={onSearchSubmit}>
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
          <div className="list-wrap">
            {list.map((item) => {
              return (
                <ListItem key={item.idx} idx={item.idx} title={item.title} image={item.image} />
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default List;
