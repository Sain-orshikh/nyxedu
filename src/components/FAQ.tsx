import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: 'What is NYXedu?',
    answer: 'NYXedu is a collaborative online platform designed for Cambridge IGCSE, AS, and A Level students. We provide a space for students to share and access high-quality, peer-reviewed study notes to help them excel in their examinations.'
  },
  {
    question: 'Are the study notes free?',
    answer: 'Yes, the vast majority of our notes are free to access. Our mission is to make learning materials accessible to everyone. We may introduce premium features or content in the future, but our core library of peer-shared notes will always have a free-to-access tier.'
  },
  {
    question: 'How can I contribute my own notes?',
    answer: "We encourage students to contribute! After signing up for a free account, you will find an 'Upload Notes' option in your user dashboard. You can upload your notes in various formats (like PDF, DOCX), add a description, and tag them with the relevant subject and level. Every contribution helps the community grow!"
  },
  {
    question: 'How is the quality of the notes ensured?',
    answer: "We have a peer-review system in place. When notes are uploaded, they can be rated and commented on by other students. Popular and highly-rated notes are featured more prominently. While we encourage accuracy, we always recommend using our notes as a supplementary resource alongside your official textbooks and teacher's guidance. The yellow highlight on an answer can signify a key point or important information."
  }
];

const FAQ = () => (
  <section className="py-20" id="faq">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-deepblue mb-12 text-center">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, idx) => (
          <Accordion key={idx} className="!bg-transparent !shadow-none !border-b !border-gray-200">
            <AccordionSummary expandIcon={<FiChevronDown size={24} />} className="">
              <Typography className="text-deepblue font-bold" style={{ fontSize: '1.25rem' }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-black leading-relaxed" style={{ fontSize: '1.25rem' }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;
