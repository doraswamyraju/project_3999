import React from 'react';

/**
 * Generic Icon component to render an SVG path.
 */
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

/** Standard Icons (from your existing setup) */
export const PageIcon = (props) => <Icon {...props} path="..." />;
export const PlusIcon = (props) => <Icon {...props} path="..." />;
export const HomeIcon = (props) => <Icon {...props} path="..." />;
export const BlockIcon = (props) => <Icon {...props} path="..." />;
export const EditIcon = (props) => <Icon {...props} path="..." />;
export const TrashIcon = (props) => <Icon {...props} path="..." />;
export const XMarkIcon = (props) => <Icon {...props} path="..." />;
export const MinusCircleIcon = (props) => <Icon {...props} path="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />;

/** ✅ Header1 Icons */
export const PhoneIcon = (props) => (
  <Icon {...props} path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.106l-1.412-.353a1.125 1.125 0 0 1-.823-.398l-1.686-1.686a1.125 1.125 0 0 0-.199-1.256l.843-.843c.438-.438.663-1.068.542-1.66a8.965 8.965 0 0 0-1.348-3.795 8.965 8.965 0 0 0-3.795-1.348c-.592-.121-1.222.104-1.66.542l-.843-.843a1.125 1.125 0 0 1-1.256-.199l-1.686-1.686a1.125 1.125 0 0 1-.398-.823L3 2.25A2.25 2.25 0 0 0 .75 4.5v2.25Z" />
);

export const MailIcon = (props) => (
  <Icon {...props} path="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.907L12 11.25l-8.684-2.607a2.25 2.25 0 0 1-1.07-1.907V6.75" />
);

export const FacebookIcon = (props) => (
  <Icon {...props} path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Zm-2.25 9h-1.5v6h-3v-6h-1.5v-3h1.5V7.5c0-1.5 1.5-1.5 1.5-1.5h1.5v3h-1.5v1.5h1.5v3Z" />
);

export const TwitterIcon = (props) => (
  <Icon {...props} path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Z" />
);

export const LinkedinIcon = (props) => (
  <Icon {...props} path="M16.5 3.75h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9A2.25 2.25 0 0 0 18.75 15V6a2.25 2.25 0 0 0-2.25-2.25Z" />
);
