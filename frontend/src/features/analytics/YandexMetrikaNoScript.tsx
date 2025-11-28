// src/main/components/Analytics/YandexMetrikaNoScript.tsx

interface YandexMetrikaNoScriptProps {
  counterId: string;
}

/**
 * Yandex.Metrika NoScript Component (Server Component)
 * Place in <body> for proper HTML5 compliance
 * 
 * This component ONLY renders the noscript fallback.
 * Must be paired with YandexMetrikaScript in <head>
 */
export default function YandexMetrikaNoScript({ counterId }: YandexMetrikaNoScriptProps) {
  // Validate counter ID
  const isValidCounterId = counterId && /^\d+$/.test(counterId);
  
  if (!isValidCounterId) {
    return null;
  }

  const counterIdNumber = parseInt(counterId, 10);

  return (
    <noscript>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc.yandex.ru/watch/${counterIdNumber}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  );
}