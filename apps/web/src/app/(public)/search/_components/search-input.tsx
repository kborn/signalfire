'use client';

import { useRouter } from 'next/navigation';
import { useRef, type FormEvent } from 'react';

type SearchInputProps = {
  initialQuery: string;
};

export function SearchInput({ initialQuery }: SearchInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = inputRef.current?.value.trim() ?? '';
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search');
    }
  }

  return (
    <form className="searchForm" onSubmit={handleSubmit} role="search">
      <div className="searchInputRow">
        <input
          ref={inputRef}
          type="search"
          name="q"
          className="searchControl"
          defaultValue={initialQuery}
          placeholder="Search articles and actions…"
          aria-label="Search articles and actions"
          autoFocus={!initialQuery}
          autoComplete="off"
        />
        <button type="submit" className="primaryCTA searchSubmitBtn">
          Search
        </button>
      </div>
    </form>
  );
}
