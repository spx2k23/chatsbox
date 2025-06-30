export const OrganizationSchema = {
  name: 'Organization',
  primaryKey: 'organizationId',
  properties: {
    organizationId: 'string',
    organizationName: 'string',
    OrganizationLogo: 'string',
    superAdmin: 'string',
    adminRights: 'string?'
  }
};
