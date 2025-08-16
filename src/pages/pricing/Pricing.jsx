import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Browse courts',
      'View announcements',
      'Basic profile',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Member',
    price: '$19/mo',
    popular: true,
    features: [
      'Priority court booking',
      'Member-only discounts',
      'Payment history',
      'Early access to events',
    ],
    cta: 'Become a Member',
  },
  {
    name: 'Pro',
    price: '$39/mo',
    features: [
      'All Member features',
      'Unlimited bookings',
      'Premium support',
      'Exclusive tournaments',
    ],
    cta: 'Go Pro',
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (tierName) => {
    if (!user) {
      navigate('/register', { state: { plan: tierName } });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-3 text-gray-600">Choose the plan that fits your game. Upgrade anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur ${tier.popular ? 'border-emerald-500 shadow-lg' : 'border-gray-200 dark:border-zinc-800'}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              {tier.popular && (
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Most popular</span>
              )}
            </div>
            <p className="mt-4 text-3xl font-bold">{tier.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(tier.name)}
              className="mt-8 w-full inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition-colors"
            >
              {user ? 'Go to Dashboard' : tier.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Have questions? <NavLink className="text-emerald-600 hover:underline" to="/courts">Browse courts</NavLink> or <NavLink className="text-emerald-600 hover:underline" to="/register">create an account</NavLink>.
      </p>
    </div>
  );
};

export default Pricing;


