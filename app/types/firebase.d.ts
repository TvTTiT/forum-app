import type { Auth } from 'firebase/auth'
import type { FirebaseApp } from 'firebase/app'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp | null
    $firebaseAuth: Auth | null
  }
}
