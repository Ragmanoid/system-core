export const generateToken = (length: number): string => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let password = ""

    for (let i = 0, n = charset.length; i < length; ++i)
        password += charset.charAt(Math.floor(Math.random() * n))

    return password;
}