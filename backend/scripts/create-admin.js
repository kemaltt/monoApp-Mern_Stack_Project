require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('../src/models/UserModel');

const createAdmin = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    // Kullanıcıyı email ile bul
    const email = process.argv[2]; // Command line'dan email al
    
    if (!email) {
      console.error('❌ Lütfen email adresi girin!');
      console.log('Kullanım: node scripts/create-admin.js email@example.com');
      process.exit(1);
    }

    const user = await UserModel.findOne({ email });
    
    if (!user) {
      console.error(`❌ ${email} adresine sahip kullanıcı bulunamadı!`);
      console.log('Önce bu email ile kayıt olmanız gerekiyor.');
      process.exit(1);
    }

    // Admin yap
    user.role = 'admin';
    await user.save();

    console.log('✅ Kullanıcı başarıyla admin yapıldı!');
    console.log('📧 Email:', user.email);
    console.log('👤 İsim:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('\nArtık bu kullanıcı ile giriş yaparak admin paneline erişebilirsiniz.');
    console.log('Admin Panel: /admin');
    console.log('Activity Logs: /admin/activity-logs');

    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

createAdmin();
