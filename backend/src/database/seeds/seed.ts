import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { RolesService } from '../../modules/roles/roles.service';
import { DepartmentsService } from '../../modules/departments/departments.service';
import { UsersService } from '../../modules/users/users.service';
import { UserStatus } from '../../shared/enums';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const rolesService       = app.get(RolesService);
  const departmentsService = app.get(DepartmentsService);
  const usersService       = app.get(UsersService);

  console.log('🌱 Starting ETS database seed...\n');

  // ─── Roles ─────────────────────────────────────────────────────────────────
  console.log('📋 Creating roles...');
  const roleData = [
    { name: 'ADMIN',   description: 'Full system access — CEO / IT Admin' },
    { name: 'MANAGER', description: 'Division management and reporting — COO / Managers' },
    { name: 'INTERN',  description: 'Intern access — create tickets, view assigned work' },
  ];

  const roles: Record<string, any> = {};
  for (const r of roleData) {
    const existing = await rolesService.findByName(r.name);
    if (existing) {
      roles[r.name] = existing;
      console.log(`  ↩  Role "${r.name}" already exists`);
    } else {
      roles[r.name] = await rolesService.create(r);
      console.log(`  ✅ Created role: ${r.name}`);
    }
  }

  // ─── Departments (ETS Divisions) ───────────────────────────────────────────
  console.log('\n🏢 Creating ETS divisions/departments...');
  const deptData = [
    {
      name: 'ETS Repairs Division',
      description: 'On-demand IT support — OS installs, virus removal, networking, hardware repairs for schools and clients',
      headOfDepartment: 'Mr HT Maile',
    },
    {
      name: 'CSDI',
      description: 'Computer Skill Development Initiative — computer literacy programme for grade 4–12 learners in North West schools',
      headOfDepartment: 'Mr Neo Kole',
    },
    {
      name: 'Digital Marketing',
      description: 'EC: Digital Marketing — website development, social media management, and digital presence for clients',
      headOfDepartment: 'Mr HT Maile',
    },
    {
      name: 'Administration',
      description: 'Business admin — new business registrations, university online applications, general office operations',
      headOfDepartment: 'Mr HT Maile',
    },
    {
      name: 'Online Store',
      description: 'ETS Online Store — product listings, order management, and client sales support',
      headOfDepartment: 'Mr Neo Kole',
    },
  ];

  const depts: Record<string, any> = {};
  for (const d of deptData) {
    const existing = await departmentsService.findByName(d.name);
    if (existing) {
      depts[d.name] = existing;
      console.log(`  ↩  Division "${d.name}" already exists`);
    } else {
      depts[d.name] = await departmentsService.create(d);
      console.log(`  ✅ Created division: ${d.name}`);
    }
  }

  // ─── Users ─────────────────────────────────────────────────────────────────
  console.log('\n👤 Creating ETS users...');

  // Fall back gracefully if a new INTERN role doesn't exist yet (first run may have STAFF)
  const internRole = roles['INTERN'] ?? roles['STAFF'];

  const userData = [
    {
      firstName: 'HT',
      lastName: 'Maile',
      email: 'htmaile@eullafiedtechsolutions.co.za',
      password: 'ETS@Admin2025',
      roleId: roles['ADMIN'].id,
      departmentId: depts['ETS Repairs Division'].id,
      status: UserStatus.ACTIVE,
    },
    {
      firstName: 'Neo',
      lastName: 'Kole',
      email: 'neo.kole@eullafiedtechsolutions.co.za',
      password: 'ETS@Manager2025',
      roleId: roles['MANAGER'].id,
      departmentId: depts['CSDI'].id,
      status: UserStatus.ACTIVE,
    },
    {
      firstName: 'Ashley',
      lastName: 'Koketso',
      email: 'ashley.koketso@eullafiedtechsolutions.co.za',
      password: 'ETS@Intern2025',
      roleId: internRole.id,
      departmentId: depts['Digital Marketing'].id,
      status: UserStatus.ACTIVE,
    },
  ];

  for (const u of userData) {
    const existing = await usersService.findByEmail(u.email);
    if (existing) {
      console.log(`  ↩  User "${u.email}" already exists`);
    } else {
      await usersService.create(u);
      console.log(`  ✅ Created user: ${u.email} (${u.password})`);
    }
  }

  console.log('\n🎉 ETS Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Login credentials:');
  console.log('  ADMIN   → htmaile@eullafiedtechsolutions.co.za  / ETS@Admin2025');
  console.log('  MANAGER → neo.kole@eullafiedtechsolutions.co.za / ETS@Manager2025');
  console.log('  INTERN  → ashley.koketso@eullafiedtechsolutions.co.za / ETS@Intern2025');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await app.close();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
