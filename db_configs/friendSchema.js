export const FriendSchema = {
  name: 'Friend',
  primaryKey: 'userId',
  properties: {
    userId: 'string',
    firstName: 'string',
    lastName: 'string',
    role: 'string',
    dateOfBirth: 'string',
    profilePicture: 'string',
    bio: 'string',
    email: 'string',
    phoneNumber: 'string',
  },
};