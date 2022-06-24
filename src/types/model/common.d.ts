declare enum UserRole {
  ROOT = 1,
  ADMIN = 2,
  USER = 3
}

declare type User = {
  avatar: string;
  date: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  roles: string[];
  _id: string;
};

declare type Warehouse = {
  _id: string;
  name: string;
  createdBy: User;
  createdAt: Date;
  lastUpdated: Date;
  lastUpdatedBy: User;
};

declare type LoginResponse = {
  userId: string;
  token: string;
  expiresPrettyPrint: string;
  expires: number;
};