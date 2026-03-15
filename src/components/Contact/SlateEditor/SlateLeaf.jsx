import React from 'react';

const SlateLeaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.code) {
    children = <code className="slate-inline-code">{children}</code>;
  }
  if (leaf.strikethrough) {
    children = <del className="slate-strikethrough">{children}</del>;
  }
  if (leaf.link && leaf.linkUrl) {
    children = (
      <a
        href={leaf.linkUrl}
        className="slate-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </a>
    );
  }
  return <span {...attributes}>{children}</span>;
};

export default SlateLeaf;
