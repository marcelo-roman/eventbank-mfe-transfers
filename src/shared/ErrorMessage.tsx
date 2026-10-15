export function ErrorMessage({ error }: { error: unknown }) {
  if (!error) {
    return null;
  }
  const message = error instanceof Error ? error.message : 'Something failed. Try again.';
  return (
    <p className="error" role="alert">
      {message}
    </p>
  );
}
