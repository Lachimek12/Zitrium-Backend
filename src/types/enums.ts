export enum ErrorType {
    EmailTaken = 'EmailTaken',
    UserDoesNotExist = 'UserDoesNotExist',
    EmailVerified = 'EmailVerified',
    VerificationFailed = 'VerificationFailed',
    ErrorSendingEmail = 'ErrorSendingEmail',
    IncorrectEmail = 'IncorrectEmail',
    ResendEmailCooldown = 'ResendEmailCooldown',
}