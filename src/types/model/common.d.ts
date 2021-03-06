declare enum UserRole {
  ROOT = 1,
  ADMIN = 2,
  USER = 3,
}

declare type User = {
  avatar: string
  date: string
  email: string
  firstname: string
  lastname: string
  password: string
  roles: string
  store: string
  _id: string
}

declare type Warehouse = {
  _id: string
  name: string
  createdBy: User
  createdAt: Date
  lastUpdated: Date
  lastUpdatedBy: User
}

declare type Store = {
  _id: string
  name: string
  createdBy: User
  createdAt: Date
  lastUpdated: Date
  lastUpdatedBy: User
}

declare type Brand = {
  name: string
  createdAt: Date
  updatedAt: Date
}

declare type BrandModel = {
  name: string
  brand: Brand
  createdAt: Date
  updatedAt: Date
}

declare type Product = {
  _id: string
  name: string
  image_url: string
  sku: string
  price: number
  brand: string | Brand
  brandModel: string | BrandModel
  createdBy: Profile | string
  createdAt: Date
  updatedAt: Date
  updatedBy: string
}

declare type Article = {
  _id: string
  createdBy: Profile | string
  product: Product | string
  warehouse: Warehouse | string
  store: Store | string
  sold: boolean
  soldAt: Date
  transferedAt: Date
  transfered: Boolean
  warehousePrice: number
  storePrice: number
  size: number
  createdAt: Date
  updatedAt: Date
}

declare type LoginResponse = {
  userId: string
  token: string
  store: string
  expiresPrettyPrint: string
  expires: number
}

declare interface AutoCompleteData {
  [key: string]: ReadonlyArray<string | Record<string, string>>
}

declare interface ArticleAutoComplete extends AutoCompleteData {
  brands: ReadonlyArray<string>
  brandModels: ReadonlyArray<string>
}
