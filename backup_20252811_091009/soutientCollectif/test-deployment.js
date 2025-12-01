#!/usr/bin/env node

/**
 * Script de test et déploiement pour Soutien Collectif
 * Vérifie que tous les composants fonctionnent correctement
 */

const axios = require('axios').default;

const API_URL = 'http://localhost:5000/api';
const ADMIN_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5173';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.bright}🚀 Soutien Collectif - Test de Déploiement${colors.reset}\n`);

async function testEndpoint(name, url, method = 'GET', data = null, headers = {}) {
  try {
    const config = { method, url, timeout: 5000, headers };
    if (data) config.data = data;
    
    const response = await axios(config);
    console.log(`${colors.green}✅ ${name}: OK${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ ${name}: ${error.message}${colors.reset}`);
    return false;
  }
}

async function runTests() {
  console.log(`${colors.blue}📡 Test des endpoints de base:${colors.reset}`);
  
  // Tests de base
  await testEndpoint('Backend Health', `${API_URL}/health`);
  await testEndpoint('Admin Interface', ADMIN_URL);
  
  // Test spécial pour React (vérifie le HTML complet)
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    if (response.data.includes('<!doctype html') && response.data.includes('root')) {
      console.log(`${colors.green}✅ Frontend Interface: OK${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Frontend Interface: Invalid HTML${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Frontend Interface: ${error.message}${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}🔐 Test de l'authentification:${colors.reset}`);
  
  // Test de connexion admin
  const loginData = {
    email: 'admin@soutiencollectif.org',
    password: 'AdminSecure123!'
  };
  
  let token = null;
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    token = response.data.data.token;
    console.log(`${colors.green}✅ Connexion admin: OK${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Connexion admin: ${error.message}${colors.reset}`);
    return;
  }
  
  console.log(`\n${colors.blue}📊 Test des APIs:${colors.reset}`);
  
  // Tests avec authentification
  const authHeaders = { Authorization: `Bearer ${token}` };
  
  await testEndpoint('Liste des campagnes', `${API_URL}/campaigns`);
  await testEndpoint('Profil admin', `${API_URL}/users/me`, 'GET', null, authHeaders);
  await testEndpoint('Stats donations', `${API_URL}/donations/stats`, 'GET', null, authHeaders);
  
  console.log(`\n${colors.green}🎉 Tests terminés !${colors.reset}`);
  console.log(`\n${colors.bright}📋 URLs d'accès:${colors.reset}`);
  console.log(`${colors.yellow}🎯 Admin: ${ADMIN_URL}${colors.reset}`);
  console.log(`${colors.yellow}🌐 Public: ${FRONTEND_URL}${colors.reset}`);
  console.log(`${colors.yellow}🔧 API: ${API_URL}${colors.reset}`);
  
  console.log(`\n${colors.bright}🔑 Identifiants admin:${colors.reset}`);
  console.log(`${colors.yellow}Email: admin@soutiencollectif.org${colors.reset}`);
  console.log(`${colors.yellow}Mot de passe: AdminSecure123!${colors.reset}`);
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };