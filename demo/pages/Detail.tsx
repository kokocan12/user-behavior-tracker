import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { db } from '../db';
import useScrollCache from '../hooks/useScrollCache';

const Detail = () => {
  const { pathname } = useLocation();
  const { idx } = useParams();
  const { containerRef, onScroll } = useScrollCache(pathname);
  const information = db.find((item) => item.idx === idx);

  const contentsRenderer = (contents: string) => {
    const contentsArray = contents.split('\n');
    const result = [];

    contentsArray.forEach((item, key) => {
      result.push(
        <span key={key} className="contents">
          {item}
        </span>,
      );
      result.push(<br key={`${key}br`} />);
    });

    return result;
  };

  return (
    <div id="detail" onScroll={onScroll} ref={containerRef}>
      <Header title={information.title} />

      <div className="image-wrap">
        <img src={information.image} alt="main-image" />
      </div>

      <div className="contents-wrap">{contentsRenderer(information.content)}</div>

      <div className="mb-flex-grow"></div>
      <div className="button-wrap">
        <Link to="/" className="btn">
          목록
        </Link>
      </div>
    </div>
  );
};

export default Detail;
