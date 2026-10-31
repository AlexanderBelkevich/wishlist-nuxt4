export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        login: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
      },
    })

    return sendRedirect(event, '/lists')
  },
  onError(event, error) {
    console.error('Ошибка входа через GitHub: ', error)
    return sendRedirect(event, '/')
  },
})
