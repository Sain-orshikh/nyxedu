import React from 'react';

export default function ContactUs() {
  return (
    <main className="container mx-auto px-4 py-8 flex-grow bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Contact Form Section */}
        <div className="contact_section bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="contact_title text-4xl font-bold text-[#0d244f] mb-8 text-center">Get in Touch</h1>
          <p className="typography_body text-center mb-8 text-base text-[#666]">We're here to help! Reach out to us with any questions or feedback.</p>
          <form className="contact_form w-full">
            <div className="form_group mb-6">
              <label className="form_label block text-[#0d244f] text-sm font-semibold mb-2" htmlFor="name">Your Name</label>
              <input className="input w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5de6f] transition-shadow duration-300" id="name" placeholder="Enter your name" type="text" />
            </div>
            <div className="form_group mb-6">
              <label className="form_label block text-[#0d244f] text-sm font-semibold mb-2" htmlFor="email">Your Email</label>
              <input className="input w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5de6f] transition-shadow duration-300" id="email" placeholder="Enter your email address" type="email" />
            </div>
            <div className="form_group mb-6">
              <label className="form_label block text-[#0d244f] text-sm font-semibold mb-2" htmlFor="subject">Subject</label>
              <input className="input w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5de6f] transition-shadow duration-300" id="subject" placeholder="What is your message about?" type="text" />
            </div>
            <div className="form_group mb-6">
              <label className="form_label block text-[#0d244f] text-sm font-semibold mb-2" htmlFor="message">Message</label>
              <textarea className="input w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5de6f] transition-shadow duration-300" id="message" placeholder="Write your message here..." rows={5}></textarea>
            </div>
            <button className="contact_button w-full bg-[#f5de6f] text-[#0d244f] rounded-full px-6 py-4 font-bold hover:bg-yellow-400 transition-colors duration-300 text-lg" type="submit">Send Message</button>
          </form>
        </div>
        {/* Contact Info & FAQ Section */}
        <div className="space-y-12">
          <div>
            <h2 className="typography_h2 text-3xl font-bold text-[#0d244f] mb-6">Direct Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[#0d244f] text-3xl">📧</span>
                <div>
                  <h3 className="font-semibold text-[#0d244f]">Email Us</h3>
                  <a className="typography_body hover:text-[#f5de6f] text-base text-[#666]" href="mailto:support@studycentral.com">support@studycentral.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#0d244f] text-3xl">📞</span>
                <div>
                  <h3 className="font-semibold text-[#0d244f]">Call Us</h3>
                  <p className="typography_body text-base text-[#666]">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#0d244f] text-3xl">📍</span>
                <div>
                  <h3 className="font-semibold text-[#0d244f]">Our Office</h3>
                  <p className="typography_body text-base text-[#666]">123 Education Lane, Cambridge, UK</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="typography_h2 text-3xl font-bold text-[#0d244f] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-medium text-[#0d244f]">How do I upload my study notes?</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="typography_body mt-2 text-base text-[#666]">To upload your notes, navigate to the 'Notes' section and click on the 'Upload Notes' button. You will be prompted to select a file from your device and fill in details like subject and topic.</p>
              </details>
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-medium text-[#0d244f]">Can I download notes from other students?</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="typography_body mt-2 text-base text-[#666]">Yes, absolutely! You can browse and download notes shared by other students. Simply find the notes you're interested in and click the 'Download' button.</p>
              </details>
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-medium text-[#0d244f]">How do I report inappropriate content?</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="typography_body mt-2 text-base text-[#666]">If you come across any content that violates our community guidelines, please use the 'Report' button located next to the content. Our moderation team will review it promptly.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
