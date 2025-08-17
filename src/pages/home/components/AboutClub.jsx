import React from 'react'
import { Trophy, Users, Target, Calendar } from 'lucide-react'

const AboutClub = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About <span className="text-emerald-600">SportNex</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the story behind our passion for sports excellence and community building
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* History Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 dark:bg-emerald-950 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">Our History</h3>
              </div>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-base md:text-lg">
                  Founded in 2010, SportNex began as a small community initiative to provide accessible, 
                  high-quality sports facilities to athletes of all levels. What started with a single 
                  tennis court has grown into a comprehensive sports complex serving thousands of members.
                </p>
                
                <p className="text-base md:text-lg">
                  Over the years, we've expanded our facilities to include multiple courts for tennis, 
                  badminton, squash, and basketball. Our commitment to excellence has made us the 
                  premier destination for sports enthusiasts in the region.
                </p>
                
                <p className="text-base md:text-lg">
                  Today, SportNex stands as a testament to our founding vision: creating a space where 
                  passion meets performance, and where every athlete can pursue their sporting dreams 
                  with world-class facilities and unwavering support.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">15+</div>
                <div className="text-sm md:text-base text-muted-foreground">Years of Excellence</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">5000+</div>
                <div className="text-sm md:text-base text-muted-foreground">Happy Members</div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 dark:bg-emerald-950 p-3 rounded-full">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">Our Mission</h3>
              </div>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-base md:text-lg">
                  At SportNex, our mission is to foster a vibrant sports community where athletes 
                  of all skill levels can thrive. We are dedicated to providing exceptional facilities, 
                  professional coaching, and a supportive environment that encourages personal growth 
                  and sporting excellence.
                </p>
                
                <p className="text-base md:text-lg">
                  We believe that sports have the power to transform lives, build character, and 
                  create lasting friendships. Our commitment extends beyond just providing courts – 
                  we're building a community that celebrates achievement, embraces diversity, and 
                  promotes healthy living.
                </p>
              </div>
            </div>

            {/* Mission Points */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 dark:bg-emerald-950 p-2 rounded-full mt-1">
                  <Trophy className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Excellence in Facilities</h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Maintaining world-class courts and equipment for optimal performance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 dark:bg-emerald-950 p-2 rounded-full mt-1">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Community Building</h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Creating connections and fostering friendships through shared sporting experiences
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 dark:bg-emerald-950 p-2 rounded-full mt-1">
                  <Target className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Personal Growth</h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Supporting every member's journey towards their sporting and personal goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Join Our Sporting Community
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience the SportNex difference and become part of a community that's passionate about sports excellence.
            </p>
            <a
              href="/register"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 cursor-pointer"
            >
              Become a Member
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutClub