const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const deleteBusiness = async (businessId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/businesses/${businessId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete business');
  }
};
