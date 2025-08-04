// Utility function for making authenticated API calls
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("access_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    let response = await fetch(url, config);

    // Handle authentication errors (401 and potentially 403)
    if (!response.ok && (response.status === 401 || response.status === 403)) {
      // Try to refresh token
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("access_token", refreshData.access_token);
          
          // Retry original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${refreshData.access_token}`,
          };
          response = await fetch(url, config); // Await the retried fetch call
        } else {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("coach_data");
          window.location.href = "/";
          // Throw an error to prevent further execution
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = "/";
        // Throw an error to prevent further execution
        throw new Error("Session expired. Please log in again.");
      }
    }

    // Check for non-ok responses again after potential refresh
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;

  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Helper function to get coach data from localStorage
export const getCoachData = () => {
  const coachData = localStorage.getItem("coach_data");
  return coachData ? JSON.parse(coachData) : null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};
