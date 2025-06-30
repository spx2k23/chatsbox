export const UserSchema = {
  name: 'User',
  primaryKey: 'userId',
  properties: {
    userId: 'string',
    firstName: 'string',
    lastName: 'string',
    role: 'string',
    dateOfBirth: 'string',
    profilePicture: 'string?',
    bio: 'string?',
    email: 'string',
    phoneNumber: 'string',
    currentOrg: 'string'
  }
};
