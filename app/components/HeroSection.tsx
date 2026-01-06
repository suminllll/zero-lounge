'use client'

import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
     const contentStyle: React.CSSProperties = {
  position:'relative',
        margin: 0,
        height: '100vh',
  width:'100%'
};



    return (
        <section className='heroCarousel ' style={{height:'100vh',width:'100%'}}>
 <div className='absolute insert-0 bg-black/40 w-full h-full'></div>
 <div className='absolute bottom-[5%] w-full -translate-y-1/2 z-50'>
  <div className='mx-auto max-w-7xl px-4'>
    <h2 className='text-primary font-bold text-4xl leading-13 ml-[4%]'>
      혼자 오는 혼술바.<br/>
      자연스럽게 대화가 시작되는 곳
    </h2>
  </div>
</div>
  <div style={contentStyle}>
        <Image src={'/images/heroSlide1.jpg'}  alt={'hero side1'} fill style={{objectFit:'cover'}} priority quality={95} sizes="100vw"/>
       </div>
  
      {/* <Carousel  autoplay effect='scrollx' style={{height: '100%'}} dots arrows className=''> */}
         
       
      {/* </div>
         <div style={contentStyle}>
        <Image src={'/images/heroSlide2.jpg'}  alt={'hero side2'} fill style={{objectFit:'cover'}} priority quality={95} sizes="100vw"/>
      </div>
         <div style={contentStyle}>
        <Image src={'/images/heroSlide3.jpg'}  alt={'hero side3'} fill style={{objectFit:'cover'}} priority quality={95} sizes="100vw"/>
      </div>
       <div style={contentStyle}>
        <Image src={'/images/heroSlide4.jpg'}  alt={'hero side4'} fill style={{objectFit:'cover'}} priority quality={95} sizes="100vw"/>
      </div>
       <div style={contentStyle}>
        <Image src={'/images/heroSlide5.jpg'}  alt={'hero side5'} fill style={{objectFit:'cover'}} priority quality={95} sizes="100vw"/>
      </div>
      </Carousel> */}
     </section>
    )
};

export default HeroSection;