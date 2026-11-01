'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { NoteTag } from '@/types/note';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';

import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      router.push('/notes/filter/all');
    },
  });

  const formAction = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const tag = String(formData.get('tag') ?? 'Todo') as NoteTag;

    if (title.length < 3 || title.length > 50) {
      return;
    }

    if (content.length > 500) {
      return;
    }

    try {
      await mutation.mutateAsync({
        title,
        content,
        tag,
      });
    } catch {
      // Помилка відображається через mutation.isError
    }
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={e => setDraft({ title: e.target.value })}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={e => setDraft({ content: e.target.value })}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={e => setDraft({ tag: e.target.value as NoteTag })}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {mutation.isError && (
        <p role="alert" className={css.error}>
          Failed to create note.
        </p>
      )}

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
