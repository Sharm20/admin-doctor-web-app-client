require("dotenv").config();

export const login = async ({ email, password } = {}) => {
  const user = { email, password };

  try {
    const res = await fetch(`${process.env.SERVER_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (error) {
    throw new Error(`Unable to Log in ${error}`);
  }
};
