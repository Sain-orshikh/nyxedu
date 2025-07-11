import React from 'react';

const AboutUs = () => (
  <section className="py-20 bg-gray-50" id="about-us">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-deepblue mb-8 text-center">About Us</h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-bold text-deepblue mb-4">Our Mission</h3>
          <p className="text-gold leading-relaxed mb-6">At StudyHub, our mission is to democratize education by creating a collaborative platform where students can share and access high-quality study materials. We believe that learning from peers is one of the most effective ways to succeed, and we're dedicated to building a supportive community for Cambridge learners worldwide.</p>
          <a className="button_primary" href="#">Learn More</a>
        </div>
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center">
              <img alt="Team Member 1" className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcHcnQDV1htgCHZIJbAzyncBAnRNVQymHBp5wbVp_RzFa_iAbsx-fc9AvoECFnxjCqQHXzRzirQRFl4najHchFWuAlXTVfs5LK8t_iK-hnbQBytLc5-8dcuAaRfU98cOyqCGsUOXAs9on0jf4Cetgt7TIEfzQr4byQL4l3NYNziRZTAVZfA-2D7G41kWo1GKct3pV69hC-tZXDY6mVXTc_dbYsbB4reKkMmJ84YM7BqDS7t2NFtNFbJ1n2dDWXjQBiiGB7QXHTi4pA" />
              <h4 className="font-bold text-lg text-deepblue">Jane Doe</h4>
              <p className="text-gold text-sm">Founder & CEO</p>
            </div>
            <div className="flex flex-col items-center">
              <img alt="Team Member 2" className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5Y8ney-6e2QERig7xkZcE7PbKQ4zyrCisBZTWMzW69RhaqjYC_v0sv0PAJMRD6MZbFfA9wVfd3TizQYp3kjp6d4TcjoQY3x3XeeMSLsg6ICb8UjOJHDcizQK78q1mFBzGRkOvxKEWQu1JQ_uHs5ynKR2nbqx5ge1WA-t4MJp1gotWWQ97dkSISfzblT4w-1O5CfkPjENElOUPDMoAgP2Q3g1dm0k-GaG_VCvVsV1Tlu-11cipUhigQyI_Z_cxIYXNyz8ImdLJUCve" />
              <h4 className="font-bold text-lg text-deepblue">John Smith</h4>
              <p className="text-gold text-sm">Lead Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
