import { ChatApp, User, UserType } from "@prisma/client";

export interface ExtendedChatApp extends ChatApp {
  userTypes: UserType[];
  createdBy: {
    id: string;
    username: string;
  };
}

export interface ExtendedUser extends User {
  userType: UserType;
}
