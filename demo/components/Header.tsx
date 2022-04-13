import React from 'react';

interface PropTypes {
  title: string;
}

const Header = ({ title }: PropTypes) => {
  return (
    <header>
      <h1 className="title">{title}</h1>
    </header>
  );
};

export default Header;
