import bcrypt from 'bcryptjs';

import { AdminAuthModule } from '../../src/admin-api/auth/admin-auth.module';
import { AdminAuthService } from '../../src/admin-api/auth/admin-auth.service';
import { setupIntegrationTest } from '../harness/integration.harness';

describe('Admin auth integration', () => {
  const harness = setupIntegrationTest([AdminAuthModule]);

  async function createAdminUser(overrides?: { email?: string; isActive?: boolean }) {
    return jestPrisma.client.adminUser.create({
      data: {
        email: overrides?.email ?? 'admin@example.com',
        passwordHash: await bcrypt.hash('FindYourFight1', 10),
        isActive: overrides?.isActive ?? true,
      },
    });
  }

  it('creates a session on login and authorizes it', async () => {
    const service = harness.module.get(AdminAuthService);
    const user = await createAdminUser();

    const session = await service.login(user.email, 'FindYourFight1');
    const authorizedUser = await service.isAuthorized(session.sessionToken);

    expect(authorizedUser.id).toBe(user.id);

    const persistedSession = await jestPrisma.client.adminSession.findUnique({
      where: { sessionToken: session.sessionToken },
    });

    expect(persistedSession).toEqual(
      expect.objectContaining({
        adminUserId: user.id,
        sessionToken: session.sessionToken,
      }),
    );
  });

  it('logs out all active sessions for the user', async () => {
    const service = harness.module.get(AdminAuthService);
    const user = await createAdminUser();

    const firstSession = await service.login(user.email, 'FindYourFight1');
    const secondSession = await service.login(user.email, 'FindYourFight1');

    await service.logout(firstSession.sessionToken);

    const remainingSessions = await jestPrisma.client.adminSession.findMany({
      where: { adminUserId: user.id },
      orderBy: { id: 'asc' },
    });

    expect(remainingSessions).toHaveLength(2);
    expect(remainingSessions.every((session) => session.expiresAt <= new Date())).toBe(true);

    await expect(service.isAuthorized(secondSession.sessionToken)).rejects.toThrow(
      'Authentication required',
    );
  });
});
