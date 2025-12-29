export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(
    `https://aidronik.com/api/v1/auth/sessions/${sessionId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete session');
  }
}