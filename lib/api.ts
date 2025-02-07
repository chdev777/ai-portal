import { ChatApp, User, UserType } from "@prisma/client"

export async function getChatApps() {
  const response = await fetch("/api/chat-apps")
  if (!response.ok) {
    throw new Error("Failed to fetch chat apps")
  }
  return response.json()
}

export async function createChatApp(data: Partial<ChatApp>) {
  const response = await fetch("/api/chat-apps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create chat app")
  }
  return response.json()
}

export async function getUsers() {
  const response = await fetch("/api/users")
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  return response.json()
}

export async function createUser(data: Partial<User>) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create user")
  }
  return response.json()
}

export async function getUserTypes() {
  const response = await fetch("/api/user-types")
  if (!response.ok) {
    throw new Error("Failed to fetch user types")
  }
  return response.json()
}

export async function createUserType(data: Partial<UserType>) {
  const response = await fetch("/api/user-types", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create user type")
  }
  return response.json()
}