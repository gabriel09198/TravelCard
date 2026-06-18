import { FirebaseError } from "firebase/app";

const authErrorMessages: Record<string, string> = {
  "auth/email-already-in-use": "Este e-mail ja esta cadastrado. Tente entrar pela tela de login.",
  "auth/configuration-not-found":
    "O Firebase Authentication ainda nao esta configurado neste projeto. No Firebase Console, abra Authentication, clique em Comecar e habilite Email/Password.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    "A chave do Firebase nao esta valida neste ambiente. Configure as variaveis NEXT_PUBLIC_FIREBASE_* na Vercel e faca um novo deploy.",
  "auth/invalid-email": "O e-mail informado nao e valido.",
  "auth/operation-not-allowed":
    "Login por e-mail e senha nao esta habilitado no Firebase Console.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/user-not-found": "Nao encontramos uma conta com este e-mail.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/network-request-failed": "Falha de rede ao falar com o Firebase. Tente novamente."
};

export function getFirebaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    return authErrorMessages[error.code] ?? `${fallback} (${error.code})`;
  }

  return fallback;
}
