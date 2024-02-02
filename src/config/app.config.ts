const appConfig = () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    client: {
        url: process.env.CLIENT_URL
    },
    files: {
        profilePicturesPath: process.env.PROFILES_FILES_PATH,
        resumesPath: process.env.RESUMES_FILES_PATH,
        uploadLimit:process.env.FILE_MAX_SIZE
    }
});

export default appConfig;