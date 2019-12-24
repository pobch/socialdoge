export type Scream = {
  userHandle: string
  body: string
  createdAt: string
}

export type User = {
  handle: string // primary key
  email: string
  createdAt: string
  userId: string | null // unique id generated from auth service
}
