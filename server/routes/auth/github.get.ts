export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const profile = {
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
    }

    const dbUser = await db
      .insert(tables.users)
      .values({ githubId: user.id, ...profile })
      .onConflictDoUpdate({ target: tables.users.githubId, set: profile })
      .returning()
      .get()

    await setUserSession(event, {
      user: { id: dbUser.id, ...profile },
    })

    return sendRedirect(event, '/lists')
  },
  onError(event, error) {
    console.error('Ошибка входа через GitHub: ', error)
    return sendRedirect(event, '/')
  },
})
