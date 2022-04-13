import React, { useEffect, useRef, WheelEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { db } from '../db';

const scrollCache = {};
const Detail = () => {
  const { idx } = useParams();
  const information = db.find((item) => item.idx === idx);
  const detailRef = useRef<HTMLDivElement>(null);

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

  const onDetailScroll = (e: WheelEvent<HTMLDivElement>) => {
    scrollCache[idx] = e.currentTarget.scrollTop;
  };

  useEffect(() => {
    if (detailRef.current && scrollCache[idx]) {
      detailRef.current.scrollTo(0, scrollCache[idx]);
    }
  }, [idx]);

  return (
    <div id="detail" onScroll={onDetailScroll} ref={detailRef}>
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
