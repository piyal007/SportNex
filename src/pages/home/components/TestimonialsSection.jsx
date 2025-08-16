import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Member',
    image: 'https://i.pravatar.cc/100?img=5',
    quote:
      'Booking courts is super fast and the facilities are top-notch. The approval and payment flow is smooth every time.',
    rating: 5,
  },
  {
    name: 'Daniel Kim',
    role: 'Regular Player',
    image: 'https://i.pravatar.cc/100?img=15',
    quote:
      'I love the clear pricing and slot availability. The reminders and history help me plan my week easily.',
    rating: 5,
  },
  {
    name: 'Sophia Martinez',
    role: 'Tennis Enthusiast',
    image: 'https://i.pravatar.cc/100?img=23',
    quote:
      'Great UI and reliable bookings. Payment with coupons saved me money, and support is quick to respond.',
    rating: 4.5,
  },
  {
    name: 'Liam O’Connor',
    role: 'Weekend Player',
    image: 'https://i.pravatar.cc/100?img=31',
    quote:
      'The courts are well maintained and the app makes scheduling with friends effortless.',
    rating: 5,
  },
  {
    name: 'Maya Singh',
    role: 'Badminton Lover',
    image: 'https://i.pravatar.cc/100?img=41',
    quote:
      'I appreciate the transparent pricing and quick approvals. Highly recommend to new members!',
    rating: 4.5,
  },
  {
    name: 'Jonas Weber',
    role: 'Member',
    image: 'https://i.pravatar.cc/100?img=7',
    quote:
      'Superb UX. Payments are seamless and I like seeing my booking history in one place.',
    rating: 5,
  },
]

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-4 h-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
  >
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.785 1.401 8.168L12 18.896l-7.335 3.867 1.4-8.168L.132 9.21l8.2-1.192z" />
  </svg>
)

const Rating = ({ value }) => {
  const full = Math.floor(value)
  const half = value % 1 !== 0
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} filled />
        if (i === full && half)
          return (
            <div key={i} className="relative w-4 h-4">
              <Star filled={false} />
              <div className="overflow-hidden absolute inset-0 w-1/2">
                <Star filled />
              </div>
            </div>
          )
        return <Star key={i} filled={false} />
      })}
    </div>
  )
}

const TestimonialsSection = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What players say</h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Real feedback from members who book and play every week.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Rating value={t.rating} />
                  <p className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed">“{t.quote}”</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default TestimonialsSection


