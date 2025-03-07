// Temporary plain text password for development
export const generateHash = async (password: string): Promise<string> => {
  return password; // temporarily return plain text password
};

// Temporary direct comparison
export const verifyHash = async (hash: string, password: string): Promise<boolean> => {
  return hash === password;
}; 