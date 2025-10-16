// app/global-error.tsx
'use client';

import { DEFAULT_LANG } from '@/main/lib/constants';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang={DEFAULT_LANG}>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light p-4">
          <h1 className="text-2xl font-bold text-error mb-4">
            Произошла критическая ошибка
          </h1>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Что-то пошло не так. Попробуйте обновить страницу.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}