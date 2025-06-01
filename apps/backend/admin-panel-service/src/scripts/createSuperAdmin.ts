import { adminService } from '../services/adminService';

async function createSuperAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@lights-shop.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = 'Super Administrator';

  try {
    // Проверяем, есть ли уже супер-админ
    const existingAdmin = await adminService.findByEmail(email);
    
    if (existingAdmin) {
      console.log(`Super admin already exists with email: ${email}`);
      
      // Обновляем роль на случай если это обычный админ
      if (existingAdmin.role !== 'SUPER_ADMIN') {
        await adminService.updateAdmin(existingAdmin.id, { role: 'SUPER_ADMIN' });
        console.log(`Updated admin ${email} role to SUPER_ADMIN`);
      }
      
      await adminService.disconnect();

      return;
    }

    // Создаем супер-админа
    const superAdmin = await adminService.createAdmin({
      email,
      password,
      name,
      role: 'SUPER_ADMIN',
    });

    console.log('Super admin created successfully:');
    console.log({
      id: superAdmin.id,
      email: superAdmin.email,
      name: superAdmin.name,
      role: superAdmin.role,
    });

    await adminService.disconnect();
  } catch (error) {
    console.error('Error creating super admin:', error);
    await adminService.disconnect();
    process.exit(1);
  }
}

// Запускаем скрипт если он вызван напрямую
if (import.meta.main) {
  createSuperAdmin();
}

export { createSuperAdmin }; 