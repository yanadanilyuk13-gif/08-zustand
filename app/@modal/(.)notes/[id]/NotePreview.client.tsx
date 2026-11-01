'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';

import css from './NotePreview.module.css';

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const closeModal = () => {
    router.back();
  };

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        {isLoading && <p>Loading note...</p>}

        {isError && <p>Failed to load note.</p>}

        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>

            <p className={css.content}>{note.content}</p>

            <p className={css.date}>{new Date(note.createdAt).toLocaleDateString()}</p>

            <button type="button" className={css.backBtn} onClick={closeModal}>
              Back
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
