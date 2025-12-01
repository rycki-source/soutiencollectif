import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { stripeAPI } from '../services/api';

let stripePromise;

const DonationForm = ({ campaign, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250];

  // Charger la clé publique Stripe
  useEffect(() => {
    const getStripeKey = async () => {
      try {
        const { data } = await stripeAPI.getConfig();
        stripePromise = loadStripe(data.data.publishableKey);
      } catch (error) {
        console.error('Erreur chargement Stripe:', error);
      }
    };
    getStripeKey();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const donationAmount = customAmount || amount;
    
    if (!donationAmount || donationAmount <= 0) {
      alert('Veuillez sélectionner ou entrer un montant');
      return;
    }

    if (!isAnonymous && (!name || !email)) {
      alert('Veuillez renseigner votre nom et email');
      return;
    }

    // Passer à l'étape de paiement
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    onSubmit({
      amount: parseFloat(customAmount || amount),
      name: isAnonymous ? 'Anonyme' : name,
      email: isAnonymous ? null : email,
      message,
      campaignId: campaign.id,
      paymentIntentId: paymentIntent.id,
      date: new Date().toISOString()
    });

    // Reset form
    setAmount('');
    setCustomAmount('');
    setName('');
    setEmail('');
    setMessage('');
    setIsAnonymous(false);
    setShowPayment(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="donation-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2 className="form-title">Faire un don pour</h2>
        <p className="form-campaign-name">{campaign.title}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-label">Choisissez un montant</label>
            <div className="amount-grid">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`amount-btn ${amount === preset.toString() ? 'active' : ''}`}
                  onClick={() => {
                    setAmount(preset.toString());
                    setCustomAmount('');
                  }}
                >
                  {preset} €
                </button>
              ))}
            </div>
            
            <div className="custom-amount">
              <label className="form-label">Ou entrez un montant personnalisé</label>
              <input
                type="number"
                placeholder="Montant en €"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('');
                }}
                className="form-input"
                min="1"
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Rester anonyme
            </label>
          </div>

          {!isAnonymous && (
            <>
              <div className="form-section">
                <label className="form-label">Nom complet *</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required={!isAnonymous}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required={!isAnonymous}
                />
              </div>
            </>
          )}
          {!showPayment ? (
            <button type="submit" className="btn-submit">
              Continuer vers le paiement 💳
            </button>
          ) : null}
        </form>

        {showPayment && stripePromise && (
          <div className="payment-section">
            <h3 className="payment-title">Paiement sécurisé</h3>
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                campaign={campaign}
                amount={parseFloat(customAmount || amount)}
                donorInfo={{
                  name: isAnonymous ? 'Anonyme' : name,
                  email: isAnonymous ? null : email
                }}
                onClose={() => setShowPayment(false)}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationForm;
