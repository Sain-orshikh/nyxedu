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
    answer: 'Yes, all of our study notes are completely free to access and download. Our mission is to make quality education materials accessible to every student, regardless of their financial situation.'
  },
  {
    question: 'How can I contribute my own notes?',
    answer: 'You can contribute by contacting our team through their email. All submissions are reviewed for quality before being published, and contributors receive full credit for their work.'
  },
  {
    question: 'When will AS/A Level notes be available?',
    answer: 'AS and A Level notes will be available within the next year. Our team is actively working with educators to create comprehensive materials. We\'ll keep you updated through our website and social media channels.'
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
