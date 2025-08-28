import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { teamMembers } from '../../data/teamMembers';

const founders = teamMembers.filter(m => m.role.toLowerCase() === 'founder');
const lead = founders[0];

const AboutUs = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className="pt-24" id="about-us">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-green-900 mb-10 text-center">What is NYXedu?</h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/3 mx-auto text-center">
            <p className="text-lg text-deepblue leading-relaxed mb-8 font-medium">
              NYXedu is a collaborative platform built by and for students, making high-quality study materials accessible to everyone. Our mission is to empower Cambridge learners worldwide to succeed by sharing notes, resources, and experiences in a supportive, student-driven community. Whether you&apos;re preparing for exams or looking to deepen your understanding, NYXedu is here to help you learn, grow, and connect.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              {founders.map((member) => (
                <div key={member.name} className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md w-64">
                  <div className="w-20 h-20 rounded-full bg-green-300 flex items-center justify-center mb-4 border-4 border-green-300">
                    <span className="text-2xl font-bold text-deepblue">{member.name[0]}</span>
                  </div>
                  <h4 className="font-bold text-lg text-deepblue">{member.name}</h4>
                  <p className="text-black text-sm">{member.role}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-2 px-6 py-2 bg-green-300 text-deepblue font-semibold rounded-lg shadow hover:opacity-80 transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => setOpen(true)}
            >
              Meet the Team
            </button>
            <Modal open={open} onClose={() => setOpen(false)}>
              <div className="px-2 sm:px-0" style={{ pointerEvents: 'none' }}>
                <Box sx={{ maxWidth: 500, mx: 'auto', my: 8, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, maxHeight: '80vh', overflowY: 'auto', pointerEvents: 'auto' }}>
                  <h3 className="text-2xl font-bold text-deepblue mb-4 text-center">Our Team</h3>
                  <div className="flex flex-col gap-4 mb-6">
                    {teamMembers.map((member) => (
                      <div key={member.name} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
                        <div className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center font-bold text-deepblue">
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-deepblue">{member.name}</div>
                          <div className="text-sm text-deepblue">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-deepblue font-semibold">Want to contribute?</div>
                    <div className="text-sm text-deepblue">Contact our lead: <span className="font-semibold">{lead.name}</span> ({lead.email})</div>
                  </div>
                </Box>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
