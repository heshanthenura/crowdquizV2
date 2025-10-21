'use client';

import NavBar from '@/components/NavBar';
import Image from 'next/image';

export default function About() {
  return (
    <div>
      <NavBar />

      <div className='p-[10px]'>
        <div className='flex flex-col items-center text-center mt-10 md:mt-16 max-w-[800px]'>
          <h1 className='text-[3rem] md:text-[4rem] font-bold !text-[#0059ff] mb-4'>
            About CrowdQuiz
          </h1>
          <p className='text-[1.2rem] md:text-[1.5rem] !text-[#666666] font-medium'>
            Empowering Students Through Collaborative Learning
          </p>
        </div>

        {/* Our Mission */}
        <div className='flex flex-col md:max-w-[80%] mt-12'>
          <h2 className='!text-[#333333] text-[33px] font-bold mb-4'>Our Mission</h2>
          <p className='!text-[#666666] font-medium text-[18px] leading-relaxed'>
            At CrowdQuiz, we believe in the power of collaborative learning. Our platform enables
            students to create, share, and learn from each other through interactive quizzes.
            We&apos;re building a community where knowledge flows freely and learning becomes a
            shared experience.
          </p>
        </div>

        {/* What We Offer */}
        <div className='flex flex-col md:max-w-[80%] mx-auto mt-12'>
          <h2 className='!text-[#333333] text-[33px] font-bold mb-6'>What We Offer</h2>
          <div className='flex flex-col md:flex-row gap-6'>
            {[
              {
                title: 'Create Quizzes',
                desc: 'Design your own quizzes with various question types and share them with your peers.',
              },
              {
                title: 'Learn Together',
                desc: 'Access quizzes created by other students and enhance your learning experience.',
              },
              {
                title: 'Track Progress',
                desc: 'Monitor your performance and identify areas for improvement.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className='rounded-[15px] shadow-lg p-6 flex-1 transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl'
              >
                <h3 className='!text-[#1059ff] text-[24px] font-bold mb-2'>{feature.title}</h3>
                <p className='!text-[#666666] font-medium'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join Community */}
        <div className='flex flex-col md:max-w-[80%] mx-auto mt-12'>
          <h2 className='!text-[#333333] text-[33px] font-bold mb-4'>Join Our Community</h2>
          <p className='!text-[#666666] font-medium text-[18px] leading-relaxed'>
            Whether you&apos;re a student looking to test your knowledge or someone who wants to
            share their expertise, CrowdQuiz is the perfect platform for you. Join us in creating a
            more interactive and engaging learning environment.
          </p>
        </div>

        {/* Developer Section */}
        <div className='flex flex-col items-center mt-12 md:mt-16 w-full md:max-w-[80%] mx-auto text-center'>
          <h2 className='!text-[#333333] text-[33px] font-bold mb-6'>Meet the Developer</h2>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8'>
            <Image
              src='/assets/developer-img.png'
              alt='Heshan Thenura'
              width={120}
              height={120}
              className='rounded-xl'
            />
            <div className='flex flex-col items-center md:items-start'>
              <h3 className='text-[24px] font-bold !text-[#1059ff] mb-3'>
                Heshan Thenura Kariyawasam
              </h3>
              <div className='flex flex-wrap gap-3 justify-center md:justify-start'>
                <a
                  href='https://github.com/heshanthenura'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#0059ff] font-medium hover:underline'
                >
                  GitHub
                </a>
                <a
                  href='https://www.linkedin.com/in/heshanthenura'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#0059ff] font-medium hover:underline'
                >
                  LinkedIn
                </a>
                <a
                  href='https://www.instagram.com/heshan_thenura/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#0059ff] font-medium hover:underline'
                >
                  Instagram
                </a>
                <a
                  href='https://youtube.com/@heshanthenura'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#0059ff] font-medium hover:underline'
                >
                  YouTube
                </a>
                <a
                  href='mailto:heshanthenura@gmail.com'
                  className='text-[#0059ff] font-medium hover:underline'
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className='h-16'></div>
      </div>
    </div>
  );
}
