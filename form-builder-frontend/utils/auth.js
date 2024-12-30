const API_URL = "http://localhost:8000";
export const login = async (username, password) => {
    console.log("Hello1");
    const response = await fetch(`${API_URL}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    console.log("res",response);
    const data = await response.json();
    console.log("data",data);
    if (response.ok) {
      localStorage.setItem('token', data.access);
    }
    return data;
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  


  export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined"; // You can also check if the token is valid here
};

export const redirectToLogin = () => {
    if (!isAuthenticated()) {
        window.location.href = "http://localhost:3000/login";  // Redirect to login page
    }
};
  