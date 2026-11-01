'use client';

import { useEffect, useState } from 'react';
import css from './Footer.module.css';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {year ?? ''} NoteHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
