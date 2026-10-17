import { api } from "../lib/api";
import type { User, GoogleSession } from "../types";

export async function saveGoogleUser(
  session: GoogleSession
): Promise<User> {
  const { data: users } = await api.get<User[]>("/users", {
    params: {
      firebaseUid: session.uid,
    },
  });

  const profile = {
    displayName: session.displayName ?? "Usuário",
    email: session.email ?? "",
    photoUrl: session.photoUrl ?? "",
  };

  if (users.length > 0) {

    console.log(users.length);

    const existingUser = users[0];

    const { data } = await api.patch<User>(
      `/users/${existingUser.id}`,
      profile
    );

    return data;
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    firebaseUid: session.uid,
    ...profile,
    groups: [],
    posts: [],
    savedPosts: [],
  };

  const { data } = await api.post<User>(
    "/users",
    newUser
  );

  return data;
}
