import React, { useMemo, FormEvent, useState, useEffect, useRef, WheelEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListItem from '../components/ListItem';
import { db } from '../db';

let scrollCache: null | number = null;
const List = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const keyword = new URLSearchParams(search).get('keyword');

  const listRef = useRef<HTMLDivElement>(null);
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

  const onListScroll = (e: WheelEvent<HTMLDivElement>) => {
    scrollCache = e.currentTarget.scrollTop;
  };

  useEffect(() => {
    if (listRef.current && scrollCache) {
      listRef.current.scrollTo(0, scrollCache);
    }
  }, []);

  return (
    <div ref={listRef} id="list" onScroll={onListScroll}>
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
