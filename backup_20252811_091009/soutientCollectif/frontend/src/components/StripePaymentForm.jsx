import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { stripeAPI } from '../services/api';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const StripePaymentForm = ({ campaign, onClose, onSuccess, amount, donorInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Créer le PaymentIntent
      const { data } = await stripeAPI.createPaymentIntent({
        amount,
        campaignId: campaign.id,
        donorEmail: donorInfo.email || 'anonyme',
        donorName: donorInfo.name || 'Anonyme'
      });

      const { clientSecret } = data.data;

      // Confirmer le paiement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: donorInfo.name || 'Anonyme',
            email: donorInfo.email || undefined
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSucceeded(true);
          setProcessing(false);
          onSuccess(result.paymentIntent);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="card-element-container">
        <label className="form-label">Informations de carte bancaire</label>
        <div className="card-element-wrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {succeeded && (
        <div className="success-message">
          🎉 Paiement réussi ! Merci pour votre don de {amount} €
        </div>
      )}

      <div className="payment-buttons">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={processing || succeeded}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={!stripe || processing || succeeded}
        >
          {processing ? 'Traitement...' : `Payer ${amount} €`}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
