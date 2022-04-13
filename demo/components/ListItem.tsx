/* eslint-disable global-require */
import React from 'react';
import { Link } from 'react-router-dom';

interface PropTypes {
  title: string;
  image: string;
  idx: string;
}

const ListItem = ({ idx, title, image }: PropTypes) => {
  return (
    <Link to={`/${idx}`} className="list-item">
      <div className="image-wrap">
        <img src={image} alt="item-image" />
      </div>

      <div className="title-wrap">
        <h1>{title}</h1>
      </div>
    </Link>
  );
};

export default ListItem;
