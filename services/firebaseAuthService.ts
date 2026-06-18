import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { firebaseAuth, firestore } from "@/lib/firebase";
import type { AppUserProfile } from "@/types/onePieceCard";

interface RegisterUserInput {
  name: string;
  handle?: string;
  email: string;
  password: string;
}

export interface RegisterUserResult {
  user: User;
  profileSaved: boolean;
}

function buildUserProfile(user: User, name?: string, handle?: string): AppUserProfile {
  return {
    id: user.uid,
    name: name ?? user.displayName ?? user.email ?? "Usuario",
    handle: handle ?? "",
    email: user.email ?? ""
  };
}

export async function saveUserProfile(
  user: User,
  name?: string,
  handle?: string
): Promise<AppUserProfile> {
  const profile = buildUserProfile(user, name, handle);

  await setDoc(
    doc(firestore, "users", user.uid),
    {
      ...profile,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return profile;
}

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    input.email,
    input.password
  );

  await updateProfile(credential.user, {
    displayName: input.name
  });

  try {
    await saveUserProfile(credential.user, input.name, input.handle);
  } catch (error) {
    console.warn("Conta criada, mas nao foi possivel salvar o perfil no Firestore.", error);
    return {
      user: credential.user,
      profileSaved: false
    };
  }

  return {
    user: credential.user,
    profileSaved: true
  };
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(firebaseAuth);
}

export async function getUserProfile(userId: string): Promise<AppUserProfile | null> {
  try {
    const snapshot = await getDoc(doc(firestore, "users", userId));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as AppUserProfile;
  } catch (error) {
    console.warn("Nao foi possivel carregar perfil do Firestore.", error);
    return null;
  }
}

export async function ensureUserProfile(user: User): Promise<AppUserProfile | null> {
  const existingProfile = await getUserProfile(user.uid);

  if (existingProfile) {
    return existingProfile;
  }

  try {
    return await saveUserProfile(user);
  } catch (error) {
    console.warn("Nao foi possivel criar perfil do usuario no Firestore.", error);
    return null;
  }
}
