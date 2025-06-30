import Realm from 'realm';
import { UserSchema } from './userSchema';
import { OrganizationSchema } from './organizationSchema';
import { FriendSchema } from './friendSchema';

export default new Realm({ schema: [UserSchema, OrganizationSchema, FriendSchema] });
