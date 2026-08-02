/**
 * lib/utils.js — Shared utility functions for Portfolio v3.1
 */

/** Merge class names (simple implementation without clsx dependency) */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** Format a date string to readable format */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Truncate text to a max length */
export function truncate(text = '', maxLength = 120) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Estimate reading time in minutes */
export function readingTime(text = '') {
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}

/** Debounce a function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Copy text to clipboard */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

/** Validate email format */
export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Get initials from a name */
export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** Random item from array */
export function sample(arr = []) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Clamp a number between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Site constants */
export const SITE = {
  name:        'Ammar Mohamed',
  title:       'Ammar Mohamed — CS Student | Networking | Software Development | AI',
  description: 'Personal brand portfolio of Ammar Mohamed, a Computer Science student specializing in Networking, Software Development, and Artificial Intelligence.',
  url:         'https://ammar-portfolio.vercel.app',
  email:       'ammar.mohamed.cs@gmail.com',
  phone:       '01091698261',
  whatsapp:    'https://wa.me/201091698261',
  github:      'https://github.com/ammar-mohamed',
  linkedin:    'https://www.linkedin.com/in/ammar-mohammed-mohamed-48b415386/',
};

export const NAV_ITEMS = [
  { label: 'Home',         href: '#hero' },
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Services',     href: '#services' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Blog',         href: '#blog' },
  { label: 'Contact',      href: '#contact' },
];
