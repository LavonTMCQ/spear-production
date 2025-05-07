import { User } from "@/types/user";

/**
 * Utility functions for working with localStorage
 * Provides type safety and error handling
 */

/**
 * Get user data from localStorage
 * @returns User object or null if not found or invalid
 */
export function getUserFromStorage(): User | null {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }
    
    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    // Clean up invalid data
    localStorage.removeItem("user");
    return null;
  }
}

/**
 * Save user data to localStorage
 * @param user User object to save
 */
export function saveUserToStorage(user: User): void {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
}

/**
 * Remove user data from localStorage
 */
export function removeUserFromStorage(): void {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error removing user data from localStorage:", error);
  }
}
