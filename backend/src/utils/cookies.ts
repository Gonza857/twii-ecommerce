export const generateCookie = () => {
    return {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: false,
        maxAge: 14 * 24 * 60 * 60 * 1000
    }
}