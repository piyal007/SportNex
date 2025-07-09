import React, { useState } from 'react';
import { Gift, Copy, Check, Percent, Tag, Clock, Star, Zap } from 'lucide-react';

const PromotionsSection = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const promotions = [
    {
      id: 1,
      code: 'SportNex',
      discount: 5,
      title: 'Welcome Bonus',
      description: 'Perfect for new members starting their fitness journey',
      validUntil: '2025-02-28',
      bgColor: 'from-blue-500 to-blue-600',
      icon: Gift
    },
    {
      id: 2,
      code: 'FITNESS20',
      discount: 20,
      title: 'Fitness Pro',
      description: 'Unlock premium training sessions and equipment access',
      validUntil: '2025-03-15',
      bgColor: 'from-emerald-500 to-emerald-600',
      icon: Zap
    },
    {
      id: 3,
      code: 'FAMILY15',
      discount: 15,
      title: 'Family Package',
      description: 'Special discount for family memberships and group classes',
      validUntil: '2025-04-30',
      bgColor: 'from-purple-500 to-purple-600',
      icon: Star
    },
    {
      id: 4,
      code: 'STUDENT10',
      discount: 10,
      title: 'Student Special',
      description: 'Exclusive offer for students with valid student ID',
      validUntil: '2025-06-30',
      bgColor: 'from-orange-500 to-orange-600',
      icon: Percent
    }
  ];

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Exclusive Discount Coupons
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock amazing savings with our special coupon codes! Each offer comes with different discount percentages to maximize your savings.
          </p>
        </div>

        {/* Promotions Grid - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo) => {
            const IconComponent = promo.icon;
            
            return (
              <div
                key={promo.id}
                className={`group relative bg-gradient-to-br ${promo.bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 overflow-hidden border border-white/30 backdrop-blur-sm`}
              >
                {/* Header Section */}
                <div className="h-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 left-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-4 text-right">
                    <div className="text-2xl font-bold text-white">{promo.discount}%</div>
                    <div className="text-xs text-white/90 font-medium">OFF</div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/10 rounded-full"></div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Title with Discount & Description */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{promo.title}</h3>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{promo.description}</p>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="mb-3">
                    <div className="bg-white/90 border-2 border-dashed border-gray-300 rounded-xl p-3 backdrop-blur-md shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Coupon Code
                          </div>
                          <div className="font-mono font-bold text-base text-gray-900 tracking-wider">
                            {promo.code}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(promo.code, promo.id)}
                          className="flex items-center gap-1 bg-white hover:bg-gray-50 text-gray-800 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          {copiedCode === promo.id ? (
                            <>
                              <Check className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Validity */}
                  <div className="flex items-center text-xs text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Valid until {formatDate(promo.validUntil)}</span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Save Big on Your Fitness Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Choose any coupon code above and apply it during checkout to enjoy instant savings on your membership!
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-105">
              <Gift className="h-5 w-5 mr-2 inline" />
              Start Your Membership
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;