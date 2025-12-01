import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function setupApp() {
  try {
    console.log('🔧 Configuration de l\'application...\n');

    // 1. Créer le compte admin
    console.log('1️⃣  Création du compte admin...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Administrateur',
      email: 'admin@soutiencollectif.org',
      password: 'AdminSecure123!'
    });
    
    const token = registerRes.data.data.token;
    console.log('   ✅ Compte admin créé !');
    console.log(`   📧 Email: admin@soutiencollectif.org`);
    console.log(`   🔑 Password: AdminSecure123!\n`);

    // 2. Créer les campagnes
    console.log('2️⃣  Création des campagnes...\n');
    
    const campaigns = [
      {
        title: 'Cadeaux et Jouets pour 100 Enfants',
        description: 'Offrons des jouets et des cadeaux de Noël à 100 enfants orphelins dans les villages et quartiers défavorisés d\'Afrique.',
        category: 'Cadeaux',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
        goal: 30000,
        daysLeft: 15
      },
      {
        title: 'Repas de Noël Festif',
        description: 'Organisons un grand repas de Noël avec des plats locaux pour 200 enfants orphelins dans plusieurs centres d\'accueil.',
        category: 'Repas',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
        goal: 15000,
        daysLeft: 20
      },
      {
        title: 'Spectacle et Animations',
        description: 'Offrons une journée magique avec artistes locaux, conteurs traditionnels et animations pour créer des souvenirs inoubliables.',
        category: 'Divertissement',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        goal: 40000,
        daysLeft: 18
      }
    ];

    for (const campaign of campaigns) {
      const res = await axios.post(`${API_URL}/campaigns`, campaign, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`   ✅ ${campaign.title}`);
      console.log(`      Objectif: ${campaign.goal.toLocaleString()} €\n`);
    }

    console.log('✨ Configuration terminée avec succès !\n');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔌 Backend: http://localhost:5000/api\n');
    console.log('👉 Vous pouvez maintenant vous connecter avec:');
    console.log('   Email: admin@soutiencollectif.org');
    console.log('   Password: AdminSecure123!');

  } catch (error) {
    console.error('\n❌ Erreur:', error.response?.data?.message || error.message);
  }
}

setupApp();
