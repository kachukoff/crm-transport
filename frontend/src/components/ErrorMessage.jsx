export default function ErrorMessage({ message, onRetry }) {
  // Если сообщение содержит "Доступ только", показываем понятный текст
  const isAccessDenied = message?.includes('Доступ только') || message?.includes('403');
  
  const displayMessage = isAccessDenied
    ? 'У вас нет доступа к этому разделу'
    : message || 'Произошла ошибка';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
      }}>
        {isAccessDenied ? '🔒' : '⚠️'}
      </div>
      
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--color-text, #111827)',
        marginBottom: '8px',
      }}>
        {isAccessDenied ? 'Доступ запрещён' : 'Что-то пошло не так'}
      </h3>
      
      <p style={{
        fontSize: '14px',
        color: 'var(--color-text-muted, #6b7280)',
        maxWidth: '400px',
        marginBottom: '24px',
      }}>
        {displayMessage}
      </p>
      
      {onRetry && (
        <button 
          className="btn btn--secondary" 
          onClick={onRetry}
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
}